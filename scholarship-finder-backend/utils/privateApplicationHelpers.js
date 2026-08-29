const crypto = require('crypto');
const PrivateApplication = require('../models/PrivateApplication');

/** Never appear on provider DTOs (private eligibility / internal identity linkage). */
const PRIVATE_ELIGIBILITY_KEYS = [
  'studentId',
  'income',
  'incomeBand',
  'GPA',
  'gpa',
  'enrollment',
  'disability',
  'firstGeneration',
  'housingInsecurity',
  'credential',
  'credentialClaims',
  'credentialSecret',
  'credentialSalt',
  'password',
  'householdIncome',
];

/** Root-level account fields that must not appear except under identity after approval. */
const ROOT_IDENTITY_KEYS = ['firstName', 'lastName', 'email', 'address', 'phone'];

function generatePublicApplicationId() {
  const n = crypto.randomInt(1000, 9999);
  return `QA-${n}`;
}

function generatePseudonym() {
  const hex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `Applicant-${hex}`;
}

async function allocatePublicApplicationId() {
  for (let i = 0; i < 20; i += 1) {
    const id = generatePublicApplicationId();
    // eslint-disable-next-line no-await-in-loop
    const exists = await PrivateApplication.exists({ publicApplicationId: id });
    if (!exists) return id;
  }
  return `QA-${Date.now().toString().slice(-6)}`;
}

/**
 * Provider-safe DTO — explicitly constructed. Never spread the mongoose doc.
 */
function toProviderDto(app) {
  const disclosure = app.identityDisclosure || {};
  const identity = { status: disclosure.status || 'HIDDEN' };

  if (
    disclosure.status === 'PARTIALLY_DISCLOSED' ||
    disclosure.status === 'DISCLOSED'
  ) {
    const approved = disclosure.approvedFields || [];
    const disclosed = disclosure.disclosed || {};
    if (approved.includes('name') && disclosed.name) {
      identity.name = disclosed.name;
    }
    if (approved.includes('email') && disclosed.email) {
      identity.email = disclosed.email;
    }
    if (approved.includes('address') && disclosed.address) {
      identity.address = disclosed.address;
    }
    if (approved.includes('phone') && disclosed.phone) {
      identity.phone = disclosed.phone;
    }
  }

  return {
    publicApplicationId: app.publicApplicationId,
    pseudonym: app.pseudonym,
    scholarshipId: app.scholarshipId,
    scholarshipTitle: app.scholarshipTitle,
    eligibilityVerified: app.eligibilityVerified,
    applicationStatus: app.applicationStatus,
    midnight: {
      network: app.midnight?.network,
      contractId: app.midnight?.contractId,
      contractAddress: app.midnight?.contractAddress,
      transactionId: app.midnight?.transactionId,
      executionId: app.midnight?.executionId,
      proofStatus: app.midnight?.proofStatus,
      ruleVersion: app.midnight?.ruleVersion,
    },
    identity,
    identityDisclosure: {
      status: disclosure.status,
      requestedFields: disclosure.requestedFields || [],
      approvedFields: disclosure.approvedFields || [],
      disclosedAt: disclosure.disclosedAt,
    },
    sensitiveInformation: {
      householdIncome: 'Not disclosed',
      gpa: 'Not disclosed',
      disability: 'Not disclosed',
      housing: 'Not disclosed',
      addressLabel:
        identity.address != null ? 'See identity.address' : 'Not disclosed',
    },
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
  };
}

function toStudentDto(app) {
  return {
    publicApplicationId: app.publicApplicationId,
    pseudonym: app.pseudonym,
    scholarshipId: app.scholarshipId,
    scholarshipTitle: app.scholarshipTitle,
    eligibilityVerified: app.eligibilityVerified,
    applicationStatus: app.applicationStatus,
    midnight: app.midnight,
    identityDisclosure: app.identityDisclosure,
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
  };
}

function assertNoSensitiveKeys(dto) {
  for (const key of PRIVATE_ELIGIBILITY_KEYS) {
    if (Object.prototype.hasOwnProperty.call(dto, key)) {
      throw new Error(`Sensitive key leaked in provider DTO: ${key}`);
    }
  }
  for (const key of ROOT_IDENTITY_KEYS) {
    if (Object.prototype.hasOwnProperty.call(dto, key)) {
      throw new Error(`Identity key leaked at provider DTO root: ${key}`);
    }
  }
  if (dto.midnight) {
    for (const key of PRIVATE_ELIGIBILITY_KEYS) {
      if (Object.prototype.hasOwnProperty.call(dto.midnight, key)) {
        throw new Error(`Sensitive key leaked in midnight: ${key}`);
      }
    }
  }
}

module.exports = {
  SENSITIVE_KEYS: [...PRIVATE_ELIGIBILITY_KEYS, ...ROOT_IDENTITY_KEYS],
  PRIVATE_ELIGIBILITY_KEYS,
  generatePseudonym,
  allocatePublicApplicationId,
  toProviderDto,
  toStudentDto,
  assertNoSensitiveKeys,
};
