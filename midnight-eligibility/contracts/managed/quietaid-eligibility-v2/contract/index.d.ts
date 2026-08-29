import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  enrolled(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, boolean];
  householdIncome(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  incomeCredentialSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  registerIncomeCredential(context: __compactRuntime.CircuitContext<PS>,
                           commitment_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  verifyEligibilityWithCredential(context: __compactRuntime.CircuitContext<PS>): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type ProvableCircuits<PS> = {
  registerIncomeCredential(context: __compactRuntime.CircuitContext<PS>,
                           commitment_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  verifyEligibilityWithCredential(context: __compactRuntime.CircuitContext<PS>): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  registerIncomeCredential(context: __compactRuntime.CircuitContext<PS>,
                           commitment_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  verifyEligibilityWithCredential(context: __compactRuntime.CircuitContext<PS>): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type Ledger = {
  readonly requiresEnrollment: boolean;
  readonly maximumIncome: bigint;
  readonly verifiedCount: bigint;
  approvedCommitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               reqEnroll_0: boolean,
               maxInc_0: bigint): Promise<__compactRuntime.ConstructorResult<PS>>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
export declare const expectedVk: Record<string, string>;
