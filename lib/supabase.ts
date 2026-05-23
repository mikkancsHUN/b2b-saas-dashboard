import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Létrehozzuk a kapcsolatot a felhővel a .env.local-ban megadott kulcsok alapján
export const supabase = createClient(supabaseUrl, supabaseAnonKey);