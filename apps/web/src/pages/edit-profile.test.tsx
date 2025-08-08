import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProfile from './edit-profile';
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
  uploadAvatar: jest.fn(),
  createUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
  getUserProfile: jest.fn(),
}));

describe('EditProfile', () => {
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
    (userApi.getUserProfile as jest.Mock).mockRejectedValue(new Error("User profile not found"));
  });

  test('renders the form correctly', async () => {
    render(<EditProfile />);
    expect(screen.getByRole('heading', { name: /Create\/Edit Profile/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Preferred Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Avatar/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Profile/i })).toBeInTheDocument();
  });

  test('handles full name input change', async () => {
    render(<EditProfile />);
    const fullNameInput = screen.getByPlaceholderText(/Full Name/i) as HTMLInputElement;
    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
    expect(fullNameInput.value).toBe('John Doe');
  });

  test('handles preferred name input change', () => {
    render(<EditProfile />);
    const preferredNameInput = screen.getByPlaceholderText(/Preferred Name/i) as HTMLInputElement;
    fireEvent.change(preferredNameInput, { target: { value: 'Johnny' } });
    expect(preferredNameInput.value).toBe('Johnny');
  });

  test('displays validation error for empty full name on submit', async () => {
    render(<EditProfile />);
    await waitFor(() => expect(supabase.auth.getSession).toHaveBeenCalled());
    // Directly trigger submit to surface validation
    fireEvent.click(screen.getByRole('button', { name: /Save Profile/i }));
    await waitFor(() => {
      expect(screen.getByText(/Full Name is required./i)).toBeInTheDocument();
    });
    expect(userApi.createUserProfile).not.toHaveBeenCalled();
  });

  test('calls createUserProfile on successful submission for new profile', async () => {
    (userApi.createUserProfile as jest.Mock).mockResolvedValue({});
    render(<EditProfile />);
    await waitFor(() => expect(supabase.auth.getSession).toHaveBeenCalled());
    const fullNameInput = screen.getByPlaceholderText(/Full Name/i);
    fireEvent.change(fullNameInput, { target: { value: 'Jane Doe' } });

    fireEvent.click(screen.getByRole('button', { name: /Save Profile/i }));

    await waitFor(() => {
      expect(userApi.createUserProfile).toHaveBeenCalledWith({
        userId: mockUserId,
        fullName: 'Jane Doe',
        preferredName: '',
      });
    });
    expect(screen.getByText(/Profile created successfully!/i)).toBeInTheDocument();
  });

  test('calls updateUserProfile on successful submission for existing profile', async () => {
    (userApi.getUserProfile as jest.Mock).mockResolvedValue({ data: { full_name: 'Existing User' } });
    (userApi.updateUserProfile as jest.Mock).mockResolvedValue({});

    render(<EditProfile />);
    await waitFor(() => expect(supabase.auth.getSession).toHaveBeenCalled());

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Full Name/i)).toHaveValue('Existing User');
    });

    const fullNameInput = screen.getByPlaceholderText(/Full Name/i);
    fireEvent.change(fullNameInput, { target: { value: 'Updated User' } });

    fireEvent.click(screen.getByRole('button', { name: /Save Profile/i }));

    await waitFor(() => {
      expect(userApi.updateUserProfile).toHaveBeenCalledWith(
        mockUserId,
        {
          userId: mockUserId,
          fullName: 'Updated User',
          preferredName: '',
        }
      );
    });
    expect(screen.getByText(/Profile updated successfully!/i)).toBeInTheDocument();
  });

  test('handles avatar file selection and upload', async () => {
    const file = new File(['dummy content'], 'avatar.png', { type: 'image/png' });
    (userApi.uploadAvatar as jest.Mock).mockResolvedValue('http://example.com/avatar.png');
    (userApi.createUserProfile as jest.Mock).mockResolvedValue({});

    render(<EditProfile />);
    await waitFor(() => expect(supabase.auth.getSession).toHaveBeenCalled());

    const fullNameInput = screen.getByPlaceholderText(/Full Name/i);
    fireEvent.change(fullNameInput, { target: { value: 'Test User' } });

    const avatarInput = screen.getByLabelText(/Avatar/i);
    fireEvent.change(avatarInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /Save Profile/i }));

    await waitFor(() => {
      expect(userApi.uploadAvatar).toHaveBeenCalledWith(mockUserId, file);
      expect(userApi.createUserProfile).toHaveBeenCalledWith({
        userId: mockUserId,
        fullName: 'Test User',
        preferredName: '',
        avatarUrl: 'http://example.com/avatar.png',
      });
    });
  });
});
