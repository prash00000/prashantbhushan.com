import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config/site';
import { getPublishedArticles } from '../utils/content';

export async function GET(context: APIContext) {
  const articles = await getPublishedArticles();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.siteUrl,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.pubDate,
      description: article.data.description,
      link: `/articles/${article.id}/`,
      categories: [article.data.category, ...article.data.tags],
    })),
    customData: '<language>en-us</language>',
  });
}
