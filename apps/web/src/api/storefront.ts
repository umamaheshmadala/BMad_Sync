import { supabase } from '../lib/supabaseClient';
import { StorefrontProfile } from '@sync/shared-types';

const isE2eMock = Boolean((globalThis as any).__VITE_E2E_MOCK__);

export const createStorefront = async (storefrontData: Partial<StorefrontProfile>, bannerFile?: File) => {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error('User not logged in');
  }
  const business_id = user.data.user.id;

  let promotional_banner_url = storefrontData.promotional_banner_url || '';
  if (bannerFile) {
    if (isE2eMock) {
      promotional_banner_url = `${business_id}-banner.png`;
    } else {
      const fileExt = bannerFile.name.split('.').pop();
      const fileName = `${business_id}-banner.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('storefront-banners')
        .upload(fileName, bannerFile, {
          cacheControl: '3600',
          upsert: true,
        });
      if (uploadError) throw uploadError;
      promotional_banner_url = data.path;
    }
  }

  if (isE2eMock) {
    const doc = { ...storefrontData, business_id, promotional_banner_url } as any;
    localStorage.setItem('e2e-storefront', JSON.stringify(doc));
    return doc;
  }
  const response = await fetch('/api/business/storefront', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...storefrontData, business_id, promotional_banner_url }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to create/update storefront');
  return data;
};

export const getStorefront = async (businessId: string) => {
  if (isE2eMock) {
    const raw = localStorage.getItem('e2e-storefront');
    if (!raw) throw new Error('Not Found');
    return JSON.parse(raw);
  }
  const response = await fetch(`/api/business/storefront?business_id=${businessId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch storefront');
  return data;
};
