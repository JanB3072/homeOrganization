import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

// 获取所有发布的文章
export async function getAllPosts() {
  const posts = await getCollection('blog', 
    ({ data }) => !data.draft
  );
  // CollectionEntry has no `url` field. List pages and cards need a canonical
  // link, so derive it here once instead of at every call site.
  return posts
    .map(post => ({ ...post, url: `/blog/${post.slug}/` }))
    .sort((a, b) => 
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

// 分页：按分类 (通用版本)
export async function getCategoryPaginated(
  category: string,
  page: number = 1,
  perPage: number = 12
) {
  const posts = await getPostsByCategory(category);
  const totalPages = Math.ceil(posts.length / perPage);
  
  return {
    posts: posts.slice((page - 1) * perPage, page * perPage),
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

// 分页：按标签 (增强版本)
export async function getTagPaginatedEnhanced(
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

// 搜索分页版本
export async function searchPostsPaginated(
  query: string,
  page: number = 1,
  perPage: number = 12
) {
  const posts = await searchPosts(query);
  const totalPages = Math.ceil(posts.length / perPage);
  
  return {
    posts: posts.slice((page - 1) * perPage, page * perPage),
    totalPages,
    currentPage: page,
    total: posts.length,
    query,
  };
}

// 按年月获取存档数据
export async function getArchivePosts() {
  const posts = await getAllPosts();
  const archiveMap = new Map<string, BlogPost[]>();
  
  posts.forEach(post => {
    const yearMonth = post.data.pubDate.toISOString().slice(0, 7);
    if (!archiveMap.has(yearMonth)) {
      archiveMap.set(yearMonth, []);
    }
    archiveMap.get(yearMonth)!.push(post);
  });
  
  return Array.from(archiveMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([yearMonth, posts]) => ({
      yearMonth,
      year: yearMonth.slice(0, 4),
      month: new Date(yearMonth + '-01').toLocaleString('en-US', { month: 'long' }),
      posts,
      count: posts.length,
    }));
}

// 获取热门/特色文章
export async function getFeaturedPosts(limit: number = 12) {
  const posts = await getAllPosts();
  
  // 计算热度分数：特色文章 + 最近发布 + 标签多
  const scored = posts.map(post => {
    let score = 0;
    
    if (post.data.featured) score += 10;
    
    const daysSincePub = (Date.now() - post.data.pubDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePub < 7) score += 5;
    else if (daysSincePub < 30) score += 3;
    else if (daysSincePub < 90) score += 1;
    
    score += post.data.tags.length * 0.5;
    
    return { post, score };
  });
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}
