import { UserProfile, Role } from '@/features/cases/types';
import { DEMO_OFFICER, DEMO_ADMIN } from '@/constants/disclaimer';

const CREDENTIALS: Record<string, { password: string; profile: UserProfile }> = {
  'OFF-2024-0421': { password: 'demo', profile: DEMO_OFFICER },
  'OFF-2026-1432': { password: 'admindemo', profile: DEMO_ADMIN },
};

/**
 * Demo authentication service — validates officer credentials against
 * a hardcoded credential map. Production would use Supabase Auth.
 */
export function validateCredentials(officerId: string, password: string): UserProfile | null {
  const cred = CREDENTIALS[officerId.trim()];
  if (cred && cred.password === password.trim()) {
    return cred.profile;
  }
  return null;
}

export function isAdmin(user: UserProfile | null): user is UserProfile {
  return user?.role === 'admin';
}
