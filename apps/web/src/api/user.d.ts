export declare const uploadAvatar: (userId: string, file: File) => Promise<string>;
interface UserProfileData {
    userId: string;
    fullName?: string;
    preferredName?: string;
    avatarUrl?: string;
}
export declare const createUserProfile: (profileData: UserProfileData) => Promise<unknown>;
interface PrivacySettings {
    adFrequency: 'low' | 'medium' | 'high';
    excludeCategories: string[];
}
interface UserProfileUpdateData {
    fullName?: string;
    preferredName?: string;
    avatarUrl?: string;
    city?: string;
    interests?: string[];
    privacy_settings?: PrivacySettings;
}
export declare const updateUserProfile: (userId: string, profileData: UserProfileUpdateData) => Promise<unknown>;
export declare const getUserProfile: (userId: string) => Promise<unknown>;
export {};
//# sourceMappingURL=user.d.ts.map