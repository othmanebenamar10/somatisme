/**
 * SOMATISME - Configuration SEO et Métadonnées
 * Centralize SEO configuration for the entire site
 */

export const siteConfig = {
  name: 'SOMATISME',
  description: 'Solutions d\'automatisme industriel, régulation, installation électrique et maintenance pour les entreprises B2B.',
  url: 'https://somatisme.ma',
  ogImage: 'https://somatisme.ma/og-image.png',
  links: {
    linkedin: 'https://www.linkedin.com/in/fouad-ben-amar-20295354?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
  },
};

export const pages = {
  home: {
    title: 'Automatisme Industriel & Solutions Techniques',
    description: 'SOMATISME : Solutions d\'automatisme industriel, régulation, installation électrique et maintenance. Expertise B2B pour l\'industrie.',
    keywords: 'automatisme industriel, régulation, installation électrique, maintenance industrielle, solutions techniques',
  },
  about: {
    title: 'À Propos de SOMATISME',
    description: 'Découvrez l\'histoire, les valeurs et l\'expertise de SOMATISME en automatisme industriel depuis plus de 15 ans.',
    keywords: 'SOMATISME, automatisme industriel, expertise, expérience',
  },
  services: {
    title: 'Nos Services',
    description: 'Découvrez nos services complètes en automatisme, régulation, installation électrique et maintenance industrielle.',
    keywords: 'services automatisme, régulation industrielle, installation électrique, maintenance',
  },
  automation: {
    title: 'Automatisme Industriel',
    description: 'Systèmes de contrôle et d\'automatisation avancés pour optimiser vos processus de production.',
    keywords: 'automatisme industriel, PLC, SCADA, robotique, automatisation',
  },
  regulation: {
    title: 'Régulation & Instrumentation',
    description: 'Solutions de mesure et de contrôle de précision pour vos processus critiques.',
    keywords: 'régulation industrielle, instrumentation, capteurs, transmetteurs',
  },
  electrical: {
    title: 'Installation Électrique Industrielle',
    description: 'Solutions électriques sécurisées, conformes aux normes et optimisées pour la performance.',
    keywords: 'installation électrique, électricité industrielle, tableaux électriques',
  },
  maintenance: {
    title: 'Maintenance Industrielle',
    description: 'Support technique complet et maintenance préventive pour assurer la continuité de vos opérations.',
    keywords: 'maintenance industrielle, maintenance préventive, support technique',
  },
  projects: {
    title: 'Nos Projets et Réalisations',
    description: 'Découvrez nos projets et réalisations pour des clients majeurs en automatisme industriel.',
    keywords: 'projets, réalisations, cas d\'étude, portfolio',
  },
  contact: {
    title: 'Nous Contacter',
    description: 'Contactez SOMATISME pour discuter de votre projet d\'automatisme industriel.',
    keywords: 'contact, devis, consultation, support',
  },
};

/**
 * Generate structured data for JSON-LD
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SOMATISME',
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rue résistance residence Nassime GH 12 Appartement N°1',
      addressLocality: 'Mohammedia',
      addressCountry: 'MA',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Sales',
      telephone: '+212679825646',
      email: 'info@somatisme.ma',
    },
    sameAs: [
      siteConfig.links.linkedin,
    ],
  };
}

/**
 * Generate structured data for local business
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'SOMATISME',
    image: `${siteConfig.url}/og-image.png`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rue résistance residence Nassime GH 12 Appartement N°1',
      addressLocality: 'Mohammedia',
      addressCountry: 'MA',
    },
    telephone: '+212679825646',
    email: 'info@somatisme.ma',
    url: siteConfig.url,
    priceRange: '$$',
  };
}
