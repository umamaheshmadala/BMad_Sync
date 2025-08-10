export const favoriteBusiness = async (userId: string, businessId: string) => {
  if ((globalThis as any).__VITE_E2E_MOCK__) return { success: true };
  const res = await fetch(`/api/user/favorites/business?userId=${encodeURIComponent(userId)}&businessId=${encodeURIComponent(businessId)}`, {
    method: 'POST',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to favorite business');
  return data;
};

export const unfavoriteBusiness = async (userId: string, businessId: string) => {
  if ((globalThis as any).__VITE_E2E_MOCK__) return { success: true };
  const res = await fetch(`/api/user/favorites/business?userId=${encodeURIComponent(userId)}&businessId=${encodeURIComponent(businessId)}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to unfavorite business');
  return data;
};

export const favoriteCoupon = async (userId: string, couponId: string) => {
  if ((globalThis as any).__VITE_E2E_MOCK__) return { success: true };
  const res = await fetch(`/api/user/favorites/coupon?userId=${encodeURIComponent(userId)}&couponId=${encodeURIComponent(couponId)}`, {
    method: 'POST',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to favorite coupon');
  return data;
};

export const unfavoriteCoupon = async (userId: string, couponId: string) => {
  if ((globalThis as any).__VITE_E2E_MOCK__) return { success: true };
  const res = await fetch(`/api/user/favorites/coupon?userId=${encodeURIComponent(userId)}&couponId=${encodeURIComponent(couponId)}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to unfavorite coupon');
  return data;
};

export const getFavorites = async (userId: string) => {
  if ((globalThis as any).__VITE_E2E_MOCK__) return { businesses: [], coupons: [] };
  const res = await fetch(`/api/user/favorites?userId=${encodeURIComponent(userId)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch favorites');
  return data as { businesses: string[]; coupons: string[] };
};


