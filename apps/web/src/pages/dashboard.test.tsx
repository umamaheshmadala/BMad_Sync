import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../pages/dashboard';
import { AuthContext } from '../context/AuthContext';
import { getDashboardData } from '../api/dashboard';

// Mock the API call
jest.mock('../api/dashboard');
const mockGetDashboardData = getDashboardData as jest.Mock;

// Mock AuthContext
const mockUser = { id: 'test-user-id', email: 'test@example.com' };
const mockAuthContextValue = {
  user: mockUser,
  loading: false,
  logout: jest.fn(),
  onboardingComplete: true,
  fetchUserProfile: jest.fn(),
};

describe('Dashboard', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockGetDashboardData.mockReset();
    mockAuthContextValue.logout.mockReset();
    mockAuthContextValue.fetchUserProfile.mockReset();
  });

  test('renders loading state initially', () => {
    mockGetDashboardData.mockImplementation(() => new Promise(() => {})); // Never resolve to keep it in loading state

    render(
      <AuthContext.Provider value={{ ...mockAuthContextValue, loading: true }}>
        <Dashboard />
      </AuthContext.Provider>
    );
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  test('renders dashboard with data', async () => {
    mockGetDashboardData.mockResolvedValue({
      user: { id: 'test-user-id', city: 'London', interests: ['Food'] },
      hotOffers: [{ id: 1, title: 'Hot Offer 1', description: 'Description 1' }],
      trendingOffers: [{ id: 2, title: 'Trending Offer 1', description: 'Description 2' }],
      promotionalAds: [{ id: 3, title: 'Ad 1', imageUrl: 'test-ad.jpg' }],
    });

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <Dashboard />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Welcome to your Dashboard!')).toBeInTheDocument();
      expect(screen.getByText('Hot Offer 1')).toBeInTheDocument();
      expect(screen.getByText('Trending Offer 1')).toBeInTheDocument();
      expect(screen.getByText('Ad 1')).toBeInTheDocument();
    });
  });

  test('displays error message on API failure', async () => {
    mockGetDashboardData.mockRejectedValue(new Error('Network error'));

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <Dashboard />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch dashboard data./i)).toBeInTheDocument();
    });
  });

  test('handles city change and re-fetches data', async () => {
    // Initial data for London
    mockGetDashboardData.mockResolvedValueOnce({
      user: { id: 'test-user-id', city: 'london', interests: ['Food'] },
      hotOffers: [{ id: 1, title: 'London Hot Offer', description: 'London Desc' }],
      trendingOffers: [],
      promotionalAds: [],
    });

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <Dashboard />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('London Hot Offer')).toBeInTheDocument();
    });

    // Data after changing to New York
    mockGetDashboardData.mockResolvedValueOnce({
      user: { id: 'test-user-id', city: 'new-york', interests: ['Food'] },
      hotOffers: [{ id: 3, title: 'New York Hot Offer', description: 'NY Desc' }],
      trendingOffers: [],
      promotionalAds: [],
    });

    userEvent.selectOptions(screen.getByRole('combobox', { name: /city selection/i }), 'new-york');

    await waitFor(() => {
      expect(screen.getByText('New York Hot Offer')).toBeInTheDocument();
      expect(mockGetDashboardData).toHaveBeenCalledWith('test-user-id', 'new-york');
    });
  });
});
