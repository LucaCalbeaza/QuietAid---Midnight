# QuietAid — Midnight Hackathon (DDLMA)

QuietAid is a privacy-preserving scholarship matcher built for the Midnight
Hackathon by adapting an existing scholarship-finder app. Students should be able
to find scholarships they qualify for **without disclosing** sensitive details
like household income, disability status, or housing situation.

## Quickstart

```bash
# install
cd frontend && npm install
cd ../scholarship-finder-backend && npm install

# seed fictional demo scholarships (needs MongoDB + backend/.env with DB_URI)
npm run seed              # non-destructive, safe to rerun
npm run seed -- --fresh   # wipe the collection, then insert only the 6 demo records

# run
npm start                      # backend  (scholarship-finder-backend/)
cd ../frontend && npm start    # frontend
```

Full instructions: [`docs/SETUP.md`](./docs/SETUP.md).

## Data

Development and demos run on a **deterministic seed of six fictional U.S.
scholarships** (`npm run seed`) — see
[`scholarship-finder-backend/seed/README.md`](./scholarship-finder-backend/seed/README.md).
Every seeded record is clearly marked fictional; no real student information is
stored. The original ScholarshipsInIndia scraper is still available via
`npm run scrape` but is now optional.

The original app's documentation is preserved in
[`docs/ORIGINAL_APP_README.md`](./docs/ORIGINAL_APP_README.md).
