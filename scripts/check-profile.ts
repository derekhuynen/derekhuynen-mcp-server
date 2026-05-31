import { loadProfile } from '../src/data/loader.js';

const p = loadProfile();
console.log(`profile.json valid: ${p.experience.length} roles, ${p.projects.length} projects`);
