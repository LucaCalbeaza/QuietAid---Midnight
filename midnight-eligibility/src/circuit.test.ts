/**
 * In-process Compact circuit tests using compact-runtime (no fake proofs).
 * Exercises real compiled contract asserts for the V1 matrix.
 */
import { describe, expect, it } from 'vitest';
import {
  createCircuitContext,
  createConstructorContext,
  sampleContractAddress,
} from '@midnight-ntwrk/compact-runtime';
import {
  Contract,
  ledger,
} from '../contracts/managed/quietaid-eligibility-v1/contract/index.js';
import { createWitnesses, type EligibilityPrivateState } from './witnesses.js';
import { EVERGREEN_V1_RULES } from './eligibilityLogic.js';

/** Encoded coin public key (32 bytes) for local circuit tests */
const DUMMY_COIN_PK = new Uint8Array(32).fill(7);

async function deployAndVerify(
  privateState: EligibilityPrivateState,
  rules = {
    requiresEnrollment: EVERGREEN_V1_RULES.requiresEnrollment,
    maximumIncome: BigInt(EVERGREEN_V1_RULES.maximumIncome),
  },
) {
  const contract = new Contract(createWitnesses());
  const ctorCtx = createConstructorContext(privateState, DUMMY_COIN_PK);
  const initial = await contract.initialState(
    ctorCtx,
    rules.requiresEnrollment,
    rules.maximumIncome,
  );

  const publicLedger = ledger(initial.currentContractState.data);
  expect(publicLedger.requiresEnrollment).toBe(rules.requiresEnrollment);
  expect(publicLedger.maximumIncome).toBe(rules.maximumIncome);

  const circuitCtx = createCircuitContext(
    'verifyEligibility',
    sampleContractAddress(),
    DUMMY_COIN_PK,
    initial.currentContractState,
    initial.currentPrivateState,
  );

  const result = await contract.circuits.verifyEligibility(circuitCtx);
  const after = ledger(result.context.callContext.currentQueryContext.state);
  return { result, after, initialLedger: publicLedger };
}

describe('QuietAid V1 Compact circuit (compact-runtime)', () => {
  it('CASE 1: enrolled + income below max → SUCCESS', async () => {
    const { after, initialLedger } = await deployAndVerify({
      enrolled: true,
      householdIncome: 50000n,
    });
    expect(initialLedger.verifiedCount).toBe(0n);
    expect(after.verifiedCount).toBe(1n);
  });

  it('CASE 2: not enrolled + enrollment required → FAILURE', async () => {
    await expect(
      deployAndVerify({ enrolled: false, householdIncome: 50000n }),
    ).rejects.toThrow(/enrollment/i);
  });

  it('CASE 3: enrolled + income above max → FAILURE', async () => {
    await expect(
      deployAndVerify({ enrolled: true, householdIncome: 90000n }),
    ).rejects.toThrow(/income/i);
  });

  it('CASE 4: enrollment not required + income below → SUCCESS', async () => {
    const { after } = await deployAndVerify(
      { enrolled: false, householdIncome: 50000n },
      { requiresEnrollment: false, maximumIncome: 75000n },
    );
    expect(after.verifiedCount).toBe(1n);
  });

  it('does not expose private income on ledger', async () => {
    const { after } = await deployAndVerify({
      enrolled: true,
      householdIncome: 42000n,
    });
    const keys = Object.keys(after);
    expect(keys).not.toContain('householdIncome');
    expect(keys).not.toContain('enrolled');
    expect(after.maximumIncome).toBe(75000n);
  });
});
