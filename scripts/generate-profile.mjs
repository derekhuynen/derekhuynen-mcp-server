// Regenerates src/data/profile.json from the workspace profile/ markdown.
// Usage: PROFILE_SRC=../derekhuynen-workspace/profile node scripts/generate-profile.mjs
// Honesty: skips every role's "## Notes" section and fails on any em-dash.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import {
  assertNoEmDashesDeep,
  collapseWhitespace,
  extractSection,
  parseCommaList,
  parseSkillGroups,
} from './transform.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = process.env.PROFILE_SRC ?? join(here, '..', '..', 'derekhuynen-workspace', 'profile');
const OUT = join(here, '..', 'src', 'data', 'profile.json');

function read(rel) {
  return readFileSync(join(SRC, rel), 'utf8');
}

function buildIdentity() {
  const { data } = matter(read('identity.md'));
  return {
    name: data.name,
    title: data.title,
    location: data.location,
    workPreference: data.work_preference,
    email: data.email,
    links: {
      linkedin: data.links?.linkedin,
      github: data.links?.github,
      website: data.links?.website,
    },
  };
}

function buildSummary() {
  const text = read('summary.md');
  const paras = text
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith('#') && !p.startsWith('>'));
  return collapseWhitespace(paras[0] ?? '');
}

function buildExperience() {
  const dir = join(SRC, 'roles');
  const files = readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_'));
  const entries = [];
  for (const file of files) {
    const { data, content } = matter(readFileSync(join(dir, file), 'utf8'));
    const entry = {
      slug: data.slug,
      project: data.project,
      title: data.title,
      employer: data.employer,
      start: String(data.start),
      end: String(data.end),
      summary: collapseWhitespace(extractSection(content, 'One-liner')),
      skills: parseCommaList(extractSection(content, 'Skills Demonstrated').replace(/\n/g, ' ')),
      featured: Boolean(data.featured),
    };
    if (data.client) entry.client = data.client;
    if (data.industry) entry.industry = data.industry;
    if (data.location) entry.location = data.location;
    entries.push(entry); // NOTE: "## Notes" is never read, so it can never be exported.
  }
  entries.sort((a, b) => (a.featured === b.featured ? b.start.localeCompare(a.start) : a.featured ? -1 : 1));
  return entries;
}

function buildProjects() {
  const md = read('projects.md');
  const lines = md.split('\n');
  const projects = [];
  let current = null;
  const flush = () => {
    if (current && current.name) projects.push(current);
    current = null;
  };
  for (const line of lines) {
    if (line.startsWith('## ')) {
      flush();
      current = { name: line.slice(3).trim(), description: '', skills: [] };
    } else if (current) {
      const what = line.match(/^- \*\*What:\*\*\s*(.*)$/);
      const tech = line.match(/^- \*\*Tech:\*\*\s*(.*)$/);
      const link = line.match(/^- \*\*(?:Link|Repo):\*\*\s*(\S+)/);
      if (what) current.description = what[1].trim();
      else if (tech) current.skills = parseCommaList(tech[1]);
      else if (link) current.url = link[1].trim();
      else if (current.description && line.trim() && !line.startsWith('- ') && !line.startsWith('>')) {
        current.description = `${current.description} ${line.trim()}`.trim();
      }
    }
  }
  flush();
  return projects;
}

function buildResume() {
  const resumePath = join(SRC, '..', 'resume', 'Derek_Huynen_Resume.md');
  if (existsSync(resumePath)) return readFileSync(resumePath, 'utf8');
  return buildSummary();
}

const profile = {
  identity: buildIdentity(),
  summary: buildSummary(),
  skills: parseSkillGroups(read('skills.md')),
  experience: buildExperience(),
  projects: buildProjects(),
  resume: buildResume(),
};

assertNoEmDashesDeep(profile, 'profile');
writeFileSync(OUT, JSON.stringify(profile, null, 2) + '\n', 'utf8');
console.log(`Wrote ${OUT}: ${profile.experience.length} roles, ${profile.projects.length} projects.`);
