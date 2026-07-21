const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

const IS_CONFIGURED =
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('your-project') &&
  !SUPABASE_URL.includes('placeholder');

import { createClient } from '@supabase/supabase-js';

function createSupabaseClient() {
  if (!IS_CONFIGURED) {
    return new Proxy({} as ReturnType<typeof createClient>, {
      get() {
        return () => {
          throw new Error('Supabase not configured');
        };
      },
    });
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const supabase = createSupabaseClient();
