/**
 * Mock Financial Aid Office — issues private income credential materials.
 * For hackathon demo only. Does not query real databases.
 *
 * The V2 Compact contract checks persistentCommit(income, salt) membership
 * in approvedCommitments after the mock issuer registers the commitment.
 */
import { randomBytes } from 'node:crypto';

export function issueIncomeCredential(householdIncome) {
  const salt = randomBytes(32);
  return {
    householdIncome: Number(householdIncome),
    saltHex: salt.toString('hex'),
    issuer: 'Mock Financial Aid Office (QuietAid demo)',
    note: 'NOT a real institutional attestation — see PRIVACY_MODEL.md NOT PROVEN',
  };
}
