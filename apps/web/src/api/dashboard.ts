import { supabase } from '../lib/supabaseClient';

export const getDashboardData = async (userId: string, city: string) => {
  try {
    // Use maybeSingle to avoid throwing when no row exists yet
    const { data, error } = await supabase
      .from('users')
      .select('user_id, email, city, interests, privacy_settings')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      // Log and continue with defaults; do not break dashboard render
      console.warn('getDashboardData: non-fatal user fetch error, using defaults:', error.message);
    }

    const effectiveCity = data?.city || city || 'london';

    // Mock data for hot offers, trending offers, and ads - dynamic by city
    const mockHotOffers = [
      { id: 1, title: `50% off Pizza in ${effectiveCity}`, description: 'Get half off all pizzas at Pizza Palace!' },
      { id: 2, title: `Buy One Get One Coffee in ${effectiveCity}`, description: 'Buy any coffee, get one free at Brew & Co.' },
    ];

    const mockTrendingOffers = [
      { id: 101, title: `New Burger Joint in ${effectiveCity}`, description: 'Try the new gourmet burgers at The Burger Spot.' },
      { id: 102, title: `Yoga Class Discount in ${effectiveCity}`, description: '20% off your first yoga class at Zen Yoga Studio.' },
    ];

    const mockPromotionalAds = [
      { id: 201, title: `Summer Sale at Fashion Hub in ${effectiveCity}`, imageUrl: 'https://example.com/ad1.jpg' },
      { id: 202, title: `New Tech Gadgets at Electro World in ${effectiveCity}`, imageUrl: 'https://example.com/ad2.jpg' },
    ];

    return {
      user: data ?? { user_id: userId, city: effectiveCity, interests: [], privacy_settings: null },
      hotOffers: mockHotOffers,
      trendingOffers: mockTrendingOffers,
      promotionalAds: mockPromotionalAds,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return safe defaults instead of throwing so UI can render
    const effectiveCity = city || 'london';
    return {
      user: { user_id: userId, city: effectiveCity, interests: [], privacy_settings: null },
      hotOffers: [
        { id: 1, title: `50% off Pizza in ${effectiveCity}`, description: 'Get half off all pizzas at Pizza Palace!' },
      ],
      trendingOffers: [
        { id: 101, title: `New Burger Joint in ${effectiveCity}`, description: 'Try the new gourmet burgers at The Burger Spot.' },
      ],
      promotionalAds: [
        { id: 201, title: `Summer Sale at Fashion Hub in ${effectiveCity}`, imageUrl: 'https://example.com/ad1.jpg' },
      ],
    };
  }
};
