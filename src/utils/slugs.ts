// 路由和链接共用同一套片段规则，避免页面生成的 URL 和 href 各写一份。
// 规则必须与已发布 URL 保持一致：只做小写和空白转连字符。
export function slugify(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

export function tagUrl(tag: string): string {
  return `/tags/${slugify(tag)}/`;
}

export function categoryUrl(category: string): string {
  return `/${slugify(category)}/`;
}

export function postUrl(slug: string): string {
  return `/blog/${slug}/`;
}
