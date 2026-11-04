import { defineConfig } from 'astro/config';

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
  
  // Note: i18n can be enabled when you have full Chinese version of content
  // For now, focus on perfecting English version with complete SEO optimization
  
  // Prefetch optimization
  prefetch: true,

  // Disable the Astro dev toolbar overlay
  devToolbar: {
    enabled: false,
  },
});
