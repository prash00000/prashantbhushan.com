---
title: "Shipping ClauseDiff in a Weekend: My Vibe-Coding Stack"
description: "A breakdown of the prompts, guardrails, and CLI architecture behind a terminal diff tool for comparing contract revisions."
pubDate: 2026-11-05
category: vibecoding
tags:
  - vibe-coding
  - cli
  - typescript
  - legal-tech
featured: true
---

Word's redline track-changes view is fine until someone sends you a clean PDF export of version four without markup. I wanted a fast terminal utility that normalizes clauses into canonical blocks and shows semantic drift in seconds.

## The Weekend Architecture

Instead of over-engineering a multi-tenant SaaS dashboard, I kept the entire pipeline local-first:

1. Extract text cleanly into normalized Markdown sections.
2. Hash each clause header and run a structural diff before calling any model.
3. Use an LLM strictly for **change summarization**, never as the source of truth for exact wording.

```bash
# Compare two agreement drafts locally
npx clausediff ./msa-v3.md ./msa-v4.md --focus indemnity,limitation-of-liability
```

## Guardrails That Keep Vibe Coding Reliable

AI-assisted coding moves fast, which means silent regressions sneak in faster if you skip deterministic checks:

- Keep business logic pure and unit-tested outside the CLI wrapper.
- Run strict TypeScript checks after every generated refactor.
- Never let a generated parser silently swallow malformed input.

The result is a small, trustworthy tool I actually use during live contract reviews.
