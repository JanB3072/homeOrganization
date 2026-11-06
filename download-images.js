#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import matter from 'gray-matter';

const blogDir = './src/content/blog';
const imagesDir = path.join(blogDir, 'images');

// 确保图片目录存在
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 预定义的图片映射
const imageMap = {
  // 只下载失败的文件
  'wire-basket-wall-storage-for-toiletries': 'https://images.pexels.com/photos/3757941/pexels-photo-3757941.jpeg',
  'how-to-style-a-floating-vanity': 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
};

// 下载文件
const downloadFile = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);
    
    // 如果文件已存在，先删除再下载（支持更新）
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    const file = fs.createWriteStream(filePath);
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      maxRedirects: 5
    }, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      reject(err);
    });
  });
};

// 生成图片文件名
const generateImageFilename = (slug) => {
  return `${slug}.jpg`;
};

// 更新 Markdown 文件 - 只添加缺少的 image 和 imageAlt
const updateMarkdownFile = (filePath, imageRelPath, imageAlt) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // 检查是否已有 image 字段
  if (content.includes('image:')) {
    return; // 已有图片，跳过
  }
  
  // 找到 draft 字段的位置，在其之前插入 image 和 imageAlt
  const draftIndex = content.indexOf('draft:');
  if (draftIndex === -1) {
    return; // 找不到 draft 字段
  }
  
  // 在 draft 字段之前插入
  const imageLines = `image: ${imageRelPath}\nimageAlt: "${imageAlt}"\n`;
  const newContent = content.slice(0, draftIndex) + imageLines + content.slice(draftIndex);
  
  fs.writeFileSync(filePath, newContent, 'utf-8');
};

// 主函数
const main = async () => {
  console.log(`\n准备为文章下载配图...\n`);
  
  let success = 0;
  let failed = 0;
  const failedFiles = [];
  
  for (const [slug, imageUrl] of Object.entries(imageMap)) {
    const filePath = path.join(blogDir, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⊘ 文件不存在: ${slug}.md`);
      continue;
    }
    
    const imageFilename = generateImageFilename(slug);
    const imageRelPath = `./images/${imageFilename}`;
    
    const { data } = matter(filePath);
    const imageAlt = data.title;
    
    try {
      console.log(`⏳ 处理中: ${slug}.md`);
      await downloadFile(imageUrl, imageFilename);
      updateMarkdownFile(filePath, imageRelPath, imageAlt);
      console.log(`✓ 已完成: ${slug}.md`);
      success++;
    } catch (error) {
      console.error(`✗ 失败: ${slug}.md - ${error.message}`);
      failedFiles.push(slug);
      failed++;
    }
    
    // 添加延迟
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n完成！成功: ${success}, 失败: ${failed}\n`);
  if (failedFiles.length > 0) {
    console.log('失败的文件：');
    failedFiles.forEach(f => console.log(`  - ${f}.md`));
  }
};

main().catch(console.error);
