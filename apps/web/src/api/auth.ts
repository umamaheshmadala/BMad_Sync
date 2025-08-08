import { supabase } from '../lib/supabaseClient';

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

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
  const { error } = await supabase.auth.signOut();

  if (error) {
    let errorMessage = 'Failed to log out.';
    errorMessage = error.message; // Fallback to raw message
    throw new Error(errorMessage);
  }
};