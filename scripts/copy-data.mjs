import { cpSync, mkdirSync } from 'node:fs';

mkdirSync('dist/data', { recursive: true });
cpSync('src/data/profile.json', 'dist/data/profile.json');
