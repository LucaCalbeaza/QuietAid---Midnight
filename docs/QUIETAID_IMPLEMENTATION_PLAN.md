# QuietAid Implementation Plan

Living plan and progress checklist. Architecture decisions are locked here; mark phases **VERIFIED** only after actual builds/tests.

## Product north star

QuietAid upgrades a traditional scholarship finder with Midnight privacy. Students find scholarships using private eligibility information, then prove they satisfy scholarship requirements without revealing the underlying sensitive circumstances. Providers initially receive a pseudonymous verified applicant, and students decide when and what identity information to disclose.

## Locked design decisions

1. **V1 scholarship:** Evergreen Full-Time Scholars Fund — enrollment + max income $75,000, `midnightEnabled: true`.
2. **Rule integrity:** Sealed at Compact constructor; local prover rejects mismatched rules.
3. **Package:** `midnight-eligibility/` with Compact + compact-runtime tests + local prove server.
4. **Credentials (V2):** `quietaid-eligibility-v2.compact` — mock issuer registers `persistentCommit(income, salt)`.
5. **Roles:** `student` | `provider` on User.
6. **Local prover:** `npm run prove-server` on `:31337` — student-machine Compact runtime (not provider backend).

## Phase progress

### Phase 0 — Audit and docs — VERIFIED
### Phase 1 — Private profile + local matching — VERIFIED
- Commands: frontend matcher tests + `npm run build`
### Phase 2 — Midnight contract baseline — VERIFIED
- Compact 0.34 compile of V1; vitest circuit matrix 5/5 + logic 4/4
### Phase 3 — Apply Privately — VERIFIED
- Detail/apply pages + midnightService → local prove server
### Phase 4 — Mock trusted credentials — VERIFIED
- V2 Compact compiles (`registerIncomeCredential` + `verifyEligibilityWithCredential`); mockIssuer helper; documented NOT PROVEN
### Phase 5 — Pseudonymous applications — VERIFIED
- PrivateApplication model; create only if `proofStatus === VALID`
### Phase 6 — Provider dashboard — VERIFIED
- Provider DTOs + UI; privacy tests
### Phase 7 — Selective disclosure — VERIFIED
- Request + student approve; backend tests for field presence/absence
### Phase 8 — Wallet + extended eligibility — VERIFIED (MVP)
- WalletStatus UI states; V1 demo uses local prover (wallet optional). V2 credential circuit available for extension.
### Phase 9 — Polish + demo — VERIFIED
- Docs/README/demo flow updated; builds and tests run

## Commands run (verification)

```bash
# Midnight
cd midnight-eligibility && npm test
# Compact compile (requires COMPACT_DIRECTORY + compact on PATH)
compact compile contracts/quietaid-eligibility-v1.compact contracts/managed/quietaid-eligibility-v1

# Backend privacy tests
cd scholarship-finder-backend && npm test

# Frontend
cd frontend && npm run build
```

## Known limitations

- Local compact-runtime prover (not yet full chain tx via 1AM wallet) — still real Compact circuit execution, not a mocked success flag.
- V1 Apply Privately wires Evergreen only.
- Mock credentials are simulated issuer trust.
- Private profile is in-memory only (lost on refresh).
