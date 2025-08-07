import { assertStrictEquals } from "https://deno.land/std@0.170.0/testing/asserts.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { default as handler } from "../update.ts";

// Mock the Supabase client
jest.mock("https://esm.sh/@supabase/supabase-js@2", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({ data: [{ id: "mock-user-id" }], error: null })),
        })),
      })),
    })),
  })),
}));

describe("update.ts Edge Function", () => {
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

  test("should return 405 for non-POST requests", async () => {
    const req = new Request("http://localhost/api/user/update", { method: "GET" });
    const resp = await handler(req, mockContext);
    assertStrictEquals(resp.status, 405);
    const body = await resp.json();
    assertStrictEquals(body.error, "Method Not Allowed");
  });

  test("should return 400 if userId is missing", async () => {
    const req = new Request("http://localhost/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: "Updated Name" }),
    });
    const resp = await handler(req, mockContext);
    assertStrictEquals(resp.status, 400);
    const body = await resp.json();
    assertStrictEquals(body.error, "User ID is required for update");
  });

  test("should update a user profile successfully", async () => {
    const mockBody = {
      userId: "test-user-uuid",
      fullName: "Updated User",
      preferredName: "Updater",
    };
    const req = new Request("http://localhost/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockBody),
    });

    const resp = await handler(req, mockContext);
    assertStrictEquals(resp.status, 200);
    const body = await resp.json();
    assertStrictEquals(body.message, "Profile updated successfully");
    expect(createClient).toHaveBeenCalledWith(
      "http://localhost:54321",
      "mock-service-role-key"
    );
    // Add more specific assertions for supabase.from().update().eq().select() calls
  });

  test("should handle Supabase update error", async () => {
    (createClient as jest.Mock).mockReturnValueOnce({
      from: jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({ data: null, error: { message: "DB Update Error" } })),
          })),
        })),
      })),
    });

    const mockBody = {
      userId: "test-user-uuid",
      fullName: "Updated User",
    };
    const req = new Request("http://localhost/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockBody),
    });

    const resp = await handler(req, mockContext);
    assertStrictEquals(resp.status, 500);
    const body = await resp.json();
    assertStrictEquals(body.error, "DB Update Error");
  });

  test("should return 404 if user profile not found for update", async () => {
    (createClient as jest.Mock).mockReturnValueOnce({
      from: jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({ data: [], error: null })),
          })),
        })),
      })),
    });

    const mockBody = {
      userId: "non-existent-user-id",
      fullName: "New Name",
    };
    const req = new Request("http://localhost/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockBody),
    });

    const resp = await handler(req, mockContext);
    assertStrictEquals(resp.status, 404);
    const body = await resp.json();
    assertStrictEquals(body.error, "User profile not found");
  });
});
