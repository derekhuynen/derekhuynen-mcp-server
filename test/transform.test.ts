import { describe, it, expect } from 'vitest';
import {
  assertNoEmDashes,
  assertNoEmDashesDeep,
  collapseWhitespace,
  extractSection,
  parseCommaList,
  parseSkillGroups,
} from '../scripts/transform.mjs';

describe('assertNoEmDashes', () => {
  it('passes for text without em-dashes (en-dash 18–21 is fine)', () => {
    expect(() => assertNoEmDashes('Team of 18–21 people', 'x')).not.toThrow();
  });
  it('throws when an em-dash (U+2014) is present', () => {
    expect(() => assertNoEmDashes('A — B', 'summary.md')).toThrow(/em-dash/i);
  });
});

describe('assertNoEmDashesDeep', () => {
  it('throws when a nested string contains an em-dash', () => {
    expect(() => assertNoEmDashesDeep({ a: { b: ['ok', 'bad — here'] } }, 'profile')).toThrow(
      /em-dash/i,
    );
  });
  it('passes for a clean nested structure', () => {
    expect(() => assertNoEmDashesDeep({ a: { b: ['ok', '18–21'] } }, 'profile')).not.toThrow();
  });
});

describe('extractSection', () => {
  const md = '# Title\n\n## One-liner\nBuilt a RAG chatbot.\n\n## Context\nSomething else.\n';
  it('returns the text under a heading up to the next heading', () => {
    expect(extractSection(md, 'One-liner')).toBe('Built a RAG chatbot.');
  });
  it('returns empty string when the heading is absent', () => {
    expect(extractSection(md, 'Nope')).toBe('');
  });
});

describe('parseCommaList', () => {
  it('splits and trims comma-separated values', () => {
    expect(parseCommaList('RAG, Azure OpenAI ,  React')).toEqual(['RAG', 'Azure OpenAI', 'React']);
  });
  it('returns [] for empty input', () => {
    expect(parseCommaList('')).toEqual([]);
  });
});

describe('parseSkillGroups', () => {
  it('parses ## groups with comma-separated skill lines', () => {
    const md = '# Skills\n\n## AI / GenAI\nRAG, Azure OpenAI\n\n## Frontend\nReact, TypeScript\n';
    expect(parseSkillGroups(md)).toEqual([
      { category: 'AI / GenAI', items: ['RAG', 'Azure OpenAI'] },
      { category: 'Frontend', items: ['React', 'TypeScript'] },
    ]);
  });
});

describe('parseCommaList paren-awareness and trailing periods', () => {
  it('does not split on commas inside parentheses', () => {
    expect(parseCommaList('Azure (Functions, CosmosDB, AI Search), MySQL, Docker')).toEqual([
      'Azure (Functions, CosmosDB, AI Search)',
      'MySQL',
      'Docker',
    ]);
  });
  it('strips a single trailing period per item', () => {
    expect(parseCommaList('Technical Leadership, Agile Planning.')).toEqual([
      'Technical Leadership',
      'Agile Planning',
    ]);
  });
  it('preserves internal dots like Node.js and .NET', () => {
    expect(parseCommaList('Node.js, .NET, C#/.NET')).toEqual(['Node.js', '.NET', 'C#/.NET']);
  });
});

describe('collapseWhitespace', () => {
  it('collapses newlines and multiple spaces to single spaces', () => {
    expect(collapseWhitespace('directing delivery\nacross   web')).toBe(
      'directing delivery across web',
    );
  });
});
