import { useCallback } from 'react';

declare global {
  interface Window {
    grecaptcha?: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      ready: (cb: () => void) => void;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
let recaptchaLoad: Promise<void> | undefined;

function loadRecaptcha(siteKey: string): Promise<void> {
  if (window.grecaptcha) return Promise.resolve();
  if (recaptchaLoad) return recaptchaLoad;

  recaptchaLoad = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById('recaptcha-script') as HTMLScriptElement | null;
    const script = existingScript || document.createElement('script');
    if (!existingScript) {
      script.id = 'recaptcha-script';
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
      script.async = true;
    }

    const cleanup = () => {
      window.clearTimeout(timeout);
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
    };
    const timeout = window.setTimeout(() => {
      cleanup();
      script.remove();
      reject(new Error('Timed out while loading reCAPTCHA'));
    }, 10_000);
    const onLoad = () => {
      cleanup();
      if (window.grecaptcha) resolve();
      else {
        script.remove();
        reject(new Error('reCAPTCHA did not initialize'));
      }
    };
    const onError = () => {
      cleanup();
      script.remove();
      reject(new Error('Failed to load reCAPTCHA'));
    };

    script.addEventListener('load', onLoad, { once: true });
    script.addEventListener('error', onError, { once: true });
    if (!script.isConnected) document.head.appendChild(script);
  }).catch((error) => {
    recaptchaLoad = undefined;
    throw error;
  });

  return recaptchaLoad;
}

export function useRecaptcha() {
  const getToken = useCallback(
    async (action: string): Promise<string | null> => {
      if (!SITE_KEY) return null;
      if (typeof window === 'undefined') return null;
      try {
        await loadRecaptcha(SITE_KEY);
        if (!window.grecaptcha) return null;
        return await new Promise<string>((resolve, reject) => {
          window.grecaptcha!.ready(() => {
            window.grecaptcha!.execute(SITE_KEY, { action }).then(resolve, reject);
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
