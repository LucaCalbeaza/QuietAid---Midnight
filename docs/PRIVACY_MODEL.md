# QuietAid Privacy Model

## PRIVATE

Data that must **not** be persisted in MongoDB for the QuietAid privacy workflow, and must not appear in provider-facing APIs, backend logs, analytics, or `localStorage`:

- Exact household income / income band
- GPA / `gpaX100`
- Enrollment status claim
- State / location eligibility claim (when used privately)
- First-generation status
- Disability / accessibility eligibility
- Housing insecurity
- Family circumstances
- Credential claims, salts, secrets, and other private witness values

For the hackathon MVP, the private eligibility profile lives **only in browser memory** (React state via `PrivateEligibilityContext`). A page refresh clearing this data is acceptable.

Legacy cleartext User fields (`GPA`, `income`, `casteCategory`, etc.) may still exist for the **legacy** profile / server-side recommendation path. They are not part of the QuietAid private apply flow and must not be returned on provider application APIs.

## PUBLIC

Data that may remain server-side / provider-visible:

**Scholarships**

- Scholarship ID, title, provider, description, award, deadline
- Public eligibility requirements (`publicRequirements`, free-text `eligibility`)
- Normalized public rule definitions (`privateEligibility` as **rules**, not student values)
- Midnight verification configuration (`midnightEnabled`, rule version, contract / deployment identifiers)

**Applications (provider-safe)**

- Public application ID (e.g. `QA-1042`)
- Pseudonym (e.g. `Applicant-A83F2`)
- Scholarship reference
- Eligibility verification status
- Proof / transaction status and safe Midnight metadata
- Application status and disclosure status

**Account (Mongo OK, not auto-disclosed to providers)**

- First name, last name, email, password hash, role (`student` | `provider`)

## PROVEN

What Midnight V1 actually proves when a private application succeeds:

- The private witnesses satisfy the **deployed scholarship rules** for that contract instance (V1: enrollment requirement and maximum household income).
- The student cannot freely substitute a looser maximum income or disable enrollment in the verified path — rules are bound at deploy / registration time.
- After Phase 4: the income (or enrollment) claim is consistent with an **approved mock credential commitment** registered by the mock issuer.

Provider learns: eligibility verified + proof / transaction valid. Provider does **not** learn the underlying private values.

## NOT PROVEN

Prototype limitations — do not overclaim:

- A ZK proof alone does **not** prove that arbitrary self-entered real-world information is true.
- The mock trusted credential represents the **role** a real university / financial-aid issuer could fill; it does not query real institutional databases.
- Local private matching is **advisory** client-side scoring. It is not cryptographic verification.
- Selective identity disclosure proves student consent for shared contact fields only — not that eligibility attributes were revealed (they remain hidden).
- V1 circuit covers enrollment + income only. GPA, state, first-gen, disability, and housing are local-match / future-circuit dimensions until extended.
