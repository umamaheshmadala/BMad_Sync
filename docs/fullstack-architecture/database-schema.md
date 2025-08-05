# Database Schema
The primary database will be PostgreSQL, managed by Supabase.

SQL

-- User Management Module
CREATE TABLE Users (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE, -- For OTP/Mobile login if implemented
    password_hash VARCHAR(255), -- For email/password login
    full_name VARCHAR(255),
    preferred_name VARCHAR(255),
    avatar_url VARCHAR(255),
    city VARCHAR(100) NOT NULL, -- Current city of user
    interests TEXT[], -- Array of chosen interests (e.g., JSONB or TEXT array)
    is_online BOOLEAN DEFAULT FALSE, -- Social presence
    last_activity_at TIMESTAMP WITH TIME ZONE,
    is_driver BOOLEAN DEFAULT FALSE, -- Calculated based on redeemed coupons
    driver_score INT DEFAULT 0, -- Aggregate score for driver status
    privacy_settings JSONB DEFAULT '{}', -- For granular notification/activity control
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Friends (
    friendship_id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL, -- 'pending', 'accepted', 'blocked'
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (user_id, friend_id) -- Ensures only one friendship entry per pair
);

CREATE TABLE UserActivities (
    activity_id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'coupon_redeemed', 'check_in', 'coupon_shared', 'ad_interaction', 'review_written'
    entity_id UUID, -- ID of the related entity (e.g., coupon_id, business_id, ad_id)
    activity_data JSONB, -- Store additional context about the activity
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Business Management Module
CREATE TABLE Businesses (
    business_id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    business_name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    google_location_url VARCHAR(512),
    contact_info VARCHAR(255),
    open_close_times JSONB, -- New: Store daily open/close times
    holidays JSONB, -- New: Store holiday closures
    logo_url VARCHAR(255),
    is_open BOOLEAN DEFAULT FALSE, -- Online presence
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100), -- If any
    target_areas TEXT[], -- JSONB or TEXT array
    target_demographics TEXT[], -- JSONB or TEXT array
    avg_ticket_size DECIMAL(10, 2),
    high_season_start DATE,
    high_season_end DATE,
    low_season_start DATE,
    low_season_end DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE -- KYC check for authenticity (future feature)
);

CREATE TABLE Storefronts (
    storefront_id UUID PRIMARY KEY,
    business_id UUID UNIQUE NOT NULL REFERENCES Businesses(business_id) ON DELETE CASCADE,
    branding_info TEXT, -- Storefront specific branding
    description TEXT,
    theme VARCHAR(50), -- 'seasonal', 'festival', 'default'
    current_offers JSONB, -- Snapshot of current offers/coupons
    contact_details JSONB, -- Contact info specific to storefront
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE StorefrontProducts (
    storefront_product_id UUID PRIMARY KEY,
    storefront_id UUID NOT NULL REFERENCES Storefronts(storefront_id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    product_image_url VARCHAR(255),
    display_order INT, -- For "Top 10" manual ordering
    is_trending BOOLEAN DEFAULT FALSE, -- Can be flagged for dynamic suggestions
    is_backup BOOLEAN DEFAULT FALSE, -- New: To mark replaced products stored as backup
    replaced_at TIMESTAMP WITH TIME ZONE, -- New: Timestamp when product was replaced
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (storefront_id, product_name, is_backup) -- Allow multiple entries if backup
);

CREATE TABLE BusinessReviews (
    review_id UUID PRIMARY KEY,
    business_id UUID NOT NULL REFERENCES Businesses(business_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    recommend_status BOOLEAN NOT NULL, -- TRUE for 'recommend', FALSE for 'don't recommend'
    review_text VARCHAR(300), -- 30 words max
    checked_in_at TIMESTAMP WITH TIME ZONE, -- Link to check-in if available
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (business_id, user_id) -- One review per user per business
);

CREATE TABLE BusinessFollows (
    follow_id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES Businesses(business_id) ON DELETE CASCADE,
    receive_notifications BOOLEAN DEFAULT TRUE, -- User control over notifications
    followed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, business_id)
);


-- Coupon Module
CREATE TABLE Coupons (
    coupon_id UUID PRIMARY KEY,
    business_id UUID NOT NULL REFERENCES Businesses(business_id) ON DELETE CASCADE,
    original_offer_id UUID, -- Link to the broader offer if exists
    title VARCHAR(255) NOT NULL,
    description TEXT,
    terms_and_conditions TEXT,
    value DECIMAL(10, 2), -- Discount amount or percentage
    start_date DATE,
    end_date DATE,
    total_quantity INT,
    remaining_quantity INT,
    is_active BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT FALSE, -- For future public sharing
    cost_per_coupon DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE UserCoupons (
    user_coupon_id UUID PRIMARY KEY,
    coupon_id UUID NOT NULL REFERENCES Coupons(coupon_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    unique_code VARCHAR(255) UNIQUE NOT NULL, -- Unique code for in-store redemption
    current_owner_id UUID NOT NULL REFERENCES Users(user_id), -- Tracks current owner for transfers
    is_redeemed BOOLEAN DEFAULT FALSE,
    redeemed_at TIMESTAMP WITH TIME ZONE,
    is_expired BOOLEAN DEFAULT FALSE,
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_favorite BOOLEAN DEFAULT FALSE,
    transfer_count INT DEFAULT 0, -- How many times it has been shared
    original_acquisition_method VARCHAR(50), -- e.g., 'direct_collect', 'shared_by_friend'
    lifecycle_metadata JSONB, -- Comprehensive metadata for coupon journey (e.g., accepted, declined)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE CouponShares (
    share_id UUID PRIMARY KEY,
    original_user_coupon_id UUID NOT NULL REFERENCES UserCoupons(user_coupon_id), -- The user_coupon_id that was shared by sender
    sharer_user_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    receiver_user_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    shared_coupon_instance_id UUID NOT NULL REFERENCES UserCoupons(user_coupon_id), -- New coupon instance created for receiver
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_accepted BOOLEAN, -- NULL for pending, TRUE for accepted, FALSE for declined
    accepted_at TIMESTAMP WITH TIME ZONE,
    declined_at TIMESTAMP WITH TIME ZONE, -- New: Timestamp when declined
    cancelled_by_sender BOOLEAN DEFAULT FALSE, -- New: Flag if sender cancelled before acceptance
    cancelled_at TIMESTAMP WITH TIME ZONE -- New: Timestamp when sender cancelled
);


-- Wishlist Module
CREATE TABLE WishlistItems (
    wishlist_item_id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    item_description TEXT,
    category VARCHAR(100), -- Categorized by system for matching
    is_matched_with_offer BOOLEAN DEFAULT FALSE, -- For notification trigger
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, item_name)
);

CREATE TABLE WishlistMatches (
    match_id UUID PRIMARY KEY,
    wishlist_item_id UUID NOT NULL REFERENCES WishlistItems(wishlist_item_id) ON DELETE CASCADE,
    coupon_id UUID REFERENCES Coupons(coupon_id), -- Can match with a coupon
    offer_id UUID, -- Can match with a general offer (if offers are separate from coupons)
    business_id UUID NOT NULL REFERENCES Businesses(business_id) ON DELETE CASCADE,
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notification_sent_at TIMESTAMP WITH TIME ZONE
);


-- Ad & Promotion Module
CREATE TABLE Ads (
    ad_id UUID PRIMARY KEY,
    business_id UUID NOT NULL REFERENCES Businesses(business_id) ON DELETE CASCADE,
    ad_type VARCHAR(50) NOT NULL, -- 'banner', 'search_result'
    title VARCHAR(255),
    image_url VARCHAR(255),
    target_parameters JSONB, -- Demographics, interests, location, etc.
    start_date DATE,
    end_date DATE,
    cost_per_day DECIMAL(10, 2), -- 500/day
    total_cost DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Promotions (
    promotion_id UUID PRIMARY KEY,
    business_id UUID NOT NULL REFERENCES Businesses(business_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_parameters JSONB, -- Demographics, interests, location, etc.
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Notification Module
CREATE TABLE Notifications (
    notification_id UUID PRIMARY KEY,
    recipient_user_id UUID NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    sender_business_id UUID REFERENCES Businesses(business_id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL, -- 'friend_request', 'offer_update', 'business_promotion', 'coupon_share_accepted', 'coupon_share_declined', 'coupon_redeemed_by_friend', 'coupon_redeemed_by_nth_connection', 'wishlist_match'
    message TEXT NOT NULL,
    deep_link_url VARCHAR(512),
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    throttling_group_id UUID -- For future grouping mechanism
);


-- Platform Owner Module
CREATE TABLE PlatformConfig (
    config_id UUID PRIMARY KEY,
    key_name VARCHAR(255) UNIQUE NOT NULL,
    config_value JSONB,
    description TEXT,
    updated_by UUID, -- Platform Owner ID
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE RevenueTracking (
    revenue_id UUID PRIMARY KEY,
    source_type VARCHAR(50) NOT NULL, -- 'coupon_generation', 'ad_banner', 'search_result_placement', 'push_notification'
    associated_entity_id UUID, -- e.g., coupon_id, ad_id
    business_id UUID REFERENCES Businesses(business_id),
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PlatformOwnerActivities (
    activity_id UUID PRIMARY KEY,
    platform_owner_id UUID NOT NULL, -- Internal ID for platform owner (not a user)
    activity_type VARCHAR(50) NOT NULL, -- 'change_business_visibility', 'block_spam', 'update_pricing'
    target_entity_id UUID, -- e.g., business_id
    activity_details JSONB,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);