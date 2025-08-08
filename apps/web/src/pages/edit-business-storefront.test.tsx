import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import EditBusinessStorefront from './edit-business-storefront';
import * as supabaseClientModule from '../lib/supabaseClient';

// Mock the supabase client
jest.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-business-id', email: 'test@business.com' } } })),
    },
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(() => Promise.resolve({ data: { path: 'test-banner-url' }, error: null })),
        getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'http://localhost/test-banner-url' }})),
      })),
    },
  },
}));

// Mock fetch API for backend calls
global.fetch = jest.fn((url) => {
  if (url.includes('/api/business/storefront') && url.includes('business_id')) {
    // Mock existing storefront data for initial fetch
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        description: 'Existing Description',
        contact_details: 'Existing Contact',
        theme: 'seasonal-summer',
        is_open: false,
        promotional_banner_url: 'existing-banner.jpg',
      }),
    }) as Promise<Response>;
  } else if (url.includes('/api/business/storefront')) {
    // Mock successful save for POST requests
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    }) as Promise<Response>;
  }
  return Promise.reject(new Error('Unhandled fetch request'));
});

// Mock window.alert
global.alert = jest.fn();

describe('EditBusinessStorefront', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form correctly and loads existing data', async () => {
    render(
      <Router>
        <EditBusinessStorefront />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Description:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Contact Details:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Storefront Theme:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Online\/Offline Status:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Promotional Banner:/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Save Storefront/i })).toBeInTheDocument();

      expect(screen.getByLabelText(/Description:/i)).toHaveValue('Existing Description');
      expect(screen.getByLabelText(/Contact Details:/i)).toHaveValue('Existing Contact');
      expect(screen.getByLabelText(/Storefront Theme:/i)).toHaveValue('seasonal-summer');
      expect(screen.getByLabelText(/Online\/Offline Status:/i)).not.toBeChecked();
    });
  });

  it('shows validation errors for required fields on blur', async () => {
    render(
      <Router>
        <EditBusinessStorefront />
      </Router>
    );

    // Clear initial values to trigger validation
    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: '' } });
    fireEvent.blur(screen.getByLabelText(/Description:/i));
    expect(await screen.findByText(/Description is required./i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Contact Details:/i), { target: { value: '' } });
    fireEvent.blur(screen.getByLabelText(/Contact Details:/i));
    expect(await screen.findByText(/Contact Details are required./i)).toBeInTheDocument();
  });

  it('submits the form successfully with banner upload', async () => {
    render(
      <Router>
        <EditBusinessStorefront />
      </Router>
    );

    // Wait for initial data load before making changes
    await waitFor(() => { expect(screen.getByLabelText(/Description:/i)).toHaveValue('Existing Description'); });

    fireEvent.change(screen.getByLabelText(/Description:/i), {
      target: { value: 'New Description' },
    });
    fireEvent.change(screen.getByLabelText(/Contact Details:/i), {
      target: { value: 'new@contact.com' },
    });
    fireEvent.change(screen.getByLabelText(/Storefront Theme:/i), {
      target: { value: 'seasonal-spring' },
    });
    fireEvent.click(screen.getByLabelText(/Online\/Offline Status:/i)); // Toggle to Online

    const file = new File(['dummy banner'], 'banner.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByLabelText(/Promotional Banner:/i), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByRole('button', { name: /Save Storefront/i }));

    await waitFor(() => {
      expect(supabaseClientModule.supabase.auth.getUser).toHaveBeenCalled();
      expect(supabaseClientModule.supabase.storage.from).toHaveBeenCalledWith('storefront-banners');
      expect(supabaseClientModule.supabase.storage.from('storefront-banners').upload).toHaveBeenCalledWith(
        'test-business-id-banner.jpg',
        file,
        {
          cacheControl: '3600',
          upsert: true,
        }
      );
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/business/storefront',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(expect.objectContaining({
            description: 'New Description',
            contact_details: 'new@contact.com',
            theme: 'seasonal-spring',
            is_open: true,
            promotional_banner_url: 'test-banner-url',
          })),
        })
      );
    });

    expect(global.alert).toHaveBeenCalledWith('Storefront updated successfully!');
  });

  it('handles submission error', async () => {
    // Mock fetch to return an error for the POST request
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to save' }),
      }) as Promise<Response>
    );

    render(
      <Router>
        <EditBusinessStorefront />
      </Router>
    );

    // Wait for initial data load before making changes
    await waitFor(() => { expect(screen.getByLabelText(/Description:/i)).toHaveValue('Existing Description'); });

    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Contact Details:/i), { target: { value: 'test@error.com' } });

    fireEvent.click(screen.getByRole('button', { name: /Save Storefront/i }));

    expect(await screen.findByText(/Failed to save/i)).toBeInTheDocument();
  });
});
