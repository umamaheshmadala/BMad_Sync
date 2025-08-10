import { serve } from '@deno/http';
import { createClient } from '@supabase/supabase-js';
import { BusinessProfile } from '../../../../packages/shared-types/src';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const path = url.pathname;

    if (req.method === 'POST' && path === '/api/business/profile') {
      const { business_id, email, business_name, address, google_location_url, contact_info, open_times, close_times, holidays, logo_url } = await req.json();

      const result = await supabase
        .from('businesses')
        .upsert({
          business_id,
          email,
          business_name,
          address,
          google_location_url,
          contact_info,
          open_times,
          close_times,
          holidays,
          logo_url,
          created_at: new Date().toISOString(),
        });

      const data = (result && 'data' in result) ? (result as any).data : undefined;
      const error = (result && 'error' in result) ? (result as any).error : undefined;

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (req.method === 'GET' && path === '/api/business/profile') {
      const { searchParams } = url;
      const business_id = searchParams.get('business_id');

      if (!business_id) {
        return new Response(JSON.stringify({ error: 'Business ID is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const result = await supabase
        .from('businesses')
        .select('*')
        .eq('business_id', business_id)
        .single();

      const data = (result && 'data' in result) ? (result as any).data : undefined;
      const error = (result && 'error' in result) ? (result as any).error : undefined;

      if (error) throw error;
      if (!data) {
        return new Response(JSON.stringify({ message: 'Business profile not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
