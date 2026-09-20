import { TestCase } from '@/features/cases/types';

/**
 * Report service — generates formal text reports from case data.
 * MVP produces a plain-text summary; production would generate PDF.
 */
export function generateCaseReport(testCase: TestCase): string {
  const lines = [
    '========================================',
    '       NARCTRACTERS FIELD TEST REPORT   ',
    '========================================',
    '',
    `Case ID:       ${testCase.caseId}`,
    `Sample ID:     ${testCase.sampleId}`,
    `Date:          ${testCase.date}`,
    `Officer:       ${testCase.officerName} (${testCase.officerId})`,
    `Station:       ${testCase.station}`,
    `GPS:           ${testCase.gps}`,
    `Substance:     ${testCase.substance || 'Not identified'}`,
    `Result:        ${testCase.result}`,
    `Status:        ${testCase.status}`,
    `Integrity:     ${testCase.integrityStatus}`,
    `Image Hash:    ${testCase.imageHash}`,
    '',
    `Notes: ${testCase.notes}`,
    '',
    '----------------------------------------',
    'DISCLAIMER: Presumptive field result only.',
    'Laboratory confirmation is required.',
    '----------------------------------------',
  ];
  return lines.join('\n');
}
