import { createClient } from '@supabase/supabase-js';

const viteE2e = (import.meta as any).env?.VITE_E2E_MOCK === '1';
// Single source of truth helper for E2E mock detection
export const isE2eMock: boolean = (() => {
  try {
    if (typeof (globalThis as any).__VITE_E2E_MOCK__ !== 'undefined') {
      return Boolean((globalThis as any).__VITE_E2E_MOCK__);
    }
  } catch {}
  return Boolean(viteE2e);
})();

let supabase: any;

if (isE2eMock) {
  type User = { id: string; email: string };

  const mockUser: User | null = null;

  const auth = {
    async signUp({ email }: { email: string; password: string; options?: any }) {
      try { (globalThis as any).__E2E_SESSION__ = { user: { id: 'e2e-user', email } }; } catch {}
      try { (globalThis as any).localStorage?.setItem('e2e-session', JSON.stringify({ user: { id: 'e2e-user', email } })); } catch {}
      return { data: { user: { id: 'e2e-user', email }, session: { user: { id: 'e2e-user', email } } }, error: null };
    },
    async signInWithPassword({ email }: { email: string; password: string }) {
      try { (globalThis as any).__E2E_SESSION__ = { user: { id: 'e2e-user', email } }; } catch {}
      try { (globalThis as any).localStorage?.setItem('e2e-session', JSON.stringify({ user: { id: 'e2e-user', email } })); } catch {}
      return { data: { user: { id: 'e2e-user', email }, session: { user: { id: 'e2e-user', email } } }, error: null };
    },
    async signOut() {
      try { (globalThis as any).__E2E_SESSION__ = null; } catch {}
      try { (globalThis as any).localStorage?.removeItem('e2e-session'); } catch {}
      return { error: null } as any;
    },
    onAuthStateChange() {
      return { data: { subscription: { unsubscribe() {} } } } as any;
    },
    async getSession() {
      try {
        const raw = (globalThis as any).localStorage?.getItem('e2e-session') ?? null;
        const persisted = raw ? JSON.parse(raw) : null;
        const globalSess = (globalThis as any).__E2E_SESSION__ || null;
        const session = persisted ?? globalSess ?? null;
        if (session?.user) {
          return { data: { session }, error: null } as any;
        }
        return { data: { session: null }, error: null } as any;
      } catch {
        const globalSess = (globalThis as any).__E2E_SESSION__ || null;
        if (globalSess?.user) return { data: { session: globalSess }, error: null } as any;
        return { data: { session: null }, error: null } as any;
      }
    },
    async getUser() {
      try {
        const raw = (globalThis as any).localStorage?.getItem('e2e-session') ?? null;
        const persisted = raw ? JSON.parse(raw) : null;
        const globalSess = (globalThis as any).__E2E_SESSION__ || null;
        const sess = persisted ?? globalSess ?? null;
        const user = sess?.user ?? mockUser;
        return { data: { user }, error: null } as any;
      } catch {
        const globalSess = (globalThis as any).__E2E_SESSION__ || null;
        const user = globalSess?.user ?? mockUser;
        return { data: { user }, error: null } as any;
      }
    },
  } as any;

  const storage = {
    from(_bucket: string) {
      return {
        async upload(path: string, _file: File | Blob, _opts?: any) {
          return { data: { path }, error: null };
        },
        getPublicUrl(path: string) {
          return { data: { publicUrl: `http://localhost/${path}` } } as any;
        },
      };
    },
  } as any;

  const from = (_table: string) => {
    return {
      select() {
        return {
          eq() {
            return {
              async single() {
                return { data: null, error: null } as any;
              },
              async maybeSingle() {
                return { data: null, error: null } as any;
              },
            };
          },
        } as any;
      },
      async insert() { return { data: null, error: null } as any; },
      async upsert() { return { data: null, error: null } as any; },
      update() {
        return {
          eq() {
            return { then: (cb: any) => cb({ data: null, error: null }) } as any;
          },
        } as any;
      },
    };
  };

  supabase = { auth, storage, from } as any;
} else {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

export { supabase };