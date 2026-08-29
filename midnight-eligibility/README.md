# QuietAid Midnight eligibility package

## Setup

```bash
export PATH="$PWD/../.tools/compact-bin:$PATH"
export COMPACT_DIRECTORY="$PWD/../.tools/compact"
cd midnight-eligibility
npm install
npm run compile   # requires Compact compiler (see docs/MIDNIGHT_INTEGRATION.md)
npm test
```

## V1 contract

`contracts/quietaid-eligibility-v1.compact`

- **Private:** `enrolled`, `householdIncome`
- **Public sealed rules:** `requiresEnrollment`, `maximumIncome` (Evergreen: true, 75000)
- **Public outcome:** `verifiedCount` increments on success — never discloses private inputs

## Rule integrity

Rules are set in the constructor and sealed. The verified apply path uses the deployed instance for Evergreen; students cannot pass alternate maxima into that path.
