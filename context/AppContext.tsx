import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Officer, TestCase, TestResult } from '@/types';
import {
  DEMO_OFFICER,
  DEMO_ADMIN,
  DEMO_CASES,
} from '@/constants/mockData';

interface NewCaseInput {
  sampleId: string;
  substance: string;
  notes: string;
  result: TestResult;
  gps: string;
  audioNoteDuration?: string;
  capturedImageUri?: string;
}

interface AppContextType {
  user: Officer | null;
  login: (officerId: string, password: string) => boolean;
  logout: () => void;
  cases: TestCase[];
  addCase: (data: NewCaseInput) => TestCase;
  getCaseById: (id: string) => TestCase | undefined;
  approveCase: (id: string) => void;
  rejectCase: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CREDENTIALS: Record<string, { password: string; officer: Officer }> = {
  'OFF-2024-0421': { password: 'demo', officer: DEMO_OFFICER },
  'OFF-2026-1432': { password: 'admindemo', officer: DEMO_ADMIN },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Officer | null>(null);
  const [cases, setCases] = useState<TestCase[]>(DEMO_CASES);

  const login = useCallback((officerId: string, password: string) => {
    const cred = CREDENTIALS[officerId.trim()];
    if (cred && cred.password === password.trim()) {
      setUser(cred.officer);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const addCase = useCallback(
    (data: NewCaseInput): TestCase => {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const seq = String(cases.length + 1).padStart(3, '0');
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
        imageHash: Array.from({ length: 64 }, () =>
          '0123456789abcdef'[Math.floor(Math.random() * 16)]
        ).join(''),
        caseId: `CASE-${dateStr}-${seq}`,
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
        c.id === id
          ? { ...c, status: 'Approved' as const, integrityStatus: 'Verified' as const }
          : c
      )
    );
  }, []);

  const rejectCase = useCallback((id: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: 'Rejected' as const } : c
      )
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        cases,
        addCase,
        getCaseById,
        approveCase,
        rejectCase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
