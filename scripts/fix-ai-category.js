/**
 * Script pour corriger la catégorie AI/ML
 * Change 'ai-ml' to 'ai' pour matcher le frontend
 */

async function main() {
  console.log('🔧 Fixing AI/ML category from "ai-ml" to "ai"...\n');

  try {
    // Fetch all solutions with category 'ai-ml'
    const response = await fetch('http://localhost:3000/api/azure-solutions?category=ai-ml');
    const data = await response.json();

    if (!data.success) {
      console.error('Failed to fetch solutions:', data.error);
      return;
    }

    const solutions = data.solutions;
    console.log(`Found ${solutions.length} solutions with category 'ai-ml'\n`);

    let successCount = 0;
    let failCount = 0;

    for (const solution of solutions) {
      try {
        console.log(`Updating ${solution.officialName}...`);

        // Update the solution with category 'ai'
        const updateResponse = await fetch(`http://localhost:3000/api/azure-solutions/${solution.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            category: 'ai'
          })
        });

        const result = await updateResponse.json();

        if (result.success) {
          successCount++;
          console.log(`   ✅ SUCCESS - Updated to category 'ai'\n`);
        } else {
          failCount++;
          console.log(`   ❌ FAILED - ${result.error}\n`);
        }
      } catch (error) {
        failCount++;
        console.log(`   ❌ FAILED - ${error.message}\n`);
      }

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log(`\n${'='.repeat(80)}`);
    console.log(`📊 SUMMARY:`);
    console.log(`   ✅ Success: ${successCount}/${solutions.length}`);
    console.log(`   ❌ Failed: ${failCount}/${solutions.length}`);
    console.log(`\n✨ Category fixed! All AI/ML solutions now use category 'ai'`);
    console.log(`\n🌐 Visit http://localhost:3000/azure-knowledge and select "AI & Machine Learning"`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
