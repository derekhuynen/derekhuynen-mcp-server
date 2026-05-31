import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ProfileSchema, type Profile } from './schema.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Default location of the committed profile snapshot, relative to the built loader. */
export const DEFAULT_PROFILE_PATH = join(__dirname, 'profile.json');

/** Validate an already-parsed object against the profile schema. Throws on mismatch. */
export function parseProfile(data: unknown): Profile {
  return ProfileSchema.parse(data);
}

/** Read and validate the profile snapshot from disk. Throws (fail-fast) on any problem. */
export function loadProfile(path: string = DEFAULT_PROFILE_PATH): Profile {
  const raw = readFileSync(path, 'utf8');
  return parseProfile(JSON.parse(raw));
}
