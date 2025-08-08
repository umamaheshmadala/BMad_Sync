import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Session, User } from '@supabase/supabase-js';

// Mock the entire ../api/auth module
jest.mock('../api/auth', () => ({
  logout: jest.fn(),
}));

// Import the mocked logout function BEFORE AuthProvider
import { logout as apiLogout } from '../api/auth';

// Mock the supabase client and its auth methods
let onAuthCallback: any;
const mockOnAuthStateChangeCallback = jest.fn();
jest.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn((callback: any) => {
        onAuthCallback = callback;
        mockOnAuthStateChangeCallback.mockImplementation(callback);
        return { data: { subscription: { unsubscribe: jest.fn() } } };
      }),
      getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
      signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: { id: '1', email: 'test@example.com' } as unknown as User, session: {} as Session } })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
      getUser: jest.fn(() => Promise.resolve({ data: { user: { id: '1', email: 'test@example.com' } } })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: { full_name: 'Test User', username: 'testuser', onboarding_complete: false, city: null, interests: [] }, error: null }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    })),
  },
}));

// Import AuthProvider and AuthContext AFTER all mocks are established
import { AuthProvider, AuthContext } from './AuthContext';
import { supabase } from '../lib/supabaseClient';


// A simple test component to consume AuthContext
const TestComponent = () => {
  const { user, loading, onboardingComplete, signIn, signUp, logout, userProfile, updateUserProfile } = React.useContext(AuthContext);

  return (
    <div>
      <span data-testid="user">{user ? user.email : 'null'}</span>
      <span data-testid="loading">{loading ? 'loading' : 'not loading'}</span>
      <span data-testid="onboarding-complete">{onboardingComplete ? 'true' : 'false'}</span>
      <span data-testid="user-profile-city">{userProfile?.city || 'null'}</span>
      <span data-testid="user-profile-interests">{(userProfile?.interests || []).join(',') || 'null'}</span>
      <button onClick={() => signIn('test@example.com', 'password')} data-testid="signin-button">Sign In</button>
      <button onClick={() => signUp('new@example.com', 'password')} data-testid="signup-button">Sign Up</button>
      <button onClick={logout} data-testid="signout-button">Sign Out</button>
      <button onClick={() => updateUserProfile({ city: 'New York', interests: ['Sports', 'Music', 'Movies', 'Books', 'Travel'], onboarding_complete: true })} data-testid="update-profile-button">Update Profile</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure the mock callback is reset for each test to avoid cross-test pollution
    mockOnAuthStateChangeCallback.mockClear();
  });

  it('initially sets loading to true and has no user or session', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('onboarding-complete')).toHaveTextContent('false');
    expect(screen.getByTestId('user-profile-city')).toHaveTextContent('null');
    expect(screen.getByTestId('user-profile-interests')).toHaveTextContent('null');
    
    // Wait for the initial session check to complete
    await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
    });

    // Manually trigger the initial session callback if AuthContext relies on it immediately
    // (AuthContext's useEffect calls getSession first, then onAuthStateChange)
    if (mockOnAuthStateChangeCallback.mock.calls.length === 0) {
      // Only if the callback hasn't been invoked by getSession already
      mockOnAuthStateChangeCallback('INITIAL_SESSION', null, null);
    }
  });

  it('calls signOut when signOut function is invoked and clears state', async () => {
    const mockSession = { user: { id: '1', email: 'test@example.com' } } as Session;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simulate user signing in via context method
    fireEvent.click(screen.getByTestId('signin-button'));
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });
    expect(screen.getByTestId('onboarding-complete')).toHaveTextContent('false'); // Initial state for onboarding
    expect(screen.getByTestId('user-profile-city')).toHaveTextContent('null');
    expect(screen.getByTestId('user-profile-interests')).toHaveTextContent('null');

    // Trigger the signOut function
    const signOutButton = screen.getByTestId('signout-button');
    fireEvent.click(signOutButton);

    // signOut resolves and onAuth SIGNED_OUT event clears state in provider
    onAuthCallback('SIGNED_OUT', null, null);
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });
    expect(screen.getByTestId('onboarding-complete')).toHaveTextContent('false');
    expect(screen.getByTestId('user-profile-city')).toHaveTextContent('null');
    expect(screen.getByTestId('user-profile-interests')).toHaveTextContent('null');
  });

  it('handles signOut errors gracefully', async () => {
    // Mock the signOut function to return a Promise that rejects with an error
    (supabase.auth.signOut as unknown as jest.Mock).mockResolvedValueOnce({ error: new Error('Sign Out failed') });

    const mockSession = { user: { id: '1', email: 'test@example.com' } } as Session;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simulate a logged-in state via signIn
    fireEvent.click(screen.getByTestId('signin-button'));
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });
    
    // Trigger the signOut function
    const signOutButton = screen.getByTestId('signout-button');
    fireEvent.click(signOutButton);

    // Assert that the mocked signOut was called
    expect((supabase.auth.signOut as unknown as jest.Mock)).toHaveBeenCalledTimes(1);

    // Assert that the error was caught and the state remains unchanged
    // We expect the user to still be logged in because signOut failed
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('onboarding-complete')).toHaveTextContent('false');
    });
  });

  it('updates user profile with city, interests, and onboarding_complete status', async () => {
    const mockUser = { id: '1', email: 'test@example.com' } as User;
    const mockSession = { user: mockUser } as Session;

    // Mock getSession to return a session with user data
    (supabase.auth.getSession as unknown as jest.Mock).mockResolvedValueOnce({ data: { session: mockSession } });

    // Establish a stateful in-memory profile and a stable supabase.from implementation
    let profile = {
      full_name: 'Test User',
      username: 'testuser',
      onboarding_complete: true,
      city: null as string | null,
      interests: [] as string[],
    };
    (supabase.from as unknown as jest.Mock).mockImplementation((table: string) => {
      if (table !== 'users') {
        return {
          select: jest.fn(() => ({ eq: jest.fn(() => ({ single: jest.fn(() => Promise.resolve({ data: null, error: null })) })) })),
          update: jest.fn(() => ({ eq: jest.fn(() => Promise.resolve({ data: null, error: null })) })),
        } as any;
      }
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: { ...profile }, error: null })),
          })),
        })),
        update: jest.fn((updates: any) => ({
          eq: jest.fn(() => {
            profile = { ...profile, ...updates };
            return Promise.resolve({ data: null, error: null });
          }),
        })),
      } as any;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not loading');
    });

    expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    // onboarding_complete mocked as true in the stateful supabase.from above
    expect(screen.getByTestId('onboarding-complete')).toHaveTextContent('true');
    expect(screen.getByTestId('user-profile-city')).toHaveTextContent('null');
    expect(screen.getByTestId('user-profile-interests')).toHaveTextContent('null');

    // Trigger update profile
    fireEvent.click(screen.getByTestId('update-profile-button'));

    await waitFor(() => {
      expect(screen.getByTestId('onboarding-complete')).toHaveTextContent('true');
      expect(screen.getByTestId('user-profile-city')).toHaveTextContent('New York');
      expect(screen.getByTestId('user-profile-interests')).toHaveTextContent('Sports,Music,Movies,Books,Travel');
    });
  });
});
