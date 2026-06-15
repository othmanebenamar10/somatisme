import { useEffect, useCallback } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      ready: (cb: () => void) => void;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

export function useRecaptcha() {
  useEffect(() => {
    if (!SITE_KEY) return;
    if (document.getElementById('recaptcha-script')) return;

    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const getToken = useCallback(
    async (action: string): Promise<string | null> => {
      if (!SITE_KEY) return null;
      if (typeof window === 'undefined' || !window.grecaptcha) return null;
      try {
        return await new Promise<string>((resolve, reject) => {
          window.grecaptcha.ready(async () => {
            try {
              const token = await window.grecaptcha.execute(SITE_KEY, { action });
              resolve(token);
            } catch (e) {
              reject(e);
            }
          });
        });
      } catch {
        return null;
      }
    },
    []
  );

  return { getToken, enabled: !!SITE_KEY };
}
