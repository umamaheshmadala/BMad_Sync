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

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required for update" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    const updateData: { full_name?: string; preferred_name?: string; avatar_url?: string } = {};
    if (fullName !== undefined) updateData.full_name = fullName;
    if (preferredName !== undefined) updateData.preferred_name = preferredName;
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("user_id", userId)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (data && data.length === 0) {
      return new Response(JSON.stringify({ error: "User profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Profile updated successfully", data }), {
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
