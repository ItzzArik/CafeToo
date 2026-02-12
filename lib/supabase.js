import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback for build time to prevent crashes if env vars are missing
// This allows the static generation to proceed, but successful API calls still require valid keys at runtime.
const isBuildTime = typeof window === 'undefined' && (!supabaseUrl || !supabaseAnonKey);

export const supabase = isBuildTime
    ? { from: () => ({ select: () => ({ data: [], error: null }) }), auth: { getSession: () => ({ data: { session: null } }) } } // Mock client for build
    : createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key');
