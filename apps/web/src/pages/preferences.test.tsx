import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Preferences from '../pages/preferences';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../api/user';

// Mock the API calls
jest.mock('../api/user');
const mockGetUserProfile = getUserProfile as jest.Mock;
const mockUpdateUserProfile = updateUserProfile as jest.Mock;

// Mock AuthContext
const mockUser = { id: 'test-user-id', email: 'test@example.com' };
const mockAuthContextValue = {
  user: mockUser,
  loading: false,
  logout: jest.fn(),
  onboardingComplete: true,
  fetchUserProfile: jest.fn(),
};

describe('Preferences', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockGetUserProfile.mockReset();
    mockUpdateUserProfile.mockReset();
    mockAuthContextValue.logout.mockReset();
    mockAuthContextValue.fetchUserProfile.mockReset();

    // Default successful mock for getUserProfile
    mockGetUserProfile.mockResolvedValue({
      user_id: 'test-user-id',
      privacy_settings: {
        adFrequency: 'medium',
        excludeCategories: ['Tech'],
      },
    });
    mockUpdateUserProfile.mockResolvedValue({}); // Successful update
  });

  test('renders loading state initially', () => {
    mockGetUserProfile.mockImplementation(() => new Promise(() => {})); // Never resolve

    render(
      <AuthContext.Provider value={{ ...mockAuthContextValue, loading: true }}>
        <Preferences />
      </AuthContext.Provider>
    );
    expect(screen.getByText('Loading preferences...')).toBeInTheDocument();
  });

  test('renders preferences form with initial data', async () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <Preferences />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Ad Preferences')).toBeInTheDocument();
      expect(screen.getByLabelText('Ad Frequency:')).toHaveValue('medium');
      expect(screen.getByLabelText('Tech')).toBeChecked();
      expect(screen.getByLabelText('Food')).not.toBeChecked();
    });
  });

  test('handles ad frequency change', async () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <Preferences />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Ad Frequency:')).toHaveValue('medium');
    });

    await userEvent.selectOptions(screen.getByLabelText('Ad Frequency:'), 'low');
    await waitFor(() => {
      expect(screen.getByLabelText('Ad Frequency:')).toHaveValue('low');
    });
  });

  test('handles exclude categories change', async () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <Preferences />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Tech')).toBeChecked();
      expect(screen.getByLabelText('Food')).not.toBeChecked();
    });

    await userEvent.click(screen.getByLabelText('Food'));
    await waitFor(() => {
      expect(screen.getByLabelText('Food')).toBeChecked();
    });

    await userEvent.click(screen.getByLabelText('Tech'));
    await waitFor(() => {
      expect(screen.getByLabelText('Tech')).not.toBeChecked();
    });
  });

  test('submits preferences successfully', async () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <Preferences />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Save Preferences')).toBeInTheDocument();
    });

    userEvent.selectOptions(screen.getByLabelText('Ad Frequency:'), 'high');
    userEvent.click(screen.getByLabelText('Sports'));
    userEvent.click(screen.getByLabelText('Tech')); // Uncheck Tech

    userEvent.click(screen.getByText('Save Preferences'));

    await waitFor(() => {
      expect(mockUpdateUserProfile).toHaveBeenCalledWith(
        'test-user-id',
        { privacy_settings: { adFrequency: 'high', excludeCategories: ['Sports'] } }
      );
      expect(screen.getByText('Preferences updated successfully!')).toBeInTheDocument();
    });
  });

  test('displays error message on submission failure', async () => {
    mockUpdateUserProfile.mockRejectedValue(new Error('Update failed'));

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <Preferences />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Save Preferences')).toBeInTheDocument();
    });

    userEvent.click(screen.getByText('Save Preferences'));

    await waitFor(() => {
      expect(screen.getByText(/Failed to update preferences./i)).toBeInTheDocument();
    });
  });

  test('displays error message on initial fetch failure', async () => {
    mockGetUserProfile.mockRejectedValue(new Error('Fetch failed'));

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <Preferences />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch preferences./i)).toBeInTheDocument();
    });
  });
});
