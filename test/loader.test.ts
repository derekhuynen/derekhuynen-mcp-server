import { describe, it, expect } from 'vitest';
import { parseProfile } from '../src/data/loader.js';
import { fixtureProfile } from './fixtures/profile.fixture.js';

describe('parseProfile', () => {
  it('accepts a valid profile object', () => {
    const result = parseProfile(fixtureProfile);
    expect(result.identity.name).toBe('Derek Huynen');
    expect(result.experience).toHaveLength(2);
  });

  it('throws on a malformed profile (missing identity)', () => {
    const bad = { summary: 'x', skills: [], experience: [], projects: [], resume: '' };
    expect(() => parseProfile(bad)).toThrow();
  });

  it('throws when email is not a valid email', () => {
    const bad = { ...fixtureProfile, identity: { ...fixtureProfile.identity, email: 'nope' } };
    expect(() => parseProfile(bad)).toThrow();
  });
});
