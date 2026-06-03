import { cpSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(rootDir, "public");

const staticEntries = ["index.html", "css", "js", "img"];

rmSync(outputDir, { force: true, recursive: true });
mkdirSync(outputDir, { recursive: true });

staticEntries.forEach((entry) => {
  cpSync(path.join(rootDir, entry), path.join(outputDir, entry), {
    recursive: true
  });
});

console.log("Static frontend built in public/");
