import { serve } from "std/server";

serve(async (req) => {
  return new Response(JSON.stringify({ message: "Hello from Edge Function!" }), {
    headers: { "Content-Type": "application/json" },
  });
});
