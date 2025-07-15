import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("+91");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Helper for mobile validation
  const isValidMobile = (value: string) => {
    // Must start with +91, then 10 digits
    return /^\+91[0-9]{10}$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else setMessage("Login successful!");
    } else if (mode === "signup") {
      // Sign up validation
      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
        setLoading(false);
        return;
      }
      if (!isValidMobile(mobile)) {
        setMessage("Mobile number must be +91 followed by 10 digits.");
        setLoading(false);
        return;
      }
      if (!fullName || !city) {
        setMessage("Please fill all fields.");
        setLoading(false);
        return;
      }
      // Sign up with metadata
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            mobile,
            city,
          },
        },
      });
      if (!error && data?.user) {
        // Insert into profiles table
        const { error: dbError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email,
              full_name: fullName,
              mobile,
              city,
            },
          ]);
        if (dbError) {
          setMessage("Sign up successful, but failed to save profile info.");
        } else {
          setMessage("Sign up successful! You can now log in.");
        }
        setTimeout(() => {
          setMode("login");
          setMessage("Sign up successful! Please log in.");
        }, 2000);
      }
    } else if (mode === "forgot") {
      // Password reset
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) setMessage(error.message);
      else setMessage("Password reset email sent! Please check your inbox.");
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) setMessage(error.message);
    setGoogleLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black to-purple-900">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-80 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-2 text-center">
          {mode === "login" ? "Sign in." : mode === "signup" ? "Sign up." : "Reset Password"}
        </h2>
        {mode !== "forgot" && (
          <>
            <Button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white text-gray-800 font-medium py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <g>
                  <path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.25s2.75-6.25 6.125-6.25c1.922 0 3.211.766 3.953 1.477l2.703-2.625c-1.703-1.57-3.906-2.523-6.656-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.75 0 9.547-4.023 9.547-9.695 0-.652-.07-1.148-.156-1.602z" fill="#4285F4"/>
                  <path d="M3.545 7.545l3.273 2.402c.891-1.781 2.578-2.947 4.457-2.947 1.312 0 2.484.453 3.406 1.344l2.555-2.555c-1.484-1.383-3.406-2.164-5.961-2.164-3.672 0-6.75 2.484-7.867 5.82z" fill="#34A853"/>
                  <path d="M12.002 22c2.484 0 4.547-.82 6.062-2.234l-2.789-2.273c-.766.523-1.75.828-3.273.828-2.523 0-4.664-1.703-5.43-4.008l-3.32 2.57c1.523 3.211 4.844 5.117 8.75 5.117z" fill="#FBBC05"/>
                  <path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.25s2.75-6.25 6.125-6.25c1.922 0 3.211.766 3.953 1.477l2.703-2.625c-1.703-1.57-3.906-2.523-6.656-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.75 0 9.547-4.023 9.547-9.695 0-.652-.07-1.148-.156-1.602z" fill="#EA4335"/>
                </g>
              </svg>
              {googleLoading ? "Signing in..." : "Sign in with Google"}
            </Button>
            <Separator />
          </>
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        {mode === "login" && (
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        )}
        {mode === "signup" && (
          <>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
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
              maxLength={13}
            />
            <Input
              type="text"
              placeholder="City"
              value={city}
              onChange={e => setCity(e.target.value)}
              required
            />
          </>
        )}
        {mode === "forgot" && (
          <div className="text-sm text-gray-700 mb-2">Enter your email to receive a password reset link.</div>
        )}
        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white">
          {loading
            ? mode === "login"
              ? "Signing in..."
              : mode === "signup"
              ? "Signing up..."
              : "Sending..."
            : mode === "login"
            ? "Sign in"
            : mode === "signup"
            ? "Sign up"
            : "Send Reset Link"}
        </Button>
        <Separator />
        <div className="text-center text-sm">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" className="text-purple-600 underline" onClick={() => setMode("signup")}>Create Account</button>
              <br />
              <button type="button" className="text-purple-600 underline" onClick={() => setMode("forgot")}>Forgot Password?</button>
            </>
          ) : mode === "signup" ? (
            <>
              Already have an account?{' '}
              <button type="button" className="text-purple-600 underline" onClick={() => setMode("login")}>Sign in</button>
            </>
          ) : (
            <>
              Remembered your password?{' '}
              <button type="button" className="text-purple-600 underline" onClick={() => setMode("login")}>Back to Sign in</button>
            </>
          )}
        </div>
        {message && (
          <div className="text-center text-sm text-red-600 mt-2">{message}</div>
        )}
      </form>
    </div>
  );
}
