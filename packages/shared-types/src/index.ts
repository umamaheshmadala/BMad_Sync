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

export interface StorefrontProfile {
  storefront_id?: string;
  business_id: string;
  description?: string;
  contact_details?: string;
  theme?: string;
  is_open?: boolean;
  promotional_banner_url?: string;
  created_at?: string;
}

export interface StorefrontProduct {
  product_id: string;
  product_name: string;
  product_description?: string;
  product_image_url?: string;
  display_order?: number;
  is_trending?: boolean;
}