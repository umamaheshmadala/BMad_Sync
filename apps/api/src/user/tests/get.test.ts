import { assertStrictEquals } from "https://deno.land/std@0.170.0/testing/asserts.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { default as handler } from "../get.ts";

// Mock the Supabase client
jest.mock("https://esm.sh/@supabase/supabase-js@2", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({ data: null, error: null })),
        })),
      })),
    })),
  })),
}));

describe("get.ts Edge Function", () => {
  const mockContext = {
    json: jest.fn(),
    text: jest.fn(),
    params: {},
    cookies: {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    },
    next: jest.fn(),
    waitUntil: jest.fn(),
    site: {
      id: "",
      name: "",
      url: "",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Deno.env.toObject = jest.fn(() => ({ 
      SUPABASE_URL: "http://localhost:54321",
      SUPABASE_SERVICE_ROLE_KEY: "mock-service-role-key",
    }));
  });

  test("should return 405 for non-GET requests", async () => {
    const req = new Request("http://localhost/api/user/get?userId=123", { method: "POST" });
    const resp = await handler(req, mockContext);
    assertStrictEquals(resp.status, 405);
    const body = await resp.json();
    assertStrictEquals(body.error, "Method Not Allowed");
  });

  test("should return 400 if userId is missing", async () => {
    const req = new Request("http://localhost/api/user/get", { method: "GET" });
    const resp = await handler(req, mockContext);
    assertStrictEquals(resp.status, 400);
    const body = await resp.json();
    assertStrictEquals(body.error, "User ID is required");
  });

  test("should return user profile successfully", async () => {
    const mockProfile = {
      full_name: "Test User",
      preferred_name: "Tester",
      avatar_url: "http://example.com/avatar.png",
      email: "test@example.com",
      created_at: "2023-01-01T00:00:00Z",
      city: "New York",
      interests: ["Technology", "Sports", "Music"],
      onboarding_complete: true,
    };
    (createClient as jest.Mock).mockReturnValueOnce({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => ({ data: mockProfile, error: null })),
          })),
        })),
      })),
    });

    const req = new Request("http://localhost/api/user/get?userId=test-user-uuid", { method: "GET" });
    const resp = await handler(req, mockContext);
    assertStrictEquals(resp.status, 200);
    const body = await resp.json();
    assertStrictEquals(body.message, "Profile fetched successfully");
    expect(body.data).toEqual(mockProfile);
  });

  test("should return 404 if user profile not found", async () => {
    (createClient as jest.Mock).mockReturnValueOnce({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => ({ data: null, error: null })),
          })),
        })),
      })),
    });

    const req = new Request("http://localhost/api/user/get?userId=non-existent-user-id", { method: "GET" });
    const resp = await handler(req, mockContext);
    assertStrictEquals(resp.status, 404);
    const body = await resp.json();
    assertStrictEquals(body.error, "User profile not found");
  });

  test("should handle Supabase fetch error", async () => {
    (createClient as jest.Mock).mockReturnValueOnce({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => ({ data: null, error: { message: "DB Fetch Error" } })),
          })),
        })),
      })),
    });

    const req = new Request("http://localhost/api/user/get?userId=test-user-uuid", { method: "GET" });
    const resp = await handler(req, mockContext);
    assertStrictEquals(resp.status, 500);
    const body = await resp.json();
    assertStrictEquals(body.error, "DB Fetch Error");
  });
});
