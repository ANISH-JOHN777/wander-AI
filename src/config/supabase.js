import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const backendMode = import.meta.env.VITE_BACKEND_MODE || 'local';

// Validate Supabase configuration if using Supabase mode
if (backendMode === 'supabase') {
    if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url_here') {
        console.warn('⚠️ Supabase URL not configured. Falling back to local mode.');
    }
    if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key_here') {
        console.warn('⚠️ Supabase Anon Key not configured. Falling back to local mode.');
    }
}

// Create Supabase client (only if properly configured)
let supabase = null;

if (
    backendMode === 'supabase' &&
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'your_supabase_project_url_here' &&
    supabaseAnonKey !== 'your_supabase_anon_key_here'
) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    });
    console.log('✅ Supabase client initialized');
} else {
    console.log('📍 Running in LOCAL mode (localStorage)');
}

// Export the client and mode
export { supabase, backendMode };

// Helper to check if backend is available
export const isBackendAvailable = () => {
    return backendMode === 'supabase' && supabase !== null;
};

// Helper to get current mode
export const getBackendMode = () => {
    return isBackendAvailable() ? 'supabase' : 'local';
};
