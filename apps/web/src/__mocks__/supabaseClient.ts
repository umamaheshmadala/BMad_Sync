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
  },
};