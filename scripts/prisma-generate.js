#!/usr/bin/env node
// Runs `prisma generate` with a fallback DATABASE_URL for build environments
// (e.g. Vercel) where no real database is configured yet.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:/tmp/dev.db';
}
const { execSync } = require('child_process');
execSync('prisma generate', { stdio: 'inherit' });
