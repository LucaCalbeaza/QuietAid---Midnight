import { describe, expect, it } from 'vitest';
import {
  checkEligibility,
  EVERGREEN_V1_RULES,
} from './eligibilityLogic.js';

describe('QuietAid V1 eligibility matrix (mirrors Compact asserts)', () => {
  const rules = {
    requiresEnrollment: EVERGREEN_V1_RULES.requiresEnrollment,
    maximumIncome: EVERGREEN_V1_RULES.maximumIncome,
  };

  it('CASE 1: enrolled + income below max → SUCCESS', () => {
    expect(
      checkEligibility(
        { enrolled: true, householdIncome: 50000 },
        rules,
      ).ok,
    ).toBe(true);
  });

  it('CASE 2: not enrolled + enrollment required + income below → FAILURE', () => {
    const r = checkEligibility(
      { enrolled: false, householdIncome: 50000 },
      rules,
    );
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/enrollment/i);
  });

  it('CASE 3: enrolled + income above max → FAILURE', () => {
    const r = checkEligibility(
      { enrolled: true, householdIncome: 90000 },
      rules,
    );
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/income/i);
  });

  it('CASE 4: enrollment not required + income below → SUCCESS', () => {
    expect(
      checkEligibility(
        { enrolled: false, householdIncome: 50000 },
        { requiresEnrollment: false, maximumIncome: 75000 },
      ).ok,
    ).toBe(true);
  });
});
