# 🚀 Guide Rapide - Configuration Azure AD

## Étapes à suivre MAINTENANT

### 1. Accéder au portail Azure
👉 [https://portal.azure.com](https://portal.azure.com)

### 2. Créer une App Registration

1. Dans le menu de gauche, cherchez **"App registrations"** (Inscriptions d'applications)
2. Cliquez sur **"+ New registration"** (Nouvelle inscription)
3. Remplissez le formulaire:
   ```
   Nom: Microsoft Partner Hub
   Types de comptes pris en charge: "Accounts in this organizational directory only"
                                     (Comptes dans cet annuaire organisationnel uniquement)
   ```
4. **IMPORTANT - Redirect URI**:
   ```
   Type: Web
   URL: http://localhost:3002/api/auth/callback/azure-ad
   ```
5. Cliquez sur **"Register"** (Inscrire)

### 3. Copier l'Application ID

Dans la page **Overview** de votre application:

1. Cherchez **"Application (client) ID"**
2. Copiez cette valeur (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
3. Ouvrez `.env.local` dans votre éditeur
4. Remplacez `your-azure-ad-client-id` par cette valeur

### 4. Créer un Client Secret

1. Dans le menu de gauche de votre app, cliquez sur **"Certificates & secrets"**
2. Sous l'onglet **"Client secrets"**, cliquez sur **"+ New client secret"**
3. Remplissez:
   ```
   Description: NextAuth Secret
   Expires: 24 months (recommandé)
   ```
4. Cliquez sur **"Add"**
5. ⚠️ **IMPORTANT**: Copiez immédiatement la **Value** (elle ne sera plus visible!)
6. Dans `.env.local`, remplacez `your-azure-ad-client-secret` par cette valeur

### 5. Copier le Tenant ID

De retour dans la page **Overview**:

1. Cherchez **"Directory (tenant) ID"**
2. Copiez cette valeur
3. Dans `.env.local`, remplacez `common` par cette valeur
   ```bash
   AZURE_AD_TENANT_ID=votre-tenant-id
   ```

### 6. Configurer les API Permissions

1. Dans le menu de gauche, cliquez sur **"API permissions"**
2. Vérifiez que ces permissions sont présentes:
   - ✅ `User.Read` (Microsoft Graph)
   - ✅ `openid`
   - ✅ `profile`
   - ✅ `email`
3. Si elles ne sont pas toutes présentes, ajoutez-les:
   - Cliquez sur **"+ Add a permission"**
   - Sélectionnez **"Microsoft Graph"**
   - Sélectionnez **"Delegated permissions"**
   - Cherchez et ajoutez les permissions manquantes
4. **IMPORTANT**: Cliquez sur **"Grant admin consent for [your organization]"**
   - Cela autorisera l'application pour tous les utilisateurs

### 7. Votre fichier .env.local devrait ressembler à:

```bash
# Microsoft Entra ID (Azure AD) Configuration
AZURE_AD_CLIENT_ID=12345678-1234-1234-1234-123456789abc
AZURE_AD_CLIENT_SECRET=AbC~1234567890_aBcDeFgHiJkLmNoPqRsTuVwXyZ
AZURE_AD_TENANT_ID=87654321-4321-4321-4321-987654321abc
```

### 8. Redémarrer le serveur

Après avoir mis à jour `.env.local`:

```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

### 9. Tester l'authentification

1. Ouvrez: http://localhost:3002/auth/signin
2. Cliquez sur **"Se connecter avec Microsoft"**
3. Connectez-vous avec votre compte Microsoft
4. Autorisez l'application
5. Vous devriez être redirigé vers la page d'accueil authentifié

## 🐛 Résolution de problèmes

### Erreur: "AADSTS90112: Application identifier is expected to be a GUID"
❌ Le `AZURE_AD_CLIENT_ID` n'est pas configuré ou est invalide
✅ Vérifiez que vous avez copié l'Application (client) ID depuis Azure Portal

### Erreur: "AADSTS7000215: Invalid client secret"
❌ Le `AZURE_AD_CLIENT_SECRET` est invalide ou expiré
✅ Créez un nouveau client secret dans Azure Portal

### Erreur: "Redirect URI mismatch"
❌ L'URL de redirection dans Azure ne correspond pas
✅ Vérifiez que dans Azure Portal, la Redirect URI est exactement:
   `http://localhost:3002/api/auth/callback/azure-ad`

### Erreur: "AADSTS50020: User account from identity provider does not exist"
❌ L'utilisateur n'existe pas dans le tenant Azure AD configuré
✅ Assurez-vous que votre compte fait partie de l'organisation Azure AD
✅ Ou changez `AZURE_AD_TENANT_ID` à `common` pour accepter tous les comptes Microsoft

## 📋 Checklist finale

Avant de tester, vérifiez:
- [ ] Application créée dans Azure Portal
- [ ] Redirect URI configuré: `http://localhost:3002/api/auth/callback/azure-ad`
- [ ] Application (client) ID copié dans `.env.local`
- [ ] Client secret créé et copié dans `.env.local`
- [ ] Tenant ID copié dans `.env.local`
- [ ] API permissions configurées et admin consent accordé
- [ ] Serveur redémarré après modification de `.env.local`

## 🎉 Une fois configuré

Après une connexion réussie, vous pourrez:
- Voir votre profil utilisateur dans le menu
- Accéder aux routes protégées
- Les API routes vérifieront automatiquement l'authentification
- Les rôles (user/manager/admin) seront gérés automatiquement

## 📖 Documentation complète

Pour plus de détails, consultez [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)
