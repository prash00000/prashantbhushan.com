import type { APIRoute } from 'astro';
import { CATEGORIES, SITE } from '../../config/site';
import { type ArticleEntry, formatDate, getPublishedArticles } from '../../utils/content';

export async function getStaticPaths() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({
    params: { slug: article.id },
    props: { article },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const article = props.article as ArticleEntry;
  const category = CATEGORIES[article.data.category].label;

  const lines = [
    `# ${article.data.title}`,
    '',
    `- Author: ${SITE.name} (${SITE.handle})`,
    `- Published: ${formatDate(article.data.pubDate, 'long')}`,
    `- Category: ${category}`,
    `- Tags: ${article.data.tags.map((t) => `#${t}`).join(', ')}`,
    '',
    `> ${article.data.description}`,
    '',
    article.body?.trim() ?? '',
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};
