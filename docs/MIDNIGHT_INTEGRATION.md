# QuietAid Midnight Integration

## Status

| Item | Status |
|------|--------|
| Compact V1 eligibility contract | **VERIFIED** — compiles with Compact 0.34; circuit tests pass |
| Compact V2 + mock credential | **VERIFIED** — compiles; mock issuer helper present |
| Local prove server | `midnight-eligibility` → `npm run prove-server` (:31337) |
| React `midnightService` | Calls local prover; never posts private profile to Express for matching |
| Browser wallet | Optional UI states (`WalletStatus`); V1 demo uses local prover |

## V1 design

**Contract:** [`midnight-eligibility/contracts/quietaid-eligibility-v1.compact`](../midnight-eligibility/contracts/quietaid-eligibility-v1.compact)

- Private witnesses: `enrolled`, `householdIncome`
- Sealed public rules: `requiresEnrollment`, `maximumIncome` (Evergreen: true, 75000)
- Public outcome: `verifiedCount` increment only — **no** private values disclosed

**Rule integrity:** Constructor seals rules. Local prover rejects requests whose rules differ from Evergreen V1 binding.

## What is public vs private

| Public | Private |
|--------|---------|
| requiresEnrollment, maximumIncome | enrolled, householdIncome |
| verifiedCount, proofStatus, execution metadata | credential salt (V2) |
| Approved commitment *membership* check result (V2) | Raw income band claims |

## Test matrix (V1) — executed via compact-runtime

| Case | Result |
|------|--------|
| enrolled + income below | SUCCESS |
| not enrolled + required | FAILURE |
| enrolled + income above | FAILURE |
| enrollment not required + income below | SUCCESS |

## How to run

```bash
export PATH="$PWD/.tools/compact-bin:$PATH"
export COMPACT_DIRECTORY="$PWD/.tools/compact"
cd midnight-eligibility
npm install
npm run compile
npm test
npm run prove-server
```

## Limitations

See [PRIVACY_MODEL.md](./PRIVACY_MODEL.md) **NOT PROVEN**. Local prove-server uses real Compact circuits via `@midnight-ntwrk/compact-runtime`; chain broadcast via browser wallet is Phase-8 optional.
