import { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

export function useSEO(config: SEOConfig) {
  useEffect(() => {
    // Set title
    document.title = `${config.title} | SOMATISME`;

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', config.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = config.description;
      document.head.appendChild(meta);
    }

    // Set keywords
    if (config.keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', config.keywords);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = config.keywords;
        document.head.appendChild(meta);
      }
    }

    // Set OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', config.ogTitle || config.title);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.content = config.ogTitle || config.title;
      document.head.appendChild(meta);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', config.ogDescription || config.description);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:description');
      meta.content = config.ogDescription || config.description;
      document.head.appendChild(meta);
    }

    if (config.ogImage) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', config.ogImage);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:image');
        meta.content = config.ogImage;
        document.head.appendChild(meta);
      }
    }

    // Set canonical
    if (config.canonical) {
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', config.canonical);
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = config.canonical;
        document.head.appendChild(link);
      }
    }
  }, [config]);
}
