import { Router, Request, Response } from "express";
import {
  getTechnologies,
  getTechnologiesCategories,
} from "../services/technologyService";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await getTechnologies();
    res.json(data);
  } catch (error) {
    console.error("Errore:", error);
    res.status(500).json({ error: "Errore nel recupero delle tecnologie" });
  }
});

router.get("/categories", async (req: Request, res: Response) => {
  try {
    const data = await getTechnologiesCategories();
    res.json(data);
  } catch (error) {
    console.error("Errore:", error);
    res
      .status(500)
      .json({ error: "Errore nel recupero delle categorie" });
  }
});

export default router;
