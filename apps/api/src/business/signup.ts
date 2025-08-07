import { createClient, SupabaseClient } from '@supabase/supabase-js';

export async function handleBusinessSignup(req: Request, supabaseClient: SupabaseClient) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { is_business: true }, // Mark as business account
      },
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status || 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ user: data.user, session: data.session }), {
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

// Only serve if the script is run directly (not imported)
if (import.meta.main) {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const defaultSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  Deno.serve(async (req) => {
    return handleBusinessSignup(req, defaultSupabase);
  });
}
