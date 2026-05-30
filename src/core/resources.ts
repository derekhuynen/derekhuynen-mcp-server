import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Profile } from '../data/schema.js';

export function registerResources(server: McpServer, profile: Profile): void {
  server.registerResource(
    'summary',
    'profile://summary',
    {
      title: 'Professional Summary',
      description: "Derek Huynen's master professional summary.",
      mimeType: 'text/markdown',
    },
    async (uri) => ({
      contents: [{ uri: uri.href, text: profile.summary, mimeType: 'text/markdown' }],
    }),
  );

  server.registerResource(
    'resume',
    'profile://resume',
    {
      title: 'Resume',
      description: "Derek Huynen's resume in markdown.",
      mimeType: 'text/markdown',
    },
    async (uri) => ({
      contents: [{ uri: uri.href, text: profile.resume, mimeType: 'text/markdown' }],
    }),
  );
}
