import React from 'react';
import { User } from "@supabase/supabase-js";
import { UserProfile, BusinessProfile } from "../../../packages/shared-types/src";
interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    businessProfile: BusinessProfile | null;
    loading: boolean;
    onboardingComplete: boolean;
    signIn: (email: string, password: string) => Promise<any>;
    signUp: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<any>;
    getUserProfile: () => Promise<void>;
    getBusinessProfile: () => Promise<void>;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
    logout: () => Promise<void>;
}
export declare const AuthContext: React.Context<AuthContextType | undefined>;
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useAuth: () => AuthContextType;
export {};
//# sourceMappingURL=AuthContext.d.ts.map