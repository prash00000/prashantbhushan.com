---
title: "Thinking About Contract Redlines Like Unit Tests"
description: "A practical mental model for reviewing SaaS agreements, liability caps, and AI clauses without getting lost in boilerplate."
pubDate: 2026-10-14
category: law
tags:
  - law
  - contracts
  - saas
featured: true
---

When software engineers review a pull request, they don't rewrite every line of boilerplate—they look at **edge cases, failure modes, and invariants**. Contract review works best the exact same way.

## Three Invariants I Check First

Before reading every recital, I test an agreement against three failure scenarios:

1. **Blast Radius (Limitation of Liability)**: What happens if something breaks badly—is the cap aligned with contract value, and are carve-outs symmetric?
2. **Ownership & Output Rights**: For AI and software tools, who owns inputs, outputs, and fine-tuned weights or templates?
3. **Exit Path**: How hard is it to export customer data and terminate cleanly if the relationship ends?

Treating redlines like a test suite keeps negotiations focused on real operational risk rather than performative edits.
