import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Profile } from '../data/schema.js';
import { registerTools } from './tools.js';
import { registerResources } from './resources.js';
import { registerPrompts } from './prompts.js';

export const SERVER_INFO = { name: 'derekhuynen-mcp-server', version: '1.0.0' };

/** Build a fully configured MCP server for the given profile. One server per connection. */
export function buildServer(profile: Profile): McpServer {
  const server = new McpServer(SERVER_INFO);
  registerTools(server, profile);
  registerResources(server, profile);
  registerPrompts(server, profile);
  return server;
}
