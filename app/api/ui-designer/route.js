import { uiDesignerOrchestrator } from '../../../lib/design-agents/ui-designer-orchestrator.js';

/**
 * UI Designer API - Parallel Multi-Agent Design Generation
 *
 * This endpoint demonstrates:
 * - Parallel execution of specialized agents
 * - Multi-agent coordination and consensus
 * - Real-time design option generation
 * - Performance-optimized agent orchestration
 */

export async function POST(request) {
  try {
    const designBrief = await request.json();

    console.log('🎨 UI Designer API Request:', designBrief);

    // Validate design brief
    if (!designBrief.industry || !designBrief.pageType) {
      return Response.json({
        error: 'Invalid design brief',
        message: 'Industry and pageType are required'
      }, { status: 400 });
    }

    // Execute parallel agent orchestration
    const startTime = Date.now();
    const result = await uiDesignerOrchestrator.generateDesignOptions(designBrief);
    const totalTime = Date.now() - startTime;

    console.log(`✅ UI Designer generated ${result.designs.length} designs in ${totalTime}ms`);

    // Return design options with metadata
    return Response.json({
      success: true,
      designs: result.designs,
      agentOutputs: result.agentOutputs,
      metadata: {
        ...result.metadata,
        totalTime: `${totalTime}ms`,
        parallelAgents: result.agentOutputs.successful.length,
        timestamp: new Date().toISOString()
      },
      analytics: uiDesignerOrchestrator.getAnalytics()
    });

  } catch (error) {
    console.error('❌ UI Designer API error:', error);

    return Response.json({
      success: false,
      error: 'Design generation failed',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * GET endpoint - Retrieve orchestrator analytics
 */
export async function GET(request) {
  try {
    const analytics = uiDesignerOrchestrator.getAnalytics();

    return Response.json({
      success: true,
      analytics,
      availableAgents: ['color', 'layout', 'typography', 'component'],
      capabilities: {
        parallelExecution: true,
        maxDesignOptions: 9,
        agenticFramework: 'Multi-Agent Decision Making (inspired by BMAD)',
        features: [
          'Parallel agent execution',
          'Consensus-based ranking',
          'Industry-specific optimization',
          'Accessibility compliance',
          'Real-time generation'
        ]
      }
    });

  } catch (error) {
    console.error('❌ Analytics error:', error);

    return Response.json({
      success: false,
      error: 'Failed to retrieve analytics'
    }, { status: 500 });
  }
}
