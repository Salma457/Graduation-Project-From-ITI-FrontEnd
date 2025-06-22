import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://obrhuhasrppixjwkznri.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icmh1aGFzcnBwaXhqd2t6bnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MDYyNzgsImV4cCI6MjA2NDA4MjI3OH0.BEso8xpPQBPBMwWFLLyM7npDMxHdEjv-pe9Q2HVU_cY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// بعد كده في useEffect مثلاً:
const token = localStorage.getItem('access-token');
// const refresh_token = localStorage.getItem('refresh-token');

if (token) {
  supabase.auth.setSession({
    access_token: token,
    // refresh_token: refresh_token,
  }).catch(console.error);
}

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     persistSession: true,
//     autoRefreshToken: true,
//     detectSessionInUrl: true,
//   },
// });
