/**
 * Evergreen Full-Time Scholars Fund — Midnight V1 public rules.
 * Bound at contract deploy; students cannot override these in the verified path.
 */
export const EVERGREEN_V1_RULES = {
  scholarshipTitle: 'Evergreen Full-Time Scholars Fund',
  requiresEnrollment: true,
  maximumIncome: 75000,
  ruleVersion: 1,
};

export type PrivateEligibilityWitness = {
  enrolled: boolean;
  householdIncome: number;
};

export type PublicEligibilityRules = {
  requiresEnrollment: boolean;
  maximumIncome: number;
};

/**
 * Pure eligibility check mirroring Compact asserts.
 * Used for fast unit tests; real proofs go through the Compact circuit.
 */
export function checkEligibility(
  privateInputs: PrivateEligibilityWitness,
  rules: PublicEligibilityRules,
): { ok: boolean; reason?: string } {
  if (rules.requiresEnrollment && !privateInputs.enrolled) {
    return { ok: false, reason: 'enrollment requirement not met' };
  }
  if (privateInputs.householdIncome > rules.maximumIncome) {
    return { ok: false, reason: 'income exceeds scholarship maximum' };
  }
  return { ok: true };
}
