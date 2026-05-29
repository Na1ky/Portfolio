import cors from "cors";
import { Request, Response, NextFunction } from "express";

const clientUrl = process.env.CLIENT_URL || "http://localhost:4200";
const allowedOrigins = new Set<string>([
  clientUrl,
  "https://nicolas-dominici.it",
  "https://www.nicolas-dominici.it",
  "http://localhost:4200",
  "http://127.0.0.1:4200",
]);

const normalizedClientUrl = clientUrl.endsWith("/")
  ? clientUrl.slice(0, -1)
  : clientUrl;

allowedOrigins.add(normalizedClientUrl);

try {
  const parsedUrl = new URL(clientUrl);

  if (parsedUrl.hostname !== "localhost") {
    const alternateProtocol = parsedUrl.protocol === "https:" ? "http:" : "https:";
    allowedOrigins.add(`${alternateProtocol}//${parsedUrl.host}`);
  }
} catch {
  // If CLIENT_URL is not a full URL, keep the exact value and let CORS decide.
}

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200,
});

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Errore:", err);
  res.status(err.status || 500).json({
    error: err.message || "Errore server",
    timestamp: new Date().toISOString(),
  });
};
