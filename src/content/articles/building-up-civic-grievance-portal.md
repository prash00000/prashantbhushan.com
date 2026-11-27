---
title: "Building UP Civic Grievance Portal: Statutory Ladders & Zero-Storage Privacy"
description: "Notes on designing a bilingual English/Hindi web platform for Uttar Pradesh citizens to look up grievance officers, verify CUG numbers, and generate RTI Form-A petitions client-side."
pubDate: 2026-11-26
category: vibecoding
tags:
  - legal-tech
  - rti
  - nextjs
featured: true
---

Public grievance portals frequently fail citizens for mundane reasons: outdated officer phone numbers, unclear escalation chains between rural and urban bodies, and bloated forms that require creating accounts just to draft a letter.

With **[UP Civic Grievance Portal](https://up-civic-redressal.vercel.app)** ([source](https://github.com/prash00000/UP-CIVIC-REDRESSAL)), the goal was to make statutory redressal steps discoverable in seconds on a `360px` mobile screen without storing a single byte of personal data.

## Encoding the Administrative Chain

Depending on whether a grievance arises in a gram panchayat, block, municipality, or municipal corporation, the competent officer and escalation path change completely. The app resolves the local hierarchy — from **Secretary, BDO, SDM, CDO, and DM** to **EO, Chairman, Municipal Commissioner, and Mayor** — directly from local election boundaries.

Statutory references are pre-wired to the relevant frameworks rather than left as vague tips:

- **UP Janhit Guarantee Act 2011** (time-bound service delivery)
- **UP Panchayati Raj Act 1947** (rural local governance)
- **UP Municipalities Act 1916** (urban municipal bodies)

## Strict Phone Number Verification Badges

An unverified government CUG number is often worse than no number at all. Every listed contact carries an explicit freshness signal — **verified date**, **unverified**, or **stale (`>90 days`)** — validated via automated data checks (`npm run validate-data`) alongside Vitest and Playwright coverage.

## 100% Client-Side Petition & RTI Generation

Formal complaint letters and **RTI Form-A** applications are assembled entirely inside the browser. No backend database receives citizen names, phone numbers, or grievance descriptions — keeping sensitive civic complaints strictly on the user's own device.
