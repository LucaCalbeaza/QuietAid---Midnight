# QuietAid — Privacy-Preserving Scholarship Finder

**Midnight Network hackathon project (DDLMA).**

QuietAid is a privacy-preserving scholarship matcher built by adapting an existing
React + Express + MongoDB scholarship-finder app. The goal: let students find
scholarships they qualify for **without disclosing** sensitive details like
household income, disability status, first-generation status, or housing
situation.

QuietAid upgrades a traditional scholarship finder with Midnight privacy.
Students find scholarships using private eligibility information, then prove they
satisfy scholarship requirements without revealing the underlying sensitive
circumstances. Providers initially receive a pseudonymous verified applicant,
and students decide when and what identity information to disclose.

> Reviewers: start here for what the app does, how to run it locally, and where
> the code lives. Privacy architecture: [`docs/PRIVACY_MODEL.md`](docs/PRIVACY_MODEL.md).
> Implementation progress: [`docs/QUIETAID_IMPLEMENTATION_PLAN.md`](docs/QUIETAID_IMPLEMENTATION_PLAN.md).

---

## Before vs after

| BEFORE (legacy) | AFTER (QuietAid privacy path) |
|-----------------|-------------------------------|
| Sensitive profile stored in MongoDB | Private eligibility profile in **browser memory only** |
| Server-side recommendation scoring | **Local** private matcher (no private profile POST) |
| Cleartext eligibility assumptions | **Midnight** ZK proof of public rules vs private witnesses |
| Traditional identity on applications | Pseudonymous application + selective disclosure |

Legacy cleartext profile and `GET /api/scholarships/recommendations` remain for
demo contrast; they are marked **LEGACY** and are not the QuietAid apply path.

---

## Why this exists

Scholarship matching needs sensitive profile fields (GPA, household income, U.S.
state, enrollment status, first-generation status, disability status, housing
insecurity). QuietAid proves eligibility **without** exposing those attributes
to providers — selective disclosure and zero-knowledge proofs instead of sending
a full private profile to the scholarship provider.

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
| Midnight | Compact eligibility contract in `midnight-eligibility/`; skills under `.agents/skills/` |

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
├── midnight-eligibility/              # Compact V1 eligibility + tests (Node ≥ 22)
├── docs/
│   ├── SETUP.md                       # QuietAid setup guide
│   ├── QUIETAID_IMPLEMENTATION_PLAN.md
│   ├── PRIVACY_MODEL.md
│   ├── MIDNIGHT_INTEGRATION.md
│   ├── DEMO_FLOW.md
│   └── ORIGINAL_APP_README.md         # Upstream scholarship-finder notes
└── .agents/skills/                    # Midnight Network agent skills
```

---

## Prerequisites

- **Node.js** 18+ for the classic frontend/backend path (LTS recommended)
- **Node.js ≥ 22** for Midnight (`midnight-eligibility/`) — required by Midnight wallet SDK
- **npm**
- **MongoDB** running locally (or a connection string you control)
- **Docker** + Compact compiler for local Midnight prove/deploy (see `.agents/skills/midnight-environment-setup`)

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

### 6. Midnight local prover (required for Apply Privately)

In a third terminal (Node ≥ 22):

```bash
cd midnight-eligibility
npm install
npm run prove-server
# listens on http://127.0.0.1:31337 — real Compact circuit execution
```

Optional provider demo account:

```bash
cd scholarship-finder-backend
npm run seed:provider
# default: provider@quietaid.demo / Provider1!demo
```

### 7. Try the product

**QuietAid privacy path (preferred demo):** see [`docs/DEMO_FLOW.md`](docs/DEMO_FLOW.md).

1. Open the app → **Scholarships** (six demo records).
2. **Register** / login as a student.
3. Open **Private Profile** → enter eligibility in browser memory.
4. **Private Matches** → local scoring (not ZK).
5. Open Evergreen → **Apply Privately** when Midnight is configured.
6. Provider dashboard → verified + identity hidden → selective disclosure.

**Legacy path (before Midnight):** Recommendations still call the server-side matcher against the Mongo profile.

---

## API overview

| Prefix | Purpose |
|--------|---------|
| `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout` | Auth (HTTP-only cookie JWT) |
| `GET /api/users/me`, user update routes | Profile |
| `GET /api/scholarships` | Browse / list |
| `GET /api/scholarships/recommendations` | **LEGACY** cleartext matching |
| `/api/private-applications` | Pseudonymous applications (student) |
| `/api/provider` | Provider-safe application views + disclosure request |
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
- A ZK proof does **not** make self-entered data true — mock credentials simulate
  issuer trust. See [`docs/PRIVACY_MODEL.md`](docs/PRIVACY_MODEL.md).
- Legacy server matching: `scholarship-finder-backend/routes/recommendations.js`.
- QuietAid docs: [`docs/SETUP.md`](docs/SETUP.md),
  [`docs/QUIETAID_IMPLEMENTATION_PLAN.md`](docs/QUIETAID_IMPLEMENTATION_PLAN.md),
  [`docs/MIDNIGHT_INTEGRATION.md`](docs/MIDNIGHT_INTEGRATION.md),
  [`docs/DEMO_FLOW.md`](docs/DEMO_FLOW.md).

---

## License

Baseline backend package metadata uses ISC; treat this hackathon fork as
source-available for review unless a root `LICENSE` is added.
