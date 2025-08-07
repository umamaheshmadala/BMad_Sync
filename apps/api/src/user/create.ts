import type { Context } from "https://edge.netlify.com/";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { userId, fullName, preferredName, avatarUrl } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          user_id: userId,
          full_name: fullName,
          preferred_name: preferredName,
          avatar_url: avatarUrl,
          email: "", // Email will be set on sign-up, but for profile creation, it might not be directly available
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Profile created successfully", data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (parseError: any) {
    return new Response(JSON.stringify({ error: `Invalid JSON: ${parseError.message}` }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};
