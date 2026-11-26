import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const collections = {
  articles: defineCollection({
    loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(['law', 'vibecoding', 'creator', 'essay']),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      heroImage: z.string().optional(),
      heroAlt: z.string().optional(),
    }),
  }),
  projects: defineCollection({
    loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      status: z.enum(['live', 'building', 'open-source', 'archived']),
      domain: z.enum(['legal-tech', 'ai-tool', 'web-app', 'cli']),
      stack: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      liveUrl: z.url().optional(),
      repoUrl: z.url().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(99),
    }),
  }),
  creator: defineCollection({
    loader: glob({ base: './src/content/creator', pattern: '**/*.md' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      platform: z.enum(['youtube', 'podcast', 'thread', 'talk']),
      url: z.url(),
      durationOrFormat: z.string().optional(),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
    }),
  }),
};
