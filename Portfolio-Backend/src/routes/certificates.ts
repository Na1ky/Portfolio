import { Router, Request, Response } from "express";
import {
    getCertificates,
    getCertificatesCount,
} from "../services/certificateService";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const data = await getCertificates();
        res.json(data);
    } catch (error) {
        console.error("Errore:", error);
        res.status(500).json({ error: "Errore nel recupero dei certificati" });
    }
});

router.get("/count", async (req: Request, res: Response) => {
    try {
        const count = await getCertificatesCount();
        res.json(count);
    } catch (error) {
        console.error("Errore:", error);
        res.status(500).json({ error: "Errore nel conteggio dei certificati" });
    }
});

export default router;
