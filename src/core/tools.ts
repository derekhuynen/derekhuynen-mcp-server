import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { Profile } from '../data/schema.js';
import * as q from './queries.js';

function jsonResult(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerTools(server: McpServer, profile: Profile): void {
  server.registerTool(
    'get_profile',
    {
      title: 'Get Profile',
      description: "Derek Huynen's identity, title, summary, and links.",
      inputSchema: {},
    },
    async () => jsonResult(q.getProfile(profile)),
  );

  server.registerTool(
    'get_contact',
    {
      title: 'Get Contact',
      description: 'How to reach Derek Huynen (email and profile links).',
      inputSchema: {},
    },
    async () => jsonResult(q.getContact(profile)),
  );

  server.registerTool(
    'get_skills',
    {
      title: 'Get Skills',
      description: "Derek's skills grouped by category.",
      inputSchema: {},
    },
    async () => jsonResult(q.getSkills(profile)),
  );

  server.registerTool(
    'get_projects',
    {
      title: 'Get Projects',
      description: "Derek's public portfolio projects.",
      inputSchema: {},
    },
    async () => jsonResult(q.getProjects(profile)),
  );

  server.registerTool(
    'get_experience',
    {
      title: 'Get Experience',
      description: "Derek's roles and engagements, optionally filtered.",
      inputSchema: {
        skill: z.string().optional().describe('Filter by skill keyword, e.g. "RAG"'),
        employer: z.string().optional().describe('Filter by employer or client name'),
        recentOnly: z.boolean().optional().describe('Only current (present) roles'),
      },
    },
    async (args) => jsonResult(q.getExperience(profile, args)),
  );

  server.registerTool(
    'search_experience',
    {
      title: 'Search Experience',
      description: 'Keyword search across roles and projects.',
      inputSchema: {
        query: z.string().describe('Search keyword, e.g. "Azure" or "leadership"'),
      },
    },
    async ({ query }) => jsonResult(q.searchExperience(profile, query)),
  );
}
