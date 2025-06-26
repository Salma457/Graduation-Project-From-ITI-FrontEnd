import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
console.log("TOKEN:", localStorage.getItem("access-token"));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// بعد كده في useEffect مثلاً:
// const token = localStorage.getItem('access-token');
// // const refresh_token = localStorage.getItem('refresh-token');

// if (token) {
//   supabase.auth.setSession({
//     access_token: token,
//     // refresh_token: refresh_token,
//   }).catch(console.error);
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     persistSession: true,
//     autoRefreshToken: true,
//     detectSessionInUrl: true,
//   },
// });
