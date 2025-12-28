import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Client wird zur Build-Zeit mit Placeholder erstellt, zur Laufzeit mit echten Credentials
// Type-Assertion stellt sicher dass TypeScript die korrekten Database-Types verwendet
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
) as SupabaseClient<Database>;
