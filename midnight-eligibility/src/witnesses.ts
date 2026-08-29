import type { WitnessContext } from '@midnight-ntwrk/compact-runtime';
import type { Ledger } from '../contracts/managed/quietaid-eligibility-v1/contract/index.js';

export type EligibilityPrivateState = {
  enrolled: boolean;
  householdIncome: bigint;
};

export const createWitnesses = () => ({
  enrolled(
    context: WitnessContext<Ledger, EligibilityPrivateState>,
  ): [EligibilityPrivateState, boolean] {
    return [context.privateState, context.privateState.enrolled];
  },
  householdIncome(
    context: WitnessContext<Ledger, EligibilityPrivateState>,
  ): [EligibilityPrivateState, bigint] {
    return [context.privateState, context.privateState.householdIncome];
  },
});
