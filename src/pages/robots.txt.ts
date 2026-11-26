import type { APIRoute } from 'astro';
import { SITE } from '../config/site';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site ?? new URL(SITE.siteUrl);
  const sitemapUrl = new URL('sitemap-index.xml', baseUrl).toString();
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
