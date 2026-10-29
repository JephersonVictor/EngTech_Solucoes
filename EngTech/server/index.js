import { createHmac, timingSafeEqual } from "node:crypto";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import pg from "pg";

const { Pool } = pg;
const port = Number(process.env.PORT ?? 3000);
const adminPassword = process.env.ADMIN_PASSWORD;
const tokenSecret = process.env.ADMIN_TOKEN_SECRET;
const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:5173,http://127.0.0.1:5173")
  .split(",").map((origin) => origin.trim()).filter(Boolean);

if (!process.env.DATABASE_URL || !adminPassword || !tokenSecret) {
  throw new Error("Configure DATABASE_URL, ADMIN_PASSWORD e ADMIN_TOKEN_SECRET.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined
});
const app = express();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false });
const messageLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: "draft-8", legacyHeaders: false });

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origem não autorizada."));
  }
}));
app.use(express.json({ limit: "32kb" }));

const defaultSocials = {
  whatsapp: "https://wa.me/5535999582036",
  instagram: "https://instagram.com/engtech_solucoes",
  linkedin: "https://linkedin.com/company/engtech"
};

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function createToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url");
  const signature = createHmac("sha256", tokenSecret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function requireAdmin(request, response, next) {
  const [payload, signature, extra] = (request.get("authorization") ?? "").replace(/^Bearer\s+/i, "").split(".");
  if (!payload || !signature || extra) return response.status(401).json({ error: "Acesso não autorizado." });
  const expected = createHmac("sha256", tokenSecret).update(payload).digest("base64url");
  if (!safeEqual(signature, expected)) return response.status(401).json({ error: "Acesso não autorizado." });
  try {
    if (JSON.parse(Buffer.from(payload, "base64url").toString()).exp < Date.now()) {
      return response.status(401).json({ error: "Sessão expirada." });
    }
  } catch {
    return response.status(401).json({ error: "Acesso não autorizado." });
  }
  return next();
}

function validProject(body) {
  return typeof body.title === "string" && body.title.trim().length > 0 && body.title.length <= 120
    && ["web", "ai"].includes(body.category)
    && typeof body.description === "string" && body.description.trim().length > 0 && body.description.length <= 2000;
}

function validSocials(body) {
  return Object.keys(defaultSocials).every((key) => {
    try {
      const url = new URL(body[key]);
      return url.protocol === "https:";
    } catch {
      return false;
    }
  });
}

function formatMessage(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    date: new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(row.created_at)
  };
}

app.get("/api/health", (_request, response) => response.json({ status: "ok" }));

app.post("/api/admin/login", loginLimiter, (request, response) => {
  const submittedPassword = typeof request.body.password === "string" ? request.body.password : "";
  if (!safeEqual(submittedPassword, adminPassword)) return response.status(401).json({ error: "Senha incorreta." });
  return response.json({ token: createToken() });
});

app.get("/api/projects", async (_request, response, next) => {
  try {
    const { rows } = await pool.query("SELECT id, title, category, description FROM projects ORDER BY id DESC");
    return response.json(rows);
  } catch (error) {
    return next(error);
  }
});

app.get("/api/socials", async (_request, response, next) => {
  try {
    const { rows } = await pool.query("SELECT whatsapp, instagram, linkedin FROM socials WHERE id = 1");
    return response.json(rows[0] ?? defaultSocials);
  } catch (error) {
    return next(error);
  }
});

app.post("/api/messages", messageLimiter, async (request, response, next) => {
  const { name, email, message } = request.body;
  if (typeof name !== "string" || !name.trim() || name.length > 120
    || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254
    || typeof message !== "string" || !message.trim() || message.length > 5000) {
    return response.status(400).json({ error: "Confira nome, e-mail e mensagem." });
  }
  try {
    const { rows } = await pool.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING id, name, email, message, created_at",
      [name.trim(), email.trim(), message.trim()]
    );
    return response.status(201).json(formatMessage(rows[0]));
  } catch (error) {
    return next(error);
  }
});

app.use("/api/admin", requireAdmin);

app.get("/api/admin/projects", async (_request, response, next) => {
  try {
    const { rows } = await pool.query("SELECT id, title, category, description FROM projects ORDER BY id DESC");
    return response.json(rows);
  } catch (error) {
    return next(error);
  }
});

app.post("/api/admin/projects", async (request, response, next) => {
  if (!validProject(request.body)) return response.status(400).json({ error: "Confira os dados do projeto." });
  try {
    const { title, category, description } = request.body;
    const { rows } = await pool.query(
      "INSERT INTO projects (title, category, description) VALUES ($1, $2, $3) RETURNING id, title, category, description",
      [title.trim(), category, description.trim()]
    );
    return response.status(201).json(rows[0]);
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/admin/projects/:id", async (request, response, next) => {
  if (!/^\d+$/.test(request.params.id)) return response.status(400).json({ error: "Projeto inválido." });
  try {
    const result = await pool.query("DELETE FROM projects WHERE id = $1", [request.params.id]);
    return result.rowCount ? response.status(204).end() : response.status(404).json({ error: "Projeto não encontrado." });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/admin/messages", async (_request, response, next) => {
  try {
    const { rows } = await pool.query("SELECT id, name, email, message, created_at FROM messages ORDER BY created_at DESC");
    return response.json(rows.map(formatMessage));
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/admin/messages", async (_request, response, next) => {
  try {
    await pool.query("DELETE FROM messages");
    return response.status(204).end();
  } catch (error) {
    return next(error);
  }
});

app.get("/api/admin/socials", async (_request, response, next) => {
  try {
    const { rows } = await pool.query("SELECT whatsapp, instagram, linkedin FROM socials WHERE id = 1");
    return response.json(rows[0] ?? defaultSocials);
  } catch (error) {
    return next(error);
  }
});

app.put("/api/admin/socials", async (request, response, next) => {
  if (!validSocials(request.body)) return response.status(400).json({ error: "Informe links HTTPS válidos para os canais." });
  try {
    const { whatsapp, instagram, linkedin } = request.body;
    await pool.query(
      "INSERT INTO socials (id, whatsapp, instagram, linkedin) VALUES (1, $1, $2, $3) ON CONFLICT (id) DO UPDATE SET whatsapp = EXCLUDED.whatsapp, instagram = EXCLUDED.instagram, linkedin = EXCLUDED.linkedin",
      [whatsapp, instagram, linkedin]
    );
    return response.json({ whatsapp, instagram, linkedin });
  } catch (error) {
    return next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  if (error.message === "Origem não autorizada.") return response.status(403).json({ error: error.message });
  return response.status(500).json({ error: "Erro interno. Tente novamente mais tarde." });
});

async function start() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(120) NOT NULL,
      category VARCHAR(8) NOT NULL CHECK (category IN ('web', 'ai')),
      description VARCHAR(2000) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(254) NOT NULL,
      message VARCHAR(5000) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS socials (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      whatsapp TEXT NOT NULL,
      instagram TEXT NOT NULL,
      linkedin TEXT NOT NULL
    );
  `);
  await pool.query(
    "INSERT INTO socials (id, whatsapp, instagram, linkedin) VALUES (1, $1, $2, $3) ON CONFLICT (id) DO NOTHING",
    [defaultSocials.whatsapp, defaultSocials.instagram, defaultSocials.linkedin]
  );
  app.listen(port, () => console.log(`EngTech API ouvindo na porta ${port}`));
}

process.on("SIGTERM", async () => {
  await pool.end();
  process.exit(0);
});

start().catch((error) => {
  console.error("Falha ao iniciar a API:", error);
  process.exit(1);
});