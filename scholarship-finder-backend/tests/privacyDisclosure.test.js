/**
 * Backend privacy tests for provider DTOs and selective disclosure.
 * Run: node --test tests/privacyDisclosure.test.js
 */
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  toProviderDto,
  assertNoSensitiveKeys,
  PRIVATE_ELIGIBILITY_KEYS,
} = require('../utils/privateApplicationHelpers');

function sampleApp(overrides = {}) {
  return {
    publicApplicationId: 'QA-1042',
    studentId: '507f1f77bcf86cd799439011',
    pseudonym: 'Applicant-A83F2',
    scholarshipId: '507f1f77bcf86cd799439012',
    scholarshipTitle: 'Evergreen Full-Time Scholars Fund',
    eligibilityVerified: true,
    applicationStatus: 'submitted',
    midnight: {
      network: 'local-compact-runtime',
      contractId: 'quietaid-eligibility-v1',
      proofStatus: 'VALID',
      executionId: 'local-abc',
      ruleVersion: 1,
    },
    identityDisclosure: {
      status: 'HIDDEN',
      requestedFields: [],
      approvedFields: [],
      disclosed: {},
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('provider DTO privacy', () => {
  it('omits studentId and sensitive eligibility keys before disclosure', () => {
    const dto = toProviderDto(sampleApp());
    assert.equal(dto.identity.status, 'HIDDEN');
    assert.equal(dto.identity.name, undefined);
    assert.equal(dto.identity.email, undefined);
    assert.ok(!('studentId' in dto));
    for (const key of PRIVATE_ELIGIBILITY_KEYS) {
      assert.ok(!(key in dto), `leaked ${key}`);
      assert.ok(!(key in (dto.identity || {})), `leaked identity.${key}`);
      assert.ok(!(key in (dto.midnight || {})), `leaked midnight.${key}`);
    }
    assert.doesNotThrow(() => assertNoSensitiveKeys(dto));
        assert.equal(dto.sensitiveInformation.householdIncome, 'Not disclosed');
        assert.equal(dto.sensitiveInformation.gpa, 'Not disclosed');
      });

      it('after name-only approval: name present, email absent', () => {
        const dto = toProviderDto(
          sampleApp({
            identityDisclosure: {
              status: 'PARTIALLY_DISCLOSED',
              requestedFields: ['name', 'email'],
              approvedFields: ['name'],
              disclosed: { name: 'Maya Khan' },
              disclosedAt: new Date(),
            },
          })
        );
        assert.equal(dto.identity.status, 'PARTIALLY_DISCLOSED');
        assert.equal(dto.identity.name, 'Maya Khan');
        assert.equal(dto.identity.email, undefined);
        assert.ok(!('studentId' in dto));
        assert.equal(dto.sensitiveInformation.householdIncome, 'Not disclosed');
        assert.doesNotThrow(() => assertNoSensitiveKeys(dto));
      });

      it('after name+email approval: both present; eligibility still hidden', () => {
        const dto = toProviderDto(
          sampleApp({
            identityDisclosure: {
              status: 'PARTIALLY_DISCLOSED',
              requestedFields: ['name', 'email'],
              approvedFields: ['name', 'email'],
              disclosed: {
                name: 'Maya Khan',
                email: 'maya@example.com',
              },
              disclosedAt: new Date(),
            },
          })
        );
        assert.equal(dto.identity.name, 'Maya Khan');
        assert.equal(dto.identity.email, 'maya@example.com');
        assert.equal(dto.sensitiveInformation.disability, 'Not disclosed');
        assert.equal(dto.sensitiveInformation.housing, 'Not disclosed');
        assert.ok(!('studentId' in dto));
        assert.ok(!('income' in dto));
        assert.ok(!('GPA' in dto));
        assert.doesNotThrow(() => assertNoSensitiveKeys(dto));
      });
    });
