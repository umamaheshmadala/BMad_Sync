import { serve } from '@deno/http';
import { createClient } from '@supabase/supabase-js';
import { assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';

// Mocks
const tableMocks: Record<string, any> = {};
const createTableMock = () => {
  const chain = {
    delete: jest.fn(() => chain),
    eq: jest.fn(() => chain),
    upsert: jest.fn(),
    select: jest.fn(() => chain),
    order: jest.fn(() => ({ data: [], error: null })),
  };
  return chain;
};

const mockSupabase = {
  from: jest.fn((table: string) => {
    if (!tableMocks[table]) tableMocks[table] = createTableMock();
    return tableMocks[table];
  }),
};

let handler: (req: Request) => Promise<Response>;
jest.mock('@deno/http', () => ({
  serve: jest.fn((h) => { handler = h; }),
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

// Import API under test to bind the handler
import '../products.ts';

describe('Storefront Products API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(tableMocks).forEach((k) => delete tableMocks[k]);
  });

  it('POST /api/storefronts/:id/products upserts products after deleting existing', async () => {
    mockSupabase.from('StorefrontProducts').upsert.mockResolvedValueOnce({ data: [{ ok: true }], error: null });

    const req = new Request('http://localhost/api/storefronts/sf-1/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products: [
          {
            product_name: 'Name',
            product_description: 'Desc',
            product_image_url: 'img.jpg',
            display_order: 0,
            is_trending: false,
          },
        ],
      }),
    });

    const res = await handler(req);
    const body = await res.json();
    assertEquals(res.status, 200);
    assertEquals(body, [{ ok: true }]);

    const tbl = mockSupabase.from('StorefrontProducts');
    expect(tbl.delete).toHaveBeenCalled();
    expect(tbl.eq).toHaveBeenCalledWith('storefront_id', 'sf-1');
    expect(tbl.upsert).toHaveBeenCalledWith([
      expect.objectContaining({ storefront_id: 'sf-1', product_name: 'Name' }),
    ]);
  });

  it('GET /api/storefronts/:id/products returns ordered list', async () => {
    mockSupabase
      .from('StorefrontProducts')
      .select.mockReturnValueOnce({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({ data: [{ product_name: 'N' }], error: null })),
        })),
      });

    const req = new Request('http://localhost/api/storefronts/sf-2/products', { method: 'GET' });
    const res = await handler(req);
    const body = await res.json();
    assertEquals(res.status, 200);
    assertEquals(body, [{ product_name: 'N' }]);
  });

  it('GET returns 400 when missing id', async () => {
    const req = new Request('http://localhost/api/storefronts//products', { method: 'GET' });
    const res = await handler(req);
    const body = await res.json();
    assertEquals(res.status, 400);
    assertEquals(body.error, 'Storefront ID is required');
  });
});



