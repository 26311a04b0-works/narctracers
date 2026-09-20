import { TestCase, NewCaseInput, CaseStatus } from './types';

/**
 * Case service — abstraction layer for case CRUD operations.
 * In the MVP demo, the data lives in React state via useAuth.
 * In production, these would call Supabase via src/lib/supabase.ts.
 */

export function filterCasesByOfficer(cases: TestCase[], officerId: string): TestCase[] {
  return cases.filter((c) => c.officerId === officerId);
}

export function searchCases(cases: TestCase[], query: string): TestCase[] {
  if (!query.trim()) return cases;
  const q = query.toLowerCase().trim();
  return cases.filter((c) => c.sampleId.toLowerCase().includes(q));
}

export function filterCasesByStatus(cases: TestCase[], status: CaseStatus): TestCase[] {
  return cases.filter((c) => c.status === status);
}

export function countByStatus(cases: TestCase[], status: CaseStatus): number {
  return cases.filter((c) => c.status === status).length;
}

export function validateNewCase(data: NewCaseInput): string[] {
  const errors: string[] = [];
  if (!data.sampleId.trim()) errors.push('Sample ID is required.');
  if (!data.result) errors.push('Test result is required.');
  if (!data.capturedImageUri) errors.push('Evidence photo is required.');
  return errors;
}
