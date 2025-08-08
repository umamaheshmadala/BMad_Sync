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

describe("Business Profile API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle POST request to create/update business profile", async () => {
    const mockData = {
      business_id: "123",
      email: "test@example.com",
      business_name: "Test Business",
      address: "123 Test St",
      google_location_url: "https://maps.google.com",
      contact_info: "123-456-7890",
      open_times: "9 AM",
      close_times: "5 PM",
      holidays: "",
      logo_url: "http://logo.url",
    };

    mockSupabase.from("businesses").upsert.mockResolvedValueOnce({
      data: [mockData],
      error: null,
    });

    const req = new Request("http://localhost/api/business/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockData),
    });

    const res = await handler(req);
    const body = await res.json();

    assertEquals(res.status, 200);
    assertEquals(body, [mockData]);
    expect(mockSupabase.from).toHaveBeenCalledWith("businesses");
    expect(mockSupabase.from("businesses").upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        business_id: "123",
        business_name: "Test Business",
      }),
    );
  });

  it("should handle GET request to retrieve business profile", async () => {
    const mockData = {
      business_id: "123",
      email: "test@example.com",
      business_name: "Test Business",
      address: "123 Test St",
      google_location_url: "https://maps.google.com",
      contact_info: "123-456-7890",
      open_times: "9 AM",
      close_times: "5 PM",
      holidays: "",
      logo_url: "http://logo.url",
    };

    mockSupabase
      .from("businesses")
      .select("*")
      .eq("business_id", "123")
      .single.mockResolvedValueOnce({ data: mockData, error: null });

    const req = new Request("http://localhost/api/business/profile?business_id=123", {
      method: "GET",
    });

    const res = await handler(req);
    const body = await res.json();

    assertEquals(res.status, 200);
    assertEquals(body, mockData);
    expect(mockSupabase.from).toHaveBeenCalledWith("businesses");
    expect(mockSupabase.from("businesses").select).toHaveBeenCalledWith("*");
    expect(mockSupabase.from("businesses").select().eq).toHaveBeenCalledWith(
      "business_id",
      "123",
    );
    expect(mockSupabase.from("businesses").select().eq().single).toHaveBeenCalled();
  });

  it("should return 400 if business_id is missing for GET request", async () => {
    const req = new Request("http://localhost/api/business/profile", {
      method: "GET",
    });

    const res = await handler(req);
    const body = await res.json();

    assertEquals(res.status, 400);
    assertEquals(body, { error: "Business ID is required" });
  });

  it("should return 404 if business profile not found for GET request", async () => {
    mockSupabase
      .from("businesses")
      .select("*")
      .eq("business_id", "non-existent-id")
      .single.mockResolvedValueOnce({ data: null, error: null });

    const req = new Request("http://localhost/api/business/profile?business_id=non-existent-id", {
      method: "GET",
    });

    const res = await handler(req);
    const body = await res.json();

    assertEquals(res.status, 404);
    assertEquals(body, { message: "Business profile not found" });
  });

  it("should return 500 for database errors on POST request", async () => {
    mockSupabase.from("businesses").upsert.mockResolvedValueOnce({
      data: null,
      error: { message: "Database error" },
    });

    const req = new Request("http://localhost/api/business/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_id: "123",
        email: "test@example.com",
      }),
    });

    const res = await handler(req);
    const body = await res.json();

    assertEquals(res.status, 500);
    assertEquals(body, { error: "Database error" });
  });

  it("should return 500 for database errors on GET request", async () => {
    mockSupabase
      .from("businesses")
      .select("*")
      .eq("business_id", "123")
      .single.mockResolvedValueOnce({
        data: null,
        error: { message: "Database error" },
      });

    const req = new Request("http://localhost/api/business/profile?business_id=123", {
      method: "GET",
    });

    const res = await handler(req);
    const body = await res.json();

    assertEquals(res.status, 500);
    assertEquals(body, { error: "Database error" });
  });
});
