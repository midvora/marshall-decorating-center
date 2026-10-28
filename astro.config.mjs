import { defineConfig } from 'astro/config';

// On GitHub Actions the site is served from https://<owner>.github.io/<repo>/
const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const onPages = Boolean(process.env.GITHUB_ACTIONS && owner && repo);

export default defineConfig({
  site: onPages ? `https://${owner}.github.io` : undefined,
  base: onPages ? `/${repo}` : '/',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
});
