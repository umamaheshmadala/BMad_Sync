import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts";
import { stub, restore } from "https://deno.land/std/mock/mod.ts";
import updatePreferencesHandler from "../update-preferences.ts";

describe("update-preferences Edge Function", () => {
  let mockSupabase: any;
  let mockContext: any;

  beforeEach(() => {
    stub(Deno.env, "get", (key) => {
      if (key === "SUPABASE_URL") return "http://mock-supabase.com";
      if (key === "SUPABASE_SERVICE_ROLE_KEY") return "mock-key";
      return undefined;
    });

    mockSupabase = {
      from: () => mockSupabase,
      update: () => mockSupabase,
      eq: () => mockSupabase,
      select: () => mockSupabase,
    };

    mockContext = {};
  });

  afterEach(() => {
    restore();
  });

  test("should return 405 for non-PUT requests", async () => {
    const req = new Request("http://localhost/api/user/preferences", {
      method: "POST",
    });
    const res = await updatePreferencesHandler(req, mockContext);
    const json = await res.json();

    assertEquals(res.status, 405);
    assertEquals(json.error, "Method Not Allowed");
  });

  test("should return 400 if userId is missing", async () => {
    const req = new Request("http://localhost/api/user/preferences", {
      method: "PUT",
      body: JSON.stringify({ privacy_settings: { adFrequency: 'low' } }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await updatePreferencesHandler(req, mockContext);
    const json = await res.json();

    assertEquals(res.status, 400);
    assertEquals(json.error, "User ID is required");
  });

  test("should return 400 if privacy_settings are missing", async () => {
    const req = new Request("http://localhost/api/user/preferences?userId=test-user", {
      method: "PUT",
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await updatePreferencesHandler(req, mockContext);
    const json = await res.json();

    assertEquals(res.status, 400);
    assertEquals(json.error, "Privacy settings are required");
  });

  test("should return 500 on Supabase update error", async () => {
    const mockError = { message: "Database error" };
    mockSupabase.select = () => ({ data: null, error: mockError });
    stub(mockSupabase, "select", () => ({ data: null, error: mockError }));

    const req = new Request("http://localhost/api/user/preferences?userId=test-user", {
      method: "PUT",
      body: JSON.stringify({ privacy_settings: { adFrequency: 'low' } }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await updatePreferencesHandler(req, mockContext);
    const json = await res.json();

    assertEquals(res.status, 500);
    assertEquals(json.error, mockError.message);
  });

  test("should return 404 if user not found for update", async () => {
    mockSupabase.select = () => ({ data: [], error: null });
    stub(mockSupabase, "select", () => ({ data: [], error: null }));

    const req = new Request("http://localhost/api/user/preferences?userId=nonexistent", {
      method: "PUT",
      body: JSON.stringify({ privacy_settings: { adFrequency: 'low' } }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await updatePreferencesHandler(req, mockContext);
    const json = await res.json();

    assertEquals(res.status, 404);
    assertEquals(json.error, "User not found or no update performed");
  });

  test("should update preferences successfully", async () => {
    const mockUpdatedData = { user_id: 'valid-user-id', privacy_settings: { adFrequency: 'high', excludeCategories: ['Food'] } };
    mockSupabase.select = () => ({ data: [mockUpdatedData], error: null });
    stub(mockSupabase, "select", () => ({ data: [mockUpdatedData], error: null }));


    const req = new Request("http://localhost/api/user/preferences?userId=valid-user-id", {
      method: "PUT",
      body: JSON.stringify({ privacy_settings: { adFrequency: 'high', excludeCategories: ['Food'] } }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await updatePreferencesHandler(req, mockContext);
    const json = await res.json();

    assertEquals(res.status, 200);
    assertEquals(json.message, "Preferences updated successfully");
    assertEquals(json.data.privacy_settings.adFrequency, 'high');
    assertEquals(json.data.privacy_settings.excludeCategories, ['Food']);
  });
});
