#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { buildServer } from '../core/server.js';
import { loadProfile } from '../data/loader.js';
import { logger } from '../logger.js';
import { installProcessErrorHandlers } from '../process.js';

async function main(): Promise<void> {
  installProcessErrorHandlers(logger);
  const profile = loadProfile();
  const server = buildServer(profile);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info('derekhuynen-mcp-server running on stdio');
}

main().catch((err) => {
  logger.error(err, 'Fatal error starting stdio server');
  process.exit(1);
});
