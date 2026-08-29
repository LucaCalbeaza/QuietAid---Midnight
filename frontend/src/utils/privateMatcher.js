import {
  EnrollmentStatus,
  ENROLLMENT_FROM_STRING,
  DEMO_STATE_FROM_NAME,
  DemoStateCode,
  incomeBandCeiling,
} from '../eligibility/codes';

/**
 * Local advisory matcher — NOT a zero-knowledge proof.
 * Never send privateProfile to the backend for matching.
 *
 * @returns {{ eligible: boolean, score: number, checks: Array<{ id: string, label: string, passed: boolean, applicable: boolean }> }}
 */
export function evaluateScholarship(privateProfile, scholarship) {
  const rules = scholarship?.privateEligibility || {};
  const checks = [];

  const requiredEnrollment =
    ENROLLMENT_FROM_STRING[rules.enrollmentStatus] ?? EnrollmentStatus.ANY;
  const enrollmentApplicable = requiredEnrollment !== EnrollmentStatus.ANY;
  const enrollmentPassed =
    !enrollmentApplicable ||
    privateProfile.enrollmentStatusCode === requiredEnrollment;
  checks.push({
    id: 'enrollment',
    label: 'Enrollment requirement can be satisfied',
    passed: enrollmentPassed,
    applicable: enrollmentApplicable,
  });

  const maxIncome = rules.maxHouseholdIncome;
  const incomeApplicable = maxIncome != null && maxIncome !== Infinity;
  const studentIncome = resolveHouseholdIncome(privateProfile);
  const incomePassed =
    !incomeApplicable ||
    (studentIncome != null && studentIncome <= maxIncome);
  checks.push({
    id: 'income',
    label: 'Income requirement can be satisfied',
    passed: incomePassed,
    applicable: incomeApplicable,
  });

  const minGpa = rules.minGPA;
  const gpaApplicable = minGpa != null && minGpa > 0;
  const studentGpa =
    privateProfile.gpaX100 != null ? privateProfile.gpaX100 / 100 : null;
  const gpaPassed =
    !gpaApplicable || (studentGpa != null && studentGpa >= minGpa);
  checks.push({
    id: 'gpa',
    label: 'GPA requirement can be satisfied',
    passed: gpaPassed,
    applicable: gpaApplicable,
  });

  const states = rules.eligibleStates || [];
  const stateApplicable = states.length > 0;
  const statePassed =
    !stateApplicable ||
    states.some((name) => {
      const code = DEMO_STATE_FROM_NAME[name];
      return (
        code != null &&
        privateProfile.stateCode === code &&
        privateProfile.stateCode !== DemoStateCode.ANY
      );
    });
  checks.push({
    id: 'state',
    label: 'Location requirement can be satisfied',
    passed: statePassed,
    applicable: stateApplicable,
  });

  const firstGenApplicable = !!rules.requiresFirstGeneration;
  const firstGenPassed =
    !firstGenApplicable || privateProfile.firstGeneration === true;
  checks.push({
    id: 'firstGeneration',
    label: 'First-generation requirement can be satisfied',
    passed: firstGenPassed,
    applicable: firstGenApplicable,
  });

  const disabilityApplicable = !!rules.requiresDisability;
  const disabilityPassed =
    !disabilityApplicable || privateProfile.disabilityEligible === true;
  checks.push({
    id: 'disability',
    label: 'Accessibility eligibility requirement can be satisfied',
    passed: disabilityPassed,
    applicable: disabilityApplicable,
  });

  const housingApplicable = !!rules.requiresHousingInsecurity;
  const housingPassed =
    !housingApplicable || privateProfile.housingInsecurity === true;
  checks.push({
    id: 'housing',
    label: 'Housing circumstance requirement can be satisfied',
    passed: housingPassed,
    applicable: housingApplicable,
  });

  const applicable = checks.filter((c) => c.applicable);
  const passedApplicable = applicable.filter((c) => c.passed);
  const eligible =
    applicable.length === 0
      ? true
      : passedApplicable.length === applicable.length;

  const score =
    applicable.length === 0
      ? 50
      : Math.round((passedApplicable.length / applicable.length) * 100);

  return { eligible, score, checks };
}

function resolveHouseholdIncome(profile) {
  if (profile.householdIncome != null && profile.householdIncome !== '') {
    return Number(profile.householdIncome);
  }
  if (profile.incomeBand != null) {
    return incomeBandCeiling(profile.incomeBand);
  }
  return null;
}

export function rankScholarships(privateProfile, scholarships) {
  return (scholarships || [])
    .map((scholarship) => {
      const result = evaluateScholarship(privateProfile, scholarship);
      return {
        ...scholarship,
        matchPercentage: result.score,
        localEligible: result.eligible,
        localChecks: result.checks,
        midnightEnabled: !!scholarship.midnightEnabled,
      };
    })
    .sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      if (a.localEligible !== b.localEligible) {
        return a.localEligible ? -1 : 1;
      }
      return 0;
    });
}
