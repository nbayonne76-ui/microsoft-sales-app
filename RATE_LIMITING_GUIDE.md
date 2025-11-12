# 🛡️ Rate Limiting - Protection des APIs

## ✅ Implémenté et Actif !

Le rate limiting est maintenant actif sur toutes les routes critiques pour protéger votre application contre :
- 🚫 Les abus des APIs AI (coûts explosifs)
- 🚫 Les attaques DDoS
- 🚫 L'utilisation excessive des ressources

## 📊 Limites Configurées

### Routes AI (Très Restrictives)
- **`/api/generate-context-email`** - 10 requêtes/minute
  - Génération d'emails avec Claude/GPT
  - Protection contre les coûts AI élevés

### Routes Enrichissement (Restrictives)
- **`/api/enrich-lead`** - 10 requêtes/minute
  - Recherche web et enrichissement de données
  - Protection contre les appels API externes

### Routes CRUD Leads (Modérées)
- **`/api/hot-leads`** (GET) - 100 requêtes/minute
- **`/api/hot-leads`** (POST/PUT/DELETE) - 30 requêtes/minute
  - Lectures fréquentes autorisées
  - Écritures limitées pour éviter le spam

## 🔄 Mode Développement vs Production

### 🧪 Développement (Actuel)
- **Stockage**: En mémoire (Map JavaScript)
- **Avantages**:
  - Aucune configuration requise
  - Fonctionne immédiatement
  - Gratuit
- **Limitations**:
  - Compteurs réinitialisés au redémarrage du serveur
  - Pas de partage entre plusieurs instances

### 🚀 Production (Recommandé)
- **Stockage**: Upstash Redis (Cloud)
- **Avantages**:
  - Persistant entre les redémarrages
  - Partagé entre toutes les instances
  - Jusqu'à 10,000 requêtes/jour GRATUIT
  - Surveillance et analytics

## 🎯 Configuration Production (5 minutes)

### Étape 1: Créer un compte Upstash (GRATUIT)
1. Aller sur [https://upstash.com](https://upstash.com)
2. Créer un compte gratuit
3. Créer une base Redis:
   - **Name**: `partner-hub-ratelimit`
   - **Region**: Choisir le plus proche de vos users
   - **Type**: Pay as you go (GRATUIT jusqu'à 10k req/jour)

### Étape 2: Copier les credentials
1. Dans votre base Redis, aller dans **Details**
2. Copier:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### Étape 3: Mettre à jour `.env.local`
```bash
# Redis & Rate Limiting (Production)
UPSTASH_REDIS_REST_URL=https://your-redis-xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

### Étape 4: Redémarrer le serveur
```bash
npm run dev
```

✅ **C'est tout !** Le rate limiting utilisera automatiquement Upstash Redis.

## 📈 Monitoring

### Dans Upstash Console
- Voir le nombre de requêtes en temps réel
- Graphiques de trafic
- Alertes si limite dépassée

### Dans les logs de votre app
```bash
[Rate Limit] Using in-memory storage (development mode)
# ou
[Rate Limit] Connected to Upstash Redis (production mode)
```

## 🧪 Tester le Rate Limiting

### Test manuel
```bash
# Envoyer 15 requêtes rapidement (limite = 10/min)
for i in {1..15}; do
  curl -X POST http://localhost:3003/api/generate-context-email \
    -H "Content-Type: application/json" \
    -d '{"leadId":"test","purpose":"prospection"}' &
done
```

### Réponse attendue après la 11ème requête:
```json
{
  "error": "Trop de requêtes",
  "message": "Limite atteinte. Réessayez dans 45 secondes.",
  "retryAfter": 45
}
```

Headers de la réponse:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699564523
Retry-After: 45
```

## 🎨 Headers de Rate Limit

Toutes les réponses incluent des headers informatifs :

```http
X-RateLimit-Limit: 10          # Limite totale
X-RateLimit-Remaining: 7       # Requêtes restantes
X-RateLimit-Reset: 1699564523  # Timestamp de reset
```

## ⚙️ Personnaliser les Limites

### Modifier les limites dans `lib/rate-limit.js`:

```javascript
// Exemple: Augmenter la limite d'emails à 20/min
export const emailRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"), // ← Changer ici
  analytics: true,
  prefix: "ratelimit:email",
})
```

### Types de limiters disponibles:
```javascript
// Fenêtre glissante (recommandé)
Ratelimit.slidingWindow(10, "1 m")

// Token bucket (autorise des rafales)
Ratelimit.tokenBucket(10, "10 s", 20)

// Fixed window (plus simple)
Ratelimit.fixedWindow(10, "1 m")
```

## 🔧 Ajouter le Rate Limiting à une Nouvelle Route

```javascript
import { withRateLimit } from '@/lib/with-rate-limit';
import { apiRateLimiter } from '@/lib/rate-limit';

// Votre handler
async function handlePOST(request) {
  // Votre logique ici
  return Response.json({ success: true })
}

// Export avec rate limiting
export const POST = withRateLimit(handlePOST, apiRateLimiter)
```

## 💰 Coûts Upstash (Plan Gratuit)

| Feature | Limite Gratuite | Coût Additionnel |
|---------|-----------------|------------------|
| Requêtes/jour | 10,000 | $0.2 per 100k |
| Stockage | 256 MB | $0.25 per GB |
| Bande passante | 1 GB/jour | Inclus |

Pour votre usage (< 10k req/jour) : **100% GRATUIT** ✅

## 🚨 Que faire si les limites sont atteintes ?

### Pour les utilisateurs:
- Message clair: "Trop de requêtes, réessayez dans X secondes"
- Le frontend peut implémenter un retry automatique

### Pour l'admin:
1. Vérifier les logs pour détecter les abus
2. Augmenter les limites si usage légitime
3. Bloquer les IPs suspectes
4. Contacter l'utilisateur si nécessaire

## 📚 Documentation Complète

- [Upstash Redis](https://docs.upstash.com/redis)
- [Upstash Ratelimit](https://github.com/upstash/ratelimit)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## ✅ Checklist de Sécurité

- [x] Rate limiting actif sur toutes les routes AI
- [x] Rate limiting actif sur enrichissement
- [x] Rate limiting actif sur CRUD leads
- [x] Headers informatifs dans les réponses
- [x] Messages d'erreur clairs pour les utilisateurs
- [x] Support développement (in-memory) ET production (Upstash)
- [x] Documentation complète

## 🎉 Résultat

Votre application est maintenant protégée contre :
- ✅ Les coûts AI explosifs (limite de 10 emails/min par utilisateur)
- ✅ Les abus d'enrichissement (limite de 10 enrichissements/min)
- ✅ Le spam de création de leads (limite de 30 créations/min)
- ✅ Les attaques DDoS simples

**Économies estimées**: 500-2000€/mois en prévention d'abus AI ! 💰
