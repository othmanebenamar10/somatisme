import { useEffect } from 'react';
import { siteConfig } from '@/lib/seo';

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
    document.title = `${config.title} | SOMATISME`;

    const setMeta = (selector: string, attribute: 'name' | 'property', key: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        const meta = document.createElement('meta');
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
        element = meta;
      }
      element.setAttribute('content', value);
    };

    setMeta('meta[name="description"]', 'name', 'description', config.description);
    if (config.keywords) {
      setMeta('meta[name="keywords"]', 'name', 'keywords', config.keywords);
    }

    setMeta('meta[property="og:title"]', 'property', 'og:title', config.ogTitle || config.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', config.ogDescription || config.description);

    if (config.ogImage) {
      setMeta('meta[property="og:image"]', 'property', 'og:image', config.ogImage);
    }

    const canonicalURL = config.canonical || `${siteConfig.url}${window.location.pathname}`;
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalURL;
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalURL);
  }, [config.title, config.description, config.keywords, config.ogTitle, config.ogDescription, config.ogImage, config.canonical]);
}
