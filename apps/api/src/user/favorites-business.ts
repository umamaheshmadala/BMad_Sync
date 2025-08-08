import type { Context } from "https://edge.netlify.com/";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export default async (req: Request, _context: Context) => {
  const url = new URL(req.url);
  const method = req.method.toUpperCase();

  if (method !== "POST" && method !== "DELETE") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userId = url.searchParams.get("userId");
  const businessId = url.searchParams.get("businessId");

  if (!userId || !businessId) {
    return new Response(
      JSON.stringify({ error: "userId and businessId are required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    if (method === "POST") {
      const { data, error } = await supabase
        .from("business_follows")
        .upsert({ user_id: userId, business_id: businessId, receive_notifications: true })
        .select();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ message: "Business favorited", data: data?.[0] ?? null }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // DELETE -> unfavorite
    const { error } = await supabase
      .from("business_follows")
      .delete()
      .eq("user_id", userId)
      .eq("business_id", businessId);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Business unfavorited" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: `Server error: ${err.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};


