---
title: "Shipping RetailFlow ERP: Offline-First GST, Ledgers & WhatsApp Delivery"
description: "Inside v1.4.0 of RetailFlow ERP: pairing Electron, React 19, Zustand, and IndexedDB with statutory Indian GST compliance and local .bak database backups."
pubDate: 2026-11-27
category: vibecoding
tags:
  - erp
  - electron
  - react
featured: true
---

Indian retail shops rarely fail for lack of cloud dashboards — they struggle when internet drops mid-billing, when GSTR-2B reconciliation takes a weekend, or when customer udhar/khata reminders require manual WhatsApp copy-pasting.

**[RetailFlow ERP](https://github.com/prash00000/RetailFlow)** (now at `v1.4.0` for Windows) puts POS billing, inventory, statutory GST reporting, accounting statements, and WhatsApp dispatch in one offline-first desktop package.

## Encoding Indian Statutory Tax Rules

Billing software for Indian SMBs has to handle real compliance edges cleanly:

- **Taxpayer modes:** Regular GST taxpayers, Section 10 Composition Scheme dealers (Retail/Trader, Restaurant, Services, Manufacturer), and Non-GST shops.
- **Reconciliation & thresholds:** Output CGST / SGST / IGST vs. eligible Input Tax Credit (ITC), **GSTR-2B Auto-Reconciliation**, Table 4 & 13 summaries, plus **Section 194Q** and **Section 269ST** warnings.
- **Accounting statements:** General Ledger, Trial Balance, Trading Account, Profit & Loss, and indirect Cash Flow statements derived from actual vouchers.

## Crash-Safe Local Storage + Multi-Business Workspaces

Built on **Electron**, **React 19**, **Zustand**, and **IndexedDB** (`idb`), the app keeps local master databases protected with automatic `.bak` rotation, 1-click `.rfbackup` / `.json` single-file restore, and structured CSV exports to `Documents\RetailFlow_Exports`. Multi-business workspaces keep separate ledgers, stock registers, and invoice numbering series isolated.

## Embedded WhatsApp Invoice Bridge

Pairing via QR inside the embedded `whatsapp-web.js` bridge lets store owners auto-send invoices upon billing, dispatch customer/vendor statements, and send automated daily closing summaries without leaving the POS screen.
