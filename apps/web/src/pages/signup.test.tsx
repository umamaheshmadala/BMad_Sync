import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SignUp from './signup';
import * as auth from '../api/auth';

// Mock the supabaseClient module
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

describe('SignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the signup form', () => {
    render(<Router><SignUp /></Router>);
    expect(screen.getByRole('heading', { name: /sign up for sync/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  it('allows users to type into email and password fields', () => {
    render(<Router><SignUp /></Router>);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls signUp and navigates on successful submission', async () => {
    jest.spyOn(auth, 'signUp').mockResolvedValueOnce({
      user: { id: 'some-user-id', email: 'test@example.com' },
      session: {}, // simplified session object
    });

    render(<Router><SignUp /></Router>);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(auth.signUp).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockedUseNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('displays correct error message on failed signup due to existing user', async () => {
    const errorMessage = 'This email is already registered. Please try logging in.';
    jest.spyOn(auth, 'signUp').mockRejectedValueOnce(new Error(errorMessage));

    render(<Router><SignUp /></Router>);

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
    jest.spyOn(auth, 'signUp').mockRejectedValueOnce(new Error(errorMessage));

    render(<Router><SignUp /></Router>);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('displays generic error message on unexpected signup failure', async () => {
    const errorMessage = 'An unknown error occurred during signup.';
    jest.spyOn(auth, 'signUp').mockRejectedValueOnce(new Error(errorMessage));

    render(<Router><SignUp /></Router>);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});