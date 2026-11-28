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
  law: { label: 'Law & Litigation', short: 'Law' },
  vibecoding: { label: 'Vibe Coding', short: 'Code' },
  creator: { label: 'Notes & Media', short: 'Media' },
  essay: { label: 'Essays', short: 'Essay' },
} as const;

export type ArticleCategory = keyof typeof CATEGORIES;

/**
 * Centralized site configuration grounded in Prashant Bhushan's profiles.
 */
export const SITE = {
  name: 'Prashant Bhushan',
  handle: '@prashantbasthana',
  xHandle: '@Embargoliving',
  monogram: 'PB',
  title: 'Prashant Bhushan | Lawyer, Vibe Coder & Thinker',
  description:
    'Law, litigation & vibe coding. Building civic legal-tech (UP Civic Grievance Portal) and offline-first software (RetailFlow ERP), writing court notes on Substack and X.',
  siteUrl: 'https://prashantbhushancom.vercel.app',
  avatarSrc: '/avatar.jpg' as string | null,
  location: 'Uttar Pradesh, India',
  heroGreeting: 'Lawyer, Vibe Coder & Thinker',
  heroTagline:
    'Law, litigation, strategy & building big. Shipping civic legal-tech and offline-first software, writing weekly notes on Substack & X, and cooking outside the terminal.',
  roles: [
    {
      key: 'law',
      label: 'Law & Litigation',
      href: '/practice',
      summary: 'Constitutional rights, Article 21 fair-trial jurisprudence, and Uttar Pradesh civic-legal research.',
    },
    {
      key: 'vibecoding',
      label: 'Vibe Coding',
      href: '/projects',
      summary: 'Shipping UP Civic Grievance Portal, RetailFlow ERP (v1.4.0), and GYM-ERP.',
    },
    {
      key: 'creator',
      label: 'Notes & Curation',
      href: '/content',
      summary: 'Substack weekly journal, X legal commentary (@Embargoliving) & YT Music rotation.',
    },
    {
      key: 'essay',
      label: 'Writing',
      href: '/articles',
      summary: 'Essays connecting statutory frameworks, courtroom realities, and practical software.',
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
  playlists: [
    {
      title: 'International Songs Only',
      curator: 'IndieArt',
      platform: 'YouTube Music',
      trackCount: 320,
      description: 'Clean A-Z English rotation (YouTube Music & Spotify).',
      url: 'https://music.youtube.com/playlist?list=PLWxPb8fPIedU',
      sampleTracks: [
        "2035 - 14's Vibe, DAN14, KAFE14 & AKA Beats",
        '7 Years - Lukas Graham',
        'Adventure of a Lifetime - Coldplay',
        'Another Love - Tom Odell',
        'Blinding Lights - The Weeknd',
        'Dandelions - Ruth B.',
        'Daylight - David Kushner',
        'Die With A Smile - Lady Gaga & Bruno Mars',
      ],
    },
    {
      title: 'Indian: Chill & Late-Night',
      curator: 'IndieArt',
      platform: 'YouTube Music',
      trackCount: 154,
      description: 'Clean A-Z Indian chill, indie & late-night tracks.',
      url: 'https://music.youtube.com/playlist?list=PLC6YtkuAEOHM',
      sampleTracks: [
        '2AM (Extended) - Zeeshan Ali',
        'Aaftaab - The Local Train',
        'Aahatein - Agnee',
        'Chaand Baaliyan - Aditya A',
        'Cold Hours - aleemrk & Umair',
        'Ehsaas (Acoustic) - Faheem Abdullah',
        'Kamikaze - Nanku & Faizan',
        'Mere Bina (Unplugged) - KK',
      ],
    },
  ],
  newsletter: {
    heading: 'Weekly Journal',
    description:
      'Notes on court rulings, civil liberties, personal boundaries, and new builds via Substack.',
    substackUrl: 'https://substack.com/@prashantbasthana',
    actionUrl: '', // Optional: paste a direct form POST endpoint if desired
    placeholderEmail: 'you@domain.com',
  },
  practice: {
    headline: 'Law, Litigation & Civic Tooling',
    intro:
      'Focused on constitutional and civil liberties research, Uttar Pradesh statutory grievance mechanisms, and software that makes complex public processes and commercial compliance simpler to navigate.',
    disclaimer:
      'Disclaimer: Everything published on this website is for informational and educational purposes only. It does not constitute legal advice, nor does viewing or contacting through this site create an attorney-client relationship.',
    contactEmail: 'mailto:officeofprashantbhushan@gmail.com?subject=Legal%20%2F%20Project%20Inquiry',
    areas: [
      {
        title: 'Constitutional & Fair-Trial Research',
        tag: 'Law & Litigation',
        summary:
          'Tracking High Court and constitutional developments around Article 21 fair-trial rights, unlawful detention, habeas corpus safeguards, and service jurisprudence.',
        deliverables: [
          'Allahabad High Court order & statutory analysis notes',
          'Article 21 victim-rights & detention accountability research',
          'Structured procedural breakdowns for public readers',
        ],
      },
      {
        title: 'Civic Grievance & RTI Systems',
        tag: 'Civic Tech',
        summary:
          'Translating Uttar Pradesh statutory escalation ladders into accessible digital tools without collecting or storing user data.',
        deliverables: [
          'UP Janhit Guarantee Act 2011 & Municipalities Act workflows',
          'Zero-storage client-side RTI Form-A & petition generators',
          'Bilingual English / Hindi legal-tech interface design',
        ],
      },
      {
        title: 'SMB GST & Commercial Ops Workflows',
        tag: 'Tax & ERP',
        summary:
          'Encoding statutory tax and accounting rules directly into offline-first software built for Indian retailers and small businesses.',
        deliverables: [
          'Regular GST & Section 10 Composition billing logic',
          'GSTR-2B reconciliation, Section 194Q & 269ST checks',
          'Audit-ready trial balance, P&L & ledger statements',
        ],
      },
      {
        title: 'Editorial & Strategy Writing',
        tag: 'Writing',
        summary:
          'Clear legal teardowns, engineering postmortems, and reflective weekly notes across Substack and X.',
        deliverables: [
          'Case-law and administrative accountability commentary',
          'Open-source legal-tech & offline-first architecture notes',
          'Long-form essays bridging policy and code',
        ],
      },
    ] satisfies PracticeArea[],
    engagements: [
      {
        title: 'Legal & Civic Research Collaboration',
        cadence: 'Research · Writing',
        description:
          'Collaborating on statutory mapping, RTI/grievance workflows, and public-interest legal-tech documentation.',
      },
      {
        title: 'Software & Tooling Builds',
        cadence: 'Civic Tech · Desktop ERPs',
        description:
          'Designing and shipping fast, offline-first TypeScript/React/Astro apps grounded in real operational constraints.',
      },
      {
        title: 'Direct Inquiries',
        cadence: 'Email · LinkedIn',
        description:
          'Reach out for discussions around litigation research, legal-tech projects, or writing collaborations.',
      },
    ] satisfies EngagementModel[],
  },
  about: {
    bioParagraphs: [
      "I'm Prashant Bhushan, working across law and litigation while vibe coding practical software, thinking in strategy, cooking good food, and building big.",
      'On the legal side, I follow High Court and constitutional jurisprudence closely, from Article 21 fair-trial protections and habeas corpus accountability in Uttar Pradesh to statutory civic grievance ladders and RTI tooling.',
      'On the software side, I build tools that solve concrete ground-level problems: the bilingual UP Civic Grievance Portal (live on Vercel) and RetailFlow ERP, an offline-first Windows desktop GST billing, inventory, and accounting app.',
      'I publish my weekly journal on Substack (@prashantbasthana), post legal thoughts on X (@Embargoliving), and maintain curated International Songs Only (320 tracks) and Indian: Chill & Late-Night (154 tracks) playlists on YouTube Music.',
    ],
    nowItems: [
      'Tracking Allahabad High Court rulings, Article 21 jurisprudence, and civil liberties commentary.',
      'Shipping and refining RetailFlow ERP (v1.4.0) and UP Civic Grievance Portal.',
      'Publishing weekly journal notes on Substack (@prashantbasthana) and short commentary on X (@Embargoliving).',
      'Cooking outside work and curating International Songs Only & Indian: Chill & Late-Night on YouTube Music.',
    ],
  },
} as const;
