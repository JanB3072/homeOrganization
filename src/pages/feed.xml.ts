import { getCollection } from 'astro:content';
import astroConfig from '../../astro.config.mjs';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const domain = astroConfig.site ?? 'https://yourblogdomain.com';
  const latestPosts = posts
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
    .slice(0, 30);

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Home Organization Blog</title>
    <link>${domain}</link>
    <description>Real home organization solutions with measurements and photos</description>
    <language>en-us</language>
    <atom:link href="${domain}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <copyright>2024 Home Organization Blog. All rights reserved.</copyright>
    <generator>Astro v4.0</generator>
    <managingEditor>your-email@example.com</managingEditor>
    <image>
      <url>${domain}/logo.png</url>
      <title>Home Organization Blog</title>
      <link>${domain}</link>
    </image>
    
    ${latestPosts
      .map((post) => {
        const pubDate = post.data.pubDate;
        const author = 'Your Name';
        const categories = [post.data.category, ...post.data.tags];
        
        return `    <item>
      <title>${post.data.title}</title>
      <link>${domain}/blog/${post.slug}/</link>
      <guid isPermaLink="true">${domain}/blog/${post.slug}/</guid>
      <description>${post.data.description}</description>
      <content:encoded><![CDATA[${post.data.description}]]></content:encoded>
      <pubDate>${pubDate.toUTCString()}</pubDate>
      <lastBuildDate>${(post.data.updatedDate || pubDate).toUTCString()}</lastBuildDate>
      <author>${author}</author>
      <category>${post.data.category}</category>
      ${post.data.tags.map((tag) => `      <category>${tag}</category>`).join('\n')}
      <comments>${domain}/blog/${post.slug}/#comments</comments>
    </item>`;
      })
      .join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
