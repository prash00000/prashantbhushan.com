export interface SocialLink {
  name: 'GitHub' | 'X' | 'LinkedIn' | 'YouTubeMusic' | 'Substack' | 'Instagram' | 'Email';
  href: string;
  label: string;
}

export interface RolePillar {
  label: string;
  href: string;
  summary: string;
  key: 'law' | 'vibecoding' | 'creator' | 'essay';
}

export interface PracticeArea {
  title: string;
  tag: string;
  summary: string;
  deliverables: string[];
}

export interface EngagementModel {
  title: string;
  cadence: string;
  description: string;
}

export const CATEGORIES = {
  law: { label: 'Law & Policy', short: 'Law' },
  vibecoding: { label: 'Vibe Coding', short: 'Code' },
  creator: { label: 'Content Creation', short: 'Creator' },
  essay: { label: 'Essays', short: 'Essay' },
} as const;

export type ArticleCategory = keyof typeof CATEGORIES;

/**
 * Centralized site configuration.
 * Update URLs, bio, avatar path, practice details, and newsletter endpoint here.
 */
export const SITE = {
  name: 'Prashant Bhushan',
  handle: '@prashantbasthana',
  monogram: 'PB',
  title: 'Prashant Bhushan — Lawyer, Vibe Coder & Writer',
  description:
    'Lawyer navigating tech and policy, vibe-coding software tools, creating content, and writing essays on law, AI, and building in public.',
  siteUrl: 'https://prashantbhushan.com', // Production domain (overridden automatically on Vercel via VERCEL_PROJECT_PRODUCTION_URL)
  avatarSrc: null as string | null, // Drop a photo in public/avatar.jpg and change this to '/avatar.jpg'
  location: 'India · Remote',
  heroGreeting: 'Lawyer, Vibe Coder & Writer.',
  heroTagline:
    'Counsel for tech and AI startups. On evenings and weekends, I build legal-tech utilities and document the work in writing and video.',
  roles: [
    {
      key: 'law',
      label: 'Lawyer',
      href: '/practice',
      summary: 'Tech contracts, AI governance, IP & founder advisory.',
    },
    {
      key: 'vibecoding',
      label: 'Vibe Coder',
      href: '/projects',
      summary: 'Shipping practical apps, legal-tech tools & CLI utilities.',
    },
    {
      key: 'creator',
      label: 'Content Creator',
      href: '/content',
      summary: 'Build breakdowns, videos, threads & speaking.',
    },
    {
      key: 'essay',
      label: 'Article Writer',
      href: '/articles',
      summary: 'Deep dives on law, AI workflows & modern shipping.',
    },
  ] satisfies RolePillar[],
  nav: [
    { label: 'Articles', href: '/articles' },
    { label: 'Projects', href: '/projects' },
    { label: 'Content', href: '/content' },
    { label: 'Practice', href: '/practice' },
    { label: 'About', href: '/about' },
  ],
  socials: [
    { name: 'GitHub', href: 'https://github.com/prash00000', label: 'GitHub' },
    { name: 'X', href: 'https://x.com/Embargoliving', label: 'X (Twitter)' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/prashant-bhushan-law/', label: 'LinkedIn' },
    { name: 'YouTubeMusic', href: 'https://music.youtube.com/playlist?list=PLWxPb8fPIedU', label: 'YouTube Music' },
    { name: 'Substack', href: 'https://substack.com/@prashantbasthana', label: 'Substack' },
    { name: 'Instagram', href: 'https://instagram.com/prashantbasthana', label: 'Instagram' },
    { name: 'Email', href: 'mailto:officeofprashantbhushan@gmail.com', label: 'Email' },
  ] satisfies SocialLink[],
  newsletter: {
    heading: 'Dispatches',
    description:
      'Occasional notes when a new essay or tool goes live. Zero spam, unsubscribe anytime.',
    actionUrl: '', // Optional: paste your Buttondown / ConvertKit / Substack form POST URL
    placeholderEmail: 'you@domain.com',
  },
  practice: {
    headline: 'Legal Counsel Built for Builders',
    intro:
      'I advise startups, indie builders, and creator-led businesses on technology contracts, intellectual property, privacy compliance, and AI product risk — grounded in hands-on experience writing and shipping code.',
    disclaimer:
      'Disclaimer: Everything published on this website is for informational and educational purposes only. It does not constitute legal advice, nor does viewing or contacting through this site create an attorney-client relationship.',
    contactEmail: 'mailto:officeofprashantbhushan@gmail.com?subject=Advisory%20Inquiry',
    areas: [
      {
        title: 'AI & Product Risk Advisory',
        tag: 'AI & Governance',
        summary:
          'Pragmatic product reviews for AI-native apps, agentic workflows, model terms, and regulatory readiness without slowing down shipping velocity.',
        deliverables: [
          'Pre-launch AI feature & policy risk audit',
          'Acceptable Use, AI disclosures & Terms of Service',
          'Vendor & foundation model API compliance checks',
        ],
      },
      {
        title: 'SaaS & Technology Contracts',
        tag: 'Commercial',
        summary:
          'Clear, plain-English commercial agreements designed to close deals faster rather than trap engineering and sales teams in redline loops.',
        deliverables: [
          'Master Services Agreements (MSA) & SaaS Order Forms',
          'Data Processing Agreements (DPA) & SLAs',
          'API licensing & enterprise pilot agreements',
        ],
      },
      {
        title: 'IP, Open Source & Creator Law',
        tag: 'IP & Media',
        summary:
          'Protecting software, brand assets, and content pipelines while navigating open-source licenses, contributor rights, and sponsorships.',
        deliverables: [
          'OSS license hygiene & dual-licensing strategy',
          'Creator sponsorship, licensing & talent agreements',
          'IP assignment & founder/contractor cleanups',
        ],
      },
      {
        title: 'Privacy & Digital Compliance',
        tag: 'Privacy',
        summary:
          'Lightweight privacy architecture that aligns actual database and analytics telemetry with your public privacy promises.',
        deliverables: [
          'Privacy Policy & cookie consent alignment',
          'Cross-border data transfer & subprocessor maps',
          'User data deletion & retention workflows',
        ],
      },
    ] satisfies PracticeArea[],
    engagements: [
      {
        title: 'Product & Contract Sprint',
        cadence: 'Fixed Scope · 1–2 Weeks',
        description:
          'Rapid review of your app launch, terms, privacy docs, or commercial agreement templates before you ship or fundraise.',
      },
      {
        title: 'Fractional Builder Counsel',
        cadence: 'Monthly Retainer',
        description:
          'Ongoing legal sounding board inside Slack/email for fast-moving founders shipping AI products and closing enterprise pilots.',
      },
      {
        title: 'Workshops & Speaking',
        cadence: 'Events · Podcasts · Teams',
        description:
          'Talks and interactive sessions on legal-tech, vibe coding safely, IP in the age of generative AI, and developer-friendly compliance.',
      },
    ] satisfies EngagementModel[],
  },
  about: {
    bioParagraphs: [
      "I'm Prashant Bhushan (@prashantbasthana) — a practicing lawyer who spends evenings and weekends vibe coding software tools, documenting builds on camera, and writing long-form articles.",
      'Too often, legal thinking and software engineering live in separate worlds. Lawyers rarely read pull requests, and builders rarely read the fine print until an enterprise deal or launch deadline forces them to. I work in the overlap between both.',
      'On this site you will find essays dissecting technology law and AI workflows, small sharp tools I have built from scratch, and videos or threads breaking down how modern AI-assisted software gets made.',
    ],
    nowItems: [
      'Advising early-stage software & AI teams on practical contracts and product risk.',
      'Vibe coding small legal-tech utilities, CLI helpers, and developer productivity apps.',
      'Publishing weekly breakdowns on agentic coding workflows and tech-law trends.',
    ],
  },
} as const;
