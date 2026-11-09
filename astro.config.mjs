import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Site configuration for SEO
  site: 'https://organizingsmall.com',
  base: '/',
  
  // Build settings
  build: {
    assets: 'assets',
  },
  
  // Output as static HTML - best for SEO and fast performance
  output: 'static',

  // Serve optimized WebP for <Image> outputs (smaller payload, better LCP)
  image: {
    format: 'webp',
    quality: 75,
  },
  
  // Note: i18n can be enabled when you have full Chinese version of content
  // For now, focus on perfecting English version with complete SEO optimization
  
  // Prefetch optimization
  prefetch: true,

  // Disable the Astro dev toolbar overlay
  devToolbar: {
    enabled: false,
  },

  // Auto-generate sitemap from all routes (posts, categories, tags, pagination)
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/tags/'),
    }),
  ],
});
