import { supabase } from '../lib/supabaseClient';

export const getDashboardData = async (userId: string, city: string) => {
  try {
    const { data, error } = await supabase
      .from('users') // Assuming dashboard data is linked to user profile or a separate dashboard table
      .select('user_id, email, city, interests, privacy_settings') // Placeholder, replace with actual dashboard data fields
      .eq('user_id', userId)
      .single();

    if (error) {
      throw error;
    }

    // Mock data for hot offers, trending offers, and ads - now dynamic based on city
    const mockHotOffers = [
      { id: 1, title: `50% off Pizza in ${city}`, description: 'Get half off all pizzas at Pizza Palace!' },
      { id: 2, title: `Buy One Get One Coffee in ${city}`, description: 'Buy any coffee, get one free at Brew & Co.' },
    ];

    const mockTrendingOffers = [
      { id: 1, title: `New Burger Joint in ${city}`, description: 'Try the new gourmet burgers at The Burger Spot.' },
      { id: 2, title: `Yoga Class Discount in ${city}`, description: '20% off your first yoga class at Zen Yoga Studio.' },
    ];

    const mockPromotionalAds = [
      { id: 1, title: `Summer Sale at Fashion Hub in ${city}`, imageUrl: 'https://example.com/ad1.jpg' },
      { id: 2, title: `New Tech Gadgets at Electro World in ${city}`, imageUrl: 'https://example.com/ad2.jpg' },
    ];


    return {
      user: data,
      hotOffers: mockHotOffers,
      trendingOffers: mockTrendingOffers,
      promotionalAds: mockPromotionalAds,
    };

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
