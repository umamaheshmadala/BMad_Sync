import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function UserMenu({ userName }: { userName?: string }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate ? useNavigate() : (url: string) => { window.location.href = url; };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="relative inline-block text-left">
      <Button
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-semibold">{userName || "User"}</span>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M6 9l6 6 6-6"/></svg>
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
} 