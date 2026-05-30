import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { Profile } from '../data/schema.js';

export function registerPrompts(server: McpServer, profile: Profile): void {
  server.registerPrompt(
    'recruiter_pitch',
    {
      title: 'Recruiter Pitch',
      description: 'Generate a concise, honest pitch for why Derek fits a target role.',
      argsSchema: {
        role: z.string().describe('Target role, e.g. "Staff AI Engineer"'),
      },
    },
    ({ role }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text:
              `Using the profile below, write a concise, honest pitch for why Derek Huynen ` +
              `is a strong fit for a ${role} position. Do not use em-dashes. Do not invent metrics.\n\n` +
              `Summary: ${profile.summary}`,
          },
        },
      ],
    }),
  );
}
