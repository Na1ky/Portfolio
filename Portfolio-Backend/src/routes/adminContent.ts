import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { createHash } from "crypto";
import { getDB } from "../config/database";
import { requireAdmin, requireTrustedOrigin } from "../middleware/adminAuth";

type Entity = "projects" | "certificates" | "technologies";
const collections: Record<Entity, string> = {
  projects: "Projects",
  certificates: "Certificates",
  technologies: "Technologies",
};
const fields: Record<Entity, string[]> = {
  projects: ["title", "description", "image_url", "details", "technologies_used", "demo_url", "download"],
  certificates: ["name", "issuer_name", "date_achieved", "image_url", "pdf_url"],
  technologies: ["name", "icon_url", "description", "category"],
};
const router = Router();
router.use(requireAdmin);

router.post("/upload-signature", requireTrustedOrigin, (req: Request, res: Response) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return res.status(503).json({ error: "Upload immagini non configurato" });
  const timestamp = Math.floor(Date.now() / 1000);
  const parameters = { allowed_formats: "jpg,jpeg,png,webp", folder: "portfolio", timestamp };
  const toSign = Object.entries(parameters).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join("&");
  const signature = createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");
  res.json({ cloudName, apiKey, timestamp, signature, folder: parameters.folder, allowedFormats: parameters.allowed_formats });
});

function documentId(value: string): any {
  if (/^[a-f\d]{24}$/i.test(value)) return new ObjectId(value);
  if (/^-?\d+$/.test(value)) return Number(value);
  return value;
}

function cleanBody(entity: Entity, body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const source = body as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const key of fields[entity]) {
    if (Object.prototype.hasOwnProperty.call(source, key)) result[key] = source[key];
  }
  const required = entity === "projects" ? ["title", "description"] : entity === "certificates" ? ["name"] : ["name"];
  if (required.some((key) => typeof result[key] !== "string" || !(result[key] as string).trim())) return null;
  const arrayFields = entity === "projects" ? ["image_url", "technologies_used"] : [];
  if (arrayFields.some((key) => result[key] !== undefined && (!Array.isArray(result[key]) || !(result[key] as unknown[]).every((item) => typeof item === "string")))) return null;
  for (const key of fields[entity].filter((field) => !arrayFields.includes(field) && field !== "category")) {
    if (result[key] !== undefined && typeof result[key] !== "string") return null;
  }
  if (entity === "certificates" && result.date_achieved !== undefined && Number.isNaN(Date.parse(String(result.date_achieved)))) return null;
  if (entity === "technologies" && result.category !== undefined) {
    const category = result.category as Record<string, unknown>;
    if (!category || typeof category !== "object" || !Number.isFinite(Number(category["id"])) || typeof category["name"] !== "string") return null;
  }
  return result;
}

router.get("/:entity", async (req: Request, res: Response) => {
  const entity = req.params.entity as Entity;
  if (!Object.prototype.hasOwnProperty.call(collections, entity)) return res.status(404).json({ error: "Entità non trovata" });
  const page = Math.max(1, Number.parseInt(String(req.query.page ?? "1"), 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(String(req.query.limit ?? "20"), 10) || 20));
  const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";
  const defaultSort = entity === "projects" || entity === "certificates" ? "date_achieved" : "name";
  const sortField = typeof req.query.sortBy === "string" && fields[entity].includes(req.query.sortBy) ? req.query.sortBy : defaultSort;
  const sortDirection = req.query.sortOrder === "asc" ? 1 : -1;
  const searchable = entity === "projects" ? ["title", "description"] : entity === "certificates" ? ["name", "issuer_name"] : ["name", "description"];
  const filter = search ? { $or: searchable.map((field) => ({ [field]: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } })) } : {};
  try {
    const collection = getDB().collection(collections[entity]);
    const [items, total] = await Promise.all([
      collection.find(filter).sort({ [sortField]: sortDirection }).skip((page - 1) * limit).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);
    return res.json({ items, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Admin list error:", error);
    return res.status(500).json({ error: "Errore nel recupero dei contenuti" });
  }
});

router.post("/:entity", requireTrustedOrigin, async (req: Request, res: Response) => {
  const entity = req.params.entity as Entity;
  if (!Object.prototype.hasOwnProperty.call(collections, entity)) return res.status(404).json({ error: "Entità non trovata" });
  const data = cleanBody(entity, req.body);
  if (!data) return res.status(400).json({ error: "Dati mancanti o non validi" });
  try {
    const now = new Date().toISOString();
    if (entity === "certificates" || entity === "technologies") data.created_at = now;
    const result = await getDB().collection(collections[entity]).insertOne(data);
    return res.status(201).json({ ...data, _id: result.insertedId });
  } catch (error) {
    console.error("Admin create error:", error);
    return res.status(500).json({ error: "Errore nella creazione del contenuto" });
  }
});

router.put("/:entity/:id", requireTrustedOrigin, async (req: Request, res: Response) => {
  const entity = req.params.entity as Entity;
  if (!Object.prototype.hasOwnProperty.call(collections, entity)) return res.status(404).json({ error: "Entità non trovata" });
  const data = cleanBody(entity, req.body);
  if (!data) return res.status(400).json({ error: "Dati mancanti o non validi" });
  try {
    const result = await getDB().collection(collections[entity]).findOneAndUpdate(
      { _id: documentId(req.params.id) }, { $set: data }, { returnDocument: "after" },
    );
    if (!result) return res.status(404).json({ error: "Contenuto non trovato" });
    return res.json(result);
  } catch (error) {
    console.error("Admin update error:", error);
    return res.status(500).json({ error: "Errore nella modifica del contenuto" });
  }
});

router.delete("/:entity/:id", requireTrustedOrigin, async (req: Request, res: Response) => {
  const entity = req.params.entity as Entity;
  if (!Object.prototype.hasOwnProperty.call(collections, entity)) return res.status(404).json({ error: "Entità non trovata" });
  try {
    const result = await getDB().collection(collections[entity]).deleteOne({ _id: documentId(req.params.id) });
    if (!result.deletedCount) return res.status(404).json({ error: "Contenuto non trovato" });
    return res.status(204).end();
  } catch (error) {
    console.error("Admin delete error:", error);
    return res.status(500).json({ error: "Errore nell'eliminazione del contenuto" });
  }
});

export default router;
