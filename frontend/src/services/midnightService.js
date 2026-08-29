import { EnrollmentStatus } from '../eligibility/codes';
import { EVERGREEN_MAX_INCOME, EVERGREEN_REQUIRES_ENROLLMENT } from './evergreenRules';

const PROVER_URL =
  process.env.REACT_APP_MIDNIGHT_PROVER_URL || 'http://127.0.0.1:31337';

/**
 * Frontend Midnight abstraction.
 * Private witnesses are sent only to the local Compact prover (student machine),
 * never to the scholarship-finder Express API for eligibility calculation.
 */
export async function proveEvergreenEligibility(privateProfile) {
  const enrolled =
    privateProfile.enrollmentStatusCode === EnrollmentStatus.FULL_TIME;
  const householdIncome = Number(privateProfile.householdIncome);

  if (Number.isNaN(householdIncome) || householdIncome < 0) {
    return {
      ok: false,
      stage: 'preparing',
      error: 'Household income is required for Midnight verification.',
    };
  }

  let res;
  try {
    res = await fetch(`${PROVER_URL}/prove/eligibility-v1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        enrolled,
        householdIncome,
        requiresEnrollment: EVERGREEN_REQUIRES_ENROLLMENT,
        maximumIncome: EVERGREEN_MAX_INCOME,
      }),
    });
  } catch {
    return {
      ok: false,
      stage: 'connecting',
      error:
        'Could not reach the local Midnight Compact prover. Start it with: cd midnight-eligibility && npm run prove-server',
    };
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    return {
      ok: false,
      stage: 'verifying',
      error:
        data.error ||
        'This profile does not satisfy the scholarship private eligibility requirements.',
      midnight: data.midnight || null,
    };
  }

  return {
    ok: true,
    stage: 'success',
    eligibilityVerified: true,
    midnight: data.midnight,
  };
}

export async function checkProverHealth() {
  try {
    const res = await fetch(`${PROVER_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
