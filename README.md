# SOMATISME

Site vitrine et catalogue de matériel industriel pour SOMATISME. Le site en
production est accessible sur [somatisme.vercel.app](https://somatisme.vercel.app).

## Fonctionnalités

- Pages de présentation des services, projets et coordonnées de l’entreprise.
- Catalogue de produits avec recherche, filtres, panier et stockage local.
- Demandes de devis avec PDF envoyé par email et récapitulatif WhatsApp.
- Paiement par Stripe Checkout ; les emails de confirmation partent après
  validation du webhook Stripe signé.
- Formulaire de contact protégé par validation, reCAPTCHA et limitation de débit.

## Technologies

- React, TypeScript, Vite et Tailwind CSS.
- API Node.js sur Vercel, avec Express pour le développement et l’hébergement
  autonome.
- Stripe Checkout, Nodemailer/SMTP, reCAPTCHA v3 et Upstash Redis.

## Développement local

Prérequis : Node.js compatible avec Vite 7 et pnpm 10.

```bash
pnpm install
pnpm dev
```

Le serveur de développement écoute sur `http://localhost:3000`.

Commandes disponibles :

```bash
pnpm check       # Vérification TypeScript
pnpm build       # Build Vite et serveur Express
pnpm preview     # Prévisualisation du client compilé
pnpm start       # Démarrage du serveur compilé
```

## Configuration

Copiez `.env.example` vers `.env` et configurez les variables nécessaires.
Pour les tests locaux, utilisez des clés Stripe de test, un secret webhook de
test et des identifiants SMTP. Upstash est optionnel. Les clés secrètes restent
côté serveur. Les formulaires sont protégés côté serveur par une limitation du
nombre de demandes et un champ honeypot.

Sur Vercel, définissez ces variables dans les paramètres du projet. Les valeurs
`VITE_*` doivent être présentes au moment du build. `PUBLIC_APP_URL` doit
correspondre à l’URL publique autorisée dans `api/_lib/security.ts`.

Le webhook Stripe attendu est :
`https://somatisme.vercel.app/api/webhooks/stripe`, événement
`checkout.session.completed`.

## Organisation

```text
api/                 Fonctions API, logique de sécurité et PDF de devis
client/src/          Interface React, pages, composants et données
client/public/       Images, robots.txt et sitemap.xml
server/              Serveur Express et routes locales
shared/              Exports partagés entre client et serveur
```

## Sécurité et limites connues

Les API valident les entrées côté serveur, appliquent CORS par origine, utilisent
Upstash pour la limitation de débit et protègent les emails de paiement derrière
le webhook signé de Stripe. Les erreurs ne doivent pas contenir de secrets ni
de données personnelles dans les logs.

Le build et la vérification TypeScript doivent être exécutés avant chaque
publication. La configuration de production (SMTP, Stripe, reCAPTCHA et Upstash)
doit également être vérifiée dans Vercel : elle n’est pas stockée dans ce dépôt.
