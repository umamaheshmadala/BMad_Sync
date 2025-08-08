export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  is_business?: boolean;
  onboarding_complete?: boolean;
  city?: string;
  interests?: string[];
}

export interface BusinessProfile {
  id: string;
  business_name: string;
  business_type?: string;
}
