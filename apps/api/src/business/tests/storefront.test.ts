import { serve } from "@deno/http";
import { createClient } from "@supabase/supabase-js";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

const SUPABASE_URL = "https://mock.supabase.co";
const SUPABASE_ANON_KEY = "mock-anon-key";

const mockSupabase = {
  from: jest.fn(() => ({
    upsert: jest.fn(),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
      })),
    })),
  })),
};

// Mock the serve function for testing
let handler: (req: Request) => Promise<Response>;
jest.mock("@deno/http", () => ({
  serve: jest.fn((h) => {
    handler = h;
  }),
}));

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => mockSupabase),
}));

describe("Business Storefront API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle POST request to create/update storefront", async () => {
    const mockStorefrontData = {
      business_id: "biz-123",
      description: "Test Storefront Description",
      contact_details: "test@storefront.com",
      theme: "default",
      is_open: true,
      promotional_banner_url: "http://banner.url",
    };

    mockSupabase.from("storefronts").upsert.mockResolvedValueOnce({
      data: [mockStorefrontData],
      error: null,
    });

    const req = new Request("http://localhost/api/business/storefront", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockStorefrontData),
    });

    const res = await handler(req);
    const body = await res.json();

    assertEquals(res.status, 200);
    assertEquals(body, [mockStorefrontData]);
    expect(mockSupabase.from).toHaveBeenCalledWith("storefronts");
    expect(mockSupabase.from("storefronts").upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        business_id: "biz-123",
        description: "Test Storefront Description",
      }),
    );
  });

  it("should handle GET request to retrieve storefront", async () => {
    const mockStorefrontData = {
      business_id: "biz-123",
      description: "Test Storefront Description",
      contact_details: "test@storefront.com",
      theme: "default",
      is_open: true,
      promotional_banner_url: "http://banner.url",
    };

    mockSupabase
      .from("storefronts")
      .select("*")
      .eq("business_id", "biz-123")
      .single.mockResolvedValueOnce({ data: mockStorefrontData, error: null });

    const req = new Request(
      "http://localhost/api/business/storefront?business_id=biz-123",
      {
        method: "GET",
      },
    );

    const res = await handler(req);
    const body = await res.json();

    assertEquals(res.status, 200);
    assertEquals(body, mockStorefrontData);
    expect(mockSupabase.from).toHaveBeenCalledWith("storefronts");
    expect(mockSupabase.from("storefronts").select).toHaveBeenCalledWith("*");
    expect(mockSupabase.from("storefronts").select().eq).toHaveBeenCalledWith(
      "business_id",
      "biz-123",
    );
    expect(
      mockSupabase.from("storefronts").select().eq().single,
    ).toHaveBeenCalled();
  });

  it("should return 400 if business_id is missing for GET request", async () => {
    const req = new Request("http://localhost/api/business/storefront", {
      method: "GET",
    });

    const res = await handler(req);
    const body = await res.json();

    assertEquals(res.status, 400);
    assertEquals(body, { error: "Business ID is required" });
  });

  it("should return 404 if storefront not found for GET request", async () => {
    mockSupabase
      .from("storefronts")
      .select("*")
      .eq("business_id", "non-existent-id")
      .single.mockResolvedValueOnce({ data: null, error: null });

    const req = new Request(
      "http://localhost/api/business/storefront?business_id=non-existent-id",
      {
        method: "GET",
      },
    );

    const res = await handler(req);
    const body = await res.json();

    assertEquals(res.status, 404);
    assertEquals(body, { message: "Storefront not found" });
  });

  it("should return 500 for database errors on POST request", async () => {
    mockSupabase.from("storefronts").upsert.mockResolvedValueOnce({
      data: null,
      error: { message: "Database error" },
    });

    const req = new Request("http://localhost/api/business/storefront", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_id: "biz-123",
        description: "description",
      }),
    });

    const res = await handler(req);
    const body = await res.json();

    assertEquals(res.status, 500);
    assertEquals(body, { error: "Database error" });
  });

  it("should return 500 for database errors on GET request", async () => {
    mockSupabase
      .from("storefronts")
      .select("*")
      .eq("business_id", "biz-123")
      .single.mockResolvedValueOnce({
        data: null,
        error: { message: "Database error" },
      });

    const req = new Request(
      "http://localhost/api/business/storefront?business_id=biz-123",
      {
        method: "GET",
      },
    );

    const res = await handler(req);
    const body = await res.json();

    assertEquals(res.status, 500);
    assertEquals(body, { error: "Database error" });
  });
});
