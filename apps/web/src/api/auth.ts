import { supabase } from '../lib/supabaseClient';

const isE2eMock = Boolean((globalThis as any).__VITE_E2E_MOCK__);

export const signUp = async (email: string, password: string) => {
  if (isE2eMock) {
    // Track previously registered emails in localStorage to simulate duplicates
    try {
      const key = 'e2e-registered-users';
      const listRaw = (globalThis as any).localStorage?.getItem(key) ?? '[]';
      let list: string[] = [];
      try { list = JSON.parse(listRaw); } catch {}
      // Consider current synthetic session as already registered for that email
      let sessionEmail: string | null = null;
      try { sessionEmail = JSON.parse((globalThis as any).localStorage?.getItem('e2e-session') || 'null')?.user?.email ?? null; } catch { sessionEmail = null; }
      if (list.includes(email) || sessionEmail === email || /exists|already/i.test(email)) {
        throw new Error('This email is already registered. Please try logging in.');
      }
      list.push(email);
      try { (globalThis as any).localStorage?.setItem(key, JSON.stringify(list)); } catch {}
    } catch {}
    const user = { id: 'e2e-user', email } as any;
    ;(globalThis as any).__E2E_SESSION__ = { user };
    return { user, session: null };
  }
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    let errorMessage = 'An unknown error occurred during signup.';
    if (error.message.includes('User already registered')) {
      errorMessage = 'This email is already registered. Please try logging in.';
    } else if (error.message.includes('Password should be at least 6 characters')) {
      errorMessage = 'Password must be at least 6 characters long.';
    } else {
      errorMessage = error.message; // Fallback to raw message for unhandled errors
    }
    throw new Error(errorMessage);
  }
  return { user: data.user, session: data.session };
};

export const login = async (email: string, password: string) => {
  if (isE2eMock) {
    const user = { id: 'e2e-user', email } as any;
    ;(globalThis as any).__E2E_SESSION__ = { user };
    return { user, session: null } as any;
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    let errorMessage = 'An unknown error occurred during login.';
    if (error.message.includes('Invalid login credentials')) {
      errorMessage = 'Invalid email or password. Please try again.';
    } else {
      errorMessage = error.message; // Fallback to raw message
    }
    throw new Error(errorMessage);
  }
  return { user: data.user, session: data.session };
};

export const signInWithGoogle = async () => {
  if (isE2eMock) {
    window.location.assign('https://accounts.google.com/o/oauth2/v2/auth');
    return { data: null } as any;
  }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin, // Redirects back to the current origin after successful Google login
      scopes: 'https://www.googleapis.com/auth/userinfo.email',
    },
  });

  if (error) {
    let errorMessage = 'Failed to sign in with Google.';
    if (error.message.includes('Popup closed by user')) {
      errorMessage = 'Google sign-in was cancelled.';
    } else {
      errorMessage = error.message; // Fallback to raw message
    }
    throw new Error(errorMessage);
  }
  return { data };
};

export const logout = async () => {
  if (isE2eMock) {
    ;(globalThis as any).__E2E_SESSION__ = null;
    return;
  }
  const { error } = await supabase.auth.signOut();

  if (error) {
    let errorMessage = 'Failed to log out.';
    errorMessage = error.message; // Fallback to raw message
    throw new Error(errorMessage);
  }
};