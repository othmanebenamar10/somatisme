/**
 * SOMATISME - Configuration de Performance
 * Performance optimization utilities and monitoring
 */

/**
 * Web Vitals Monitoring
 */
export interface WebVitals {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  ttfb: number; // Time to First Byte
}

/**
 * Monitor Core Web Vitals
 */
export function monitorWebVitals(callback: (vitals: Partial<WebVitals>) => void) {
  const vitals: Partial<WebVitals> = {};

  // First Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            vitals.fcp = entry.startTime;
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('Paint Observer not supported');
    }

    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        vitals.lcp = lastEntry.renderTime || lastEntry.loadTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP Observer not supported');
    }

    // Cumulative Layout Shift
    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutEntry = entry as any;
          if (!('hadRecentInput' in layoutEntry) || !layoutEntry.hadRecentInput) {
            vitals.cls = (vitals.cls || 0) + layoutEntry.value;
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS Observer not supported');
    }
  }

  // Report vitals after page load
  window.addEventListener('load', () => {
    setTimeout(() => callback(vitals), 0);
  });
}

/**
 * Image optimization helper
 */
export function getOptimizedImageUrl(url: string, width?: number, format?: 'webp' | 'jpg'): string {
  // This would integrate with your image CDN
  // Example: Cloudinary, Imgix, or similar
  if (!url) return '';

  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (format) params.append('f', format);

  // For now, return the original URL
  // In production, integrate with your CDN
  return url;
}

/**
 * Prefetch resources for better performance
 */
export function prefetchResource(url: string, as: 'script' | 'style' | 'image' = 'script') {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = as;
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Preload critical resources
 */
export function preloadResource(url: string, as: 'script' | 'style' | 'font' = 'script') {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = url;
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImages() {
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    const images = document.querySelectorAll('img[data-src]');
    images.forEach((img) => {
      const src = (img as HTMLImageElement).dataset.src;
      if (src) {
        (img as HTMLImageElement).src = src;
      }
    });
    return;
  }

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  const images = document.querySelectorAll('img[data-src]');
  images.forEach((img) => imageObserver.observe(img));
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Cache management
 */
export class CacheManager {
  private static readonly PREFIX = 'somatisme_cache_';
  private static readonly DEFAULT_TTL = 3600000; // 1 hour

  static set(key: string, value: any, ttl: number = this.DEFAULT_TTL): void {
    const data = {
      value,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(this.PREFIX + key, JSON.stringify(data));
  }

  static get(key: string): any {
    const data = localStorage.getItem(this.PREFIX + key);
    if (!data) return null;

    try {
      const parsed = JSON.parse(data);
      if (Date.now() - parsed.timestamp > parsed.ttl) {
        this.remove(key);
        return null;
      }
      return parsed.value;
    } catch {
      return null;
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  static clear(): void {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}
