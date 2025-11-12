// Script de démonstration rapide pour générer des données de test

console.log('🌱 Génération de données de démonstration...');

const demoClients = [
  { company: 'Contoso Corp', segment: 'enterprise' },
  { company: 'TechStart SAS', segment: 'startup' },
  { company: 'PME Services', segment: 'sme' }
];

async function seedDemoData() {
  try {
    // Créer des clients
    for (const client of demoClients) {
      const response = await fetch('http://localhost:3006/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: client.company,
          segment: client.segment,
          industry: 'Technology',
          currentChallenges: 'Migration cloud, optimisation coûts'
        })
      });
      
      if (response.ok) {
        console.log(`✅ Client ${client.company} créé`);
      }
    }

    // Mettre à jour les métriques
    const metricsResponse = await fetch('http://localhost:3006/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'daily' })
    });

    if (metricsResponse.ok) {
      console.log('📊 Métriques mises à jour');
    }

    console.log('🎉 Données de démonstration créées !');
    console.log('🌐 Accédez à http://localhost:3006/analytics pour voir les métriques');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

seedDemoData();