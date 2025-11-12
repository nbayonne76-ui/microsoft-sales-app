export async function POST(request) {
  try {
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError.message);
      return Response.json({ 
        error: 'Invalid JSON format', 
        details: 'Make sure your content is properly escaped' 
      }, { status: 400 });
    }
    
    const { transcript } = requestBody;
    
    if (!transcript || !transcript.trim()) {
      return Response.json({ error: 'Transcript is required' }, { status: 400 });
    }

    // Basic transcript analysis
    const extractedData = {};
    const text = transcript.toLowerCase();
    
    // Simple pattern matching
    if (text.includes('client:') || text.includes('nom:')) {
      const nameMatch = transcript.match(/(?:client|nom):\s*([^.\n,]+)/i);
      if (nameMatch) extractedData.customer_name = nameMatch[1].trim();
    }
    
    if (text.includes('entreprise:') || text.includes('company:')) {
      const companyMatch = transcript.match(/(?:entreprise|company):\s*([^.\n,]+)/i);
      if (companyMatch) extractedData.company_name = companyMatch[1].trim();
    }
    
    if (text.includes('budget:')) {
      const budgetMatch = transcript.match(/budget:\s*([^.\n,]+)/i);
      if (budgetMatch) extractedData.budget = budgetMatch[1].trim();
    }

    // Technology detection
    const technologies = [];
    if (text.includes('azure')) technologies.push('Azure');
    if (text.includes('microsoft 365') || text.includes('m365')) technologies.push('Microsoft 365');
    if (text.includes('teams')) technologies.push('Teams');
    if (text.includes('copilot')) technologies.push('Copilot');

    // Basic sentiment
    const positiveWords = ['excellent', 'good', 'great', 'satisfied', 'happy'];
    const negativeWords = ['problem', 'issue', 'difficult', 'bad'];
    
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    
    let sentiment = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    if (negativeCount > positiveCount) sentiment = 'negative';

    // Opportunity score
    let opportunityScore = 50;
    if (extractedData.budget) opportunityScore += 20;
    if (technologies.length > 0) opportunityScore += 15;
    if (sentiment === 'positive') opportunityScore += 10;
    
    return Response.json({
      extractedData,
      entities: {
        technologies,
        companies: [],
        products: [],
        people: []
      },
      sentiment,
      opportunityScore: Math.round(opportunityScore),
      keyTopics: [],
      confidence: Object.keys(extractedData).length * 10 + 30,
      metadata: {
        wordCount: transcript.trim().split(/\s+/).length,
        processedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Transcript analysis error:', error);
    return Response.json(
      { error: 'Transcript analysis failed', details: error.message },
      { status: 500 }
    );
  }
}