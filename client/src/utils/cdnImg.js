/**
 * Proxy BunnyCDN images through the server API to bypass hotlink protection on localhost.
 * On production domains, images load directly from CDN (no proxy needed).
 */
export const cdnImg = (url) => {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  if (url.includes('.b-cdn.net') && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return `/api/upload/proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
};
