import { assert, assertEquals } from "https://deno.land/std@0.170.0/testing/asserts.ts";
import { User, Session, SignInWithPasswordCredentials } from "https://esm.sh/@supabase/supabase-js@2.43.4";

// Import the named handler function
import { handleLogin } from "../login.ts";

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

Deno.test("login function - successful login", async () => {
  const mockSignInWithPassword = createMockFn<(_: SignInWithPasswordCredentials) => Promise<{ data: { user: User | null, session: Session | null }, error: any }>>();
  mockSignInWithPassword.mockResolvedValueOnce({
    data: { user: mockUser, session: mockSession },
    error: null,
  });

  mockSupabaseClient.auth.signInWithPassword = mockSignInWithPassword;

  const mockRequest = new Request("http://localhost/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test@example.com", password: "password123" }),
  });

  const response = await handleLogin(mockRequest, mockSupabaseClient);
  const responseBody = await response.json();

  assertEquals(response.status, 200);
  assertEquals(responseBody.user.email, "test@example.com");
  // Explicitly cast to access email property
  const credentials = mockSignInWithPassword.calls[0][0] as { email?: string };
  assert(credentials.email === "test@example.com");
});

Deno.test("login function - missing email or password", async () => {
  const mockRequest = new Request("http://localhost/login", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: "", password: "password123" }),
  });

  const response = await handleLogin(mockRequest, mockSupabaseClient);
  const responseBody = await response.json();

  assertEquals(response.status, 400);
  assertEquals(responseBody.error, "Email and password are required");
});

Deno.test("login function - Supabase error", async () => {
  const mockSignInWithPassword = createMockFn<(_: SignInWithPasswordCredentials) => Promise<{ data: { user: User | null, session: Session | null }, error: any }>>();
  mockSignInWithPassword.mockResolvedValueOnce({
    data: { user: null, session: null },
    error: { message: "Invalid login credentials", status: 400 },
  });

  mockSupabaseClient.auth.signInWithPassword = mockSignInWithPassword;

  const mockRequest = new Request("http://localhost/login", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: "wrong@example.com", password: "wrongpassword" }),
  });

  const response = await handleLogin(mockRequest, mockSupabaseClient);
  const responseBody = await response.json();

  assertEquals(response.status, 400);
  assertEquals(responseBody.error, "Invalid login credentials");
  // Explicitly cast to access email property
  const credentials = mockSignInWithPassword.calls[0][0] as { email?: string };
  assert(credentials.email === "wrong@example.com");
});