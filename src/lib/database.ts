/**
 * Database table names and column references.
 * Centralised so schema changes only need updating in one place.
 */
export const TABLES = {
  PROFILES: 'profiles',
  CASES: 'cases',
  TEST_STEPS: 'test_steps',
  AUDIT_LOGS: 'audit_logs',
  MESSAGES: 'messages',
} as const;

export type TableName = (typeof TABLES)[keyof typeof TABLES];
