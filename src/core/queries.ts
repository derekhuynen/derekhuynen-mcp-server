import type { Profile, Experience, SkillGroup, Project, Links } from '../data/schema.js';

export interface ProfileView {
  name: string;
  title: string;
  location: string;
  workPreference: string;
  summary: string;
  links: Links;
}

export interface ContactView extends Links {
  email: string;
}

export function getProfile(p: Profile): ProfileView {
  return {
    name: p.identity.name,
    title: p.identity.title,
    location: p.identity.location,
    workPreference: p.identity.workPreference,
    summary: p.summary,
    links: p.identity.links,
  };
}

export function getContact(p: Profile): ContactView {
  return { email: p.identity.email, ...p.identity.links };
}

export function getSkills(p: Profile): SkillGroup[] {
  return p.skills;
}

export function getProjects(p: Profile): Project[] {
  return p.projects;
}

export interface ExperienceFilters {
  skill?: string;
  employer?: string;
  recentOnly?: boolean;
}

export function getExperience(p: Profile, filters: ExperienceFilters = {}): Experience[] {
  let xs = p.experience;
  if (filters.skill) {
    const s = filters.skill.toLowerCase();
    xs = xs.filter((x) => x.skills.some((k) => k.toLowerCase().includes(s)));
  }
  if (filters.employer) {
    const e = filters.employer.toLowerCase();
    xs = xs.filter(
      (x) => x.employer.toLowerCase().includes(e) || (x.client?.toLowerCase().includes(e) ?? false),
    );
  }
  if (filters.recentOnly) {
    xs = xs.filter((x) => x.end.toLowerCase() === 'present');
  }
  return xs;
}

export type SearchHit =
  | { type: 'role'; slug: string; project: string; summary: string }
  | { type: 'project'; name: string; description: string };

export function searchExperience(p: Profile, query: string): SearchHit[] {
  const q = query.toLowerCase();
  const roleHits: SearchHit[] = p.experience
    .filter((x) =>
      [x.project, x.title, x.employer, x.client ?? '', x.summary, ...x.skills]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
    .map((x) => ({ type: 'role', slug: x.slug, project: x.project, summary: x.summary }));
  const projectHits: SearchHit[] = p.projects
    .filter((x) => [x.name, x.description, ...x.skills].join(' ').toLowerCase().includes(q))
    .map((x) => ({ type: 'project', name: x.name, description: x.description }));
  return [...roleHits, ...projectHits];
}
