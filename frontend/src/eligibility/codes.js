/**
 * Normalized eligibility codes for QuietAid local matching.
 * Keep in sync with scholarship-finder-backend/eligibility/codes.js
 */

export const EnrollmentStatus = {
  ANY: 0,
  FULL_TIME: 1,
  PART_TIME: 2,
};

export const ENROLLMENT_FROM_STRING = {
  any: EnrollmentStatus.ANY,
  fullTime: EnrollmentStatus.FULL_TIME,
  partTime: EnrollmentStatus.PART_TIME,
};

export const EducationLevel = {
  ANY: 0,
  HIGH_SCHOOL: 1,
  UNDERGRADUATE: 2,
  GRADUATE: 3,
  PHD: 4,
};

/** Demo U.S. states appearing in QuietAid seed data only. */
export const DemoStateCode = {
  ANY: 0,
  CALIFORNIA: 1,
  TEXAS: 2,
};

export const DEMO_STATE_FROM_NAME = {
  California: DemoStateCode.CALIFORNIA,
  Texas: DemoStateCode.TEXAS,
};

/** Convert GPA float (e.g. 3.45) to integer hundredths (345). */
export function gpaToX100(gpa) {
  if (gpa == null || Number.isNaN(Number(gpa))) return null;
  return Math.round(Number(gpa) * 100);
}

export function x100ToGpa(gpaX100) {
  if (gpaX100 == null || Number.isNaN(Number(gpaX100))) return null;
  return Number(gpaX100) / 100;
}

/**
 * Income bands for UI (optional). Matching uses exact householdIncome when set.
 * Band ceilings are inclusive upper bounds in USD.
 */
export const IncomeBand = {
  BAND_1: 1, // <= 30_000
  BAND_2: 2, // <= 45_000
  BAND_3: 3, // <= 60_000
  BAND_4: 4, // <= 75_000
  BAND_5: 5, // <= 100_000
  BAND_6: 6, // > 100_000
};

export const INCOME_BAND_CEILINGS = {
  [IncomeBand.BAND_1]: 30000,
  [IncomeBand.BAND_2]: 45000,
  [IncomeBand.BAND_3]: 60000,
  [IncomeBand.BAND_4]: 75000,
  [IncomeBand.BAND_5]: 100000,
  [IncomeBand.BAND_6]: Number.POSITIVE_INFINITY,
};

export function incomeBandCeiling(band) {
  return INCOME_BAND_CEILINGS[band] ?? null;
}

export function emptyPrivateProfile() {
  return {
    householdIncome: null,
    incomeBand: null,
    stateCode: DemoStateCode.ANY,
    enrollmentStatusCode: EnrollmentStatus.ANY,
    gpaX100: null,
    firstGeneration: false,
    disabilityEligible: false,
    housingInsecurity: false,
  };
}
