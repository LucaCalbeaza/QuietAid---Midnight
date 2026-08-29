/**
 * Keep in sync with frontend/src/eligibility/codes.js
 */
const EnrollmentStatus = {
  ANY: 0,
  FULL_TIME: 1,
  PART_TIME: 2,
};

const ENROLLMENT_FROM_STRING = {
  any: EnrollmentStatus.ANY,
  fullTime: EnrollmentStatus.FULL_TIME,
  partTime: EnrollmentStatus.PART_TIME,
};

const EducationLevel = {
  ANY: 0,
  HIGH_SCHOOL: 1,
  UNDERGRADUATE: 2,
  GRADUATE: 3,
  PHD: 4,
};

const DemoStateCode = {
  ANY: 0,
  CALIFORNIA: 1,
  TEXAS: 2,
};

const DEMO_STATE_FROM_NAME = {
  California: DemoStateCode.CALIFORNIA,
  Texas: DemoStateCode.TEXAS,
};

function gpaToX100(gpa) {
  if (gpa == null || Number.isNaN(Number(gpa))) return null;
  return Math.round(Number(gpa) * 100);
}

module.exports = {
  EnrollmentStatus,
  ENROLLMENT_FROM_STRING,
  EducationLevel,
  DemoStateCode,
  DEMO_STATE_FROM_NAME,
  gpaToX100,
};
