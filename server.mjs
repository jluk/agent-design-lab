import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { runAgentDesignPipeline } from "./src/agent/pipeline.mjs";
import { runEvalSuite } from "./src/evals/runSuite.mjs";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

async function serveStatic(filePath, response) {
  const ext = path.extname(filePath);
  const body = await fs.readFile(filePath);
  response.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
  response.end(body);
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload, null, 2));
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${host}:${port}`);

    if (request.method === "GET" && url.pathname === "/api/health") {
      return sendJson(response, 200, { ok: true });
    }

    if (request.method === "GET" && url.pathname === "/api/evals") {
      const result = await runEvalSuite();
      return sendJson(response, 200, result);
    }

    if (request.method === "GET" && url.pathname === "/api/report") {
      const topic = url.searchParams.get("topic") || "AI agents";
      const result = await runAgentDesignPipeline(topic);
      return sendJson(response, 200, result);
    }

    const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = path.join(publicDir, requestedPath);
    return serveStatic(filePath, response);
  } catch (error) {
    const status = error.code === "ENOENT" ? 404 : 500;
    return sendJson(response, status, {
      error: status === 404 ? "Not found" : "Server error",
      detail: error.message
    });
  }
});

server.listen(port, host, () => {
  console.log(`Agent Design Lab running at http://${host}:${port}`);
});
