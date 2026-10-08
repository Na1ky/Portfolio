import { createHmac, timingSafeEqual } from "crypto";
import { Request, Response, NextFunction } from "express";

export const ADMIN_COOKIE = "portfolio_admin";
const TOKEN_TTL_SECONDS = 60 * 60 * 8;

function secret(): string {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) {
    throw new Error("JWT_SECRET deve contenere almeno 32 caratteri");
  }
  return value;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function equal(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function createAdminToken(email: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ sub: email, iat: now, exp: now + TOKEN_TTL_SECONDS })).toString("base64url");
  const content = `${header}.${payload}`;
  return `${content}.${sign(content)}`;
}

export function verifyAdminToken(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const content = `${parts[0]}.${parts[1]}`;
    if (!equal(parts[2], sign(content))) return false;
    const header = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    return header.alg === "HS256" && payload.sub === process.env.ADMIN_EMAIL?.trim().toLowerCase() &&
      Number.isFinite(payload.exp) && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function adminCookieOptions() {
  const secure = process.env.NODE_ENV === "production";
  return { httpOnly: true, secure, sameSite: "lax" as const, path: "/api", maxAge: TOKEN_TTL_SECONDS * 1000 };
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const cookieHeader = req.headers.cookie ?? "";
  const token = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${ADMIN_COOKIE}=`))?.slice(ADMIN_COOKIE.length + 1);
  let decoded = "";
  try { decoded = token ? decodeURIComponent(token) : ""; } catch { decoded = ""; }
  if (!decoded || !verifyAdminToken(decoded)) {
    res.status(401).json({ error: "Autenticazione richiesta" });
    return;
  }
  next();
}

export function requireTrustedOrigin(req: Request, res: Response, next: NextFunction): void {
  const origin = req.get("origin");
  const configured = process.env.CLIENT_URL;
  if (!origin || !configured) {
    res.status(403).json({ error: "Origine non autorizzata" });
    return;
  }
  try {
    if (new URL(origin).origin !== new URL(configured).origin) {
      res.status(403).json({ error: "Origine non autorizzata" });
      return;
    }
  } catch {
    res.status(403).json({ error: "Origine non autorizzata" });
    return;
  }
  next();
}
