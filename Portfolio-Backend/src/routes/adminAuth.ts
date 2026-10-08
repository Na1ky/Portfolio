import { Router, Request, Response } from "express";
import { scryptSync, timingSafeEqual } from "crypto";
import { ADMIN_COOKIE, adminCookieOptions, createAdminToken, requireAdmin, requireTrustedOrigin } from "../middleware/adminAuth";

const router = Router();

function passwordMatches(password: string, encoded: string): boolean {
  const [scheme, salt, expectedHex] = encoded.split(":");
  if (scheme !== "scrypt" || !salt || !expectedHex || !/^[a-f0-9]+$/i.test(expectedHex)) return false;
  const expected = Buffer.from(expectedHex, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

router.post("/login", requireTrustedOrigin, (req: Request, res: Response) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !passwordHash || !process.env.JWT_SECRET) {
    res.status(503).json({ error: "Autenticazione admin non configurata" });
    return;
  }
  if (email !== adminEmail || !passwordMatches(password, passwordHash)) {
    res.status(401).json({ error: "Email o password non validi" });
    return;
  }

  res.cookie(ADMIN_COOKIE, createAdminToken(adminEmail), adminCookieOptions());
  res.json({ authenticated: true, email: adminEmail });
});

router.get("/session", requireAdmin, (req: Request, res: Response) => {
  res.json({ authenticated: true, email: process.env.ADMIN_EMAIL?.trim().toLowerCase() });
});

router.post("/logout", requireTrustedOrigin, (req: Request, res: Response) => {
  res.clearCookie(ADMIN_COOKIE, { ...adminCookieOptions(), maxAge: undefined });
  res.status(204).end();
});

export default router;
