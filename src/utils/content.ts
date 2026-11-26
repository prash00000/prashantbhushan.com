import { type CollectionEntry, getCollection } from 'astro:content';

export type ArticleEntry = CollectionEntry<'articles'>;
export type ProjectEntry = CollectionEntry<'projects'>;
export type CreatorEntry = CollectionEntry<'creator'>;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export async function getPublishedArticles(): Promise<ArticleEntry[]> {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return articles.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getSortedProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => {
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
  });
}

export async function getSortedCreatorItems(): Promise<CreatorEntry[]> {
  const items = await getCollection('creator');
  return items.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getReadingTime(body: string | undefined): string {
  if (!body) return '1 min read';
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`~\[\]()]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

export function formatDate(date: Date, style: 'short' | 'long' = 'short'): string {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  });
}

export function slugifyTag(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface MonthGroup {
  monthIndex: number;
  monthName: string;
  articles: ArticleEntry[];
}

export interface YearGroup {
  year: number;
  count: number;
  months: MonthGroup[];
}

export function groupArticlesByYearMonth(articles: ArticleEntry[]): YearGroup[] {
  const yearMap = new Map<number, Map<number, ArticleEntry[]>>();

  for (const article of articles) {
    const year = article.data.pubDate.getUTCFullYear();
    const month = article.data.pubDate.getUTCMonth();

    if (!yearMap.has(year)) yearMap.set(year, new Map());
    const monthMap = yearMap.get(year)!;
    if (!monthMap.has(month)) monthMap.set(month, []);
    monthMap.get(month)!.push(article);
  }

  return Array.from(yearMap.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, monthMap]) => {
      const months = Array.from(monthMap.entries())
        .sort((a, b) => b[0] - a[0])
        .map(([monthIndex, list]) => ({
          monthIndex,
          monthName: MONTHS[monthIndex] ?? 'Unknown',
          articles: list,
        }));
      const count = months.reduce((acc, m) => acc + m.articles.length, 0);
      return { year, count, months };
    });
}

export interface TagSummary {
  slug: string;
  label: string;
  count: number;
}

export function collectTags(
  articles: ArticleEntry[],
  projects: ProjectEntry[],
  creator: CreatorEntry[],
): TagSummary[] {
  const tagMap = new Map<string, { label: string; count: number }>();

  const register = (tags: string[]) => {
    for (const raw of tags) {
      const slug = slugifyTag(raw);
      if (!slug) continue;
      const existing = tagMap.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        tagMap.set(slug, { label: raw, count: 1 });
      }
    }
  };

  articles.forEach((a) => register(a.data.tags));
  projects.forEach((p) => register(p.data.tags));
  creator.forEach((c) => register(c.data.tags));

  return Array.from(tagMap.entries())
    .map(([slug, val]) => ({ slug, label: val.label, count: val.count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
