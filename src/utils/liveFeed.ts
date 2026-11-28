import { metric } from '@vercel/functions';
import type { CreatorEntry } from './content';

export type DispatchPlatform =
  | 'substack'
  | 'thread'
  | 'playlist'
  | 'youtube'
  | 'podcast'
  | 'talk';

export interface DispatchItem {
  id: string;
  title: string;
  description: string;
  pubDate: Date;
  platform: DispatchPlatform;
  url: string;
  durationOrFormat?: string;
  source: 'live' | 'archive';
}

interface SubstackFeedItem {
  entity_key?: string;
  type?: string;
  context?: {
    type?: string;
    timestamp?: string;
  };
  comment?: {
    body?: string;
    date?: string;
  };
  post?: {
    title?: string;
    subtitle?: string;
    truncated_body_text?: string;
    canonical_url?: string;
    post_date?: string;
  };
}

const DEFAULT_SUBSTACK_PROFILE_ID = '19899938';
const DEFAULT_SUBSTACK_HANDLE = 'prashantbasthana';
const UPSTREAM_TIMEOUT_MS = 2500;

function readEnv(key: string): string | undefined {
  const fromVite = (import.meta.env as Record<string, string | undefined>)[key];
  return fromVite || process.env[key];
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
}

export function cleanPlainText(raw: string): string {
  return decodeHtmlEntities(raw)
    .replace(/<[^>]+>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitNoteHeadline(text: string): { title: string; description: string } {
  const cleaned = cleanPlainText(text);
  if (!cleaned) {
    return { title: 'Note', description: '' };
  }

  // Prefer breaking cleanly on sentence or colon boundary near 35-85 chars.
  const sentenceMatch = /^(.{18,88}?)(?:[.!?](?:\s|$)|:\s+)(.+)$/.exec(cleaned);
  if (sentenceMatch) {
    return {
      title: sentenceMatch[1].trim(),
      description: sentenceMatch[2].trim(),
    };
  }

  if (cleaned.length <= 84) {
    return { title: cleaned, description: cleaned };
  }

  const sliceAt = cleaned.lastIndexOf(' ', 78);
  const title = sliceAt > 30 ? cleaned.slice(0, sliceAt).trim() : cleaned.slice(0, 78).trim();
  const rest = cleaned.slice(title.length).trim();
  return {
    title,
    description: rest || cleaned,
  };
}

function normalizeUrlKey(rawUrl: string): string {
  try {
    const u = new URL(rawUrl);
    u.search = '';
    u.hash = '';
    return `${u.origin}${u.pathname.replace(/\/+$/, '')}`.toLowerCase();
  } catch {
    return rawUrl.replace(/\/+$/, '').toLowerCase();
  }
}

export function parseSubstackProfileItems(
  items: SubstackFeedItem[],
  handle = DEFAULT_SUBSTACK_HANDLE,
): DispatchItem[] {
  const parsed: DispatchItem[] = [];

  for (const item of items) {
    const contextType = item.context?.type;
    const isAuthoredNote = item.type === 'comment' && contextType === 'note';
    const isAuthoredPost = item.type === 'post' && contextType !== 'comment_restack';
    if (!isAuthoredNote && !isAuthoredPost) continue;

    const rawDate = item.context?.timestamp || item.comment?.date || item.post?.post_date;
    const pubDate = rawDate ? new Date(rawDate) : new Date();
    if (Number.isNaN(pubDate.valueOf())) continue;

    if (isAuthoredPost && item.post?.canonical_url) {
      const title = cleanPlainText(item.post.title || 'Substack Essay');
      const description = cleanPlainText(
        item.post.subtitle || item.post.truncated_body_text || title,
      );
      parsed.push({
        id: `substack-${item.entity_key || item.post.canonical_url}`,
        title,
        description,
        pubDate,
        platform: 'substack',
        url: item.post.canonical_url,
        durationOrFormat: 'Post',
        source: 'live',
      });
      continue;
    }

    if (isAuthoredNote && item.entity_key && item.comment?.body) {
      const { title, description } = splitNoteHeadline(item.comment.body);
      parsed.push({
        id: `substack-${item.entity_key}`,
        title,
        description,
        pubDate,
        platform: 'substack',
        url: `https://substack.com/@${handle}/note/${item.entity_key}`,
        durationOrFormat: 'Note',
        source: 'live',
      });
    }
  }

  return parsed;
}

function extractXmlTag(block: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const m = regex.exec(block);
  return m ? m[1].trim() : '';
}

export function parseRssOrAtomFeed(
  xml: string,
  platform: DispatchPlatform = 'thread',
): DispatchItem[] {
  const results: DispatchItem[] = [];

  const rssItems = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((m) => m[1]);
  const atomEntries =
    rssItems.length === 0
      ? [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].map((m) => m[1])
      : [];
  const blocks = rssItems.length > 0 ? rssItems : atomEntries;

  for (const [idx, block] of blocks.entries()) {
    const rawTitle = extractXmlTag(block, 'title');
    const rawDesc =
      extractXmlTag(block, 'description') ||
      extractXmlTag(block, 'summary') ||
      extractXmlTag(block, 'content');
    const rawDate =
      extractXmlTag(block, 'pubDate') ||
      extractXmlTag(block, 'published') ||
      extractXmlTag(block, 'updated');

    let link = decodeHtmlEntities(extractXmlTag(block, 'link')).trim();
    if (!link) {
      const atomLinkMatch = /<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i.exec(block);
      link = atomLinkMatch ? decodeHtmlEntities(atomLinkMatch[1]).trim() : '';
    }
    if (!link) continue;

    const pubDate = rawDate ? new Date(rawDate) : new Date();
    if (Number.isNaN(pubDate.valueOf())) continue;

    const cleanedTitle = cleanPlainText(rawTitle);
    const cleanedDesc = cleanPlainText(rawDesc);
    const baseText = cleanedDesc || cleanedTitle;
    if (!baseText) continue;

    // Many X RSS bridges emit boilerplate like "Prashant (@Embargoliving)" or "Post by @Embargoliving" in <title>.
    const isGenericAuthorTitle =
      !cleanedTitle ||
      /^(?:prashant(?:\s+bhushan)?|@?embargoliving)\b.*(?::|on x)?$/i.test(cleanedTitle) ||
      /^(?:post|tweet)\s+by\b/i.test(cleanedTitle);

    const split =
      !isGenericAuthorTitle
        ? { title: cleanedTitle, description: cleanedDesc || cleanedTitle }
        : splitNoteHeadline(baseText);

    results.push({
      id: `${platform}-rss-${idx}-${pubDate.valueOf()}`,
      title: split.title,
      description: split.description,
      pubDate,
      platform,
      url: link,
      durationOrFormat: platform === 'thread' ? 'X Post' : 'Feed',
      source: 'live',
    });
  }

  return results;
}

export async function fetchSubstackNotes(): Promise<DispatchItem[]> {
  const profileId = readEnv('SUBSTACK_PROFILE_ID') || DEFAULT_SUBSTACK_PROFILE_ID;
  const handle = readEnv('SUBSTACK_HANDLE') || DEFAULT_SUBSTACK_HANDLE;
  const endpoint = `https://substack.com/api/v1/reader/feed/profile/${encodeURIComponent(profileId)}`;

  const res = await fetch(endpoint, {
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    headers: {
      Accept: 'application/json',
      'User-Agent': 'prashantbhushan.com/1.0 (+https://prashantbhushancom.vercel.app)',
    },
  });

  if (!res.ok) {
    throw new Error(`Substack feed returned ${res.status}`);
  }

  const data = (await res.json()) as { items?: SubstackFeedItem[] };
  return parseSubstackProfileItems(data.items ?? [], handle);
}

export async function fetchXPostsFromRss(): Promise<DispatchItem[]> {
  const rssUrl = readEnv('X_RSS_URL');
  if (!rssUrl) return [];

  const res = await fetch(rssUrl, {
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    headers: {
      Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml',
      'User-Agent': 'prashantbhushan.com/1.0 (+https://prashantbhushancom.vercel.app)',
    },
  });

  if (!res.ok) {
    throw new Error(`X RSS feed returned ${res.status}`);
  }

  const xml = await res.text();
  return parseRssOrAtomFeed(xml, 'thread');
}

export function creatorEntryToDispatch(entry: CreatorEntry): DispatchItem {
  return {
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    pubDate: entry.data.pubDate,
    platform: entry.data.platform,
    url: entry.data.url,
    durationOrFormat: entry.data.durationOrFormat,
    source: 'archive',
  };
}

export async function getMergedCreatorDispatches(
  localEntries: readonly CreatorEntry[],
): Promise<DispatchItem[]> {
  const startedAt = performance.now();
  const [substackRes, xRes] = await Promise.allSettled([
    fetchSubstackNotes(),
    fetchXPostsFromRss(),
  ]);

  const substackItems = substackRes.status === 'fulfilled' ? substackRes.value : [];
  const xItems = xRes.status === 'fulfilled' ? xRes.value : [];
  const hasAnyFailure =
    substackRes.status === 'rejected' ||
    (Boolean(readEnv('X_RSS_URL')) && xRes.status === 'rejected');

  metric('feed_sync.duration_ms', Math.round(performance.now() - startedAt));
  metric('feed_sync.fetch', 1, {
    outcome: hasAnyFailure ? 'partial' : 'success',
    substack_ok: String(substackRes.status === 'fulfilled'),
    x_ok: String(xRes.status === 'fulfilled'),
  });

  // Archive entries seeded first so hand-curated titles/descriptions take precedence
  // for existing URLs, while any new live post flows automatically to the top.
  const deduped = new Map<string, DispatchItem>();
  for (const entry of localEntries) {
    const item = creatorEntryToDispatch(entry);
    deduped.set(normalizeUrlKey(item.url), item);
  }
  for (const liveItem of [...substackItems, ...xItems]) {
    const key = normalizeUrlKey(liveItem.url);
    if (!deduped.has(key)) {
      deduped.set(key, liveItem);
    }
  }

  return [...deduped.values()].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}
