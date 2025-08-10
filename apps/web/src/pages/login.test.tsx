import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './login';
import * as auth from '../api/auth';
import { AuthContext } from '../context/AuthContext';

// Mock the supabaseClient module - keep it for AuthProvider's internal usage
jest.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      })),
      getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
    },
  },
}));

// Mock the useNavigate hook
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

function renderWithAuth(ui: React.ReactElement, overrides?: Partial<React.ContextType<typeof AuthContext>>) {
  const defaultValue = {
    user: null,
    userProfile: null,
    businessProfile: null,
    loading: false,
    onboardingComplete: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getUserProfile: jest.fn(),
    getBusinessProfile: jest.fn(),
    updateUserProfile: jest.fn(),
    logout: jest.fn(),
  } as any;
  const value = { ...defaultValue, ...(overrides as any) };
  return render(<AuthContext.Provider value={value}>{ui}</AuthContext.Provider>);
}

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    renderWithAuth(<Router><Login /></Router>);
    expect(screen.getByRole('heading', { name: /login to sync/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('allows users to type into email and password fields', () => {
    renderWithAuth(<Router><Login /></Router>);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls signIn on successful submission', async () => {
    const mockSignIn = jest.fn().mockResolvedValueOnce({ user: { id: 'some-user-id', email: 'test@example.com' } });
    renderWithAuth(<Router><Login /></Router>, { signIn: mockSignIn });

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in$/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockedUseNavigate).not.toHaveBeenCalled();
    });
  });

  it('displays correct error message on failed login due to invalid credentials', async () => {
    const errorMessage = 'Invalid email or password. Please try again.';
    const mockSignIn = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
    renderWithAuth(<Router><Login /></Router>, { signIn: mockSignIn });

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in$/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockedUseNavigate).not.toHaveBeenCalled();
    });
  });

  it('displays generic error message on unexpected login failure', async () => {
    const errorMessage = 'An unknown error occurred during login.';
    const mockSignIn = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
    renderWithAuth(<Router><Login /></Router>, { signIn: mockSignIn });

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in$/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('calls signInWithGoogle and navigates on successful Google login', async () => {
    jest.spyOn(auth, 'signInWithGoogle').mockResolvedValueOnce({ data: {} });

    renderWithAuth(<Router><Login /></Router>);

    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));

    await waitFor(() => {
      expect(auth.signInWithGoogle).toHaveBeenCalled();
      // For OAuth, navigation is typically handled by the provider redirect
      // So, we don't expect internal navigate to be called here
      expect(mockedUseNavigate).not.toHaveBeenCalled();
    });
  });

  it('displays error message on failed Google login', async () => {
    const errorMessage = 'Google sign-in was cancelled.';
    jest.spyOn(auth, 'signInWithGoogle').mockRejectedValueOnce(new Error(errorMessage));

    renderWithAuth(<Router><Login /></Router>);

    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});