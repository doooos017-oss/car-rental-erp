import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

let supabase = null

try {
    if (supabaseUrl && !supabaseUrl.includes('your-project')) {
        supabase = createClient(supabaseUrl, supabaseAnonKey)
    } else {
        console.warn('Supabase not configured. Using demo mode.')
    }
} catch (error) {
    console.warn('Supabase initialization failed:', error.message)
}

export { supabase }
export default supabase
