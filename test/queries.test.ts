import { describe, it, expect } from 'vitest';
import {
  getProfile,
  getContact,
  getSkills,
  getProjects,
  getExperience,
  searchExperience,
} from '../src/core/queries.js';
import { fixtureProfile } from './fixtures/profile.fixture.js';

describe('getProfile', () => {
  it('returns identity essentials and summary', () => {
    const r = getProfile(fixtureProfile);
    expect(r.name).toBe('Derek Huynen');
    expect(r.links.github).toContain('derekhuynen');
    expect(r.summary).toBeTruthy();
  });
});

describe('getContact', () => {
  it('returns email and links', () => {
    const r = getContact(fixtureProfile);
    expect(r.email).toBe('derek.huynen@gmail.com');
    expect(r.linkedin).toContain('linkedin');
  });
});

describe('getSkills / getProjects', () => {
  it('returns the grouped skills', () => {
    expect(getSkills(fixtureProfile)).toHaveLength(2);
  });
  it('returns the projects', () => {
    expect(getProjects(fixtureProfile)[0].name).toBe('AI RAG Chatbot (2025)');
  });
});

describe('getExperience', () => {
  it('returns all roles with no filter', () => {
    expect(getExperience(fixtureProfile)).toHaveLength(2);
  });
  it('filters by skill (case-insensitive, partial)', () => {
    const r = getExperience(fixtureProfile, { skill: 'rag' });
    expect(r).toHaveLength(1);
    expect(r[0].slug).toBe('neudesic-pge-genai-chatbot');
  });
  it('filters by employer or client', () => {
    expect(getExperience(fixtureProfile, { employer: 't-mobile' })).toHaveLength(1);
  });
  it('filters to current roles with recentOnly', () => {
    const r = getExperience(fixtureProfile, { recentOnly: true });
    expect(r).toHaveLength(1);
    expect(r[0].end).toBe('present');
  });
});

describe('searchExperience', () => {
  it('matches roles and projects by keyword', () => {
    const r = searchExperience(fixtureProfile, 'semantic kernel');
    expect(r.some((x) => x.type === 'project')).toBe(true);
  });
  it('returns [] when nothing matches', () => {
    expect(searchExperience(fixtureProfile, 'zzzznotfound')).toEqual([]);
  });
  it('matches roles by skill keyword and returns a role hit shape', () => {
    const r = searchExperience(fixtureProfile, 'leadership');
    const roleHit = r.find((x) => x.type === 'role');
    expect(roleHit).toBeDefined();
    expect(roleHit).toMatchObject({ type: 'role', slug: 'ibm-tmobile-arrow' });
  });
});
