import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("A guest in one's eyes"),
    category: z.enum([
      'Kitchen',
      'Closet',
      'Bathroom',
      'Small Space',
      'Declutter',
      'Guides',
    ]),
    subcategory: z.string(),
    tags: z.array(z.string()),
    keywords: z.array(z.string()).optional(),
    takeaways: z.array(z.string()).optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
