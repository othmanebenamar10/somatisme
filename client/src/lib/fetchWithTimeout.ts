/** Fetch and parse JSON with a finite wait so the UI cannot stay busy forever. */
export async function fetchJsonWithTimeout<T>(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 30_000,
): Promise<{ response: Response; data: T | null }> {
  const controller = new AbortController();
  let timeout = 0;
  const timedOut = new Promise<never>((_resolve, reject) => {
    timeout = window.setTimeout(() => {
      controller.abort();
      const error = new Error('The request timed out.');
      error.name = 'TimeoutError';
      reject(error);
    }, timeoutMs);
  });

  try {
    const request = (async () => {
      const response = await fetch(input, { ...init, signal: controller.signal });
      let data: T | null = null;
      try {
        data = await response.json() as T;
      } catch {
        // Keep the HTTP response so callers can show a status-specific message.
      }
      return { response, data };
    })();
    return await Promise.race([request, timedOut]);
  } finally {
    window.clearTimeout(timeout);
  }
}
