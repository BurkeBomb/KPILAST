# ERA KPI Dashboard — Pro (True PMB)

**Ops-only**, standalone. All features included.

## Modules
- KPI tiles (ZAR/%), filters, **True PMB** calc
- PMB Evidence Pack (ZIP) per account
- Reason Code Intelligence (plain-English buckets + tips)
- Owner SLA & Workload (per-assignee KPIs)
- Scheme & Option Split (upload `scheme_alias.csv` → `alias,scheme`)
- PMB Data Coverage Meter (ICD-10/DSP/ER/Auth presence)
- High-Value Tariff Watch (3058/3130/1949/1952/0255)
- Appeals Generator (DOCX templates)
- Audit Trail Export, PMB-only CSV, Bulk Notes CSV
- Lightweight RBAC (role selector), POPIA Safe Mode (anonymise in UI/exports)
- Collabtive/Task hook helper (generic POST utility)
- Nightly Inbox Ingest **stub** (`/api/ingest-email`) + Vercel Cron example
- Theming: CTRL Room / MediBurgh

## Quick Start
```bash
npm i
npm run dev
# http://localhost:3000
```

## Vercel Cron (stub inbox ingest)
Add a cron in `vercel.json`:
```json
{
  "crons": [{ "path": "/api/ingest-email", "schedule": "0 2 * * *" }]
}
```

## Files to know
- `/app/page.tsx` — dashboard
- `/app/ops/appeals/page.tsx` — DOCX appeal generator
- `/lib/evidence.ts` — Evidence Pack ZIP via JSZip
- `/lib/exports.ts` — CSV exports (PMB-only, notes, audit)
- `/lib/reasons.ts` — reason buckets + PMB explainer chips
- `/lib/collabtive.ts` — simple POST helper

## Sample data
- `public/data/sample.xlsx` — demo rows
- `public/data/pmb_icd10.csv` — demo PMB ICD-10 prefixes
- `public/data/scheme_alias.csv` — demo scheme alias mapping

---
Built 2025-11-18.
# KPIBomb
# KPILAST
