# Déploiement SOMATISME sur Vercel

Le dépôt est configuré pour un build Vite et des fonctions API Node.js sur
Vercel. Le domaine actuellement utilisé est `somatisme.vercel.app`.

## Avant le déploiement

En local, avec Node.js et pnpm installés :

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

Vercel utilise le `buildCommand` et le dossier de sortie définis dans
`vercel.json`. Les routes `/api/*` sont traitées par les fonctions du dossier
`api/`.

## Variables d’environnement

Ajoutez les variables suivantes dans les paramètres Vercel. Utilisez les
environnements Preview et Production selon les clés prévues pour chacun.

| Variable | Usage |
| --- | --- |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Envoi d’emails par SMTP |
| `EMAIL_TO` | Adresse qui reçoit les notifications |
| `STRIPE_SECRET_KEY` | Création des sessions Checkout |
| `STRIPE_WEBHOOK_SECRET` | Vérification de la signature du webhook |
| `PUBLIC_APP_URL` | URL de retour après Checkout : `https://somatisme.vercel.app` |
| `RECAPTCHA_SECRET_KEY` | Vérification serveur reCAPTCHA v3 |
| `VITE_RECAPTCHA_SITE_KEY` | Clé publique reCAPTCHA intégrée au build |
| `UPSTASH_REDIS_REST_URL` | Limitation de débit et idempotence des emails de commande |
| `UPSTASH_REDIS_REST_TOKEN` | Jeton Upstash correspondant |

Ne mettez jamais les clés Stripe secrètes, le secret reCAPTCHA, le mot de passe
SMTP ou le jeton Upstash dans une variable `VITE_*` ou dans le code client.
Les variables `VITE_*` doivent être définies avant le build. En production,
reCAPTCHA, SMTP et Upstash sont requis pour les formulaires concernés.

## Stripe

Dans le tableau de bord Stripe, configurez un webhook vers
`https://somatisme.vercel.app/api/webhooks/stripe` pour l’événement
`checkout.session.completed`. Copiez sa clé de signature dans
`STRIPE_WEBHOOK_SECRET`. Vérifiez l’achat en mode test avant d’activer les clés
de production.

## reCAPTCHA

Utilisez une clé reCAPTCHA v3 et autorisez `somatisme.vercel.app` dans la
configuration des domaines Google. Si vous ajoutez plus tard un domaine
personnalisé, enregistrez-le également et mettez à jour la liste CORS dans
`api/_lib/security.ts`, `PUBLIC_APP_URL` et les URLs du webhook Stripe.

## Après le déploiement

- Vérifiez `/api/health` et le chargement des pages principales.
- Vérifiez les journaux Vercel pour les erreurs d’API.
- Faites un achat Stripe de test et vérifiez le webhook et les emails associés.
- Soumettez un devis de test uniquement avec une adresse de test autorisée.
- Vérifiez les en-têtes de sécurité dans la réponse HTTP.

Ne testez pas une commande réelle pour vérifier l’envoi : utilisez le mode test
Stripe et un environnement SMTP maîtrisé.
