export type TestResult = 'Positive' | 'Negative' | 'Inconclusive' | 'Pending';

export type CaseStatus = 'Saved' | 'Submitted' | 'Approved' | 'Rejected' | 'Verified' | 'Pending';

export type Role = 'officer' | 'admin';

export interface Officer {
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
  integrityStatus: 'Pending' | 'Verified';
  audioNoteDuration?: string;
  capturedImageUri?: string;
}
