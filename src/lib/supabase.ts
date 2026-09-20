import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client singleton.
 * Keys are read from environment variables — never hardcoded.
 * In Expo, env vars must be prefixed with EXPO_PUBLIC_ to be visible client-side.
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
