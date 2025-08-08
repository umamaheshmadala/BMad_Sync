export const supabase = {
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(() => ({
      data: {
        subscription: {
          unsubscribe: jest.fn(),
        },
      },
    })),
    getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
    getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'mock-user-id', email: 'mock@example.com' } } })),
  },
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(() => Promise.resolve({ data: { path: 'test-banner-url' }, error: null })),
      getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'http://localhost/test-banner-url' } })),
    })),
  },
};