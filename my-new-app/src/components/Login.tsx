import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const floatingPinkPurple = {
  animation: "float 8s ease-in-out infinite",
};
const floatingGray = {
  animation: "float2 10s ease-in-out infinite",
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setTimeout(() => setGoogleLoading(false), 1200);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-[#121212] overflow-hidden font-sans"
      style={{ fontFamily: "Inter, Noto Sans, sans-serif" }}
    >
      {/* Floating gradient circles */}
      <div
        className="absolute top-[-120px] left-[-120px] w-[340px] h-[340px] rounded-full z-0"
        style={{
          ...floatingPinkPurple,
          background:
            "radial-gradient(circle at 30% 30%, #ff4da6 60%, #7c3aed 100%)",
          opacity: 0.55,
        }}
      />
      <div
        className="absolute top-10 right-[-60px] w-[160px] h-[160px] rounded-full z-0"
        style={{
          ...floatingGray,
          background:
            "radial-gradient(circle at 70% 40%, #23222a 60%, #000 100%)",
          opacity: 0.45,
        }}
      />
      {/* Centered card */}
      <div className="relative z-10 w-full max-w-md mx-auto bg-[#18171d]/90 rounded-2xl shadow-2xl px-6 py-8 sm:px-10 sm:py-12 flex flex-col items-center border border-[#23222a] backdrop-blur-md animate-fade-in">
        <h2 className="text-white text-3xl font-bold mb-8 text-center tracking-tight">
          Sign in.
        </h2>
        <div className="w-full flex flex-col gap-4 mb-4">
          <Button
            variant="outline"
            className="w-full rounded-full border border-white/30 text-white font-medium flex items-center gap-2 py-4 text-base hover:bg-white/10 transition-colors"
            onClick={handleGoogleLogin}
            type="button"
            disabled={googleLoading}
          >
            {/* Google Icon */}
            <svg width="20" height="20" viewBox="0 0 48 48">
              <g>
                <path
                  fill="#4285F4"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.61l6.85-6.85C35.63 2.7 30.23 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.19C12.36 13.13 17.73 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.66 7.01l7.19 5.59C43.98 37.13 46.1 31.36 46.1 24.55z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.67 28.18a14.5 14.5 0 0 1 0-8.36l-7.98-6.19A23.97 23.97 0 0 0 0 24c0 3.77.9 7.34 2.69 10.45l7.98-6.27z"
                />
                <path
                  fill="#EA4335"
                  d="M24 48c6.23 0 11.45-2.06 15.26-5.61l-7.19-5.59c-2.01 1.35-4.59 2.16-8.07 2.16-6.27 0-11.64-3.63-13.33-8.64l-7.98 6.27C6.73 42.18 14.82 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </g>
            </svg>
            Continue with Google
          </Button>
        </div>
        <div className="w-full flex items-center my-4">
          <Separator className="flex-grow bg-white/10" />
          <span className="mx-3 text-[#b0b0b0] text-xs font-medium">or</span>
          <Separator className="flex-grow bg-white/10" />
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-full border border-white/20 bg-[#1e1e1e] px-5 py-3 text-white placeholder:text-[#b0b0b0] focus:outline-none focus:ring-2 focus:ring-[#ff4da6] text-base"
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-full border border-white/20 bg-[#1e1e1e] px-5 py-3 text-white placeholder:text-[#b0b0b0] focus:outline-none focus:ring-2 focus:ring-[#ff4da6] text-base"
            required
          />
          <Button
            type="submit"
            className="w-full rounded-full py-3 font-bold text-white text-base bg-gradient-to-r from-[#ff007a] to-[#ff4da6] shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200 disabled:opacity-60 mt-2"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="w-full flex flex-col items-center mt-6 gap-2">
          <span className="text-white text-sm">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="underline hover:text-[#ff4da6] transition-colors"
            >
              Create Account
            </a>
          </span>
          <a
            href="#"
            className="text-white text-sm font-bold underline hover:text-[#ff4da6] transition-colors"
          >
            Forgot Password?
          </a>
        </div>
      </div>
      {/* Custom keyframes for floating and fade-in */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(30px) scale(1.04); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
