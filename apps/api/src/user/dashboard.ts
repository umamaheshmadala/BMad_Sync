import type { Context } from "https://edge.netlify.com/";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export default async (req: Request, context: Context) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    // Fetch user profile to get city, interests, and privacy settings
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("city, interests, privacy_settings")
      .eq("user_id", userId)
      .single();

    if (userError) {
      console.error("Supabase user fetch error:", userError);
      return new Response(JSON.stringify({ error: userError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!userData) {
      return new Response(JSON.stringify({ error: "User profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { city, interests, privacy_settings } = userData;

    // Mock data based on user's city, interests, and privacy settings
    // In a real application, this would involve more complex logic
    // and database queries to fetch actual offers and ads.
    const hotOffers = [
      { id: 1, title: `Hot Pizza in ${city || 'Your City'}`, description: 'Get 50% off all pizzas!' },
      { id: 2, title: `Hot Coffee in ${city || 'Your City'}`, description: 'Buy one get one free coffee!' },
    ];

    const trendingOffers = [
      { id: 3, title: `Trending New Restaurant in ${city || 'Your City'}`, description: 'Check out the hottest new eatery!' },
      { id: 4, title: `Trending Yoga Classes for ${interests?.[0] || 'Wellness'}`, description: 'Discover your inner peace.' },
    ];

    const promotionalAds = [
      { id: 5, title: `Ad for ${interests?.[0] || 'Fashion'} Sale`, imageUrl: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Ad1' },
      { id: 6, title: `Ad for ${interests?.[1] || 'Tech'} Gadgets`, imageUrl: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=Ad2' },
    ];

    return new Response(JSON.stringify({
      message: "Dashboard data fetched successfully",
      data: {
        user: userData,
        hotOffers,
        trendingOffers,
        promotionalAds,
      },
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Server error:", err);
    return new Response(JSON.stringify({ error: `Server error: ${err.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
