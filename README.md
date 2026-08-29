# QuietAid — Privacy-Preserving Scholarship Finder

**Midnight Network hackathon project (DDLMA).**

QuietAid upgrades a traditional scholarship finder with Midnight privacy.
Students find scholarships using **private eligibility information**, then
**prove** they satisfy scholarship requirements without revealing the underlying
sensitive circumstances. Providers initially receive a **pseudonymous verified
applicant**, and students decide when and what identity information to disclose.

> There is **no root `package.json`**. Always `cd` into `scholarship-finder-backend`,
> `frontend`, or `midnight-eligibility` before running `npm` commands.

Privacy model: [`docs/PRIVACY_MODEL.md`](docs/PRIVACY_MODEL.md) ·  
Demo script: [`docs/DEMO_FLOW.md`](docs/DEMO_FLOW.md) ·  
Midnight details: [`docs/MIDNIGHT_INTEGRATION.md`](docs/MIDNIGHT_INTEGRATION.md)

---

## Before vs after

| BEFORE (legacy) | AFTER (QuietAid privacy path) |
|-----------------|-------------------------------|
| Sensitive profile stored in MongoDB | Private eligibility profile in **browser memory only** |
| Server-side recommendation scoring | **Local** private matcher (no private profile POST) |
| Cleartext eligibility assumptions | **Midnight** Compact proof of public rules vs private witnesses |
| Traditional identity on applications | Pseudonymous application + selective disclosure |

Legacy profile + **Legacy Recs** (`GET /api/scholarships/recommendations`) remain for contrast.

---

## What you can do

| Feature | Description |
|---------|-------------|
| Browse scholarships | Six fictional U.S. demo scholarships |
| Private Profile | In-memory eligibility (enrollment, income, GPA, flags) — not saved to Mongo |
| Private Matches | Client-side scoring against public scholarship rules |
| Apply Privately | Evergreen fund → real Compact eligibility proof → pseudonymous app |
| My Applications | Student view + selective disclosure responses |
| Provider dashboard | Sees verification / proof status; not income, GPA, etc. |
| Selective disclosure | Provider requests contact; student chooses Name / Email / … |
| Legacy Recs | Old server-side matcher against Mongo profile |
| Sentiment | VADER badges on scholarship cards (unchanged) |

**Midnight V1 scholarship:** Evergreen Full-Time Scholars Fund  
Rules proven privately: **full-time enrollment** + **household income ≤ $75,000**.

---

## Repository layout

```
.
├── frontend/                         # React app — http://localhost:3000
├── scholarship-finder-backend/       # Express API — http://localhost:3001
├── midnight-eligibility/             # Compact contracts + local prove server (:31337)
├── docs/                             # Privacy, demo flow, Midnight notes
└── .agents/skills/                   # Midnight development skills
```

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| **Node.js 18+** | Frontend + backend |
| **Node.js ≥ 22** | `midnight-eligibility` (prove server / Compact runtime) |
| **npm** | Per-package install |
| **MongoDB** | Local or any URI you control |

```bash
# macOS example
brew services start mongodb-community
```

You need **four processes** for the full privacy demo: MongoDB, API, Midnight prover, frontend.

---

## How to run (step by step)

### 1. Clone

```bash
git clone https://github.com/LucaCalbeaza/Midnight-Hackathon---DDLMA.git
cd Midnight-Hackathon---DDLMA
```

### 2. Backend env + install

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

### 3. Seed data

Still in `scholarship-finder-backend/`:

```bash
npm run seed -- --fresh          # exactly 6 fictional scholarships
npm run seed:provider            # provider@quietaid.demo / Provider1!demo
```

> Do **not** run `npm run seed` from the repo root — there is no root `package.json`.

### 4. Start the API (terminal 1)

```bash
cd scholarship-finder-backend
npm start
```

Check: [http://localhost:3001](http://localhost:3001) → `Welcome to Scholarship Finder Backend`.

### 5. Start the Midnight prover (terminal 2)

Required for **Apply Privately**. Use Node ≥ 22.

```bash
cd midnight-eligibility
npm install
npm run prove-server
```

Check: [http://127.0.0.1:31337/health](http://127.0.0.1:31337/health) → `{"ok":true,...}`.

This runs the **real Compact eligibility circuit** via `@midnight-ntwrk/compact-runtime` on your machine. It is not the scholarship provider backend and does not write private values to MongoDB.

### 6. Start the frontend (terminal 3)

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:3001
```

Optional (defaults to the local prover):

```env
REACT_APP_MIDNIGHT_PROVER_URL=http://127.0.0.1:31337
```

```bash
npm start
```

App: [http://localhost:3000](http://localhost:3000).

---

## Demo walkthrough

### A. Student — private apply (success path)

1. Open [http://localhost:3000](http://localhost:3000) → **Register**.

   Example student:

   | Field | Value |
   |-------|--------|
   | Name | Maya Khan |
   | Email | `maya.student@quietaid.demo` |
   | Password | `Student1!demo` |
   | Education | undergraduate |
   | Institution | Evergreen State University |
   | GPA | 3.7 |
   | DOB | 2003-05-12 |
   | Gender | Female |
   | Country | United States |

2. **Private Profile** — keep in browser memory only:

   | Field | Value (success) |
   |-------|-----------------|
   | Enrollment | Full-Time |
   | Household income | `50000` (≤ 75000) |
   | GPA | `3.7` |

3. **Find Private Matches** → open **Evergreen Full-Time Scholars Fund**.
4. **Apply Privately with Midnight** → generate proof (prover must be running).
5. Expect: Application `QA-…`, pseudonym `Applicant-…`, Eligibility verified, Identity not disclosed.
6. **My Applications** to review.

**Failure demo:** set income `90000` or Part-Time → proof fails → no verified application.

### B. Provider — verify + request contact

1. Logout → login as:

   | Email | Password |
   |-------|----------|
   | `provider@quietaid.demo` | `Provider1!demo` |

2. **Provider** → open the application.
3. Confirm: Eligibility **VERIFIED**, Midnight **VALID**, Identity **HIDDEN**, income/GPA/disability/housing **Not disclosed**.
4. **Request Contact**.

### C. Selective disclosure

1. Login as student → **My Applications**.
2. Approve **Name** + **Email** only.
3. Login as provider again → Name + Email visible; private eligibility still hidden.

Full script: [`docs/DEMO_FLOW.md`](docs/DEMO_FLOW.md).

---

## Main UI routes

| Route | Who | Purpose |
|-------|-----|---------|
| `/scholarships` | Anyone | Browse demo scholarships |
| `/scholarships/:id` | Anyone | Details + Apply Privately (if Midnight-enabled) |
| `/private-profile` | Student | In-memory private eligibility |
| `/private-matches` | Student | Local match scores |
| `/my-applications` | Student | Apps + disclosure |
| `/provider/applications` | Provider | Provider-safe dashboard |
| `/recommendations` | Student | **LEGACY** server-side matching |
| `/dashboard`, `/edit-profile` | Student | **LEGACY** Mongo account profile |

---

## API overview

| Prefix | Purpose |
|--------|---------|
| `/api/auth/*` | Register / login / logout (HTTP-only JWT cookie) |
| `/api/users/*` | Account profile (**LEGACY** cleartext fields may exist) |
| `/api/scholarships` | Public scholarship list + rules |
| `/api/scholarships/recommendations` | **LEGACY** server matching |
| `/api/private-applications` | Pseudonymous apps (student); disclose endpoint |
| `/api/provider/*` | Provider list/detail + request disclosure |
| `/api/sentiment` | VADER helpers |

Provider responses are explicit DTOs: no `studentId`, income, GPA, or other private eligibility fields.

---

## Scripts

**Backend** (`scholarship-finder-backend/`)

```bash
npm start                 # API on :3001
npm run dev               # nodemon
npm run seed              # upsert 6 demo scholarships
npm run seed -- --fresh   # wipe + insert exactly 6
npm run seed:provider     # create/update provider demo user
npm test                  # privacy / disclosure unit tests
```

**Frontend** (`frontend/`)

```bash
npm start
npm run build
npm test                  # includes privateMatcher tests
```

**Midnight** (`midnight-eligibility/`)

```bash
npm test                  # Compact circuit + logic matrix
npm run prove-server      # local prover on :31337
npm run compile           # needs Compact compiler on PATH (see docs/MIDNIGHT_INTEGRATION.md)
```

---

## Environment variables

### Backend (`scholarship-finder-backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_URI` | Yes* | MongoDB URI (*defaults to local `scholarship-finder`) |
| `JWT_SECRET` | Yes | Auth signing secret |
| `JWT_EXPIRES_IN` | No | e.g. `1d` |
| `PORT` | No | Default `3001` |
| `CLIENT_URL` | No | CORS origin (default `http://localhost:3000`) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_URL` | Yes | Backend origin, e.g. `http://localhost:3001` |
| `REACT_APP_MIDNIGHT_PROVER_URL` | No | Default `http://127.0.0.1:31337` |

Do not commit `.env` files.

---

## Reviewer checklist

- [ ] MongoDB up; API starts without DB errors
- [ ] Seed from **`scholarship-finder-backend/`**: `npm run seed -- --fresh` → 6 records
- [ ] `npm run seed:provider` works
- [ ] Prove server health OK on `:31337`
- [ ] Frontend on `:3000` talks to API
- [ ] Student private apply on Evergreen succeeds with eligible profile
- [ ] Ineligible profile fails; no verified application created
- [ ] Provider sees verified + hidden identity/sensitive fields
- [ ] After Name+Email disclosure, provider sees only those fields

---

## Known limitations

- Demo scholarships are **fictional**.
- Private eligibility lives in **browser memory** (lost on refresh) — by design for the MVP.
- A ZK/Compact proof does **not** prove real-world truth of self-entered data; V2 mock credentials simulate issuer trust. See [`docs/PRIVACY_MODEL.md`](docs/PRIVACY_MODEL.md).
- Apply Privately V1 is wired for **Evergreen** only.
- Local prove server = real Compact circuit execution; browser wallet / on-chain broadcast is optional (see Wallet UI on the apply page).

---

## License

Baseline backend package metadata uses ISC; treat this hackathon fork as
source-available for review unless a root `LICENSE` is added.
