import "dotenv/config";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import connectDB from "./lib/mongodb.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.disable("x-powered-by");
app.set("trust proxy", true);

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function originAllowed(origin) {
  if (
    !origin ||
    allowedOrigins.length === 0 ||
    allowedOrigins.includes(origin) ||
    origin.startsWith("http://localhost") ||
    origin.startsWith("http://127.0.0.1") ||
    origin.endsWith(".vercel.app") ||
    origin.endsWith("jobcareercanvas.in")
  ) {
    return true;
  }
  return false;
}

app.use(
  cors({
    origin(origin, cb) {
      if (originAllowed(origin)) {
        return cb(null, true);
      }
      return cb(null, false);
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Media uploads arrive as base64 data URLs inside a JSON body, which inflates
// the file by ~4/3. The media route accepts 8 MB images and 20 MB PDFs, so the
// JSON limit has to be larger than that or the body parser rejects the upload.
// Posts are published at runtime, so browser/CDN caching of a read must never
// serve a list from before a post was published. The admin panel also re-reads
// the same endpoints right after a write.
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// --- auto-mount every route.js under src/routes as an Express router ---
const routesRoot = join(__dirname, "routes");
const routeFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (entry === "route.js") {
      routeFiles.push(full);
    }
  }
})(routesRoot);

routeFiles.sort((a, b) => {
  const depth = (p) =>
    p.split(/[\\/]/).filter((s) => s && s !== "route.js").length;
  return depth(a) - depth(b);
});

for (const file of routeFiles) {
  try {
    const rel = file.slice(routesRoot.length).split(/[\\/]/);
    const segs = rel.slice(0, -1).filter(Boolean);
    const mountPath =
      "/api/" +
      segs
        .filter((s) => !(s.startsWith("[") && s.endsWith("]")))
        .join("/");
    const mod = await import(`file://${file.replace(/\\/g, "/")}`);
    if (mod.default && typeof mod.default === "function") {
      app.use(mountPath, mod.default);
      console.log(`mounted ${mountPath} <- ${file.slice(routesRoot.length)}`);
    } else {
      console.warn(`skipped ${file} (no default router export)`);
    }
  } catch (err) {
    console.error(`route mount error ${file}:`, err.message);
  }
}

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "job-career-backend",
    status: "ok",
    time: new Date().toISOString(),
  });
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ success: true, status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return;
  if (err?.type === "entity.too.large" || err?.status === 413) {
    return res.status(413).json({ success: false, message: "File is too large to upload. Maximum is 8 MB for images and 20 MB for PDFs." });
  }
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid request body." });
  }
  const status = err?.status && err.status >= 400 && err.status < 500 ? err.status : 500;
  res.status(status).json({ success: false, message: "Internal server error." });
});

connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connect (startup) failed:", err.message));

app.listen(PORT, () => {
  console.log(`JobCareer backend listening on http://localhost:${PORT}`);
});