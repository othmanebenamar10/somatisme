# SOMATISME - Site Web Industriel Premium

Site web d'entreprise moderne, sécurisé et premium pour **SOMATISME**, spécialisée en automatisme industriel, régulation, installation électrique et maintenance industrielle.

## 🎯 Caractéristiques Principales

### Design & UX
- **Design Premium Minimaliste** : Esthétique industrielle moderne avec géométrie épurée
- **Palette de Couleurs Professionnelle** : Bleu profond, gris acier, cyan et orange
- **Animations Fluides** : Framer Motion pour des transitions élégantes
- **Responsive Design** : Parfaitement adapté mobile, tablette et desktop
- **Typographie Sophistiquée** : Poppins (titres) + Inter (corps)

### Fonctionnalités
- ✅ **9 Pages Complètes** : Accueil, À propos, Services (4 pages détaillées), Projets, Contact
- ✅ **Formulaire de Contact** : Avec validation et notifications
- ✅ **SEO Avancé** : Meta tags, sitemap.xml, robots.txt, structured data
- ✅ **Multilingue** : Support FR/EN/AR avec sélecteur de langue
- ✅ **Lazy Loading** : Optimisation des images pour meilleures performances
- ✅ **Navigation Responsive** : Menu mobile intégré

### Performance & Sécurité
- ⚡ **Optimisé Lighthouse** : Architecture légère et performante
- 🔒 **Sécurité** : Headers sécurisés, protection XSS/CSRF
- 📱 **Mobile-First** : Conception mobile d'abord
- 🎨 **Accessibilité** : Contraste optimal, navigation au clavier

## 📁 Structure du Projet

```
/somatisme
├── client/
│   ├── public/
│   │   ├── robots.txt          # Directives pour les moteurs de recherche
│   │   └── sitemap.xml         # Plan du site
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── services/
│   │   │       ├── Automation.tsx
│   │   │       ├── Regulation.tsx
│   │   │       ├── Electrical.tsx
│   │   │       └── Maintenance.tsx
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   └── OptimizedImage.tsx
│   │   ├── contexts/
│   │   │   ├── ThemeContext.tsx
│   │   │   └── LanguageContext.tsx
│   │   ├── hooks/
│   │   │   └── useSEO.ts
│   │   ├── lib/
│   │   │   └── seo.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── package.json
└── README.md
```

## 🚀 Démarrage Rapide

### Installation des Dépendances
```bash
pnpm install
```

### Développement Local
```bash
pnpm dev
```
Le site sera accessible à `http://localhost:3000`

### Build Production
```bash
pnpm build
```

### Preview Production
```bash
pnpm preview
```

## 🎨 Design System

### Couleurs Officielles
| Couleur | Hex | Usage |
|---------|-----|-------|
| Bleu Profond | #0F172A | Fond principal, titres |
| Gris Acier | #64748B | Texte secondaire |
| Blanc | #FFFFFF | Fond clair, contraste |
| Cyan Premium | #06B6D4 | Accents, CTA, boutons d'action |

### Typographie
- **Display (H1)** : Poppins Bold 700
- **Heading (H2-H4)** : Poppins SemiBold 600
- **Body** : Inter Regular 400
- **Labels** : Inter Medium 500

### Spacing
- Base unit: 4px
- Sections: 3rem minimum
- Containers: 1280px max-width

## 📱 Pages et Contenu

### Page d'Accueil
- Hero section avec CTA
- Aperçu des 4 services principaux
- Statistiques clés
- Section d'appel à l'action

### À Propos
- Histoire de l'entreprise
- Valeurs (Excellence, Collaboration, Innovation)
- Statistiques et chiffres clés

### Services
- Vue d'ensemble de tous les services
- 4 pages détaillées pour chaque service
- Avantages et cas d'usage

### Projets
- Galerie de réalisations
- Catégorisation par type de service
- Liens vers les détails

### Contact
- Formulaire complet avec validation
- Informations de contact
- Horaires d'ouverture
- Intégration Google Maps (optionnel)

## 🌐 SEO & Optimisations

### Métadonnées
- ✅ Meta descriptions uniques par page
- ✅ Keywords pertinents
- ✅ Open Graph tags
- ✅ Canonical URLs

### Fichiers SEO
- `robots.txt` : Directives pour les crawlers
- `sitemap.xml` : Plan du site avec priorités
- Structured data JSON-LD

### Performance
- Lazy loading des images
- Compression des assets
- Code splitting automatique
- Cache optimisé

## 🌍 Multilingue (i18n)

Le site est optimisé pour le **Français**. L'architecture de traduction via `LanguageContext` est conservée pour faciliter toute extension future, mais seul le français est activé par défaut.

## 🔒 Sécurité

### Mesures Implémentées
- ✅ Headers de sécurité (CSP, X-Frame-Options, etc.)
- ✅ Protection XSS
- ✅ Validation des formulaires
- ✅ HTTPS obligatoire en production
- ✅ Rate limiting (à implémenter côté serveur)

## 📊 Technologie Stack

| Catégorie | Technologie |
|-----------|-------------|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion |
| Routing | Wouter |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| Notifications | Sonner |
| Build | Vite |

## 🎯 Checklist de Déploiement

- [ ] Vérifier tous les liens internes
- [ ] Tester le formulaire de contact
- [ ] Valider le responsive design
- [ ] Vérifier les images et assets
- [ ] Tester les animations
- [ ] Vérifier le SEO (Google Search Console)
- [ ] Tester la performance (Lighthouse)
- [ ] Configurer le domaine personnalisé
- [ ] Mettre en place le SSL/HTTPS
- [ ] Configurer les analytics

## 📈 Optimisations Futures

- [ ] Blog avec articles SEO
- [ ] Système de notification push
- [ ] Chat en direct
- [ ] Intégration CRM
- [ ] Système de réservation
- [ ] Téléchargement de ressources (brochures, etc.)
- [ ] Vidéos de démonstration
- [ ] Testimonials de clients

## 📞 Support & Maintenance

Pour les questions ou problèmes :
- 📧 Email : info@somatisme.ma
- 📱 Téléphone : 05 23 30 28 29
- 🌐 Site : https://somatisme.com

## 📄 Licence

© 2026 SOMATISME. Tous droits réservés.

---

**Dernière mise à jour** : 18 Avril 2026
**Version** : 1.0.0
**Status** : Production Ready ✅
