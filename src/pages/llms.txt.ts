import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { getPublishedArticles, getSortedProjects } from '../utils/content';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site?.toString() ?? SITE.siteUrl).replace(/\/$/, '');
  const [articles, projects] = await Promise.all([
    getPublishedArticles(),
    getSortedProjects(),
  ]);

  const lines: string[] = [
    `# ${SITE.name} (${SITE.handle})`,
    '',
    `> ${SITE.description}`,
    '',
    '## Core Pages (Markdown Mirrors)',
    `- [About](${baseUrl}/about.md): Bio, pillars, and contact details`,
    `- [Legal Practice](${baseUrl}/practice.md): Advisory areas, engagements, and disclaimer`,
    `- [Projects](${baseUrl}/projects.md): Vibe-coded software tools and experiments`,
    `- [RSS Feed](${baseUrl}/rss.xml): Latest articles`,
    '',
    '## Articles (.md)',
    ...articles.map(
      (a) => `- [${a.data.title}](${baseUrl}/articles/${a.id}.md): ${a.data.description}`,
    ),
    '',
    '## Projects',
    ...projects.map(
      (p) => `- [${p.data.title}](${baseUrl}/projects/${p.id}): ${p.data.description}`,
    ),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
