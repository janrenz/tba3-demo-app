/**
 * Shared MCP server implementation (tools + config).
 * Used by both stdio (index.js) and HTTP (server-http.js) entrypoints.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const API_BASE = process.env.TBA3_API_BASE_URL || "http://localhost:8000";

// Vollständige Listen (wie in der Demo-App) für aussagekräftige MCP-Antworten
const GROUPS = [
  { id: "3a-deutsch", name: "3a Deutsch", subject: "DE", grade: "V3" },
  { id: "3b-deutsch", name: "3b Deutsch", subject: "DE", grade: "V3" },
  { id: "3c-deutsch", name: "3c Deutsch", subject: "DE", grade: "V3" },
  { id: "3a-mathe", name: "3a Mathematik", subject: "MA", grade: "V3" },
  { id: "3b-mathe", name: "3b Mathematik", subject: "MA", grade: "V3" },
  { id: "3c-mathe", name: "3c Mathematik", subject: "MA", grade: "V3" },
  { id: "8a-deutsch", name: "8a Deutsch", subject: "DE", grade: "V8" },
  { id: "8b-deutsch", name: "8b Deutsch", subject: "DE", grade: "V8" },
  { id: "8c-deutsch", name: "8c Deutsch", subject: "DE", grade: "V8" },
  { id: "8a-englisch", name: "8a Englisch", subject: "EN", grade: "V8" },
  { id: "8b-englisch", name: "8b Englisch", subject: "EN", grade: "V8" },
  { id: "8c-englisch", name: "8c Englisch", subject: "EN", grade: "V8" },
  { id: "8a-franzoesisch", name: "8a Französisch", subject: "FR", grade: "V8" },
  { id: "8b-franzoesisch", name: "8b Französisch", subject: "FR", grade: "V8" },
  { id: "8c-franzoesisch", name: "8c Französisch", subject: "FR", grade: "V8" },
  { id: "8a-mathe", name: "8a Mathematik", subject: "MA", grade: "V8" },
  { id: "8b-mathe", name: "8b Mathematik", subject: "MA", grade: "V8" },
  { id: "8c-mathe", name: "8c Mathematik", subject: "MA", grade: "V8" },
  { id: "8d-mathe", name: "8d Mathematik", subject: "MA", grade: "V8" },
];

const SCHOOLS = [
  { id: "gs-musterstadt", name: "Grundschule Musterstadt", type: "Grundschule" },
  { id: "gym-beispielstadt", name: "Gymnasium Beispielstadt", type: "Gymnasium" },
];

const STATES = [
  { id: "beispielland", name: "Beispielland" },
];

const SUBJECTS = [
  { code: "DE", name: "Deutsch" },
  { code: "MA", name: "Mathematik" },
  { code: "EN", name: "Englisch" },
  { code: "FR", name: "Französisch" },
];

const GRADES = [
  { code: "V3", name: "Klasse 3", description: "Vergleichsarbeiten Klasse 3" },
  { code: "V8", name: "Klasse 8", description: "Vergleichsarbeiten Klasse 8" },
];

export const ENTITIES = {
  groups: GROUPS.map((g) => g.id),
  schools: SCHOOLS.map((s) => s.id),
  states: STATES.map((s) => s.id),
};

async function fetchApi(path, params = {}) {
  const url = new URL(path, API_BASE);
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== "") url.searchParams.set(k, String(v));
  });
  const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TBA3 API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export function createMcpServer() {
  const server = new McpServer({
    name: "tba3-results",
    version: "1.0.0",
  });

  server.registerTool(
    "tba3_list_entities",
    {
      title: "List TBA3 entities (schools, classes/groups, states)",
      description:
        "List available Schulen, Lerngruppen/Klassen oder Bundesländer mit id, name und ggf. Fach/Klasse/Schulart. Optional nach subject (DE/MA/EN/FR), grade (V3/V8) oder type (Schulart) filtern.",
      inputSchema: {
        entityType: z.enum(["group", "school", "state"]),
        subject: z
          .enum(["DE", "MA", "EN", "FR"])
          .optional()
          .describe("Nur bei entityType=group: Filter nach Fach"),
        grade: z
          .enum(["V3", "V8"])
          .optional()
          .describe("Nur bei entityType=group: Filter nach Jahrgang (Klasse 3/8)"),
        type: z.string().optional().describe("Nur bei entityType=school: Filter nach Schulart, z.B. Grundschule"),
      },
    },
    async ({ entityType, subject, grade, type }) => {
      let list;
      if (entityType === "group") {
        list = GROUPS.filter((g) => {
          if (subject && g.subject !== subject) return false;
          if (grade && g.grade !== grade) return false;
          return true;
        });
      } else if (entityType === "school") {
        list = type ? SCHOOLS.filter((s) => s.type === type) : SCHOOLS;
      } else {
        list = STATES;
      }
      const data = { entityType, count: list.length, items: list };
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        structuredContent: data,
      };
    }
  );

  server.registerTool(
    "tba3_list_subjects",
    {
      title: "List TBA3 subjects (Fächer)",
      description: "Liste der verfügbaren Fächer mit code und name (DE, MA, EN, FR).",
      inputSchema: {},
    },
    async () => {
      const data = { subjects: SUBJECTS };
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        structuredContent: data,
      };
    }
  );

  server.registerTool(
    "tba3_list_grades",
    {
      title: "List TBA3 grade levels (Jahrgangsstufen)",
      description: "Liste der verfügbaren Jahrgangsstufen (Klasse 3, Klasse 8) mit code, name und description.",
      inputSchema: {},
    },
    async () => {
      const data = { grades: GRADES };
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        structuredContent: data,
      };
    }
  );

  server.registerTool(
    "tba3_get_competence_levels",
    {
      title: "Get TBA3 competence levels",
      description: "Fetch competence level statistics (Kompetenzstufen I–V) for a group, school, or state.",
      inputSchema: {
        entityType: z.enum(["group", "school", "state"]),
        entityId: z.string(),
        type: z
          .enum(["group", "students", "group,students"])
          .optional()
          .describe("Include group-level, student-level, or both (default: group only)"),
      },
    },
    async ({ entityType, entityId, type }) => {
      try {
        const path = `/${entityType}s/${encodeURIComponent(entityId)}/competence-levels`;
        const data = await fetchApi(path, type ? { type } : {});
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          structuredContent: data,
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "tba3_get_aggregations",
    {
      title: "Get TBA3 aggregations",
      description: "Fetch aggregation statistics (e.g. mean, frequency) for a group, school, or state.",
      inputSchema: {
        entityType: z.enum(["group", "school", "state"]),
        entityId: z.string(),
        type: z
          .enum(["group", "students", "group,students"])
          .optional()
          .describe("Include group-level, student-level, or both (default: group only)"),
      },
    },
    async ({ entityType, entityId, type }) => {
      try {
        const path = `/${entityType}s/${encodeURIComponent(entityId)}/aggregations`;
        const data = await fetchApi(path, type ? { type } : {});
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          structuredContent: data,
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "tba3_get_items",
    {
      title: "Get TBA3 item results",
      description: "Fetch per-item statistics (solution frequency, etc.) for a group, school, or state.",
      inputSchema: {
        entityType: z.enum(["group", "school", "state"]),
        entityId: z.string(),
        type: z
          .enum(["group", "students", "group,students"])
          .optional()
          .describe("Include group-level, student-level, or both (default: group only)"),
      },
    },
    async ({ entityType, entityId, type }) => {
      try {
        const path = `/${entityType}s/${encodeURIComponent(entityId)}/items`;
        const data = await fetchApi(path, type ? { type } : {});
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          structuredContent: data,
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  return server;
}
