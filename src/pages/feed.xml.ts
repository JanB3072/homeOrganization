import { getCollection } from 'astro:content';

const domain = 'https://organizingsmall.com';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// RSS 的 content:encoded 需要 HTML。这里只处理文章里的段落、标题和站内链接，
// 并把相对链接补全成绝对地址，避免阅读器把 /blog/... 当成阅读器自己的路径。
function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/\]\(\/([^)\s]*)\)/g, `](${domain}/$1)`)
    .split(/\n\s*\n/)
    .map((block) => {
      const text = block.trim();
      if (!text) return '';
      const heading = text.match(/^(#{2,4})\s+(.+)$/);
      if (heading) {
        const level = heading[1].length;
        return `<h${level}>${escapeXml(heading[2])}</h${level}>`;
      }
      const inline = escapeXml(text)
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => `<a href="${href}">${label}</a>`)
        .replace(/\n/g, '<br />');
      return `<p>${inline}</p>`;
    })
    .filter(Boolean)
    .join('\n');
}

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const latestPosts = posts
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
    .slice(0, 30);

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Organizing Small</title>
    <link>${domain}</link>
    <description>Storage and decluttering projects measured and photographed in a 580-square-foot Chicago apartment.</description>
    <language>en-us</language>
    <atom:link href="${domain}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <copyright>${new Date().getFullYear()} Organizing Small. All rights reserved.</copyright>
    <managingEditor>hello@organizingsmall.com (Clara)</managingEditor>
    <image>
      <url>${domain}/logo.png</url>
      <title>Organizing Small</title>
      <link>${domain}</link>
    </image>
    ${latestPosts
      .map((post) => {
        const pubDate = post.data.pubDate;
        const html = markdownToHtml(post.body).replace(/]]>/g, ']]]]><![CDATA[>');

        return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${domain}/blog/${post.slug}/</link>
      <guid isPermaLink="true">${domain}/blog/${post.slug}/</guid>
      <description>${escapeXml(post.data.description)}</description>
      <content:encoded><![CDATA[${html}]]></content:encoded>
      <pubDate>${pubDate.toUTCString()}</pubDate>
      <author>hello@organizingsmall.com (Clara)</author>
      <category>${escapeXml(post.data.category)}</category>
      ${post.data.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n')}
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
