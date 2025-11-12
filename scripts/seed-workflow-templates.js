/**
 * Script to seed workflow templates into the database
 * Run with: node scripts/seed-workflow-templates.js
 */

import { prisma } from '../lib/database.js';
import { seedWorkflowTemplates } from '../lib/workflow-templates.js';

async function main() {
  console.log('🚀 Starting workflow template seeding...\n');

  try {
    await seedWorkflowTemplates(prisma);
    console.log('\n✅ Workflow templates seeded successfully!');
  } catch (error) {
    console.error('\n❌ Error seeding templates:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
