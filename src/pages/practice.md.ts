import type { APIRoute } from 'astro';
import { SITE } from '../config/site';

export const GET: APIRoute = async () => {
  const lines = [
    `# ${SITE.practice.headline}`,
    '',
    SITE.practice.intro,
    '',
    `> ${SITE.practice.disclaimer}`,
    '',
    '## Core Advisory Areas',
    ...SITE.practice.areas.flatMap((area) => [
      `### ${area.title} (${area.tag})`,
      area.summary,
      ...area.deliverables.map((d) => `- ${d}`),
      '',
    ]),
    '## Engagement Formats',
    ...SITE.practice.engagements.flatMap((eng) => [
      `### ${eng.title} — ${eng.cadence}`,
      eng.description,
      '',
    ]),
    `Contact: ${SITE.practice.contactEmail}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};
