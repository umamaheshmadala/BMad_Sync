import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFavorites, unfavoriteCoupon } from '../api/favorites';

const CouponWalletPage: React.FC = () => {
  const { user } = useAuth();
  const [favoriteCoupons, setFavoriteCoupons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const fav = await getFavorites(user.id);
        setFavoriteCoupons(fav.coupons);
      } catch (e: any) {
        setError(e.message || 'Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, [user]);

  const handleUnfavorite = async (couponId: string) => {
    if (!user?.id) return;
    try {
      setActionError(null);
      await unfavoriteCoupon(user.id, couponId);
      setFavoriteCoupons((prev) => prev.filter((id) => id !== couponId));
    } catch (e) {
      console.error(e);
      setActionError('Failed to unfavorite coupon. Please try again.');
    }
  };

  if (loading) return <div className="text-center mt-8">Loading wallet...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-sm border border-border mt-8">
      <h2 className="text-2xl font-bold mb-4">Coupon Wallet</h2>
      {actionError && (
        <div className="mb-4 text-sm text-red-600" role="alert">
          {actionError}
        </div>
      )}
      {favoriteCoupons.length === 0 ? (
        <p className="text-muted-foreground">No favorited coupons yet.</p>
      ) : (
        <ul className="space-y-2">
          {favoriteCoupons.map((couponId) => (
            <li key={couponId} className="flex items-center justify-between border border-border rounded p-3">
              <div>
                <p className="text-sm text-muted-foreground">Coupon ID</p>
                <p className="font-semibold">{couponId}</p>
              </div>
              <button
                onClick={() => handleUnfavorite(couponId)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1 rounded"
              >
                Unfavorite
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CouponWalletPage;


