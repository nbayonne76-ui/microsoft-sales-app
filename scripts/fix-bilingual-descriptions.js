/**
 * Rewrites all AzureSolution descriptions in clean English AND French.
 * Processes 5 solutions at a time to stay within OpenAI rate limits.
 */
const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai').default;
require('dotenv').config();

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BATCH_SIZE = 5;
const DELAY_MS   = 1200; // ~50 RPM safety margin

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function generateDescriptions(solution) {
  const prompt = `You are a Microsoft Azure technical writer.
Rewrite the following solution descriptions in TWO languages: clean English and clean French.
NO mixing of languages : each output must be 100% in its target language.
No markdown syntax like **bold** in the output.

Solution: "${solution.officialName}"
Category: ${solution.category}
Existing short description (mixed, needs fixing): ${solution.shortDescription}
Existing full description (mixed, needs fixing): ${solution.fullDescription}

Return ONLY valid JSON:
{
  "shortEn": "One-sentence English description, max 180 chars, professional tone",
  "fullEn": "2-3 sentence English description, max 450 chars, technical but accessible",
  "shortFr": "One-sentence French description, max 180 chars, professional tone",
  "fullFr": "2-3 sentence French description, max 450 chars, technical but accessible"
}`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 600,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(res.choices[0].message.content);
}

async function main() {
  const solutions = await prisma.azureSolution.findMany({
    select: { id: true, name: true, officialName: true, category: true, shortDescription: true, fullDescription: true },
    orderBy: { name: 'asc' },
  });

  console.log(`Found ${solutions.length} solutions. Processing in batches of ${BATCH_SIZE}...\n`);

  let success = 0;
  let failed  = 0;

  for (let i = 0; i < solutions.length; i += BATCH_SIZE) {
    const batch = solutions.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(solutions.length / BATCH_SIZE);

    console.log(`Batch ${batchNum}/${totalBatches}: ${batch.map(s => s.officialName).join(', ')}`);

    const results = await Promise.allSettled(
      batch.map(s => generateDescriptions(s))
    );

    for (let j = 0; j < batch.length; j++) {
      const sol = batch[j];
      const result = results[j];

      if (result.status === 'fulfilled') {
        const { shortEn, fullEn, shortFr, fullFr } = result.value;
        await prisma.azureSolution.update({
          where: { id: sol.id },
          data: {
            shortDescription:   shortEn || sol.shortDescription,
            fullDescription:    fullEn  || sol.fullDescription,
            shortDescriptionFr: shortFr || null,
            fullDescriptionFr:  fullFr  || null,
          },
        });
        console.log(`  ✅ ${sol.officialName}`);
        success++;
      } else {
        console.error(`  ❌ ${sol.officialName}: ${result.reason?.message}`);
        failed++;
      }
    }

    // Small delay between batches (not needed on last batch)
    if (i + BATCH_SIZE < solutions.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\nDone. ✅ ${success} updated, ❌ ${failed} failed.`);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
