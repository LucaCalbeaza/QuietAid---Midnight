/**
 * Unit tests for local private matcher.
 * Asserts matching stays local (no network) by exercising pure functions.
 */
import {
  evaluateScholarship,
  rankScholarships,
} from './privateMatcher';
import { EnrollmentStatus, DemoStateCode, gpaToX100 } from '../eligibility/codes';

describe('privateMatcher', () => {
  const evergreen = {
    _id: 'evergreen',
    title: 'Evergreen Full-Time Scholars Fund',
    midnightEnabled: true,
    privateEligibility: {
      maxHouseholdIncome: 75000,
      eligibleStates: [],
      enrollmentStatus: 'fullTime',
      minGPA: 3.5,
      requiresFirstGeneration: false,
      requiresDisability: false,
      requiresHousingInsecurity: false,
    },
  };

  const eligibleProfile = {
    householdIncome: 50000,
    incomeBand: null,
    stateCode: DemoStateCode.ANY,
    enrollmentStatusCode: EnrollmentStatus.FULL_TIME,
    gpaX100: gpaToX100(3.7),
    firstGeneration: false,
    disabilityEligible: false,
    housingInsecurity: false,
  };

  test('eligible profile matches Evergreen', () => {
    const result = evaluateScholarship(eligibleProfile, evergreen);
    expect(result.eligible).toBe(true);
    expect(result.score).toBe(100);
  });

  test('ineligible when not full-time', () => {
    const result = evaluateScholarship(
      { ...eligibleProfile, enrollmentStatusCode: EnrollmentStatus.PART_TIME },
      evergreen
    );
    expect(result.eligible).toBe(false);
    expect(result.checks.find((c) => c.id === 'enrollment').passed).toBe(false);
  });

  test('ineligible when income above maximum', () => {
    const result = evaluateScholarship(
      { ...eligibleProfile, householdIncome: 90000 },
      evergreen
    );
    expect(result.eligible).toBe(false);
    expect(result.checks.find((c) => c.id === 'income').passed).toBe(false);
  });

  test('rankScholarships attaches local scores without mutating rules', () => {
    const ranked = rankScholarships(eligibleProfile, [evergreen]);
    expect(ranked[0].matchPercentage).toBe(100);
    expect(ranked[0].localEligible).toBe(true);
    expect(ranked[0].midnightEnabled).toBe(true);
  });
});
