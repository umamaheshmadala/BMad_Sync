import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Sync</h1>
          {/* Navigation Links (if any) */}
        </div>
        <div className="flex items-center space-x-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* City Selection */}
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-gray-600" />
            <select
              className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <FaUserCircle className="text-4xl text-gray-600 cursor-pointer" />
            {/* Dropdown Menu (hidden by default) */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
              <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</Link>
              <Link to="/preferences" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Preferences</Link>
              <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Welcome to your Dashboard!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Hot Coupon Offers</h3>
            {hotOffers.length > 0 ? (
              <ul>
                {hotOffers.map(offer => (
                  <li key={offer.id} className="mb-2">
                    <h4 className="font-semibold">{offer.title}</h4>
                    <p className="text-gray-600 text-sm">{offer.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No hot offers available at the moment.</p>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Trending Content</h3>
            {trendingOffers.length > 0 ? (
              <ul>
                {trendingOffers.map(offer => (
                  <li key={offer.id} className="mb-2">
                    <h4 className="font-semibold">{offer.title}</h4>
                    <p className="text-gray-600 text-sm">{offer.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No trending content available at the moment.</p>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Promotional Ads</h3>
            {promotionalAds.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {promotionalAds.map(ad => (
                  <div key={ad.id} className="border border-gray-200 rounded-md p-2">
                    <h4 className="font-semibold mb-1">{ad.title}</h4>
                    {ad.imageUrl && <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto rounded-md" />}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No promotional ads available at the moment.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
