import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const build = JSON.parse(readFileSync(join(__dirname, "build.json"), "utf8"));

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BUILD_NUMBER: String(build.number),
    BUILD_DATE: build.date,
  },
};

export default nextConfig;
