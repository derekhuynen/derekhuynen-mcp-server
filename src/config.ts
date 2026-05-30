export interface Config {
  port: number;
  logLevel: string;
  rateLimitWindowMs: number;
  rateLimitMax: number;
  corsOrigins: string;
  trustProxy: number;
}

function parseNumber(
  value: string | undefined,
  fallback: number,
  name: string,
  min: number,
  max: number,
): number {
  if (value === undefined || value.trim() === '') return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new Error(
      `Invalid numeric config for ${name}: "${value}" (expected integer in [${min}, ${max}])`,
    );
  }
  return n;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return {
    port: parseNumber(env.PORT, 3000, 'PORT', 1, 65535),
    logLevel: env.LOG_LEVEL ?? 'info',
    rateLimitWindowMs: parseNumber(
      env.RATE_LIMIT_WINDOW_MS,
      60_000,
      'RATE_LIMIT_WINDOW_MS',
      1,
      Number.MAX_SAFE_INTEGER,
    ),
    rateLimitMax: parseNumber(
      env.RATE_LIMIT_MAX,
      100,
      'RATE_LIMIT_MAX',
      1,
      Number.MAX_SAFE_INTEGER,
    ),
    corsOrigins: env.CORS_ORIGINS ?? '*',
    trustProxy: parseNumber(env.TRUST_PROXY, 1, 'TRUST_PROXY', 0, 100),
  };
}
