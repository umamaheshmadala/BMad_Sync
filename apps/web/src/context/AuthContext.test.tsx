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
const mockOnAuthStateChangeCallback = jest.fn();
jest.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn((_event, callback) => {
        mockOnAuthStateChangeCallback.mockImplementation(callback);
        return { data: { subscription: { unsubscribe: jest.fn() } } };
      }),
      getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
      signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: {} as User, session: {} as Session } })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
    },
  },
}));

// Import AuthProvider and AuthContext AFTER all mocks are established
import { AuthProvider, AuthContext } from './AuthContext';


// A simple test component to consume AuthContext
const TestComponent = () => {
  const { user, session, loading, login, logout } = React.useContext(AuthContext);

  return (
    <div>
      <span data-testid="user">{user ? user.email : 'null'}</span>
      <span data-testid="session">{session ? 'session' : 'null'}</span>
      <span data-testid="loading">{loading ? 'loading' : 'not loading'}</span>
      <button onClick={() => login('test@example.com', 'password')} data-testid="login-button">Login</button>
      <button onClick={logout} data-testid="logout-button">Logout</button>
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
    expect(screen.getByTestId('session')).toHaveTextContent('null');
    
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

  it('calls signOut when logout function is invoked and clears state', async () => {
    const mockSession = { user: { id: '1', email: 'test@example.com' } } as Session;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simulate a user being logged in
    await waitFor(() => {
      // Ensure the onAuthStateChange listener has been set up
      expect(mockOnAuthStateChangeCallback).toHaveBeenCalled();
      mockOnAuthStateChangeCallback.mock.calls[0][1]('SIGNED_IN', mockSession, mockSession.user);
    });

    expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    expect(screen.getByTestId('session')).toHaveTextContent('session');

    // Trigger the logout function
    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);

    // Assert that the mocked logout was called
    expect(apiLogout).toHaveBeenCalledTimes(1);

    // Manually trigger the SIGNED_OUT event callback
    await waitFor(() => {
      mockOnAuthStateChangeCallback.mock.calls[0][1]('SIGNED_OUT', null, null);
    });

    // Assert that the state is now cleared
    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('session')).toHaveTextContent('null');
  });

  it('handles logout errors gracefully', async () => {
    // Mock the logout function to return a Promise that rejects with an error
    (apiLogout as jest.Mock).mockRejectedValueOnce(new Error('Logout failed'));

    const mockSession = { user: { id: '1', email: 'test@example.com' } } as Session;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simulate a logged-in state
    await waitFor(() => {
      // Ensure the onAuthStateChange listener has been set up
      expect(mockOnAuthStateChangeCallback).toHaveBeenCalled();
      mockOnAuthStateChangeCallback.mock.calls[0][1]('SIGNED_IN', mockSession, mockSession.user);
    });
    
    // Trigger the logout function
    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);

    // Assert that the mocked logout was called
    expect(apiLogout).toHaveBeenCalledTimes(1);

    // Assert that the error was caught and the state remains unchanged
    // We expect the user to still be logged in because logout failed
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('session')).toHaveTextContent('session');
    });
  });
});
