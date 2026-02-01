import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use Service Role Key for backend operations to bypass RLS if needed, or Anon Key for client

// We use the Service Role Key here because we are likely using this in API routes 
// where we want full access (or we pass the user's auth token to respect RLS).
// For now, let's stick to a simple client. If we are on the server (API routes), we can use the Service Role Key.
// CAUTION: NEVER use the SERVICE ROLE KEY on the client-side.

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey)
