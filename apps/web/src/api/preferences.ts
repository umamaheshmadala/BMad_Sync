import { supabase } from '../lib/supabaseClient';

export const getUserPreferences = async (userId: string) => {
  if ((globalThis as any).__VITE_E2E_MOCK__) {
    try {
      const raw = localStorage.getItem('e2e-user-profile');
      if (raw) {
        const doc = JSON.parse(raw);
        return doc?.privacy_settings ?? { adFrequency: 'medium', excludeCategories: [] };
      }
    } catch {}
    return { adFrequency: 'medium', excludeCategories: ['Tech'] };
  }
  const { data, error } = await supabase
    .from('users')
    .select('privacy_settings')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data?.privacy_settings ?? { adFrequency: 'medium', excludeCategories: [] };
};

export const updateUserPreferences = async (userId: string, prefs: any) => {
  if ((globalThis as any).__VITE_E2E_MOCK__) {
    try {
      const raw = localStorage.getItem('e2e-user-profile');
      const existing = raw ? JSON.parse(raw) : { user_id: userId };
      const updated = { ...existing, privacy_settings: prefs };
      localStorage.setItem('e2e-user-profile', JSON.stringify(updated));
    } catch {}
    return { success: true };
  }
  const { error } = await supabase
    .from('users')
    .update({ privacy_settings: prefs })
    .eq('user_id', userId);
  if (error) throw error;
  return { success: true };
};


