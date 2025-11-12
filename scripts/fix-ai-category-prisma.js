/**
 * Script pour corriger la catégorie AI/ML directement dans la DB
 * Change 'ai-ml' to 'ai' pour matcher le frontend
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Fixing AI/ML category from "ai-ml" to "ai"...\n');

  try {
    // Find all solutions with category 'ai-ml'
    const solutions = await prisma.azureSolution.findMany({
      where: {
        category: 'ai-ml'
      }
    });

    console.log(`Found ${solutions.length} solutions with category 'ai-ml'\n`);

    if (solutions.length === 0) {
      console.log('No solutions to update.');
      return;
    }

    // Update all to 'ai'
    const result = await prisma.azureSolution.updateMany({
      where: {
        category: 'ai-ml'
      },
      data: {
        category: 'ai'
      }
    });

    console.log(`✅ Successfully updated ${result.count} solutions!`);
    console.log(`\nUpdated solutions:`);
    solutions.forEach((sol, idx) => {
      console.log(`   ${idx + 1}. ${sol.officialName}`);
    });

    console.log(`\n${'='.repeat(80)}`);
    console.log(`✨ Category fixed! All AI/ML solutions now use category 'ai'`);
    console.log(`\n🌐 Visit http://localhost:3000/azure-knowledge and select "AI & Machine Learning"`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
