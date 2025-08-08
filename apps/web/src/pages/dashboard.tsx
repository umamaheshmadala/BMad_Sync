import React, { useEffect, useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getDashboardData } from '../api/dashboard';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, selectedCity]); // Add selectedCity to dependencies

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
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
        <h2 className="text-3xl font-semibold mb-6">Welcome to your Dashboard!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-sm border border-border">
            <h3 className="text-xl font-medium mb-2">Hot Coupon Offers</h3>
            {hotOffers.length > 0 ? (
              <ul>
                {hotOffers.map(offer => (
                  <li key={offer.id} className="mb-2">
                    <h4 className="font-semibold">{offer.title}</h4>
                    <p className="text-muted-foreground text-sm">{offer.description}</p>
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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
