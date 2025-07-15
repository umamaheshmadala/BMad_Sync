import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TestSupabase() {
  const [status, setStatus] = useState("Testing...");

  useEffect(() => {
    // Try to get the current session (does not require any table)
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) {
          setStatus("Supabase client error: " + error.message);
        } else {
          setStatus("Supabase client is working! (Session: " + (data.session ? "Exists" : "None") + ")");
        }
      });
  }, []);

  return (
    <div style={{ background: "yellow", color: "black", padding: 20, fontSize: 24, zIndex: 9999, position: "fixed", top: 0, right: 0 }}>
      <strong>Supabase Test:</strong> {status}
    </div>
  );
}
