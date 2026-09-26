import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const srcRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..", "src");

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (full.endsWith(".js")) out.push(full);
  }
  return out;
}

const relativeRe = /(from\s+["'])(\.{1,2}[^"']+?)(["'])|(import\(["'])(\.{1,2}[^"']+?)(["'])/g;

function fixRelPath(p) {
  if (/\.(js|mjs|cjs|json|node)$/.test(p)) return p;
  return `${p}.js`;
}

let fixed = 0;
for (const file of walk(srcRoot)) {
  const src = readFileSync(file, "utf8");
  const out = src.replace(relativeRe, (m, a, p1, b, c, p2, d) => {
    if (p1) return `${a}${fixRelPath(p1)}${b}`;
    if (p2) return `${c}${fixRelPath(p2)}${d}`;
    return m;
  });
  if (out !== src) {
    writeFileSync(file, out, "utf8");
    fixed += 1;
    console.log(`fixed ${relative(srcRoot, file)}`);
  }
}
console.log(`done — ${fixed} file(s) updated`);