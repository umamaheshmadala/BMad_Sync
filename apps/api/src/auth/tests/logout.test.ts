import { assertEquals, assert } from "https://deno.land/std@0.170.0/testing/asserts.ts";
import { User, Session } from "https://esm.sh/@supabase/supabase-js@2.43.4";

// Import the named handler function
import { handleLogout } from "../logout.ts";

// Custom mock function to replace jest.fn()
const createMockFn = <T extends (...args: any[]) => any>(impl?: T) => {
  let calls: Parameters<T>[] = [];
  let resolvedValue: Awaited<ReturnType<T>> | undefined;
  let rejectedValue: any | undefined;
  let hasResolvedValue = false;
  let hasRejectedValue = false;

  const mockFn: T & { calls: Parameters<T>[]; mockResolvedValueOnce: (value: Awaited<ReturnType<T>>) => any; mockRejectedValueOnce: (value: any) => any; } = ((...args: Parameters<T>) => {
    calls.push(args);
    if (hasResolvedValue) {
      return Promise.resolve(resolvedValue);
    } else if (hasRejectedValue) {
      return Promise.reject(rejectedValue);
    } else if (impl) {
      return impl(...args);
    }
    return Promise.resolve(undefined); // Default return
  }) as any;

  mockFn.calls = calls;
  mockFn.mockResolvedValueOnce = (value: Awaited<ReturnType<T>>) => {
    resolvedValue = value;
    hasResolvedValue = true;
    hasRejectedValue = false;
    return mockFn;
  };
  mockFn.mockRejectedValueOnce = (value: any) => {
    rejectedValue = value;
    hasRejectedValue = true;
    hasResolvedValue = false;
    return mockFn;
  };

  return mockFn;
};

// Mock full User and Session objects as expected by Supabase types
const mockUser: User = {
    id: "123",
    aud: "authenticated",
    role: "authenticated",
    email: "test@example.com",
    email_confirmed_at: "",
    phone: "",
    phone_confirmed_at: "",
    app_metadata: {},
    user_metadata: {},
    created_at: "",
    updated_at: "",
} as User;

const mockSession: Session = {
    access_token: "mock_access_token",
    refresh_token: "mock_refresh_token",
    expires_in: 3600,
    token_type: "Bearer",
    user: mockUser,
} as Session;

// Simplified mock for SupabaseClient
const mockSupabaseClient: any = {
  auth: {
    signUp: createMockFn(),
    signInWithPassword: createMockFn(),
    signOut: createMockFn(),
    signInWithOAuth: createMockFn(),
    getSession: createMockFn(),
    onAuthStateChange: createMockFn(() => ({ data: { subscription: { unsubscribe: () => {} } } })) as any,
  },
};

Deno.test("logout function - successful logout", async () => {
  const mockSignOut = createMockFn<() => Promise<{ error: any }>>();
  mockSignOut.mockResolvedValueOnce({
    error: null,
  });

  mockSupabaseClient.auth.signOut = mockSignOut;

  const mockRequest = new Request("http://localhost/logout", {
    method: "POST",
  });

  const response = await handleLogout(mockRequest, mockSupabaseClient);
  const responseBody = await response.json();

  assertEquals(response.status, 200);
  assertEquals(responseBody.message, "Successfully logged out");
  assert(mockSignOut.calls.length === 1);
});

Deno.test("logout function - Supabase error during logout", async () => {
  const mockSignOut = createMockFn<() => Promise<{ error: any }>>();
  mockSignOut.mockResolvedValueOnce({
    error: { message: "Failed to sign out", status: 500 },
  });

  mockSupabaseClient.auth.signOut = mockSignOut;

  const mockRequest = new Request("http://localhost/logout", {
    method: "POST",
  });

  const response = await handleLogout(mockRequest, mockSupabaseClient);
  const responseBody = await response.json();

  assertEquals(response.status, 500);
  assertEquals(responseBody.error, "Failed to sign out");
  assert(mockSignOut.calls.length === 1);
});
