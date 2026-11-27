import type { APIRoute } from 'astro';
import { CATEGORIES, SITE } from '../config/site';
import {
  formatDate,
  getPublishedArticles,
  getSortedCreatorItems,
  getSortedProjects,
} from '../utils/content';

export const GET: APIRoute = async () => {
  const [articles, projects, creator] = await Promise.all([
    getPublishedArticles(),
    getSortedProjects(),
    getSortedCreatorItems(),
  ]);

  const items = [
    ...articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      url: `/articles/${article.id}`,
      type: 'article' as const,
      badge: `Article · ${CATEGORIES[article.data.category].short}`,
      date: formatDate(article.data.pubDate),
      tags: article.data.tags,
    })),
    ...projects.map((project) => ({
      title: project.data.title,
      description: project.data.description,
      url: `/projects/${project.id}`,
      type: 'project' as const,
      badge: `Project · ${project.data.domain}`,
      date: formatDate(project.data.pubDate),
      tags: [...project.data.tags, ...project.data.stack],
    })),
    ...creator.map((item) => ({
      title: item.data.title,
      description: item.data.description,
      url: item.data.url,
      type: 'content' as const,
      badge: `Content · ${item.data.platform}`,
      date: formatDate(item.data.pubDate),
      tags: item.data.tags,
    })),
    ...SITE.practice.areas.map((area) => ({
      title: `Practice: ${area.title}`,
      description: area.summary,
      url: '/practice',
      type: 'page' as const,
      badge: `Practice · ${area.tag}`,
      tags: area.deliverables,
    })),
    {
      title: `About ${SITE.name}`,
      description: SITE.description,
      url: '/about',
      type: 'page' as const,
      badge: 'Page',
      tags: ['bio', 'lawyer', 'litigation', 'vibe coder', 'substack', 'youtube music'],
    },
  ];

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
