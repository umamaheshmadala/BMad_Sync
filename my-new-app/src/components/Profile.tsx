import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Profile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('full_name, mobile, city, email')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (data) {
            setFullName(data.full_name || "");
            setMobile(data.mobile || "");
            setCity(data.city || "");
          }
        });
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        mobile,
        city,
      })
      .eq('id', user.id);
    if (error) setMessage(error.message);
    else setMessage("Profile updated successfully!");
    setLoading(false);
  };

  if (!user) return <div className="p-8">You must be logged in to view your profile.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black to-purple-900">
      <form onSubmit={handleUpdate} className="bg-white p-8 rounded-lg shadow-md w-80 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-2 text-center">Profile</h2>
        <Input
          type="email"
          value={user.email}
          disabled
          className="bg-gray-100 cursor-not-allowed"
        />
        <Input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Mobile Number (e.g. +911234567890)"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        {message && (
          <div className="text-center text-sm text-red-600 mt-2">{message}</div>
        )}
      </form>
    </div>
  );
} 