import { fileURLToPath } from 'node:url';
import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { buildServer } from '../core/server.js';
import { loadProfile } from '../data/loader.js';
import { loadConfig, type Config } from '../config.js';
import { logger } from '../logger.js';
import { installProcessErrorHandlers } from '../process.js';
import type { Profile } from '../data/schema.js';

export function createHttpApp(profile: Profile, config: Config): Express {
  const app = express();
  app.set('trust proxy', config.trustProxy);
  app.use(helmet());
  app.use(express.json({ limit: '64kb' }));
  // CORS defaults to '*' (all data is public); set CORS_ORIGINS to restrict embedding.
  app.use(
    cors({
      origin:
        config.corsOrigins === '*' ? true : config.corsOrigins.split(',').map((s) => s.trim()),
    }),
  );
  app.use(
    rateLimit({
      windowMs: config.rateLimitWindowMs,
      max: config.rateLimitMax,
      skip: (req) => req.path === '/health',
    }),
  );

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // Stateless Streamable HTTP: a fresh server + transport per request.
  app.post('/mcp', async (req: Request, res: Response) => {
    try {
      const server = buildServer(profile);
      // Stateless transport (no session id) and no DNS-rebinding protection are deliberate:
      // every response is public, read-only data, so there is no session or origin to protect.
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      res.on('close', () => {
        void transport.close();
        void server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      logger.error(err, 'MCP request failed');
      if (!res.headersSent) {
        res
          .status(500)
          .json({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal error' }, id: null });
      }
    }
  });

  // Centralized error handler.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err, 'Unhandled HTTP error');
    if (!res.headersSent) res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

export function startHttpServer() {
  installProcessErrorHandlers(logger);
  const config = loadConfig();
  const profile = loadProfile();
  const app = createHttpApp(profile, config);
  const httpServer = app.listen(config.port, () => {
    logger.info(`derekhuynen-mcp-server HTTP listening on :${config.port}`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down`);
    httpServer.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  return httpServer;
}

// Run the server when invoked directly (node dist/transports/http.js or tsx src/transports/http.ts).
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  startHttpServer();
}
