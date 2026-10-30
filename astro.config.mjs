import { defineConfig } from 'astro/config';

export default defineConfig({
  // 项目配置
  site: 'https://example.com', // 替换为实际域名
  base: '/',
  
  // 构建配置
  build: {
    assets: 'assets',
  },
  
  // 输出配置
  output: 'static',
  
  // 国际化配置（可选）
  // i18n: {
  //   defaultLocale: 'en',
  //   locales: ['en', 'zh'],
  //   routing: 'prefix-other-locales',
  // }
});
