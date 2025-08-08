export declare const signUp: (email: any, password: any) => Promise<{
    user: import("@supabase/auth-js").User | null;
    session: import("@supabase/auth-js").Session | null;
}>;
export declare const login: (email: any, password: any) => Promise<{
    user: import("@supabase/auth-js").User;
    session: import("@supabase/auth-js").Session;
}>;
export declare const signInWithGoogle: () => Promise<{
    data: {
        provider: import("@supabase/auth-js").Provider;
        url: string;
    };
}>;
export declare const logout: () => Promise<void>;
//# sourceMappingURL=auth.d.ts.map