import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const CREATOR_DIR = path.join(ROOT_DIR, 'src', 'content', 'creator');
const PROFILE_DIR = path.join(ROOT_DIR, '.x-sync-profile');
const HANDLE = process.env.X_HANDLE || 'Embargoliving';
const PROFILE_URL = `https://x.com/${HANDLE}`;
const MAX_POSTS = Number(process.env.X_SYNC_LIMIT || 12);

const BROWSER_CANDIDATES = [
  'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\imput\\Helium\\Application\\chrome.exe',
];

function findExternalBrowserExecutable() {
  for (const candidate of BROWSER_CANDIDATES) {
    if (existsSync(candidate)) return candidate;
  }
  const pwRoot = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright');
  if (existsSync(pwRoot)) {
    const dirs = readdirSync(pwRoot).filter((d) => d.startsWith('chromium-')).sort().reverse();
    for (const dir of dirs) {
      const exe = path.join(pwRoot, dir, 'chrome-win64', 'chrome.exe');
      if (existsSync(exe)) return exe;
      const legacyExe = path.join(pwRoot, dir, 'chrome-win', 'chrome.exe');
      if (existsSync(legacyExe)) return legacyExe;
    }
  }
  return undefined;
}

function yamlEscape(str) {
  return `"${String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, ' ').trim()}"`;
}

function splitTweetHeadline(text) {
  const cleaned = text.replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return { title: `Post on X (@${HANDLE})`, description: text.trim() };

  const boundary = /^(.{18,86}?)(?:[.!?](?:\s|$)|:\s+)(.+)$/.exec(cleaned);
  if (boundary) {
    return {
      title: boundary[1].trim(),
      description: boundary[2].trim(),
    };
  }
  if (cleaned.length <= 84) {
    return { title: cleaned, description: cleaned };
  }
  const cut = cleaned.lastIndexOf(' ', 76);
  const title = cut > 28 ? cleaned.slice(0, cut).trim() : cleaned.slice(0, 76).trim();
  return { title, description: cleaned };
}

function loadExistingStatusIds() {
  const ids = new Set();
  if (!existsSync(CREATOR_DIR)) return ids;
  for (const file of readdirSync(CREATOR_DIR)) {
    if (!file.endsWith('.md')) continue;
    const raw = readFileSync(path.join(CREATOR_DIR, file), 'utf8');
    const matches = raw.matchAll(/x\.com\/[^/\s"']+\/status\/(\d+)/gi);
    for (const m of matches) ids.add(m[1]);
  }
  return ids;
}

async function openExternalContext() {
  // Prefer attaching cleanly to an already-running Brave/Chrome remote-debugging window if open on :9229
  try {
    const res = await fetch('http://127.0.0.1:9229/json/version', { signal: AbortSignal.timeout(1000) });
    if (res.ok) {
      console.log('Connecting to existing external browser on http://127.0.0.1:9229...');
      const browser = await chromium.connectOverCDP('http://127.0.0.1:9229');
      const context = browser.contexts()[0] || (await browser.newContext());
      return { browser, context, ownedBrowser: false };
    }
  } catch {
    // No active remote-debugging browser; launch a persistent visible external browser window instead.
  }

  mkdirSync(PROFILE_DIR, { recursive: true });
  const executablePath = findExternalBrowserExecutable();
  console.log(`Launching external browser${executablePath ? ` (${path.basename(executablePath)})` : ''}...`);
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    executablePath,
    viewport: { width: 1280, height: 860 },
    args: ['--disable-blink-features=AutomationControlled'],
  });
  return { browser: null, context, ownedBrowser: true };
}

async function main() {
  const { browser, context, ownedBrowser } = await openExternalContext();
  const page = await context.newPage();

  try {
    await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const tweetSelector = `article[data-testid="tweet"] a[href*="/${HANDLE}/status/"]`;
    let tweetsReady = false;
    try {
      await page.waitForSelector(tweetSelector, { timeout: 10000 });
      tweetsReady = true;
    } catch {
      console.log(
        '\nX requires login in this external browser window.\n' +
          `Please sign in at https://x.com in the opened window (waiting up to 3 minutes)...\n`,
      );
      await page.waitForFunction(
        (h) => {
          const loggedInNav = Boolean(document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"], a[href="/home"][aria-label]'));
          const onProfileWithTweets =
            window.location.pathname.toLowerCase().includes(h.toLowerCase()) &&
            document.querySelectorAll(`article[data-testid="tweet"] a[href*="/${h}/status/"]`).length > 0;
          return loggedInNav || onProfileWithTweets;
        },
        HANDLE,
        { timeout: 180000 },
      );

      if (!page.url().toLowerCase().includes(HANDLE.toLowerCase())) {
        await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
      }
      await page.waitForSelector(tweetSelector, { timeout: 20000 });
      tweetsReady = true;
    }

    if (!tweetsReady) {
      throw new Error(`Could not detect posts for @${HANDLE}`);
    }

    // Gentle scroll down once to load ~10 recent posts cleanly
    for (let i = 0; i < 3; i += 1) {
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(900);
    }

    const extracted = await page.evaluate((handle) => {
      const items = [];
      const seen = new Set();
      const articles = document.querySelectorAll('article[data-testid="tweet"]');

      for (const article of articles) {
        // Skip retweets/reposts from other authors
        const socialContext = article.querySelector('[data-testid="socialContext"]')?.textContent || '';
        if (/reposted/i.test(socialContext)) continue;

        const statusLink = article.querySelector(`a[href*="/${handle}/status/"]`);
        if (!statusLink) continue;

        const href = statusLink.getAttribute('href') || '';
        const idMatch = new RegExp(`/${handle}/status/(\\d+)`, 'i').exec(href);
        if (!idMatch) continue;
        const statusId = idMatch[1];
        if (seen.has(statusId)) continue;
        seen.add(statusId);

        const timeEl = article.querySelector('time[datetime]');
        const datetime = timeEl?.getAttribute('datetime') || '';
        if (!datetime) continue;

        const textEl = article.querySelector('[data-testid="tweetText"]');
        const text = textEl?.innerText?.trim() || '';
        if (!text) continue;

        items.push({
          statusId,
          url: `https://x.com/${handle}/status/${statusId}`,
          datetime,
          text,
        });
      }
      return items;
    }, HANDLE);

    const existingIds = loadExistingStatusIds();
    const freshPosts = extracted.filter((p) => !existingIds.has(p.statusId)).slice(0, MAX_POSTS);

    for (const post of freshPosts) {
      const dateIso = new Date(post.datetime).toISOString().slice(0, 10);
      const { title, description } = splitTweetHeadline(post.text);
      const outPath = path.join(CREATOR_DIR, `x-${post.statusId}.md`);
      const md = [
        '---',
        `title: ${yamlEscape(title)}`,
        `description: ${yamlEscape(description)}`,
        `pubDate: ${dateIso}`,
        'platform: thread',
        `url: ${yamlEscape(post.url)}`,
        'durationOrFormat: "X Post"',
        'tags:',
        '  - x',
        '  - commentary',
        'featured: false',
        '---',
        '',
        `> ${post.text.replace(/\r?\n/g, '\n> ')}`,
        '',
        `Posted on [@${HANDLE}](${post.url}).`,
        '',
      ].join('\n');

      writeFileSync(outPath, md, 'utf8');
      console.log(`Added: src/content/creator/x-${post.statusId}.md (${dateIso})`);
    }

    console.log(
      `\nSync complete: scanned ${extracted.length} authored post(s) from @${HANDLE}, added ${freshPosts.length} new markdown file(s).`,
    );
  } finally {
    await page.close().catch(() => {});
    if (ownedBrowser) {
      await context.close().catch(() => {});
    } else if (browser) {
      await browser.close().catch(() => {});
    }
  }
}

main().catch((err) => {
  console.error('sync:x failed:', err.message);
  process.exit(1);
});
