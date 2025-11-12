# 🔐 Configuration de l'authentification Microsoft SSO

## Vue d'ensemble

L'application utilise **NextAuth.js** avec **Microsoft Entra ID** (Azure AD) pour l'authentification sécurisée.

## ✅ Ce qui a été implémenté

- [x] NextAuth.js configuré avec Microsoft Entra ID
- [x] Modèles de base de données (User, Account, Session, VerificationToken)
- [x] Page de connexion personnalisée (/auth/signin)
- [x] Session Provider pour le client
- [x] Helpers pour protéger les API routes
- [x] Composant UserMenu avec sign in/out
- [x] Support des rôles (user, manager, admin)

## 📋 Configuration requise (Azure Portal)

### Étape 1: Créer une App Registration dans Azure

1. Aller sur [Azure Portal](https://portal.azure.com)
2. Naviguer vers **App registrations** > **New registration**
3. Remplir les informations:
   - **Name**: "Microsoft Partner Hub"
   - **Supported account types**: "Accounts in this organizational directory only"
   - **Redirect URI**:
     - Type: Web
     - URL: `http://localhost:3002/api/auth/callback/azure-ad`

4. Cliquer sur **Register**

### Étape 2: Configurer l'application

1. Dans **Overview**, copier:
   - **Application (client) ID** → `MICROSOFT_CLIENT_ID`
   - **Directory (tenant) ID** → `MICROSOFT_TENANT_ID`

2. Aller dans **Certificates & secrets** > **New client secret**:
   - Description: "NextAuth Secret"
   - Expires: 24 months
   - Copier la **Value** → `MICROSOFT_CLIENT_SECRET` ⚠️ **Ne sera affiché qu'une fois!**

3. Aller dans **API permissions**:
   - Vérifier que ces permissions sont présentes:
     - `openid` (Sign in and read user profile)
     - `profile` (View user's basic profile)
     - `email` (View user's email address)
     - `User.Read` (Read user profile)
   - Cliquer sur **Grant admin consent**

### Étape 3: Configuration des variables d'environnement

Créer un fichier `.env.local` à la racine du projet:

```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3002"
NEXTAUTH_SECRET="generate-with-command-below"

# Microsoft Entra ID (Azure AD)
AZURE_AD_CLIENT_ID="your-application-client-id"
AZURE_AD_CLIENT_SECRET="your-client-secret"
AZURE_AD_TENANT_ID="your-tenant-id"

# AI APIs (existing)
ANTHROPIC_API_KEY="your-key"
OPENAI_API_KEY="your-key"
```

### Génération du NEXTAUTH_SECRET

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🚀 Utilisation

### Dans une page Client Component

```jsx
'use client'
import { useSession } from 'next-auth/react'

export default function MyPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Please sign in</div>
  }

  return (
    <div>
      <h1>Welcome {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
    </div>
  )
}
```

### Dans une API Route

```javascript
import { requireAuth } from "@/lib/auth-helpers"

export async function GET(request) {
  const session = await requireAuth()

  // Si pas authentifié, requireAuth retourne une Response 401
  if (session instanceof Response) {
    return session
  }

  // Utilisateur authentifié!
  return Response.json({
    user: session.user.email,
    data: "Protected data"
  })
}
```

### Protection par rôle

```javascript
import { requireRole } from "@/lib/auth-helpers"

export async function DELETE(request) {
  // Seulement les admins peuvent supprimer
  const session = await requireRole(['admin'])

  if (session instanceof Response) {
    return session
  }

  // Admin authentifié!
  return Response.json({ message: "Deleted successfully" })
}
```

## 👥 Gestion des rôles

### Rôles disponibles

- **user**: Utilisateur standard (lecture seule)
- **manager**: Manager (lecture + création)
- **admin**: Administrateur (tous les droits)

### Attribution d'un rôle

Les rôles sont stockés dans la table `users`. Par défaut, tous les nouveaux utilisateurs ont le rôle `user`.

Pour changer le rôle d'un utilisateur:

```javascript
// Via Prisma Studio
npx prisma studio
// Ou via code
await prisma.user.update({
  where: { email: 'user@company.com' },
  data: { role: 'admin' }
})
```

## 🔒 Routes protégées

### Toutes les routes critiques doivent être protégées:

1. `/api/hot-leads` - CRUD operations
2. `/api/enrich-lead` - Enrichment
3. `/api/generate-context-email` - Email generation
4. `/api/workflows` - Workflow management
5. `/api/azure-solutions` - Write operations

## 📝 TODO: Prochaines étapes

- [ ] Protéger toutes les API routes sensibles
- [ ] Ajouter un middleware pour rediriger vers /auth/signin si non authentifié
- [ ] Implémenter la page /auth/error
- [ ] Ajouter la gestion des permissions granulaires
- [ ] Configurer le domaine de production dans Azure

## 🐛 Troubleshooting

### Erreur: "Invalid credentials"
- Vérifier que `MICROSOFT_CLIENT_ID` et `MICROSOFT_CLIENT_SECRET` sont corrects
- Le secret n'est visible qu'une fois dans Azure Portal

### Erreur: "Redirect URI mismatch"
- Vérifier que l'URL dans Azure App Registration correspond exactement à:
  `http://localhost:3002/api/auth/callback/azure-ad`

### Utilisateur connecté mais pas de données
- Vérifier que la migration Prisma a été exécutée: `npx prisma migrate dev`
- Vérifier que le Prisma Client a été généré: `npx prisma generate`

## 🔗 Liens utiles

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Azure Portal](https://portal.azure.com)
- [Prisma Auth Documentation](https://www.prisma.io/docs/guides/authentication)
