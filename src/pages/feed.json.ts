import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const domain = 'https://yourblogdomain.com'; // Replace with actual domain
  const latestPosts = posts
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
    .slice(0, 30);

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Home Organization Blog',
    description: 'Real home organization solutions with measurements and photos',
    home_page_url: domain,
    feed_url: `${domain}/feed.json`,
    icon: `${domain}/logo.png`,
    favicon: `${domain}/favicon.ico`,
    author: {
      name: 'Your Name',
      url: domain,
    },
    language: 'en',
    items: latestPosts.map((post) => ({
      id: `${domain}/blog/${post.slug}/`,
      url: `${domain}/blog/${post.slug}/`,
      title: post.data.title,
      content_text: post.data.description,
      content_html: `<p>${post.data.description}</p>`,
      summary: post.data.description,
      image: post.data.image || `${domain}/og-image-default.jpg`,
      date_published: post.data.pubDate.toISOString(),
      date_modified: (post.data.updatedDate || post.data.pubDate).toISOString(),
      author: {
        name: 'Your Name',
      },
      tags: [post.data.category, ...post.data.tags],
      category: post.data.category,
      _extensions: {
        category: post.data.category,
        subcategory: post.data.subcategory,
        reading_time_minutes: Math.ceil(
          (post.body?.split(' ').length || 200) / 200
        ),
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
