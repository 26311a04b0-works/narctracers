export type TestResult = 'Positive' | 'Negative' | 'Inconclusive' | 'Pending';

export type CaseStatus = 'Saved' | 'Submitted' | 'Approved' | 'Rejected' | 'Verified' | 'Pending';

export type IntegrityStatus = 'Pending' | 'Verified';

export type Role = 'officer' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  officerId: string;
  station: string;
  role: Role;
}

export interface TestCase {
  id: string;
  sampleId: string;
  officerId: string;
  officerName: string;
  station: string;
  date: string;
  substance: string;
  notes: string;
  result: TestResult;
  status: CaseStatus;
  gps: string;
  imageHash: string;
  caseId: string;
  integrityStatus: IntegrityStatus;
  audioNoteDuration?: string;
  capturedImageUri?: string;
}

export interface EvidenceImage {
  id: string;
  caseId: string;
  uri: string;
  hash: string;
  capturedAt: string;
}

export interface TestStep {
  index: number;
  instruction: string;
  completed: boolean;
}

export interface AuditLog {
  id: string;
  caseId: string;
  action: string;
  performedBy: string;
  performedAt: string;
  details?: string;
}

export interface NewCaseInput {
  sampleId: string;
  substance: string;
  notes: string;
  result: TestResult;
  gps: string;
  audioNoteDuration?: string;
  capturedImageUri?: string;
}
