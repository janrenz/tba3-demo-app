#!/usr/bin/env node
/**
 * TBA3 Results MCP Server (stdio)
 * For Cursor/IDE: run with node mcp-server/index.js
 * Set TBA3_API_BASE_URL to your API base (default: http://localhost:8000).
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./server-impl.js";

const server = createMcpServer();
const transport = new StdioServerTransport();
await server.connect(transport);
