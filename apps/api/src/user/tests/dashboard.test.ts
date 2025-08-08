import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts";
import { stub, restore } from "https://deno.land/std/mock/mod.ts";
import dashboardHandler from "../dashboard.ts"; // The actual Edge Function file

describe("dashboard Edge Function", () => {
  let mockSupabase: any;
  let mockContext: any;

  beforeEach(() => {
    // Mock Deno.env.get
    stub(Deno.env, "get", (key) => {
      if (key === "SUPABASE_URL") return "http://mock-supabase.com";
      if (key === "SUPABASE_SERVICE_ROLE_KEY") return "mock-key";
      return undefined;
    });

    // Mock Supabase client
    mockSupabase = {
      from: () => mockSupabase,
      select: () => mockSupabase,
      eq: () => mockSupabase,
      single: () => mockSupabase,
    };

    mockContext = {}; // Context can be empty for this test
  });

  afterEach(() => {
    restore(); // Restore all stubs
  });

  test("should return 405 for non-GET requests", async () => {
    const req = new Request("http://localhost/api/user/dashboard", {
      method: "POST",
    });
    const res = await dashboardHandler(req, mockContext);
    const json = await res.json();

    assertEquals(res.status, 405);
    assertEquals(json.error, "Method Not Allowed");
  });

  test("should return 400 if userId is missing", async () => {
    const req = new Request("http://localhost/api/user/dashboard", {
      method: "GET",
    });
    const res = await dashboardHandler(req, mockContext);
    const json = await res.json();

    assertEquals(res.status, 400);
    assertEquals(json.error, "User ID is required");
  });

  test("should return 404 if user profile not found", async () => {
    mockSupabase.single = () => ({ data: null, error: null });
    stub(mockSupabase, "single", () => ({ data: null, error: null }));

    const req = new Request("http://localhost/api/user/dashboard?userId=nonexistent", {
      method: "GET",
    });
    const res = await dashboardHandler(req, mockContext);
    const json = await res.json();

    assertEquals(res.status, 404);
    assertEquals(json.error, "User profile not found");
  });

  test("should return 500 on Supabase user fetch error", async () => {
    const mockError = { message: "Database error" };
    mockSupabase.single = () => ({ data: null, error: mockError });
    stub(mockSupabase, "single", () => ({ data: null, error: mockError }));


    const req = new Request("http://localhost/api/user/dashboard?userId=test-user", {
      method: "GET",
    });
    const res = await dashboardHandler(req, mockContext);
    const json = await res.json();

    assertEquals(res.status, 500);
    assertEquals(json.error, mockError.message);
  });

  test("should return dashboard data for a valid user", async () => {
    const mockUserData = {
      city: "London",
      interests: ["Food", "Tech"],
      privacy_settings: { adFrequency: "low", excludeCategories: [] },
    };
    mockSupabase.single = () => ({ data: mockUserData, error: null });
    stub(mockSupabase, "single", () => ({ data: mockUserData, error: null }));


    const req = new Request("http://localhost/api/user/dashboard?userId=valid-user-id", {
      method: "GET",
    });
    const res = await dashboardHandler(req, mockContext);
    const json = await res.json();

    assertEquals(res.status, 200);
    assertEquals(json.message, "Dashboard data fetched successfully");
    assert(json.data.user.city === "London");
    assert(json.data.hotOffers.length > 0);
    assert(json.data.trendingOffers.length > 0);
    assert(json.data.promotionalAds.length > 0);
  });
});
