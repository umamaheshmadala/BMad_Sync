import { BusinessProfile } from '../../../packages/shared-types/src';
export declare const signUpBusiness: (email: string, password: string) => Promise<{
    user: import("@supabase/auth-js").User | null;
    session: import("@supabase/auth-js").Session | null;
}>;
export declare const loginBusiness: (email: string, password: string) => Promise<{
    user: import("@supabase/auth-js").User;
    session: import("@supabase/auth-js").Session;
}>;
export declare const createBusinessProfile: (profileData: Partial<BusinessProfile>, logoFile?: File) => Promise<unknown>;
export declare const getBusinessProfile: (businessId: string) => Promise<unknown>;
//# sourceMappingURL=business.d.ts.map