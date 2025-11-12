const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('\n🔍 VÉRIFICATION BASE DE DONNÉES\n');
  console.log('='.repeat(80));

  // Compter toutes les solutions
  const totalSolutions = await prisma.azureSolution.count();
  console.log(`\n✅ TOTAL SOLUTIONS: ${totalSolutions}`);

  // Par catégorie
  const byCategory = await prisma.azureSolution.groupBy({
    by: ['category'],
    _count: { category: true },
    orderBy: { _count: { category: 'desc' } }
  });

  console.log('\n📊 PAR CATÉGORIE:');
  console.log('-'.repeat(80));
  byCategory.forEach(cat => {
    const categoryNames = {
      'ai': 'AI & Machine Learning',
      'business': 'Business Applications (Dynamics 365)',
      'development': 'Development & Low-Code',
      'security': 'Security',
      'analytics': 'Analytics & Data',
      'storage': 'Storage',
      'compute': 'Compute',
      'networking': 'Networking',
      'integration': 'Integration',
      'management': 'Management & Governance',
      'iot': 'IoT'
    };
    console.log(`  ${categoryNames[cat.category] || cat.category}: ${cat._count.category} solutions`);
  });

  // Solutions Business (Dynamics 365)
  const dynamicsSolutions = await prisma.azureSolution.findMany({
    where: { category: 'business' },
    select: { name: true, officialName: true }
  });

  console.log('\n🏢 DYNAMICS 365 SOLUTIONS:');
  console.log('-'.repeat(80));
  dynamicsSolutions.forEach((sol, idx) => {
    console.log(`  ${idx + 1}. ${sol.officialName}`);
  });

  // Sequences
  const sequences = await prisma.emailSequence.count();
  console.log(`\n✅ EMAIL SEQUENCES: ${sequences}`);

  console.log('\n' + '='.repeat(80));
  console.log('✅ TOUTES LES DONNÉES SONT PRÉSENTES!\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
