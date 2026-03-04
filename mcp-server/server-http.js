#!/usr/bin/env node
/**
 * TBA3 Results MCP Server (Streamable HTTP)
 * For deployment: run with node mcp-server/server-http.js
 * Set PORT (default 3000) and TBA3_API_BASE_URL.
 */

import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpServer } from "./server-impl.js";

const PORT = Number(process.env.PORT) || 3000;

const app = createMcpExpressApp({ host: "0.0.0.0" });

app.post("/mcp", async (req, res) => {
  const server = createMcpServer();
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless for deployment
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    res.on("close", () => {
      transport.close();
      server.close();
    });
  } catch (err) {
    console.error("Error handling MCP request:", err);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
});

app.get("/mcp", (req, res) => {
  res.writeHead(405, { "Content-Type": "application/json" }).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null,
    })
  );
});

app.get("/healthz", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" }).end("ok\n");
});

app.listen(PORT, "0.0.0.0", (err) => {
  if (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
  console.log(`TBA3 MCP server (HTTP) listening on 0.0.0.0:${PORT}`);
});
