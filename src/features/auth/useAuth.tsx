import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserProfile, TestCase, NewCaseInput } from '@/features/cases/types';
import { validateCredentials } from '@/features/auth/authService';
import { generateCaseId, generateImageHash } from '@/utils/caseId';
import { DEMO_CASES } from '@/constants/disclaimer';

interface AppContextType {
  user: UserProfile | null;
  login: (officerId: string, password: string) => boolean;
  logout: () => void;
  cases: TestCase[];
  addCase: (data: NewCaseInput) => TestCase;
  getCaseById: (id: string) => TestCase | undefined;
  approveCase: (id: string) => void;
  rejectCase: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cases, setCases] = useState<TestCase[]>(DEMO_CASES as TestCase[]);

  const login = useCallback((officerId: string, password: string) => {
    const profile = validateCredentials(officerId, password);
    if (profile) {
      setUser(profile);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const addCase = useCallback(
    (data: NewCaseInput): TestCase => {
      const now = new Date();
      const newCase: TestCase = {
        id: `case-${Date.now()}`,
        sampleId: data.sampleId,
        officerId: user?.officerId || 'OFF-2024-0421',
        officerName: user?.name || 'Insp. Rajesh Kumar',
        station: user?.station || 'Central NCB Unit, New Delhi',
        date: now.toISOString(),
        substance: data.substance || '',
        notes: data.notes,
        result: data.result,
        status: 'Submitted',
        gps: data.gps,
        imageHash: generateImageHash(),
        caseId: generateCaseId(cases.length + 1),
        integrityStatus: 'Pending',
        audioNoteDuration: data.audioNoteDuration,
        capturedImageUri: data.capturedImageUri,
      };
      setCases((prev) => [newCase, ...prev]);
      return newCase;
    },
    [user, cases.length]
  );

  const getCaseById = useCallback(
    (id: string) => cases.find((c) => c.id === id),
    [cases]
  );

  const approveCase = useCallback((id: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: 'Approved', integrityStatus: 'Verified' } : c
      )
    );
  }, []);

  const rejectCase = useCallback((id: string) => {
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Rejected' } : c))
    );
  }, []);

  return (
    <AppContext.Provider
      value={{ user, login, logout, cases, addCase, getCaseById, approveCase, rejectCase }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
