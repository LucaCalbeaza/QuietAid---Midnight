# QuietAid demo seed

Deterministic demo data for QuietAid. Replaces the need to run the
ScholarshipsInIndia scraper during development and demos.

## What it does

`npm run seed` (from `scholarship-finder-backend/`) inserts **six fictional U.S.
scholarships** into MongoDB using the existing `Scholarship` model and the
`DB_URI` environment variable.

- **Fictional only.** Every provider, amount, deadline, and URL is invented.
  Records are marked with `isDemoData: true` and a `demoDisclaimer`, and each
  description is prefixed with `[FICTIONAL DEMO DATA]`.
- **No real student information** is created or stored.
- **Safe to re-run.** Each record is upserted on the key
  `{ source: "QuietAid Demo Seed", title }`, so re-running updates the existing
  rows instead of creating duplicates. Data from other sources (e.g. the
  scraper) is never touched.

## `--fresh` (destructive reset)

```bash
npm run seed -- --fresh
```

Deletes **every** document in the `scholarships` collection, then inserts only
the six demo scholarships. Use this when you want a clean demo database with
nothing but QuietAid data. Afterwards `GET /api/scholarships` returns exactly
six records.

Plain `npm run seed` (no flag) stays non-destructive.

## Files

| File | Purpose |
|---|---|
| `demoScholarships.data.js` | The six scholarships as plain data (no DB code) |
| `seedDemoScholarships.js` | Runnable script — connects via `db.js`, upserts, prints a summary |

## Private eligibility coverage

The six entries between them exercise all seven private eligibility categories
QuietAid cares about:

| Category | Demonstrated by |
|---|---|
| Household income | Horizon First-Gen Futures Grant, Lone Star Merit & Need Award |
| U.S. state | Golden State Access Scholarship, Lone Star Merit & Need Award |
| Enrollment status | SteadyHome Student Stability Award, Evergreen Full-Time Scholars Fund |
| GPA | Lone Star Merit & Need Award, Evergreen Full-Time Scholars Fund |
| First-generation status | Horizon First-Gen Futures Grant, New Roots Opportunity Scholarship |
| Disability eligibility | Golden State Access Scholarship, New Roots Opportunity Scholarship |
| Housing insecurity | SteadyHome Student Stability Award, New Roots Opportunity Scholarship |

Structured criteria live in `privateEligibility` on each record; public-facing
rules live in `publicRequirements` and the free-text `eligibility` field.

## The scraper is still here

`npm run scrape` (or `node scrapers/index.js`) still works and is unchanged —
it is now **optional**. Use the seed for QuietAid development.
