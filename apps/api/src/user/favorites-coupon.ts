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
  const couponId = url.searchParams.get("couponId");

  if (!userId || !couponId) {
    return new Response(
      JSON.stringify({ error: "userId and couponId are required" }),
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
        .from("user_coupons")
        .upsert({ user_id: userId, coupon_id: couponId, is_favorite: true })
        .select();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ message: "Coupon favorited", data: data?.[0] ?? null }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // DELETE -> unfavorite
    const { error } = await supabase
      .from("user_coupons")
      .update({ is_favorite: false })
      .eq("user_id", userId)
      .eq("coupon_id", couponId);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Coupon unfavorited" }), {
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


