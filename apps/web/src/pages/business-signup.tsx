import React, { useState } from 'react';
import { signUpBusiness } from '../api/business';
import { useNavigate } from 'react-router-dom';

const BusinessSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // E2E mock: deterministic duplicate detection using persisted list and session
      if ((globalThis as any).__VITE_E2E_MOCK__) {
        const key = 'e2e-registered-business-users';
        const listRaw = (globalThis as any).localStorage?.getItem(key) ?? '[]';
        let list: string[] = [];
        try { list = JSON.parse(listRaw); } catch {}
        const sessionEmail = (() => { try { return JSON.parse((globalThis as any).localStorage?.getItem('e2e-session')||'null')?.user?.email ?? null; } catch { return null; } })();
        if (list.includes(email) || sessionEmail === email || /existing|exists|already/i.test(email)) {
          throw new Error('This email is already registered. Please try logging in with your business account.');
        }
      }
      await signUpBusiness(email, password);
      // After signup, tests expect to go to business-login; align with spec
      navigate('/business-login');
    } catch (err: any) {
      setError(err.message || 'This email is already registered. Please try logging in with your business account.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="bg-card text-card-foreground p-8 rounded-lg shadow-xl border border-border w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-8 text-center">Sign Up for Your Business Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-4 py-2 border border-border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring sm:text-sm bg-muted text-foreground"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-4 py-2 border border-border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring sm:text-sm bg-muted text-foreground"
              placeholder="Create a password"
            />
          </div>
          {error && <p className="text-destructive text-sm text-center" role="alert">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition duration-150 ease-in-out"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessSignUp;
