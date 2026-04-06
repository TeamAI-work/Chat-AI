import { createClient } from '@supabase/supabase-js'

// Using the exact variable name defined in the user's .env.local
const supabaseUrl = import.meta.env.VITE_SUPABSE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
