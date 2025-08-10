import { createClient, SupabaseClient } from '@supabase/supabase-js';


export async function handleLogout(req: Request, supabaseClient: SupabaseClient) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status || 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Successfully logged out' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Serve in Deno runtime when available (avoid import.meta for Jest compatibility)
try {
  // @ts-ignore - Deno is available only in edge/runtime
  if (typeof Deno !== 'undefined' && typeof Deno.serve === 'function') {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const defaultSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    // @ts-ignore
    Deno.serve(async (req: Request) => handleLogout(req, defaultSupabase));
  }
} catch {
  // no-op in non-Deno environments
}
