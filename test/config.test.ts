import { describe, it, expect } from 'vitest';
import { loadConfig } from '../src/config.js';

describe('loadConfig', () => {
  it('returns defaults when env is empty', () => {
    const c = loadConfig({});
    expect(c.port).toBe(3000);
    expect(c.rateLimitMax).toBe(100);
    expect(c.corsOrigins).toBe('*');
    expect(c.trustProxy).toBe(1);
  });
  it('treats an empty string as "use default"', () => {
    expect(loadConfig({ PORT: '' }).port).toBe(3000);
  });
  it('parses a valid override', () => {
    expect(loadConfig({ PORT: '8080' }).port).toBe(8080);
  });
  it('throws on a non-numeric value', () => {
    expect(() => loadConfig({ PORT: 'abc' })).toThrow(/PORT/);
  });
  it('throws on an out-of-range port', () => {
    expect(() => loadConfig({ PORT: '70000' })).toThrow(/PORT/);
  });
});
