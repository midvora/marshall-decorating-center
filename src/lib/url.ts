/** Site links that respect the deploy base path (GitHub Pages serves the site from /<repo>/). */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const url = (path = '/') => `${base}${path.startsWith('/') ? path : `/${path}`}`;
