import { supabase } from '../lib/supabaseClient';
import { BusinessProfile } from '@sync/shared-types';

const isE2eMock = Boolean((globalThis as any).__VITE_E2E_MOCK__);

export const signUpBusiness = async (email: string, password: string) => {
  if (isE2eMock) {
    // Track business emails to simulate duplicates
    try {
      const key = 'e2e-registered-business-users';
      const listRaw = (globalThis as any).localStorage?.getItem(key) ?? '[]';
      let list: string[] = [];
      try { list = JSON.parse(listRaw); } catch {}
      if (list.includes(email) || /exists|already/i.test(email)) {
        throw new Error('This email is already registered. Please try logging in with your business account.');
      }
      list.push(email);
      try { (globalThis as any).localStorage?.setItem(key, JSON.stringify(list)); } catch {}
    } catch {}
    const user = { id: 'e2e-business', email, user_metadata: { is_business: true } } as any;
    ;(globalThis as any).__E2E_SESSION__ = { user };
    return { user, session: null } as any;
  }
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { is_business: true } } });

  if (error) {
    let errorMessage = 'An unknown error occurred during business signup.';
    if (error.message.includes('User already registered')) {
      errorMessage = 'This email is already registered. Please try logging in with your business account.';
    } else if (error.message.includes('Password should be at least 6 characters')) {
      errorMessage = 'Password must be at least 6 characters long.';
    } else {
      errorMessage = error.message; // Fallback to raw message for unhandled errors
    }
    throw new Error(errorMessage);
  }
  return { user: data.user, session: data.session };
};

export const loginBusiness = async (email: string, password: string) => {
  if (isE2eMock) {
    const user = { id: 'e2e-business', email, user_metadata: { is_business: true } } as any;
    ;(globalThis as any).__E2E_SESSION__ = { user };
    return { user, session: null } as any;
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    let errorMessage = 'An unknown error occurred during business login.';
    if (error.message.includes('Invalid login credentials')) {
      errorMessage = 'Invalid email or password for business account. Please try again.';
    } else {
      errorMessage = error.message; // Fallback to raw message
    }
    throw new Error(errorMessage);
  }
  // Optional: Verify if the logged-in user is a business user
  // This would typically involve checking a `user_metadata` field or a separate `profiles` table
  // For now, we assume successful login implies the correct user type.
  return { user: data.user, session: data.session };
};

export const createBusinessProfile = async (profileData: Partial<BusinessProfile & { logo_url?: string }>, logoFile?: File) => {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error('User not logged in');
  }
  const business_id = user.data.user.id;

  let logo_url = (profileData as any).logo_url || '';
  if (logoFile) {
    if (isE2eMock) {
      logo_url = `${business_id}.png`;
    } else {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${business_id}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('business-logos')
        .upload(fileName, logoFile, {
          cacheControl: '3600',
          upsert: true,
        });
      if (uploadError) throw uploadError;
      logo_url = data.path;
    }
  }

  if (isE2eMock) {
    const doc = {
      ...profileData,
      business_id,
      email: user.data.user.email,
      logo_url,
    } as any;
    localStorage.setItem('e2e-business-profile', JSON.stringify(doc));
    return doc;
  }
  const response = await fetch('/api/business/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...profileData, business_id, email: user.data.user.email, logo_url }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to create/update business profile');
  return data;
};

export const getBusinessProfile = async (businessId: string) => {
  if (isE2eMock) {
    const raw = localStorage.getItem('e2e-business-profile');
    if (!raw) throw new Error('Not Found');
    return JSON.parse(raw);
  }
  const response = await fetch(`/api/business/profile?business_id=${businessId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch business profile');
  return data;
};
