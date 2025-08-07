import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import BusinessSignUp from './business-signup';
import * as businessAuth from '../api/business'; // Use the new business auth API

// Mock the supabaseClient module (if not already globally mocked in setupTests.ts)
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

describe('BusinessSignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the business signup form', () => {
    render(<Router><BusinessSignUp /></Router>);
    expect(screen.getByRole('heading', { name: /sign up for your business account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  it('allows business users to type into email and password fields', () => {
    render(<Router><BusinessSignUp /></Router>);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'business@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'businesspassword123' } });

    expect(emailInput).toHaveValue('business@example.com');
    expect(passwordInput).toHaveValue('businesspassword123');
  });

  it('calls signUpBusiness and navigates on successful submission', async () => {
    jest.spyOn(businessAuth, 'signUpBusiness').mockResolvedValueOnce({
      user: { id: 'some-business-id', email: 'business@example.com' },
      session: {}, // simplified session object
    });

    render(<Router><BusinessSignUp /></Router>);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'business@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'businesspassword123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(businessAuth.signUpBusiness).toHaveBeenCalledWith('business@example.com', 'businesspassword123');
      expect(mockedUseNavigate).toHaveBeenCalledWith('/business-login');
    });
  });

  it('displays correct error message on failed business signup due to existing user', async () => {
    const errorMessage = 'This email is already registered. Please try logging in with your business account.';
    jest.spyOn(businessAuth, 'signUpBusiness').mockRejectedValueOnce(new Error(errorMessage));

    render(<Router><BusinessSignUp /></Router>);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'business@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'businesspassword123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockedUseNavigate).not.toHaveBeenCalled();
    });
  });

  it('displays correct error message on failed business signup due to weak password', async () => {
    const errorMessage = 'Password must be at least 6 characters long.';
    jest.spyOn(businessAuth, 'signUpBusiness').mockRejectedValueOnce(new Error(errorMessage));

    render(<Router><BusinessSignUp /></Router>);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'business@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('displays generic error message on unexpected business signup failure', async () => {
    const errorMessage = 'An unknown error occurred during business signup.';
    jest.spyOn(businessAuth, 'signUpBusiness').mockRejectedValueOnce(new Error(errorMessage));

    render(<Router><BusinessSignUp /></Router>);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'business@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'businesspassword123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
