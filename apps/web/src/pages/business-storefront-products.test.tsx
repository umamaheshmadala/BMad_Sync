import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import BusinessStorefrontProducts from './business-storefront-products';

// Use the existing moduleNameMapper mock for supabase client
import * as supabaseClientModule from '../lib/supabaseClient';

// Stabilize storage bucket mock
const storageBucketMock = {
  upload: jest.fn(() => Promise.resolve({ data: { path: 'product-image-url' }, error: null })),
  getPublicUrl: jest.fn((path: string) => ({ data: { publicUrl: `http://localhost/${path}` } })),
};

jest.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'biz-001', email: 'biz@test.com' } } })),
    },
    storage: {
      from: jest.fn(() => storageBucketMock),
    },
  },
}));

// Mock window.alert
// @ts-ignore
global.alert = jest.fn();

describe('BusinessStorefrontProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    global.fetch = jest.fn((url: string, init?: RequestInit) => {
      // GET storefront by business id
      if (url.includes('/api/business/storefront') && url.includes('business_id=')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ storefront_id: 'sf-123' }),
        }) as any;
      }
      // GET existing products for storefront
      if (url.includes('/api/storefronts/sf-123/products') && (!init || init.method === 'GET')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              product_id: 'p-1',
              product_name: 'Existing 1',
              product_description: 'Desc 1',
              product_image_url: 'existing-1.jpg',
              display_order: 0,
              is_trending: false,
            },
            {
              product_id: 'p-2',
              product_name: 'Existing 2',
              product_description: 'Desc 2',
              product_image_url: 'existing-2.jpg',
              display_order: 1,
              is_trending: false,
            },
            {
              product_id: 'p-3',
              product_name: 'Existing 3',
              product_description: 'Desc 3',
              product_image_url: 'existing-3.jpg',
              display_order: 2,
              is_trending: false,
            },
          ]),
        }) as any;
      }
      // GET trending
      if (url.endsWith('/api/trending-products')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              product_id: 'trend-1',
              product_name: 'Trending A',
              product_description: 'Hot',
              product_image_url: 'trend-a.png',
              display_order: 0,
              is_trending: true,
            },
          ]),
        }) as any;
      }
      // POST save products
      if (url.includes('/api/storefronts/sf-123/products') && init?.method === 'POST') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) }) as any;
      }
      return Promise.reject(new Error(`Unhandled fetch: ${url}`));
    });
  });

  it('loads storefront, existing products and trending suggestions', async () => {
    render(
      <Router>
        <BusinessStorefrontProducts />
      </Router>
    );

    // Existing product 1 is rendered
    expect(await screen.findByText(/Product 1/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing 1')).toBeInTheDocument();

    // Trending grid appears
    expect(await screen.findByText('Trending Product Suggestions')).toBeInTheDocument();
    expect(screen.getByText('Trending A')).toBeInTheDocument();
  });

  it('adds a manual product row and saves successfully', async () => {
    render(
      <Router>
        <BusinessStorefrontProducts />
      </Router>
    );

    // Wait for initial load
    await screen.findByText(/Manage Storefront Products/i);

    // Add a new manual product and fill last row
    fireEvent.click(screen.getByRole('button', { name: /Add Product/i }));

    const nameInputs = screen.getAllByLabelText(/Product Name:/i);
    const descInputs = screen.getAllByLabelText(/Description:/i);
    const lastRowIndex = nameInputs.length - 1;
    const lastName = nameInputs[lastRowIndex] as HTMLInputElement;
    const lastDesc = descInputs[lastRowIndex] as HTMLTextAreaElement;

    fireEvent.change(lastName, { target: { value: 'Manual Prod' } });
    fireEvent.change(lastDesc, { target: { value: 'Manual Desc' } });

    const fileInputs = screen.getAllByLabelText(/Product Image:/i);
    const lastFile = fileInputs[lastRowIndex] as HTMLInputElement;
    const file = new File(['image-bytes'], 'prod.jpg', { type: 'image/jpeg' });
    fireEvent.change(lastFile, { target: { files: [file] } });

    // Ensure upload mock is used when saving
    fireEvent.click(screen.getByRole('button', { name: /Save Products/i }));

    await waitFor(() => {
      expect(supabaseClientModule.supabase.auth.getUser).toHaveBeenCalled();
      expect(supabaseClientModule.supabase.storage.from).toHaveBeenCalledWith('product-images');
      expect(storageBucketMock.upload).toHaveBeenCalled();
    });

    expect(global.alert).toHaveBeenCalledWith('Products updated successfully!');
  });
});


