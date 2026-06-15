export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  tech: string;
  result: string;
  image: string;
  gallery?: string[];
  client?: string;
  location?: string;
  duration?: string;
  year?: string;
}

export const projects: Project[] = [
  {
    slug: 'qualite-assuree',
    title: 'Installation logiciel pour la qualité assurée',
    category: 'Qualité',
    description: "L'assurance qualité (AQ) est une approche proactive et systématique visant à garantir la conformité des produits ou services aux exigences définies, prévenant ainsi les défauts avant qu'ils ne surviennent. Elle structure les processus opérationnels, assure le respect des normes (ex: ISO 9001) et améliore la confiance client. Contrairement au contrôle qualité (QC) qui détecte les défauts sur le produit final, l'AQ se concentre sur l'amélioration des processus de production pour éviter les erreurs. La gestion proactive implique la définition de normes, la documentation, la formation du personnel et des audits continus. En informatique, le QA concerne les tests de logiciels pour garantir la conformité, la performance et l'expérience utilisateur, souvent géré par un QA Lead ou un analyste.",
    tech: 'ISO 9001, Audit qualité, Documentation process, Formation personnel, Tests logiciels, QA Lead',
    result: 'Conformité process assurée, prévention des défauts, confiance client renforcée',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'unite-poudre-bostik',
    title: 'Installation et modification unité poudre — Bostik',
    category: 'Automatisme',
    description: "Installation et modification de l'unité poudre au sein de la Société des colles marocain « Bostik ». Intervention complète sur la ligne de production : adaptation des équipements existants, mise à niveau des automatismes et optimisation du process de fabrication des colles en poudre pour répondre aux nouvelles exigences de production.",
    tech: 'Automatismes industriels, Modification ligne process, Instrumentation, Mise en service',
    result: 'Ligne de production modernisée, capacité de production optimisée, conformité process',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    client: 'Bostik — Société des colles marocain',
  },
  {
    slug: 'logiciel-qualite-fater',
    title: 'Installation de logiciel de qualité — Fater',
    category: 'Qualité',
    description: "Installation et déploiement d'un logiciel de qualité au sein de l'entreprise Fater. Mise en place des outils de suivi, de contrôle et de traçabilité qualité pour les lignes de production. Paramétrage des indicateurs de performance, formation des équipes et intégration avec les systèmes de supervision existants.",
    tech: 'Logiciel qualité, Traçabilité, KPI production, Formation équipes, Intégration SCADA',
    result: 'Traçabilité complète, réduction des non-conformités, amélioration continue assurée',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    client: 'Fater',
  },
  {
    slug: 'hmi-siemens-rockwell',
    title: 'Installation HMI Siemens et Rockwell',
    category: 'Automatisme',
    description: "Installation et mise en service d'interfaces homme-machine (HMI) sur des plateformes Siemens et Rockwell Automation. Déploiement de panneaux opérateurs Siemens TP/KTP et Allen-Bradley PanelView, développement des écrans de supervision, intégration avec les automates S7 et ControlLogix, et formation des opérateurs à l'utilisation des nouvelles interfaces.",
    tech: 'HMI Siemens TP/KTP, Rockwell PanelView, WinCC, FactoryTalk, API S7 & ControlLogix',
    result: 'Interface opérateur intuitive, supervision facilitée, réduction des erreurs de manipulation',
    image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&q=80&w=800',
  },
];
