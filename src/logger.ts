import pino from 'pino';

// Read LOG_LEVEL directly (not via loadConfig) so importing the logger never triggers
// numeric env parsing. A malformed PORT must not crash the stdio transport, which has no port.
// Logs go to stderr (fd 2) so they never corrupt the JSON-RPC stream on stdout over stdio.
const level = process.env.LOG_LEVEL ?? 'info';
export const logger = pino({ level }, pino.destination(2));
