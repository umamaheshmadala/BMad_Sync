import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SignUp from './signup';
import * as auth from '../api/auth';

// Mock the supabaseClient module
// Do not use real AuthProvider in these tests to avoid Supabase side effects.

// Mock the useNavigate hook
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('SignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it('renders the signup form', () => {
    renderWithAuth(<Router><SignUp /></Router>);
    expect(screen.getByRole('heading', { name: /sign up for sync/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  it('allows users to type into email and password fields', () => {
    renderWithAuth(<Router><SignUp /></Router>);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls signUp and navigates on successful submission', async () => {
    const mockSignUp = jest.fn().mockResolvedValueOnce({ user: { id: 'some-user-id', email: 'test@example.com' } });
    renderWithAuth(<Router><SignUp /></Router>, { signUp: mockSignUp });

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockedUseNavigate).toHaveBeenCalledWith('/onboarding-city-interests');
    });
  });

  it('displays correct error message on failed signup due to existing user', async () => {
    const errorMessage = 'This email is already registered. Please try logging in.';
    const mockSignUp = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
    renderWithAuth(<Router><SignUp /></Router>, { signUp: mockSignUp });

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockedUseNavigate).not.toHaveBeenCalled();
    });
  });

  it('displays correct error message on failed signup due to weak password', async () => {
    const errorMessage = 'Password must be at least 6 characters long.';
    const mockSignUp = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
    renderWithAuth(<Router><SignUp /></Router>, { signUp: mockSignUp });

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('displays generic error message on unexpected signup failure', async () => {
    const errorMessage = 'An unknown error occurred during signup.';
    const mockSignUp = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
    renderWithAuth(<Router><SignUp /></Router>, { signUp: mockSignUp });

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});