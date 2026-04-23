import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();

async function readJson(filePath) {
  const raw = await fs.readFile(path.join(rootDir, filePath), "utf8");
  return JSON.parse(raw);
}

export async function loadPosts() {
  return readJson("data/posts.json");
}

export async function loadEvalCases() {
  return readJson("data/eval-cases.json");
}
