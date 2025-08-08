import type { Context } from "https://edge.netlify.com/";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export default async (req: Request, _context: Context) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "userId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    const { data: favBusinesses, error: favBizErr } = await supabase
      .from("business_follows")
      .select("business_id")
      .eq("user_id", userId)
      .eq("receive_notifications", true);

    if (favBizErr) {
      return new Response(JSON.stringify({ error: favBizErr.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: favCoupons, error: favCouponErr } = await supabase
      .from("user_coupons")
      .select("coupon_id")
      .eq("user_id", userId)
      .eq("is_favorite", true);

    if (favCouponErr) {
      return new Response(JSON.stringify({ error: favCouponErr.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        businesses: favBusinesses?.map((b) => b.business_id) ?? [],
        coupons: favCoupons?.map((c) => c.coupon_id) ?? [],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: `Server error: ${err.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};


