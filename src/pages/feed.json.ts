import { getCollection } from 'astro:content';

const domain = 'https://organizingsmall.com';

function readingMinutes(body: string | undefined): number {
  const words = body?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return Math.max(1, Math.round(words / 200));
}

function absoluteInternalLinks(body: string): string {
  return body.replace(/\]\(\/([^)\s]*)\)/g, `](${domain}/$1)`);
}

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const latestPosts = posts
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
    .slice(0, 30);

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Organizing Small',
    description: 'Storage and decluttering projects measured and photographed in a 580-square-foot Chicago apartment.',
    home_page_url: domain,
    feed_url: `${domain}/feed.json`,
    icon: `${domain}/logo.png`,
    favicon: `${domain}/logo.png`,
    author: {
      name: 'Clara',
      url: `${domain}/about/`,
    },
    language: 'en',
    items: latestPosts.map((post) => ({
      id: `${domain}/blog/${post.slug}/`,
      url: `${domain}/blog/${post.slug}/`,
      title: post.data.title,
      content_text: absoluteInternalLinks(post.body),
      content_html: `<p>${post.data.description}</p>`,
      summary: post.data.description,
      image: post.data.image
        ? new URL(post.data.image.src, domain).href
        : `${domain}/og-image-default.jpg`,
      date_published: post.data.pubDate.toISOString(),
      date_modified: (post.data.updatedDate || post.data.pubDate).toISOString(),
      author: {
        name: 'Clara',
      },
      tags: [post.data.category, ...post.data.tags],
      category: post.data.category,
      _extensions: {
        category: post.data.category,
        subcategory: post.data.subcategory,
        reading_time_minutes: readingMinutes(post.body),
      },
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
