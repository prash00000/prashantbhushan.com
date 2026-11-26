import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { getSortedProjects } from '../utils/content';

export const GET: APIRoute = async () => {
  const projects = await getSortedProjects();

  const lines = [
    `# Projects — ${SITE.name} (${SITE.handle})`,
    '',
    'Software tools, legal-tech utilities, and vibe-coded experiments.',
    '',
    ...projects.flatMap((p) => [
      `## ${p.data.title}`,
      `- Domain: ${p.data.domain}`,
      `- Status: ${p.data.status}`,
      `- Stack: ${p.data.stack.join(', ')}`,
      ...(p.data.liveUrl ? [`- Live: ${p.data.liveUrl}`] : []),
      ...(p.data.repoUrl ? [`- Repo: ${p.data.repoUrl}`] : []),
      '',
      p.data.description,
      '',
    ]),
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};
