import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const routesRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..", "src", "routes");

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, out);
    } else if (entry === "route.js") {
      out.push(full);
    }
  }
  return out;
}

function compatImportPrefix(file) {
  const folder = file.slice(0, file.length - "route.js".length);
  const rel = relative(routesRoot, folder);
  const levels = rel.split(sep).filter(Boolean).length; // segments; +1 for routes dir -> src
  return "../".repeat(levels + 1);
}

for (const file of walk(routesRoot)) {
  let src = readFileSync(file, "utf8");
  const prefix = compatImportPrefix(file);

  src = src.replace(/import \{ expressify \} from "[^"]*compat\.js";\r?\n?/g, "");
  const prevRouter = src.indexOf('\nimport { Router } from "express";');
  if (prevRouter !== -1) src = src.slice(0, prevRouter);
  src = src.replace(/\s*$/, "");

  src = src.replace(/export const dynamic\s*=\s*"force-dynamic";?\r?\n?/g, "");
  src = src.replace(/export const runtime\s*=\s*"nodejs";?\r?\n?/g, "");

  const methods = [];
  for (const m of ["GET", "POST", "PATCH", "PUT", "DELETE"]) {
    if (new RegExp(`export async function ${m}\\b`).test(src)) methods.push(m);
  }

  const rel = relative(routesRoot, file);
  const segs = rel.split(sep).slice(0, -1);
  const isParam = segs.some((s) => s.startsWith("[") && s.endsWith("]"));
  const mountPath = isParam ? `/:${(segs.find((s) => s.startsWith("[")) || "[id]").slice(1, -1)}` : "/";

  const header = `import { expressify } from "${prefix}compat.js";\n`;
  src = header + src;

  const router = `
import { Router } from "express";
const router = Router();
${methods.map((m) => `router.${m.toLowerCase()}("${mountPath}", expressify(${m}));`).join("\n")}
export default router;
`;
  src = src.replace(/\s*$/, "") + router;

  writeFileSync(file, src, "utf8");
  console.log(`ok ${rel} methods=[${methods.join(",")}] path="${mountPath}"`);
}
console.log("transform complete");