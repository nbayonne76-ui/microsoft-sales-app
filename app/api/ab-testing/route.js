import { NextResponse } from 'next/server';
import { automatedABTesting } from '../../../lib/automated-ab-testing.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const testId = searchParams.get('testId');

    switch (action) {
      case 'list':
        const tests = await automatedABTesting.listActiveTests();
        return NextResponse.json({ success: true, tests });

      case 'results':
        if (!testId) {
          return NextResponse.json({ error: 'Test ID required' }, { status: 400 });
        }
        const results = await automatedABTesting.analyzeTestResults(testId);
        return NextResponse.json({ success: true, results });

      case 'variant':
        if (!testId) {
          return NextResponse.json({ error: 'Test ID required' }, { status: 400 });
        }
        const userContext = {
          userId: searchParams.get('userId') || 'anonymous',
          sessionId: searchParams.get('sessionId')
        };
        const variant = await automatedABTesting.selectVariantForEmail(testId, userContext);
        return NextResponse.json({ success: true, variant });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Erreur API A/B testing:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'create_test': {
        const { baseTemplate, variations, testConfig } = data;
        const newTest = await automatedABTesting.createABTest(baseTemplate, variations, testConfig);
        return NextResponse.json({
          success: true,
          message: 'A/B test créé avec succès',
          test: newTest
        });
      }

      case 'auto_create': {
        const { templateId, strategies } = data;
        const autoTests = await automatedABTesting.autoCreateABTestsForTemplate(templateId, strategies);
        return NextResponse.json({
          success: true,
          message: `${autoTests.length} A/B tests créés automatiquement`,
          tests: autoTests
        });
      }

      case 'generate_variations': {
        const { template, strategy, count } = data;
        const variations = await automatedABTesting.generateTemplateVariations(template, strategy, count);
        return NextResponse.json({
          success: true,
          variations
        });
      }

      case 'record_result': {
        const { variantId, metric, value, metadata } = data;
        await automatedABTesting.recordTestResult(variantId, metric, value, metadata);
        return NextResponse.json({
          success: true,
          message: 'Résultat enregistré'
        });
      }

      case 'end_test': {
        const { testId } = data;
        await automatedABTesting.endTest(testId);
        const finalResults = await automatedABTesting.analyzeTestResults(testId);
        return NextResponse.json({
          success: true,
          message: 'Test terminé',
          results: finalResults
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Erreur création A/B test:', error);
    return NextResponse.json({
      error: 'Failed to process A/B test request',
      details: error.message
    }, { status: 500 });
  }
}