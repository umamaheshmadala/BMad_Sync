import React, { useEffect, useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardData } from '../api/dashboard';
import { getFavorites, favoriteCoupon, unfavoriteCoupon } from '../api/favorites';

interface Offer {
  id: number;
  title: string;
  description: string;
}

interface Ad {
  id: number;
  title: string;
  imageUrl: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [hotOffers, setHotOffers] = useState<Offer[]>([]);
  const [trendingOffers, setTrendingOffers] = useState<Offer[]>([]);
  const [promotionalAds, setPromotionalAds] = useState<Ad[]>([]);
  const [favoriteBusinessIds, setFavoriteBusinessIds] = useState<string[]>([]);
  const [favoriteCouponIds, setFavoriteCouponIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('london'); // Default city

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const data = await getDashboardData(user.id, selectedCity);
        setHotOffers(data.hotOffers);
        setTrendingOffers(data.trendingOffers);
        setPromotionalAds(data.promotionalAds);
      } catch (err) {
        // Even if dashboard data fails, show a friendly message
        setError('Failed to fetch dashboard data.');
        console.error(err);
      }

      // Fetch favorites separately; non-fatal if backend not running locally
      try {
        if (user?.id) {
          const fav = await getFavorites(user.id);
          setFavoriteBusinessIds(fav.businesses);
          setFavoriteCouponIds(fav.coupons);
        }
      } catch (favErr) {
        console.warn('Fetching favorites failed; continuing without favorites.', favErr);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, selectedCity]); // Add selectedCity to dependencies

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  const toggleCouponFavorite = async (couponId: string) => {
    if (!user?.id) return;
    const isFav = favoriteCouponIds.includes(couponId);
    try {
      setFavoriteError(null);
      if (isFav) {
        await unfavoriteCoupon(user.id, couponId);
        setFavoriteCouponIds((prev) => prev.filter((id) => id !== couponId));
      } else {
        await favoriteCoupon(user.id, couponId);
        setFavoriteCouponIds((prev) => [...prev, couponId]);
      }
    } catch (e) {
      console.error(e);
      setFavoriteError('Failed to update favorite. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Bar */}
      <nav className="bg-card text-card-foreground border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Sync</h1>
        </div>
        <div className="flex items-center space-x-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-full border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>

          {/* City Selection */}
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-muted-foreground" />
            <select
              aria-label="City Selection"
              className="border border-border rounded-md py-1 px-2 bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={selectedCity}
              onChange={handleCityChange}
            >
              <option value="london">London</option>
              <option value="new-york">New York</option>
              <option value="paris">Paris</option>
            </select>
          </div>

          {/* User Avatar and Profile Dropdown */}
          <div className="relative">
            <FaUserCircle className="text-4xl text-muted-foreground cursor-pointer" />
            {/* Dropdown (placeholder) */}
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-md py-1 z-10 hidden">
              <a href="/profile" className="block px-4 py-2 hover:bg-muted">Profile</a>
              <a href="/preferences" className="block px-4 py-2 hover:bg-muted">Preferences</a>
              <button className="block w-full text-left px-4 py-2 hover:bg-muted">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold">Welcome to your Dashboard!</h2>
            <Link to="/progress" className="text-sm text-blue-600 hover:underline">View Story Progress</Link>
          </div>
        {favoriteError && (
          <div className="mb-4 text-sm text-red-600" role="alert">
            {favoriteError}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-sm border border-border">
            <h3 className="text-xl font-medium mb-2">Hot Coupon Offers</h3>
            {hotOffers.length > 0 ? (
              <ul>
                {hotOffers.map(offer => (
                  <li key={offer.id} className="mb-2">
                    <h4 className="font-semibold">{offer.title}</h4>
                    <p className="text-muted-foreground text-sm">{offer.description}</p>
                    {user?.id && (
                      <button
                        className={`mt-1 text-xs px-2 py-1 rounded ${favoriteCouponIds.includes(String(offer.id)) ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
                        onClick={() => toggleCouponFavorite(String(offer.id))}
                      >
                        {favoriteCouponIds.includes(String(offer.id)) ? 'Unfavorite' : 'Favorite'}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No hot offers available at the moment.</p>
            )}
          </div>
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-sm border border-border">
            <h3 className="text-xl font-medium mb-2">Trending Content</h3>
            {trendingOffers.length > 0 ? (
              <ul>
                {trendingOffers.map(offer => (
                  <li key={offer.id} className="mb-2">
                    <h4 className="font-semibold">{offer.title}</h4>
                    <p className="text-muted-foreground text-sm">{offer.description}</p>
                    {user?.id && (
                      <button
                        className={`mt-1 text-xs px-2 py-1 rounded ${favoriteCouponIds.includes(String(offer.id)) ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
                        onClick={() => toggleCouponFavorite(String(offer.id))}
                      >
                        {favoriteCouponIds.includes(String(offer.id)) ? 'Unfavorite' : 'Favorite'}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No trending content available at the moment.</p>
            )}
          </div>
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-sm border border-border">
            <h3 className="text-xl font-medium mb-2">Promotional Ads</h3>
            {promotionalAds.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {promotionalAds.map(ad => (
                  <div key={ad.id} className="border border-border rounded-md p-2">
                    <h4 className="font-semibold mb-1">{ad.title}</h4>
                    {ad.imageUrl && <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto rounded-md" />}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No promotional ads available at the moment.</p>
            )}
          </div>
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-sm border border-border">
            <h3 className="text-xl font-medium mb-2">Your Favorite Businesses</h3>
            {favoriteBusinessIds.length > 0 ? (
              <ul>
                {favoriteBusinessIds.map((bizId) => (
                  <li key={bizId} className="mb-2 text-sm text-muted-foreground">{bizId}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No favorites yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
