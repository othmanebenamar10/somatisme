# Revue du dépôt SOMATISME

Date : 21 octobre 2026
Périmètre : sources client/API/serveur, configuration et documentation suivies
dans Git.

## Changements apportés

- Ajout de `https://somatisme.vercel.app` aux origines CORS de production.
- Chargement de reCAPTCHA attendu avant l’émission d’un jeton, avec délai
  maximal et gestion de l’échec de chargement.
- Harmonisation des URL canoniques et de l’image Open Graph avec le domaine
  actuellement déployé.
- Suppression d’anciens utilitaires de sécurité client, d’un composant de facture
  inutilisé et d’une ancienne couche MongoDB sans référence active.
- Suppression des variables MongoDB, PayPal et de sécurité non utilisées dans
  `.env.example`; retrait de Mongoose du manifeste et de l’importateur du lockfile.
- Retrait des dépendances directes non utilisées pour les résolveurs de formulaires,
  Stripe.js (paiement hébergé) et nanoid.
- Suppression d’un ancien rapport HTML Next.js qui contredisait l’application
  Vite actuellement déployée.
- Mise à jour du README et des consignes Vercel pour refléter les API actuelles,
  Stripe Checkout, SMTP, reCAPTCHA et Upstash.

## Contrôles effectués

- Validation de la syntaxe JSON de `package.json` et `vercel.json`.
- Validation de la syntaxe YAML de `pnpm-lock.yaml` et XML du sitemap.
- `git diff --check` ne signale pas d’erreur d’espacement.
- Vérification HTTP non transactionnelle : `/api/quote` répond 405 à GET et
  renvoie l’en-tête CORS de l’origine Vercel. Aucun devis ni email n’a été envoyé.

## Limites de cette revue

- Le contrôle TypeScript et le build n’ont pas été exécutés : Node.js et pnpm
  n’étaient pas disponibles dans l’environnement de travail.
- Les variables secrètes et les journaux du projet Vercel ne sont pas accessibles
  depuis le dépôt ; leur présence et leur validité restent à confirmer dans Vercel.
- Aucune commande réelle, aucun paiement réel et aucun envoi d’email réel n’ont
  été déclenchés.
- Ce document décrit une revue de code et des contrôles ciblés. Ce n’est pas une
  certification de sécurité ni une preuve d’absence de vulnérabilité.
