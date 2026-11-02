import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

// 获取所有发布的文章
export async function getAllPosts() {
  const posts = await getCollection('blog', 
    ({ data }) => !data.draft
  );
  return posts.sort((a, b) => 
    b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
}

// 按分类查询
export async function getPostsByCategory(category: string) {
  const posts = await getAllPosts();
  return posts.filter(p => p.data.category === category);
}

// 按子分类查询
export async function getPostsBySubcategory(
  category: string, 
  subcategory: string
) {
  const posts = await getAllPosts();
  return posts.filter(
    p => p.data.category === category && 
         p.data.subcategory === subcategory
  );
}

// 获取所有标签及计数
export async function getAllTags() {
  const posts = await getAllPosts();
  const tagMap = new Map<string, number>();
  posts.forEach(post => {
    post.data.tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });
  return Array.from(tagMap.entries())
    .sort((a, b) => b[1] - a[1]);
}

// 分页：所有文章
export async function getPaginatedPosts(
  page: number = 1, 
  perPage: number = 12
) {
  const posts = await getAllPosts();
  const totalPages = Math.ceil(posts.length / perPage);
  const start = (page - 1) * perPage;
  
  return {
    posts: posts.slice(start, start + perPage),
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

// 分页：按子分类
export async function getSubcategoryPaginated(
  category: string,
  subcategory: string,
  page: number = 1,
  perPage: number = 12
) {
  const posts = await getPostsBySubcategory(category, subcategory);
  const totalPages = Math.ceil(posts.length / perPage);
  
  return {
    posts: posts.slice((page - 1) * perPage, page * perPage),
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

// 分页：按标签
export async function getTagPaginated(
  tag: string,
  page: number = 1,
  perPage: number = 12
) {
  const posts = await getAllPosts();
  const tagPosts = posts.filter(p => p.data.tags.includes(tag));
  const totalPages = Math.ceil(tagPosts.length / perPage);
  
  return {
    posts: tagPosts.slice((page - 1) * perPage, page * perPage),
    totalPages,
    currentPage: page,
    total: tagPosts.length,
  };
}

// 获取相关文章
export async function getRelatedPosts(slug: string, limit = 3) {
  const posts = await getAllPosts();
  const current = posts.find(p => p.slug === slug);
  if (!current) return [];
  
  const scored = posts
    .filter(p => p.slug !== slug)
    .map(p => {
      let score = 0;
      if (p.data.category === current.data.category) score += 3;
      if (p.data.subcategory === current.data.subcategory) score += 5;
      score += p.data.tags.filter(t => 
        current.data.tags.includes(t)
      ).length;
      return { post: p, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return scored.map(item => item.post);
}

// 搜索
export async function searchPosts(query: string) {
  const posts = await getAllPosts();
  const q = query.toLowerCase();
  
  return posts.filter(p =>
    p.data.title.toLowerCase().includes(q) ||
    p.data.description.toLowerCase().includes(q) ||
    p.data.tags.some(tag => tag.toLowerCase().includes(q))
  );
}
