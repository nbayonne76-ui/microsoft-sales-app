import { NextResponse } from 'next/server';
import { MetricsService } from '../../../lib/analytics.js';

// GET /api/metrics - Récupérer les métriques
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'summary';
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    console.log('📊 Récupération métriques:', { type, days });

    let data;

    switch (type) {
      case 'range':
        if (!startDate) {
          return NextResponse.json(
            { success: false, error: 'startDate requis pour type=range' },
            { status: 400 }
          );
        }
        data = await MetricsService.getMetricsRange(
          new Date(startDate),
          endDate ? new Date(endDate) : new Date()
        );
        break;

      case 'segments':
        data = await MetricsService.getSegmentPerformance(days);
        break;

      case 'templates':
        const limit = parseInt(searchParams.get('limit') || '10');
        data = await MetricsService.getBestPerformingTemplates(limit);
        break;

      case 'summary':
      default:
        // Mettre à jour les métriques du jour
        await MetricsService.updateDailyMetrics();
        
        // Récupérer les métriques récentes
        const endDateDefault = new Date();
        const startDateDefault = new Date();
        startDateDefault.setDate(startDateDefault.getDate() - days);
        
        const rangeData = await MetricsService.getMetricsRange(startDateDefault, endDateDefault);
        const segmentData = await MetricsService.getSegmentPerformance(days);
        const templateData = await MetricsService.getBestPerformingTemplates(5);

        data = {
          summary: rangeData,
          segments: segmentData,
          topTemplates: templateData,
          period: `${days} derniers jours`
        };
        break;
    }

    return NextResponse.json({
      success: true,
      data,
      type,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erreur GET /api/metrics:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la récupération des métriques',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST /api/metrics/update - Forcer la mise à jour des métriques
export async function POST(request) {
  try {
    const body = await request.json();
    const { date, action } = body;

    console.log('🔄 Mise à jour métriques:', { date, action });

    let result;

    switch (action) {
      case 'daily':
        result = await MetricsService.updateDailyMetrics(
          date ? new Date(date) : new Date()
        );
        break;

      case 'refresh_all':
        // Mettre à jour les 30 derniers jours
        const promises = [];
        for (let i = 0; i < 30; i++) {
          const targetDate = new Date();
          targetDate.setDate(targetDate.getDate() - i);
          promises.push(MetricsService.updateDailyMetrics(targetDate));
        }
        result = await Promise.all(promises);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Action non supportée' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Métriques mises à jour avec succès'
    });
    
  } catch (error) {
    console.error('❌ Erreur POST /api/metrics:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la mise à jour des métriques',
        details: error.message 
      },
      { status: 500 }
    );
  }
}