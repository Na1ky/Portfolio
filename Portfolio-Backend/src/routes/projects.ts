import { Router, Request, Response } from "express";
import { getProjects, getProjectsCount } from "../services/projectService";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await getProjects();
    res.json(data);
  } catch (error) {
    console.error("Errore:", error);
    res.status(500).json({ error: "Errore nel recupero dei progetti" });
  }
});

router.get("/count", async (req: Request, res: Response) => {
  try {
    const count = await getProjectsCount();
    res.json(count);
  } catch (error) {
    console.error("Errore:", error);
    res.status(500).json({ error: "Errore nel conteggio dei progetti" });
  }
});

export default router;
