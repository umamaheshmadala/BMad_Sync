import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import BusinessLogin from './business-login';
import * as businessAuth from '../api/business'; // Use the new business auth API
import { AuthProvider } from '../context/AuthContext'; // AuthProvider is needed if components use useAuth

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

describe('BusinessLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the business login form', () => {
    render(<Router><BusinessLogin /></Router>);
    expect(screen.getByRole('heading', { name: /login to your business account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('allows business users to type into email and password fields', () => {
    render(<Router><BusinessLogin /></Router>);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'business@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'businesspassword123' } });

    expect(emailInput).toHaveValue('business@example.com');
    expect(passwordInput).toHaveValue('businesspassword123');
  });

  it('calls loginBusiness and navigates on successful submission', async () => {
    jest.spyOn(businessAuth, 'loginBusiness').mockResolvedValueOnce({
      user: { id: 'some-business-id', email: 'business@example.com' },
      session: {}, // simplified session object
    });

    render(<Router><BusinessLogin /></Router>);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'business@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'businesspassword123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(businessAuth.loginBusiness).toHaveBeenCalledWith('business@example.com', 'businesspassword123');
      expect(mockedUseNavigate).toHaveBeenCalledWith('/business-dashboard');
    });
  });

  it('displays correct error message on failed business login due to invalid credentials', async () => {
    const errorMessage = 'Invalid email or password for business account. Please try again.';
    jest.spyOn(businessAuth, 'loginBusiness').mockRejectedValueOnce(new Error(errorMessage));

    render(<Router><BusinessLogin /></Router>);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'business@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockedUseNavigate).not.toHaveBeenCalled();
    });
  });

  it('displays generic error message on unexpected business login failure', async () => {
    const errorMessage = 'An unknown error occurred during business login.';
    jest.spyOn(businessAuth, 'loginBusiness').mockRejectedValueOnce(new Error(errorMessage));

    render(<Router><BusinessLogin /></Router>);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'business@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'businesspassword123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
