# QuietAid — setup

QuietAid is a privacy-preserving scholarship matcher for the Midnight Hackathon,
adapted from an existing scholarship-finder app. Instead of scraping real Indian
scholarship listings, QuietAid runs on a **deterministic demo seed** of fictional
U.S. scholarships that exercise private eligibility categories (household income,
U.S. state, enrollment status, GPA, first-generation status, disability, housing
insecurity).

The original app's setup notes are preserved in
[`ORIGINAL_APP_README.md`](./ORIGINAL_APP_README.md). This file is the current
one to follow.

## Prerequisites

- Node.js (18+)
- A running MongoDB instance (local `mongod`, or a connection string)

## 1. Install dependencies

```bash
cd frontend && npm install
cd ../scholarship-finder-backend && npm install
```

## 2. Environment files

`frontend/.env`

```
REACT_APP_API_URL=http://localhost:3001
```

`scholarship-finder-backend/.env`

```
PORT=3001
DB_URI=mongodb://localhost:27017/scholarship-finder
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
```

## 3. Seed the demo data

From `scholarship-finder-backend/`:

```bash
npm run seed
```

This inserts **six fictional U.S. scholarships** into MongoDB using the
`Scholarship` model and your `DB_URI`.

- All records are **fictional demo data** — marked with `isDemoData: true`, a
  `demoDisclaimer`, and a `[FICTIONAL DEMO DATA]` prefix on every description.
  No real student information is stored.
- The command is **safe to re-run**: each record is upserted on
  `{ source: "QuietAid Demo Seed", title }`, so re-running updates rather than
  duplicates. It never touches data from other sources.

### Clean reset

```bash
npm run seed -- --fresh
```

Deletes **all** scholarships from the collection, then inserts only the six
demo records — `GET /api/scholarships` will return exactly six. Use this to
clear out any previously scraped data. Plain `npm run seed` (no flag) is
non-destructive.

See [`scholarship-finder-backend/seed/README.md`](../scholarship-finder-backend/seed/README.md)
for the list of scholarships and which private eligibility category each one
demonstrates.

## 4. (Optional) Run the legacy scraper instead

The ScholarshipsInIndia scraper is still included but is **no longer required**.
If you want real scraped listings instead of / alongside the demo seed:

```bash
npm run scrape        # from scholarship-finder-backend/
# or: node scrapers/index.js
```

## 5. Run the backend

From `scholarship-finder-backend/`:

```bash
npm start        # or: npm run dev  (nodemon)
```

## 6. Run the frontend

In a separate terminal:

```bash
cd frontend
npm start
```

Open http://localhost:3000 and browse the seeded scholarships.
