import { z } from 'zod';

export const LinksSchema = z.object({
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
});

export const IdentitySchema = z.object({
  name: z.string(),
  title: z.string(),
  location: z.string(),
  workPreference: z.string(),
  email: z.string().email(),
  links: LinksSchema,
});

export const SkillGroupSchema = z.object({
  category: z.string(),
  items: z.array(z.string()).min(1),
});

export const ExperienceSchema = z.object({
  slug: z.string(),
  project: z.string(),
  title: z.string(),
  employer: z.string(),
  client: z.string().optional(),
  industry: z.string().optional(),
  start: z.string(), // YYYY-MM
  end: z.string(), // YYYY-MM or "present"
  location: z.string().optional(),
  summary: z.string(),
  skills: z.array(z.string()),
  featured: z.boolean(),
});

export const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  skills: z.array(z.string()),
  url: z.string().url().optional(),
});

export const ProfileSchema = z.object({
  identity: IdentitySchema,
  summary: z.string(),
  skills: z.array(SkillGroupSchema),
  experience: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  resume: z.string(),
});

export type Links = z.infer<typeof LinksSchema>;
export type Identity = z.infer<typeof IdentitySchema>;
export type SkillGroup = z.infer<typeof SkillGroupSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
