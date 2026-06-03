import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "public/index.html",
  "public/css/styles.css",
  "public/js/app.js",
  "public/img/Pantera.png",
  "api/partidos.js"
];

const missingFiles = requiredFiles.filter((file) => !existsSync(path.join(appDir, file)));

if (missingFiles.length > 0) {
  console.error(`Missing required deploy files: ${missingFiles.join(", ")}`);
  process.exit(1);
}

console.log("Static frontend ready in public/");
