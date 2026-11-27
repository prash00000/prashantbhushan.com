---
title: "RetailFlow ERP"
description: "Offline-first Windows desktop ERP, GST billing, inventory, accounting, and Point-of-Sale (POS) app for Indian retailers with GSTR-2B reconciliation and WhatsApp invoice delivery."
pubDate: 2026-11-27
status: live
domain: erp-pos
stack:
  - Electron
  - React 19
  - Zustand
  - IndexedDB
  - Supabase
tags:
  - erp
  - gst
  - offline-first
  - electron
liveUrl: "https://github.com/prash00000/RetailFlow/releases/tag/v1.4.0"
repoUrl: "https://github.com/prash00000/RetailFlow"
featured: true
order: 2
---

Packaged Windows desktop application (`v1.4.0`) unifying retail billing, inventory, statutory GST compliance, financial accounting, and WhatsApp dispatch without requiring constant internet access.

## Core Modules

- **POS & Purchase Recording:** GST invoices and Section 10 Composition Bill of Supply receipts with UPI / Bharat QR standees, quick search (`Ctrl + K`), and Section 194Q compliance checks.
- **Statutory GST Compliance Center:** CGST / SGST / IGST liability vs. eligible ITC tracking, **GSTR-2B Auto-Reconciliation**, Table 4 & 13 summaries, and Section 269ST warnings.
- **Accounting & Financial Statements:** General Ledger, Trial Balance, Trading Account, Profit & Loss Statement, Cash Flow Statement (Indirect Method), and customer/vendor khata ledgers.
- **WhatsApp Bridge & Crash-Safe Storage:** Embedded WhatsApp Web delivery (`whatsapp-web.js`), `.bak` rotation, and 1-click `.rfbackup` / `.json` database backup and CSV exports.
