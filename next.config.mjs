import { execSync } from "child_process";

const buildNumber = execSync("git rev-list --count HEAD").toString().trim();
const buildDate = new Date().toISOString().slice(0, 10);

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BUILD_NUMBER: buildNumber,
    BUILD_DATE: buildDate,
  },
};

export default nextConfig;
