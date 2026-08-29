# DDLMA — Privacy-Aware Scholarship Finder

**Midnight Network hackathon project.** A full-stack scholarship discovery app that matches students to opportunities using personal eligibility data (GPA, income, education level, location, and more). The baseline is a working React + Express + MongoDB product; Midnight skills and tooling live in-repo so we can move sensitive matching toward privacy-preserving (ZK) flows on Midnight.

> Reviewers: start here for what the app does, how to run it locally, and where the code lives.

---

## Why this exists

Scholarship matching needs sensitive profile fields (GPA, household income, caste/category, gender, date of birth). Today that data lives in a conventional backend. On Midnight, the long-term direction is to prove eligibility **without** exposing those attributes in the clear — selective disclosure and zero-knowledge proofs instead of dumping a full profile to a server.

**Current status:** the scholarship finder (browse, auth, profile, recommendations, scrapers, sentiment) runs as a classic web app. Midnight Compact contracts / wallet flows are not wired into the UI yet; `.agents/skills/` holds Midnight development skills for the next phase.

---

## Features (baseline app)

| Area | What you get |
|------|----------------|
| **Browse** | List scholarships scraped from public sources (title, amount, eligibility, links) |
| **Auth** | Register / login / logout with JWT cookies |
| **Profile** | Education, GPA, income, location, major, and related fields |
| **Recommendations** | Score scholarships against the logged-in user’s profile |
| **Sentiment** | VADER-based sentiment on scholarship text (shown in the UI) |
| **Scrapers** | Node scrapers (Cheerio / Puppeteer) to populate MongoDB |

---

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 19, React Router, MUI, Axios, React Hook Form + Yup |
| Backend | Node.js, Express 5, Mongoose, JWT (`express-jwt`), bcrypt, CORS, Helmet |
| Database | MongoDB |
| Scraping / NLP | Cheerio, Puppeteer, `vader-sentiment` |
| Midnight (planned) | Compact contracts, Midnight.js / wallet tooling (skills under `.agents/skills/`) |

---

## Repository layout

```
.
├── frontend/                      # React CRA app (port 3000)
│   └── src/
│       ├── components/            # Nav, forms, scholarship cards, sentiment
│       ├── pages/                 # Scholarships, recommendations, profile
│       └── utils/axiosInstance.js # API client (credentials + base URL)
├── scholarship-finder-backend/    # Express API (port 3001)
│   ├── routes/                    # auth, users, scholarships, recommendations, sentiment
│   ├── models/                    # User, Scholarship
│   ├── scrapers/                  # Seed scholarships into MongoDB
│   ├── middleware/                # JWT auth, validation
│   └── server.js
├── docs/ORIGINAL_APP_README.md    # Upstream scholarship-finder notes
└── .agents/skills/                # Midnight Network agent skills
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

### 3. Seed scholarships (optional but recommended)

Run **before** or while the API is down — scrapers write directly to MongoDB:

```bash
cd scholarship-finder-backend
node scrapers/index.js
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

1. Open the app → you land on **Scholarships**.
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
| ` /api/sentiment` | Sentiment helpers |

CORS allows `CLIENT_URL` (default `http://localhost:3000`) with credentials.

---

## Environment variables

### Backend (`scholarship-finder-backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_URI` | Yes* | MongoDB URI (*defaults to local `scholarship-finder` DB) |
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
- [ ] `node scrapers/index.js` populates scholarships (or DB already has data)  
- [ ] Frontend talks to API (`REACT_APP_API_URL` correct)  
- [ ] Register → login → scholarships list loads  
- [ ] Recommendations page returns ranked matches for the profile  
- [ ] Logout clears the session  

---

## Scripts

**Backend**

```bash
npm start          # node server.js
npm run dev        # nodemon
node scrapers/index.js
```

**Frontend**

```bash
npm start          # CRA dev server
npm run build      # production build
npm test
```

---

## Notes & known limitations

- Scrapers depend on external sites; structure or availability can change.
- Matching logic lives in `scholarship-finder-backend/routes/recommendations.js` (server-side scores against stored profile fields).
- Original upstream setup notes: [`docs/ORIGINAL_APP_README.md`](docs/ORIGINAL_APP_README.md).
- Midnight privacy layer (Compact / wallet / selective disclosure) is the hackathon direction, not yet the default runtime path of this README’s Quick start.

---

## License

Baseline backend package metadata uses ISC; treat this hackathon fork as source-available for review unless a root `LICENSE` is added.
