import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildFile = join(__dirname, "../build.json");

const data = JSON.parse(readFileSync(buildFile, "utf8"));
data.number += 1;
data.date = new Date().toISOString().slice(0, 10);
writeFileSync(buildFile, JSON.stringify(data, null, 2) + "\n");

console.log(`Build #${data.number} — ${data.date}`);
