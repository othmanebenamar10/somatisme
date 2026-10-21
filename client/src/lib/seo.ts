/**
 * SOMATISME - Configuration SEO et Métadonnées
 * Centralize SEO configuration for the entire site
 */

export const siteConfig = {
  description: 'Solutions d\'automatisme industriel, régulation, installation électrique et maintenance pour les entreprises B2B.',
  url: 'https://somatisme.vercel.app',
  ogImage: 'https://somatisme.vercel.app/somatisme.png',
};

/**
 * Generate structured data for the local business
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'SOMATISME',
    image: siteConfig.ogImage,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rue résistance residence Nassime GH 12 Appartement N°1',
      addressLocality: 'Mohammedia',
      addressCountry: 'MA',
    },
    telephone: '+212679825646',
    email: 'somatisme@gmail.com',
    url: siteConfig.url,
    priceRange: '$$',
  };
}
