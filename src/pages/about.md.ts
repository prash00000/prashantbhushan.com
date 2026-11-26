import type { APIRoute } from 'astro';
import { SITE } from '../config/site';

export const GET: APIRoute = async () => {
  const lines = [
    `# ${SITE.name} (${SITE.handle})`,
    '',
    `Location: ${SITE.location}`,
    '',
    SITE.heroTagline,
    '',
    '## Bio',
    ...SITE.about.bioParagraphs.flatMap((p) => [p, '']),
    '## Four Pillars',
    ...SITE.roles.map((r) => `- **${r.label}** (${r.href}): ${r.summary}`),
    '',
    '## Current Focus',
    ...SITE.about.nowItems.map((n) => `- ${n}`),
    '',
    '## Links',
    ...SITE.socials.map((s) => `- ${s.name}: ${s.href}`),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};
