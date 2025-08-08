import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import EditBusinessProfile from './edit-business-profile';
import * as supabaseClientModule from '../lib/supabaseClient';

// Mock the supabase client
// stable bucket instance to allow call-site equality and call tracking
const storageBucketMock = {
  upload: jest.fn(() => Promise.resolve({ data: { path: 'test-logo-url' }, error: null })),
  getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'http://localhost/test-logo-url' }})),
};
const businessesTableMock = {
  upsert: jest.fn(() => Promise.resolve({ data: {}, error: null })),
};

jest.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-business-id', email: 'test@business.com' } } })),
    },
    storage: {
      from: jest.fn(() => storageBucketMock),
    },
    from: jest.fn((table: string) => (table === 'businesses' ? businessesTableMock : { upsert: jest.fn() })),
  },
}));

// Mock fetch API for backend calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  }) as Promise<Response>
);

describe('EditBusinessProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(
      <Router>
        <EditBusinessProfile />
      </Router>
    );

    expect(screen.getByLabelText(/Business Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Google Location URL:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Info \(Email\/Phone\):/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Open Times:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Close Times:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Holidays:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Logo:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Profile/i })).toBeInTheDocument();
  });

  it('shows validation errors for required fields on blur', async () => {
    render(
      <Router>
        <EditBusinessProfile />
      </Router>
    );

    fireEvent.blur(screen.getByLabelText(/Business Name:/i));
    expect(await screen.findByText(/Business Name is required./i)).toBeInTheDocument();

    fireEvent.blur(screen.getByLabelText(/Address:/i));
    expect(await screen.findByText(/Address is required./i)).toBeInTheDocument();
  });

  it('shows validation error for invalid Google Location URL', async () => {
    render(
      <Router>
        <EditBusinessProfile />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Google Location URL:/i), {
      target: { value: 'invalid-url' },
    });
    fireEvent.blur(screen.getByLabelText(/Google Location URL:/i));

    expect(await screen.findByText(/Invalid URL format./i)).toBeInTheDocument();
  });

  it('submits the form successfully with logo upload', async () => {
    render(
      <Router>
        <EditBusinessProfile />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Business Name:/i), {
      target: { value: 'Test Business' },
    });
    fireEvent.change(screen.getByLabelText(/Address:/i), {
      target: { value: '123 Test St' },
    });
    fireEvent.change(screen.getByLabelText(/Google Location URL:/i), {
      target: { value: 'https://maps.google.com/test' },
    });
    fireEvent.change(screen.getByLabelText(/Contact Info \(Email\/Phone\):/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Open Times:/i), {
      target: { value: '9 AM' },
    });
    fireEvent.change(screen.getByLabelText(/Close Times:/i), {
      target: { value: '5 PM' },
    });
    fireEvent.change(screen.getByLabelText(/Holidays:/i), {
      target: { value: "New Year's Day" },
    });

    const file = new File(['dummy content'], 'logo.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/Logo:/i), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByRole('button', { name: /Save Profile/i }));

    await waitFor(() => {
      expect(supabaseClientModule.supabase.auth.getUser).toHaveBeenCalled();
      expect(supabaseClientModule.supabase.storage.from).toHaveBeenCalledWith('business-logos');
      expect(storageBucketMock.upload).toHaveBeenCalledWith('test-business-id.png', file, { cacheControl: '3600', upsert: true });
      expect(supabaseClientModule.supabase.from).toHaveBeenCalledWith('businesses');
      expect(businessesTableMock.upsert).toHaveBeenCalledWith(expect.objectContaining({
        business_name: 'Test Business',
        address: '123 Test St',
        logo_url: 'test-logo-url',
      }));
    });

    expect(window.alert).toHaveBeenCalledWith('Business profile updated successfully!');
    // You might also want to check for navigation here if you mock useNavigate
  });

  it('handles submission error', async () => {
    (supabaseClientModule.supabase.from as jest.Mock).mockReturnValueOnce({
      upsert: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Database error' } })),
    } as any);

    render(
      <Router>
        <EditBusinessProfile />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Business Name:/i), {
      target: { value: 'Test Business' },
    });
    fireEvent.change(screen.getByLabelText(/Address:/i), {
      target: { value: '123 Test St' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Save Profile/i }));

    expect(await screen.findByText(/Database error/i)).toBeInTheDocument();
  });
});
