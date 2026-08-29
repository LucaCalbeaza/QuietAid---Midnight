# QuietAid — Privacy-Preserving Scholarship Finder

**Midnight Network hackathon project (DDLMA).**

QuietAid is a privacy-preserving scholarship matcher built by adapting an existing
React + Express + MongoDB scholarship-finder app. The goal: let students find
scholarships they qualify for **without disclosing** sensitive details like
household income, disability status, first-generation status, or housing
situation.

The baseline finder (browse, auth, profile, recommendations, sentiment) runs
today as a classic web app against MongoDB, seeded with fictional demo data.
Midnight development skills and tooling live in-repo under `.agents/skills/` for
the next phase.

> Reviewers: start here for what the app does, how to run it locally, and where
> the code lives.

---

## Why this exists

Scholarship matching needs sensitive profile fields (GPA, household income, U.S.
state, enrollment status, first-generation status, disability status, housing
insecurity). Today that data lives in a conventional backend. On Midnight, the
direction is to prove eligibility **without** exposing those attributes in the
clear — selective disclosure and zero-knowledge proofs instead of sending a full
profile to a server.

**Current status:** the scholarship finder runs as a classic web app. It is
seeded with six fictional U.S. demo scholarships (see below). **Midnight Compact
contracts and wallet integration are not implemented yet** — `.agents/skills/`
holds the Midnight development skills for that work.

---

## Features (baseline app)

| Area | What you get |
|------|----------------|
| **Browse** | List scholarships with title, award amount, deadline, provider, public eligibility requirements, and links |
| **Demo seed** | `npm run seed -- --fresh` loads exactly six fictional U.S. demo scholarships into MongoDB |
| **Auth** | Register / login / logout with JWT cookies |
| **Profile** | Education level, GPA, income, location, major, and related fields |
| **Recommendations** | Score scholarships against the logged-in user's profile |
| **Sentiment** | VADER-based sentiment on scholarship text (shown in the UI) |
| **Legacy scraper** | Optional Node scraper (Cheerio / Puppeteer) — not used for the QuietAid demo |

---

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 19, React Router, MUI, Axios, React Hook Form + Yup |
| Backend | Node.js, Express 5, Mongoose, JWT (`express-jwt`), bcrypt, CORS, Helmet |
| Database | MongoDB + deterministic demo seed (`scholarship-finder-backend/seed/`) |
| Legacy scraping / NLP | Cheerio, Puppeteer, `vader-sentiment` (scraper optional) |
| Midnight (planned, not yet implemented) | Compact contracts, Midnight.js / wallet tooling (skills under `.agents/skills/`) |

---

## Repository layout

```
.
├── frontend/                          # React CRA app (port 3000)
│   └── src/
│       ├── components/                # Nav, forms, scholarship cards, sentiment
│       ├── pages/                     # Scholarships, recommendations, profile
│       └── utils/axiosInstance.js     # API client (credentials + base URL)
├── scholarship-finder-backend/        # Express API (port 3001)
│   ├── routes/                        # auth, users, scholarships, recommendations, sentiment
│   ├── models/                        # User, Scholarship
│   ├── seed/                          # QuietAid demo seed (6 fictional U.S. scholarships)
│   │   ├── demoScholarships.data.js   # the six records as plain data
│   │   ├── seedDemoScholarships.js    # runnable script (npm run seed [-- --fresh])
│   │   └── README.md
│   ├── scrapers/                      # Optional legacy scraper
│   ├── middleware/                    # JWT auth, validation
│   └── server.js
├── docs/
│   ├── SETUP.md                       # QuietAid setup guide
│   └── ORIGINAL_APP_README.md         # Upstream scholarship-finder notes
└── .agents/skills/                    # Midnight Network agent skills (next phase)
```

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm**
- **MongoDB** running locally (or a connection string you control)

```bash
# macOS (Homebrew) example
brew services start mongodb-community
```

---

## Quick start

### 1. Clone

```bash
git clone https://github.com/LucaCalbeaza/Midnight-Hackathon---DDLMA.git
cd Midnight-Hackathon---DDLMA
```

### 2. Backend

```bash
cd scholarship-finder-backend
npm install
```

Create `scholarship-finder-backend/.env`:

```env
PORT=3001
DB_URI=mongodb://localhost:27017/scholarship-finder
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:3000
```

### 3. Seed demo scholarships (recommended)

```bash
cd scholarship-finder-backend
npm run seed -- --fresh
```

This wipes the local `scholarships` collection and inserts **exactly six
fictional U.S. demo scholarships** using the `Scholarship` model and your
`DB_URI`. Every record is clearly marked as fictional demo data (`isDemoData:
true`, a disclaimer, and a `[FICTIONAL DEMO DATA]` prefix on each description) —
**these are illustrative examples, not real scholarship opportunities**, and no
real student information is stored. Between them the six records cover the
private eligibility categories QuietAid focuses on: household income, U.S. state,
enrollment status, GPA, first-generation status, disability eligibility, and
housing insecurity.

Re-run any time:

```bash
npm run seed              # non-destructive upsert — safe to repeat, leaves other data alone
npm run seed -- --fresh   # destructive reset — back to exactly the six demo records
```

After `--fresh`, `GET /api/scholarships` returns exactly six records. See
[`scholarship-finder-backend/seed/README.md`](scholarship-finder-backend/seed/README.md)
for the full list and which private eligibility category each entry demonstrates.

#### Optional: legacy scraper

The original ScholarshipsInIndia scraper is still present but **optional** and is
not used for the QuietAid demo:

```bash
cd scholarship-finder-backend
npm run scrape        # or: node scrapers/index.js
```

### 4. Start the API

```bash
cd scholarship-finder-backend
npm start
# or: npm run dev   # nodemon
```

API base: `http://localhost:3001`
Health check: open `/` — you should see `Welcome to Scholarship Finder Backend`.

### 5. Frontend

In a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:3001
```

```bash
npm start
```

App: [http://localhost:3000](http://localhost:3000) (CRA may open this automatically).

### 6. Try the product

1. Open the app → you land on **Scholarships** (the six demo records).
2. **Register** with a full profile (education, location, etc.).
3. Open **Recommendations** for profile-matched results.
4. Use **Dashboard / Edit profile** to adjust matching inputs.

---

## API overview

| Prefix | Purpose |
|--------|---------|
| `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout` | Auth (HTTP-only cookie JWT) |
| `GET /api/users/me`, user update routes | Profile |
| `GET /api/scholarships` | Browse / list |
| `GET /api/scholarships/recommendations` | Auth-required matching |
| `/api/sentiment` | Sentiment helpers |

CORS allows `CLIENT_URL` (default `http://localhost:3000`) with credentials.

---

## Environment variables

### Backend (`scholarship-finder-backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_URI` | Yes* | MongoDB URI (*defaults to local `scholarship-finder` DB); used by both the API and the seed script |
| `JWT_SECRET` | Yes | Signing secret for auth tokens |
| `JWT_EXPIRES_IN` | No | e.g. `1d` |
| `PORT` | No | Default `3001` |
| `CLIENT_URL` | No | Frontend origin for CORS (default `http://localhost:3000`) |
| `NODE_ENV` | No | Set `production` for secure cookies |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_URL` | Yes | Backend origin, e.g. `http://localhost:3001` (no trailing `/api`) |

Do not commit `.env` files (they are gitignored).

---

## Demo checklist for reviewers

- [ ] MongoDB is up; backend starts without connection errors
- [ ] `npm run seed -- --fresh` reports `inserted: 6`
- [ ] `GET /api/scholarships` returns exactly six records, all marked `isDemoData: true`
- [ ] Frontend talks to API (`REACT_APP_API_URL` correct)
- [ ] Register → login → scholarships list loads (the six demo records)
- [ ] Recommendations page returns ranked matches for the profile
- [ ] Logout clears the session

---

## Scripts

**Backend** (`scholarship-finder-backend/`)

```bash
npm start                  # node server.js
npm run dev                # nodemon
npm run seed               # upsert the 6 demo scholarships (non-destructive)
npm run seed -- --fresh    # wipe collection, then insert exactly the 6 demo scholarships
npm run scrape             # optional: legacy ScholarshipsInIndia scraper
```

**Frontend** (`frontend/`)

```bash
npm start          # CRA dev server
npm run build      # production build
npm test
```

---

## Notes & known limitations

- **The QuietAid demo scholarships are fictional.** The six seeded records are
  illustrative examples for the demo, not real opportunities, and contain no real
  student information.
- **The Midnight privacy layer (Compact contracts, wallet integration, selective
  disclosure) is the hackathon direction and is not yet implemented.** The Quick
  start above runs the classic web-app path.
- The legacy scraper depends on external sites; structure or availability can
  change. It is optional and not part of the QuietAid demo path.
- Matching logic lives in `scholarship-finder-backend/routes/recommendations.js`
  (server-side scores against stored profile fields).
- QuietAid setup guide: [`docs/SETUP.md`](docs/SETUP.md). Original upstream setup
  notes: [`docs/ORIGINAL_APP_README.md`](docs/ORIGINAL_APP_README.md).

---

## License

Baseline backend package metadata uses ISC; treat this hackathon fork as
source-available for review unless a root `LICENSE` is added.
