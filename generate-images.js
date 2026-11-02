#!/usr/bin/env node

/**
 * Image generation script for og-image and logo
 * Uses SVG as source and exports to formats needed
 * 
 * Requirements: npm install --save-dev sharp
 * Usage: node generate-images.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if sharp is installed
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (e) {
  console.log('⚠️  sharp 未安装。请运行以下命令安装：');
  console.log('npm install --save-dev sharp');
  console.log('\n之后再运行此脚本。');
  process.exit(1);
}

const publicDir = path.join(__dirname, 'public');

async function generateImages() {
  try {
    console.log('🎨 正在生成 og-image 和 logo...\n');

    // 1. Generate og-image-default.jpg from SVG
    const ogSvgPath = path.join(publicDir, 'og-image-default.svg');
    const ogJpgPath = path.join(publicDir, 'og-image-default.jpg');

    await sharp(ogSvgPath)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90, progressive: true })
      .toFile(ogJpgPath);

    console.log(`✅ og-image-default.jpg (1200x630px) 生成成功！`);
    console.log(`   位置: ${ogJpgPath}`);
    console.log(`   大小: ${(fs.statSync(ogJpgPath).size / 1024).toFixed(2)} KB\n`);

    // 2. Generate logo.png from SVG
    const logoSvgPath = path.join(publicDir, 'logo.svg');
    const logoPngPath = path.join(publicDir, 'logo.png');

    await sharp(logoSvgPath)
      .resize(200, 200, {
        fit: 'cover',
        position: 'center'
      })
      .png({ quality: 95 })
      .toFile(logoPngPath);

    console.log(`✅ logo.png (200x200px) 生成成功！`);
    console.log(`   位置: ${logoPngPath}`);
    console.log(`   大小: ${(fs.statSync(logoPngPath).size / 1024).toFixed(2)} KB\n`);

    // 3. Also generate a larger logo for use in headers
    const logoLargePath = path.join(publicDir, 'logo-large.png');

    await sharp(logoSvgPath)
      .resize(500, 500, {
        fit: 'cover',
        position: 'center'
      })
      .png({ quality: 95 })
      .toFile(logoLargePath);

    console.log(`✅ logo-large.png (500x500px) 生成成功！`);
    console.log(`   位置: ${logoLargePath}`);
    console.log(`   大小: ${(fs.statSync(logoLargePath).size / 1024).toFixed(2)} KB\n`);

    // 4. Generate Twitter image (1024x512 - better aspect ratio for Twitter)
    const twitterPath = path.join(publicDir, 'twitter-image-default.jpg');

    await sharp(ogSvgPath)
      .resize(1024, 512, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90, progressive: true })
      .toFile(twitterPath);

    console.log(`✅ twitter-image-default.jpg (1024x512px) 生成成功！`);
    console.log(`   位置: ${twitterPath}`);
    console.log(`   大小: ${(fs.statSync(twitterPath).size / 1024).toFixed(2)} KB\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 所有图片生成完成！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📝 使用方式：');
    console.log('1. og-image-default.jpg - 用于 Facebook、Pinterest 分享');
    console.log('2. twitter-image-default.jpg - 用于 Twitter 分享');
    console.log('3. logo.png - 网站 favicon 和小图标');
    console.log('4. logo-large.png - 页面头部展示');
    console.log('5. og-image-default.svg - 矢量版本（可编辑）');
    console.log('6. logo.svg - 矢量版本（可编辑）\n');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

// Run the script
generateImages();
