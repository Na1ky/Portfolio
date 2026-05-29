import express, { Express, Request, Response } from "express";
import { connectDB, disconnectDB } from "./config/database";
import { corsMiddleware, errorHandler } from "./middleware/corsMiddleware";
import certificatesRouter from "./routes/certificates";
import technologiesRouter from "./routes/technologies";
import projectsRouter from "./routes/projects";
import path from "path";

const app: Express = express();
const port = process.env.PORT || 3100;
const staticDir = path.resolve(process.cwd(), "static");

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use("/static", express.static(staticDir));
app.use("/img", express.static(path.join(staticDir, "img")));
app.use("/cv", express.static(path.join(staticDir, "cv")));
app.use(express.static(staticDir));

// API Routes
app.use("/api/certificates", certificatesRouter);
app.use("/api/technologies", technologiesRouter);
app.use("/api/projects", projectsRouter);

// Health check
app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`\n🚀 Server avviato sulla porta: ${port}`);
            console.log(`📍 http://localhost:${port}`);
            console.log(`🔗 API disponibili su http://localhost:${port}/api\n`);
        });
    } catch (error) {
        console.error("✗ Errore avvio server:", error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on("SIGINT", async () => {
    console.log("\n⏹️  Spegnimento server...");
    await disconnectDB();
    process.exit(0);
});

startServer();
