import { defineConfig } from 'astro/config';

export default defineConfig({
  // Site configuration for SEO
  site: 'https://yourblogdomain.com', // Change to your actual domain
  base: '/',
  
  // Build settings
  build: {
    assets: 'assets',
  },
  
  // Output as static HTML for SEO and fast performance
  output: 'static',
  
  // Optional: Internationalization setup (if you expand to multiple languages later)
  // i18n: {
  //   defaultLocale: 'en',
  //   locales: ['en', 'es', 'fr'],
  //   routing: 'prefix-other-locales',
  // }
});
