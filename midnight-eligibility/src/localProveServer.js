/**
 * Local Midnight eligibility prover — student machine only.
 * Runs the real Compact contract via compact-runtime.
 * Does not persist or log private witness values.
 * Not the scholarship-finder provider backend.
 */
import http from 'node:http';
import {
  createCircuitContext,
  createConstructorContext,
  sampleContractAddress,
} from '@midnight-ntwrk/compact-runtime';
import {
  Contract,
  ledger,
} from '../contracts/managed/quietaid-eligibility-v1/contract/index.js';

/** Keep in sync with src/eligibilityLogic.ts EVERGREEN_V1_RULES */
const EVERGREEN_V1_RULES = {
  requiresEnrollment: true,
  maximumIncome: 75000,
  ruleVersion: 1,
};

const PORT = Number(process.env.QUIETAID_PROVER_PORT || 31337);
const DUMMY_COIN_PK = new Uint8Array(32).fill(7);

const witnesses = {
  enrolled: (ctx) => [ctx.privateState, ctx.privateState.enrolled],
  householdIncome: (ctx) => [
    ctx.privateState,
    ctx.privateState.householdIncome,
  ],
};

async function proveEligibility(body) {
  const enrolled = !!body.enrolled;
  const householdIncome = BigInt(body.householdIncome);
  const requiresEnrollment =
    body.requiresEnrollment ?? EVERGREEN_V1_RULES.requiresEnrollment;
  const maximumIncome = BigInt(
    body.maximumIncome ?? EVERGREEN_V1_RULES.maximumIncome,
  );

  // Rule integrity: reject attempts to loosen Evergreen V1 rules in the demo path
  if (
    requiresEnrollment !== EVERGREEN_V1_RULES.requiresEnrollment ||
    Number(maximumIncome) !== EVERGREEN_V1_RULES.maximumIncome
  ) {
    const err = new Error(
      'Scholarship rules do not match the deployed Evergreen V1 contract binding',
    );
    err.code = 'RULE_MISMATCH';
    throw err;
  }

  const contract = new Contract(witnesses);
  const privateState = { enrolled, householdIncome };
  const ctorCtx = createConstructorContext(privateState, DUMMY_COIN_PK);
  const initial = await contract.initialState(
    ctorCtx,
    requiresEnrollment,
    maximumIncome,
  );

  const circuitCtx = createCircuitContext(
    'verifyEligibility',
    sampleContractAddress(),
    DUMMY_COIN_PK,
    initial.currentContractState,
    initial.currentPrivateState,
  );

  const result = await contract.circuits.verifyEligibility(circuitCtx);
  const after = ledger(result.context.callContext.currentQueryContext.state);

  return {
    ok: true,
    eligibilityVerified: true,
    midnight: {
      network: 'local-compact-runtime',
      contractId: 'quietaid-eligibility-v1',
      ruleVersion: EVERGREEN_V1_RULES.ruleVersion,
      verifiedCount: Number(after.verifiedCount),
      requiresEnrollment: after.requiresEnrollment,
      maximumIncome: Number(after.maximumIncome),
      proofStatus: 'VALID',
      // Local runtime execution id — not a chain tx until wallet deploy path is used
      executionId: `local-${Date.now().toString(36)}`,
    },
  };
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, service: 'quietaid-local-prover' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/prove/eligibility-v1') {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    try {
      const body = JSON.parse(raw || '{}');
      const out = await proveEligibility(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(out));
    } catch (err) {
      const message = err?.message || 'Proof failed';
      const status = err?.code === 'RULE_MISMATCH' ? 400 : 422;
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          ok: false,
          eligibilityVerified: false,
          error: message,
        }),
      );
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(
    `QuietAid local Compact prover listening on http://127.0.0.1:${PORT}`,
  );
});
