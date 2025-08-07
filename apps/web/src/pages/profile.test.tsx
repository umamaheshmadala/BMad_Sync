import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from './profile';
import { supabase } from '../lib/supabaseClient';
import * as userApi from '../api/user';

// Mock the supabase and userApi modules
jest.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

jest.mock('../api/user', () => ({
  getUserProfile: jest.fn(),
}));

describe('Profile', () => {
  const mockUserId = 'test-user-id';
  const mockSession = {
    user: { id: mockUserId },
    access_token: 'mock-token',
    refresh_token: 'mock-refresh-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Date.now() / 1000 + 3600,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
    });
  });

  test('renders loading state initially', () => {
    (userApi.getUserProfile as jest.Mock).mockReturnValue(new Promise(() => {})); // Never resolves
    render(<Profile />);
    expect(screen.getByText(/Loading profile.../i)).toBeInTheDocument();
  });

  test('renders user profile data correctly', async () => {
    const mockProfile = {
      full_name: 'Test User',
      preferred_name: 'Tester',
      avatar_url: 'http://example.com/test-avatar.png',
    };
    (userApi.getUserProfile as jest.Mock).mockResolvedValue({ data: mockProfile });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /User Profile/i })).toBeInTheDocument();
      expect(screen.getByText(/Full Name: Test User/i)).toBeInTheDocument();
      expect(screen.getByText(/Preferred Name: Tester/i)).toBeInTheDocument();
      expect(screen.getByAltText(/Avatar/i)).toHaveAttribute('src', mockProfile.avatar_url);
    });
  });

  test('displays error message if profile fetch fails', async () => {
    (userApi.getUserProfile as jest.Mock).mockRejectedValue(new Error('Network Error'));
    render(<Profile />);
    await waitFor(() => {
      expect(screen.getByText(/Error: Network Error/i)).toBeInTheDocument();
    });
  });

  test('displays "No profile found" message if profile is not found', async () => {
    (userApi.getUserProfile as jest.Mock).mockResolvedValue({ data: null });
    render(<Profile />);
    await waitFor(() => {
      expect(screen.getByText(/No profile found. Please create one./i)).toBeInTheDocument();
    });
  });

  test('displays "User not logged in" message if no session', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
    });
    render(<Profile />);
    await waitFor(() => {
      expect(screen.getByText(/Error: User not logged in./i)).toBeInTheDocument();
    });
  });
});
