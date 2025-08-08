import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import { UserProfile, BusinessProfile } from "@sync/shared-types";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  businessProfile: BusinessProfile | null;
  loading: boolean;
  onboardingComplete: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  getUserProfile: () => Promise<void>;
  getBusinessProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>; // Add this line
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [businessProfile, setBusinessProfile] =
    useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    console.log("AuthContext useEffect: Initializing auth listener and session check.");
    // Safety timeout in case Supabase session init hangs
    const loadingTimeoutId = setTimeout(() => {
      console.warn("AuthContext: Forcing loading=false after timeout");
      setLoading(false);
    }, 10000);

    const handleSession = async (session: User | null) => {
      console.log("handleSession: Session received:", session ? session.id : "null");
      if (session) {
        setUser(session);
        console.log("handleSession: User set to", session.id);
        try {
          console.log("handleSession: Fetching user profile for", session.id);
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 7000);
          await getUserProfile(session.id);
          clearTimeout(timeout);
          console.log("handleSession: User profile fetched.");

          // If user profile is still null, bootstrap a minimal row
          try {
            const { data: existing } = await supabase
              .from('users')
              .select('user_id')
              .eq('user_id', session.id)
              .single();
            if (!existing) {
              console.log("handleSession: Bootstrapping users row for", session.id);
              await supabase
                .from('users')
                .insert({ user_id: session.id, email: (session as any).email ?? session.user_metadata?.email ?? null })
                .select()
                .single();
            }
          } catch (e) {
            console.warn("handleSession: Bootstrap users row attempt warning:", (e as any)?.message ?? e);
          }

          const { data: profileData } = await Promise.race([
            supabase
              .from('users')
              .select('onboarding_complete')
              .eq('user_id', session.id)
              .single(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout fetching onboarding status.')), 7000)),
          ]) as any;

          if (profileData && (profileData.onboarding_complete === true)) {
            setOnboardingComplete(true);
            console.log("handleSession: Onboarding complete.");
          } else {
            setOnboardingComplete(false);
            console.log("handleSession: Onboarding not complete.");
          }
        } catch (error) {
          console.error("handleSession: Error handling session data:", error);
          setUserProfile(null);
          setBusinessProfile(null);
          setOnboardingComplete(false);
        } finally {
          console.log("handleSession: Setting loading to false.");
          clearTimeout(loadingTimeoutId);
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setBusinessProfile(null);
        setOnboardingComplete(false);
        console.log("handleSession: No session, setting loading to false.");
        clearTimeout(loadingTimeoutId);
        setLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("onAuthStateChange event:", event, "session:", session ? session.user?.id : "null");
        await handleSession(session?.user || null);
      },
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial getSession: session:", session ? session.user?.id : "null");
      await handleSession(session?.user || null);
    });

    return () => {
      console.log("AuthContext useEffect cleanup: Unsubscribing from auth listener.");
      authListener.subscription.unsubscribe();
      clearTimeout(loadingTimeoutId);
    };
  }, []);

  const withTimeout = async <T,>(promise: Promise<T>, ms: number, label: string): Promise<T | null> => {
    let timeoutId: any;
    try {
      const result = await Promise.race<unknown>([
        promise,
        new Promise<null>((resolve) => {
          timeoutId = setTimeout(() => {
            console.warn(`${label}: timed out after ${ms}ms`);
            resolve(null);
          }, ms);
        }),
      ]);
      return result as T | null;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("signIn: Attempting sign in for", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("signIn: Error during sign in:", error);
      throw error;
    }
    setUser(data.user);
    console.log("signIn: User set after sign in", data.user?.id);
    if (data.user) {
      await getUserProfile(data.user.id);
      console.log("signIn: User profile fetched after sign in.");
      const { data: profileData } = await Promise.race([
        supabase
          .from('users')
          .select('onboarding_complete')
          .eq('user_id', data.user.id)
          .single(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout fetching onboarding status.')), 7000)),
      ]) as any;

      if (profileData && (profileData.onboarding_complete === true)) {
        setOnboardingComplete(true);
        console.log("signIn: Onboarding complete after sign in.");
      } else {
        setOnboardingComplete(false);
        console.log("signIn: Onboarding not complete after sign in.");
      }
      if (data.user?.user_metadata?.is_business) {
        await getBusinessProfile(data.user.id);
        console.log("signIn: Business profile fetched after sign in.");
      }
    }
    console.log("signIn: Returning data, loading should be false now.");
    setLoading(false); // Ensure loading is set to false after sign-in
    return data;
  };

  const signUp = async (email: string, password: string) => {
    console.log("signUp: Attempting sign up for", email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error("signUp: Error during sign up:", error);
      throw error;
    }
    setUser(data.user);
    console.log("signUp: User set after sign up", data.user?.id);
    if (data.user) {
      await getUserProfile(data.user.id);
      console.log("signUp: User profile fetched after sign up.");
      const { data: profileData } = await Promise.race([
        supabase
          .from('users')
          .select('onboarding_complete')
          .eq('user_id', data.user.id)
          .single(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout fetching onboarding status.')), 7000)),
      ]) as any;

      if (profileData && (profileData.onboarding_complete === true)) {
        setOnboardingComplete(true);
        console.log("signUp: Onboarding complete after sign up.");
      } else {
        setOnboardingComplete(false);
        console.log("signUp: Onboarding not complete after sign up.");
      }
      if (data.user?.user_metadata?.is_business) {
        await getBusinessProfile(data.user.id);
        console.log("signUp: Business profile fetched after sign up.");
      }
    }
    console.log("signUp: Returning data, loading should be false now.");
    setLoading(false); // Ensure loading is set to false after sign-up
    return data;
  };

  const logout = async () => {
    console.log("signOut: Attempting sign out.");
    // Never hang the UI on sign-out; proceed after max 3s
    try {
      const result = await withTimeout(supabase.auth.signOut(), 3000, 'signOut');
      const error = (result as any)?.error;
      if (error) console.error("signOut: Error during sign out:", error);
    } catch (e) {
      console.error("signOut: Exception during sign out:", e);
    }
    // Always clear local auth state, even if remote signOut fails
    setUser(null);
    setUserProfile(null);
    setBusinessProfile(null);
    setOnboardingComplete(false);
    console.log("signOut: User logged out, loading should be false now.");
    setLoading(false); // Ensure loading is set to false after sign-out
  };

  const getUserProfile = async (userId: string) => {
    console.log("getUserProfile: Fetching profile for", userId);
    try {
      const raceResult: any = await Promise.race([
        supabase.from("users").select("*").eq("user_id", userId).single(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout fetching user profile.")), 5000)),
      ]);
      const { data, error } = raceResult || {};

      if (error) {
        console.error("getUserProfile: Error details:", error.message, error.details, error.hint);
        setUserProfile(null);
        throw error; // Rethrow for caller handling
      } else if (data) {
        setUserProfile(data as UserProfile);
        console.log("getUserProfile: Profile data:", data);
      } else {
        console.log("getUserProfile: No user profile found for ID:", userId);
        setUserProfile(null);
      }
    } catch (err: any) {
      console.error("getUserProfile: Uncaught error (or timeout):", err.message);
      setUserProfile(null); // Ensure null on failure
    }
  };

  const getBusinessProfile = async (businessId: string) => {
    console.log("getBusinessProfile: Fetching business profile for", businessId);
    try {
      const response = await fetch(
        `/api/business/profile?business_id=${businessId}`,
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch business profile");
      }
      setBusinessProfile(data as BusinessProfile);
      console.log("getBusinessProfile: Business profile data:", data);
    } catch (error) {
      console.error("getBusinessProfile: Error fetching business profile:", error);
      setBusinessProfile(null);
      // Removed setLoading(false) here as it's handled in handleSession finally block
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    console.log("updateUserProfile: Updating profile for user.", updates);
    const user = supabase.auth.getUser();
    if (!user) {
      console.error("updateUserProfile: User not logged in.");
      throw new Error("User not logged in");
    }

    const updateResult = await withTimeout(
      (supabase
        .from("users")
        .update(updates)
        .eq("user_id", (await user).data.user?.id) as unknown as Promise<any>),
      7000,
      'updateUserProfile'
    );
    const error = (updateResult as any)?.error ?? null;

    if (error) {
      console.warn("updateUserProfile: Client update failed, attempting server-side update via Edge Function.");
      // Fallback to server-side update using service role
      const userId = (await user).data.user?.id as string;
      const body: any = { userId };
      if ((updates as any).full_name) body.fullName = (updates as any).full_name;
      if ((updates as any).preferred_name) body.preferredName = (updates as any).preferred_name;
      if ((updates as any).avatar_url) body.avatarUrl = (updates as any).avatar_url;
      if (typeof (updates as any).city !== 'undefined') body.city = (updates as any).city;
      if (typeof (updates as any).interests !== 'undefined') body.interests = (updates as any).interests;
      if (typeof (updates as any).onboarding_complete !== 'undefined') body.onboarding_complete = (updates as any).onboarding_complete;

      const resp = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const j = await resp.json().catch(() => ({}));
        console.error("updateUserProfile: Edge Function update failed:", j?.error || resp.statusText);
        throw new Error(j?.error || 'Failed to update user profile');
      }
    }
    // Optimistically update local state to keep UX responsive
    setUserProfile((prev) => ({ ...(prev ?? {} as any), ...(updates as any) }));
    if (typeof (updates as any).onboarding_complete !== 'undefined') {
      setOnboardingComplete(Boolean((updates as any).onboarding_complete));
    }

    // Best-effort refresh from server, but don't block navigation if it times out
    try {
      await getUserProfile((await user).data.user?.id || "");
      console.log("updateUserProfile: User profile updated, re-fetching onboarding status.");
      const statusResult = await withTimeout(
        supabase.from('users').select('onboarding_complete').eq('user_id', (await user).data.user?.id).single() as unknown as Promise<any>,
        5000,
        'updateUserProfile:fetchOnboarding'
      );
      const profileData = (statusResult as any)?.data;
      if (profileData && (profileData.onboarding_complete === true)) {
        setOnboardingComplete(true);
        console.log("updateUserProfile: Onboarding complete after update.");
      }
    } catch (e) {
      console.warn('updateUserProfile: Skipping server confirmation due to timeout/error. Using optimistic state.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        businessProfile,
        loading,
        onboardingComplete,
        signIn,
        signUp,
        logout,
        // Provide signOut alias to maintain backward compatibility with tests/components
        signOut: logout,
        getUserProfile: () => getUserProfile(user?.id || ''),
        getBusinessProfile: () => getBusinessProfile(user?.id || ''),
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};