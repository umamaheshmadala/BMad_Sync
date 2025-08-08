import { supabase } from '../lib/supabaseClient';
import { StorefrontProfile } from '../../../packages/shared-types/src';

export const createStorefront = async (storefrontData: Partial<StorefrontProfile>, bannerFile?: File) => {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error('User not logged in');
  }
  const business_id = user.data.user.id;

  let promotional_banner_url = storefrontData.promotional_banner_url || '';
  if (bannerFile) {
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

  const response = await fetch('/api/business/storefront', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...storefrontData,
      business_id,
      promotional_banner_url,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create/update storefront');
  }
  return data;
};

export const getStorefront = async (businessId: string) => {
  const response = await fetch(`/api/business/storefront?business_id=${businessId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch storefront');
  }
  return data;
};
