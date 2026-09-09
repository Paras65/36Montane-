// utils/safeFetch.js - Bulletproof JSON Fetching & HTML Guard

/**
 * Safely parses a response as JSON.
 * If the response is HTML, text, or malformed, it returns the provided fallback without throwing.
 */
export const safeParseJson = async (response, fallback = null) => {
  if (!response) return fallback;
  try {
    const contentType = response.headers?.get ? response.headers.get('content-type') || '' : '';
    // If the server returned an HTML error page (e.g. <!DOCTYPE html>)
    if (contentType.includes('text/html')) {
      console.warn('safeParseJson: Received text/html instead of application/json from:', response.url);
      return fallback;
    }
    const text = await response.text();
    if (!text || !text.trim()) return fallback;
    
    // Extra guard against HTML content with wrong content-type
    const trimmed = text.trim();
    if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || trimmed.startsWith('<?xml')) {
      console.warn('safeParseJson: Received HTML markup instead of JSON from:', response.url);
      return fallback;
    }

    return JSON.parse(text);
  } catch (err) {
    console.warn('safeParseJson parse error:', err.message);
    return fallback;
  }
};

/**
 * Performs a fetch and guarantees returning valid JSON or the fallback.
 */
export const safeFetchJson = async (url, options = {}, fallback = null) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      console.warn(`safeFetchJson: Request to ${url} returned status ${res.status}`);
      return fallback;
    }
    return await safeParseJson(res, fallback);
  } catch (err) {
    console.warn(`safeFetchJson network error for ${url}:`, err.message);
    return fallback;
  }
};
