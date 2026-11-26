---
title: "ClauseDiff CLI"
description: "Local-first terminal diff tool that normalizes contract drafts into structural clause blocks and highlights substantive risk changes."
pubDate: 2026-11-04
status: open-source
domain: cli
stack:
  - TypeScript
  - Node.js
  - Diff Match Patch
tags:
  - vibe-coding
  - cli
  - legal-tech
repoUrl: "https://github.com/prash00000/clausediff"
featured: true
order: 1
---

ClauseDiff solves a recurring headache in commercial negotiations: comparing two contract versions when redlines are missing or stripped across PDF exports.

## What It Does

- Parses headings and numbered clauses into deterministic canonical sections.
- Flags shifted liability caps, indemnity carve-outs, and termination window edits.
- Runs 100% locally on sensitive client agreements with zero cloud upload required.
