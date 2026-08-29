# QuietAid Demo Flow

Target end-to-end hackathon demo (after Phases 1–7+).

## Prerequisites

1. MongoDB running; backend `.env` configured
2. `cd scholarship-finder-backend && npm run seed -- --fresh`
3. Backend on `:3001`, frontend on `:3000`
4. Midnight local stack available when demonstrating Apply Privately (see MIDNIGHT_INTEGRATION.md)
5. One student account and one provider account (role=`provider`)

## Steps

1. **Login as student**
2. Open **Private Eligibility Profile** (`/private-profile`)
3. Enter / load private values (enrollment, income, GPA, flags) — confirm UI says data stays in browser memory
4. Click **Find Private Matches** → `/private-matches`
5. Open **Evergreen Full-Time Scholars Fund** (Midnight-enabled)
6. Click **Apply Privately with Midnight**
7. Confirm disclosure explanation (what is proven vs not shared)
8. Generate **real** Midnight proof / transaction
9. On success: see pseudonymous application (`QA-…`, `Applicant-…`, eligibility verified, identity not disclosed)
10. **Logout / login as provider**
11. Open **Provider Applications** (`/provider/applications`)
12. Confirm: Eligibility verified, Midnight proof valid, Identity hidden, income/GPA/disability/housing **Not disclosed**
13. Provider clicks **Request Contact** / Advance Applicant
14. **Switch to student** → see disclosure request
15. Student approves **Name + Email only** (not address unless chosen)
16. **Switch to provider** → Name + Email visible; private eligibility attributes still absent
17. **Negative path:** student with income above Evergreen max → Apply Privately fails → no verified application created

## Messaging

- Local match % = advisory client scoring, **not** ZK verification
- Midnight success = cryptographic eligibility verification against deployed rules
- Selective disclosure = identity/contact only; never eligibility attributes
