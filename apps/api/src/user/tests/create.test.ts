import { assertStrictEquals } from "https://deno.land/std@0.170.0/testing/asserts.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { default as handler } from "../create.ts";

// Mock the Supabase client
jest.mock("https://esm.sh/@supabase/supabase-js@2", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({ data: [{ id: "mock-user-id" }], error: null })),
      })),
    })),
  })),
}));

describe("create.ts Edge Function", () => {
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
    const req = new Request("http://localhost/api/user/create", { method: "GET" });
    const resp = await handler(req, mockContext);
    assertStrictEquals(resp.status, 405);
    const body = await resp.json();
    assertStrictEquals(body.error, "Method Not Allowed");
  });

  test("should create a user profile successfully", async () => {
    const mockBody = {
      userId: "test-user-uuid",
      fullName: "Test User",
      preferredName: "Tester",
      avatarUrl: "http://example.com/avatar.png",
    };
    const req = new Request("http://localhost/api/user/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockBody),
    });

    const resp = await handler(req, mockContext);
    assertStrictEquals(resp.status, 200);
    const body = await resp.json();
    assertStrictEquals(body.message, "Profile created successfully");
    expect(createClient).toHaveBeenCalledWith(
      "http://localhost:54321",
      "mock-service-role-key"
    );
    // Add more specific assertions for supabase.from().insert() calls
  });

  test("should handle invalid JSON body", async () => {
    const req = new Request("http://localhost/api/user/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "invalid json",
    });

    const resp = await handler(req, mockContext);
    assertStrictEquals(resp.status, 400);
    const body = await resp.json();
    expect(body.error).toContain("Invalid JSON");
  });

  test("should handle Supabase insert error", async () => {
    (createClient as jest.Mock).mockReturnValueOnce({
      from: jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({ data: null, error: { message: "DB Error" } })),
        })),
      })),
    });

    const mockBody = {
      userId: "test-user-uuid",
      fullName: "Test User",
      preferredName: "Tester",
      avatarUrl: "http://example.com/avatar.png",
    };
    const req = new Request("http://localhost/api/user/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockBody),
    });

    const resp = await handler(req, mockContext);
    assertStrictEquals(resp.status, 500);
    const body = await resp.json();
    assertStrictEquals(body.error, "DB Error");
  });
});
