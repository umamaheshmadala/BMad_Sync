SynC Fullstack Architecture Document
## Introduction
This document outlines the complete fullstack architecture for SynC, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack. This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

Starter Template or Existing Project
This is a Greenfield project. The architecture design proceeds from scratch, utilizing a combination of modern tools and frameworks rather than a single starter template. Core components like React/Vite for frontend, Supabase for backend services, and Netlify for deployment are integrated.

Change Log
Date	Version	Description	Author
2025-07-22	1.0	Initial Fullstack Architecture draft	Architect

Export to Sheets
## High Level Architecture
Technical Summary
SynC will be built as a serverless-first fullstack application, deployed on Netlify, with a React/Vite frontend and a Supabase-powered backend (PostgreSQL, Auth, Edge Functions). The architecture will follow a monorepo structure to manage shared code and streamline development. This design prioritizes scalability, real-time capabilities, and cost-effectiveness to support 10,000+ concurrent users and achieve the PRD's goals of enhancing Hyperlocal business engagement through gamified social features.

Platform and Infrastructure Choice
The chosen platform leverages a combination of specialized services:

Platform: Netlify (for frontend hosting and serverless function deployment) integrated with Supabase (for managed backend services).

Key Services: PostgreSQL Database, Authentication, Realtime capabilities (via Supabase), Edge Functions (Supabase & Netlify for custom API endpoints), Storage (Supabase).

Deployment Host and Regions: [Inference] Deployment will target global CDN for frontend and a region close to the primary user base (e.g., Mumbai, India for initial rollout) for backend services.

Repository Structure
The project will utilize a Monorepo structure.

Structure: Monorepo, managed possibly with NPM Workspaces (given Vite/React context).

Package Organization: apps/ for deployable applications (e.g., web, api), packages/ for shared code (e.g., shared-types, ui-components).

High Level Architecture Diagram
Code snippet

graph TD
    A[User/Business] --> B(Frontend Application - React/Vite)
    B --> C(API Gateway / Edge Functions - Netlify)
    C --> D(Supabase Backend)
    D --> D1(PostgreSQL Database)
    D --> D2(Authentication Service)
    D --> D3(Realtime Service)
    D --> D4(Storage Service)

    C --> E(External Services - e.g., Payment Gateway, SMS, Email)

    subgraph SynC Platform
        B
        C
        D
    end

    style A fill:#ADD8E6,stroke:#333,stroke-width:2px
    style B fill:#FFE4B5,stroke:#333,stroke-width:2px
    style C fill:#FFE4B5,stroke:#333,stroke-width:2px
    style D fill:#90EE90,stroke:#333,stroke-width:2px
    style D1 fill:#E0FFFF,stroke:#666,stroke-width:1px
    style D2 fill:#E0FFFF,stroke:#666,stroke-width:1px
    style D3 fill:#E0FFFF,stroke:#666,stroke-width:1px
    style D4 fill:#E0FFFF,stroke:#666,stroke-width:1px
    style E fill:#D3D3D3,stroke:#666,stroke-width:1px
Architectural Patterns
Jamstack Architecture: Static site generation/SSG (via Vite/React) with serverless APIs (Netlify Functions/Supabase Edge) - [Rationale]: Optimal performance, scalability, and security for web applications.

Component-Based UI: Reusable React components with TypeScript - [Rationale]: Maintainability, modularity, and type safety across large codebases.

Repository Pattern: Abstract data access logic - [Rationale]: Enables easier testing, clear separation of concerns, and future database migration flexibility.

API Gateway Pattern: Unified entry point for all API calls (implied by Netlify Functions/Supabase Edge acting as proxies/gateways) - [Rationale]: Centralized authentication, rate limiting, and monitoring.

Event-Driven Communication: Utilizing Supabase Realtime for selective real-time updates - [Rationale]: Supports efficient broadcasting of social and business activities to connected clients.

Microservice/Serverless Functions (Conceptual): Distinct serverless functions for specific business logic (e.g., Coupon generation, Driver calculation) - [Rationale]: Promotes independent deployment, scalability, and modularity.

## Tech Stack
Technology Stack Table
Category	Technology	Version	Purpose	Rationale
Frontend Language	TypeScript	Latest LTS	Primary development language for frontend	Strong typing, better maintainability, large ecosystem.
Frontend Framework	React	Latest LTS	Building user interfaces	Component-based, large community, excellent for SPAs.
UI Component Library	Shadcn UI	Latest	Reusable UI components	Composable, headless, customizable, built on Radix UI.
State Management	React Context API / Zustand / Jotai	Latest	Managing application state	Efficient state management for various complexities.
Backend Language	TypeScript / Node.js	Latest LTS	Primary development language for serverless functions	Aligns with frontend language, large ecosystem, performant.
Backend Services	Supabase	Latest	Auth, Database (PostgreSQL), Storage, Edge Functions	All-in-one backend-as-a-service, speeds up development.
API Style	REST / Serverless Functions	N/A	Communication between frontend and backend	Industry standard, flexible, scales well with serverless.
Database	PostgreSQL	(Supabase Managed)	Relational data storage	Robust, mature, ACID-compliant, supported by Supabase.
Authentication	Supabase Auth	Latest	User and Business authentication	Integrated with Supabase, secure, supports various login methods.
Frontend Testing	Jest / React Testing Library	Latest	Unit & Integration testing for UI components	Industry standard, robust for React.
Backend Testing	Jest / Vitest	Latest	Unit & Integration testing for serverless functions	Fast, popular testing framework.
E2E Testing	Playwright / Cypress	Latest	End-to-End testing of user flows	Browser automation, reliable E2E tests.
Build Tool	Vite	Latest	Fast development server and bundler	Modern, fast build tool for React projects.
Deployment	Netlify	N/A	Frontend hosting and serverless functions deployment	CDN, automated deployments, seamless integration with Git.
Monitoring	[Inference] Supabase Analytics / Netlify Analytics / Custom	N/A	System health, performance, and usage monitoring	Built-in platform tools, extensible for custom metrics.
Logging	[Inference] Centralized Logging (e.g., Pino, Winston via custom setup)	N/A	Application and error logging	Structured logging for diagnostics and debugging.
CSS Framework	Tailwind CSS	Latest	Utility-first CSS framework	Rapid UI development, highly customizable.

Export to Sheets
## Data Models
User
Purpose: Stores all user-related information, including authentication details, profile, preferences, and driver status.

Key Attributes: user_id (PK), email (Unique), phone_number (Unique, optional), password_hash, full_name, preferred_name, avatar_url, city, interests (array), is_online, is_driver, driver_score, privacy_settings (JSONB).

Relationships: One-to-many with UserActivities, BusinessReviews, BusinessFollows, UserCoupons, WishlistItems, Events, Notifications. Many-to-many with Friends.

Business
Purpose: Stores all business-related information, including authentication, profile, storefront details, and operational hours.

Key Attributes: business_id (PK), email (Unique), password_hash, business_name, address, google_location_url, contact_info, logo_url, is_open, category, subcategory, target_areas (array), target_demographics (array), avg_ticket_size, high_season_start/end, low_season_start/end, open_close_times (JSONB), holidays (JSONB), is_verified.

Relationships: One-to-many with Storefronts, BusinessReviews, BusinessFollows, Coupons, Ads, Promotions, Notifications, RevenueTracking.

Storefront
Purpose: Represents a business's digital presence within the SynC app, including branding and product display.

Key Attributes: storefront_id (PK), business_id (FK, Unique), branding_info, description, theme, current_offers (JSONB), contact_details (JSONB).

Relationships: One-to-many with StorefrontProducts.

StorefrontProduct
Purpose: Details products displayed on a business's digital storefront.

Key Attributes: storefront_product_id (PK), storefront_id (FK), product_name, product_description, product_image_url, display_order, is_trending.

Coupon
Purpose: Defines the master details of a coupon offer created by a business.

Key Attributes: coupon_id (PK), business_id (FK), original_offer_id (FK), title, description, terms_and_conditions, value, start_date, end_date, total_quantity, remaining_quantity, is_active, is_public, cost_per_coupon.

Relationships: One-to-many with UserCoupons.

UserCoupon
Purpose: Represents a specific instance of a coupon collected or owned by a user, tracking its lifecycle.

Key Attributes: user_coupon_id (PK), coupon_id (FK), user_id (FK), unique_code (Unique), current_owner_id (FK to Users), is_redeemed, redeemed_at, is_expired, collected_at, is_favorite, transfer_count, original_acquisition_method, lifecycle_metadata (JSONB).

Relationships: One-to-one with CouponShares (as shared_coupon_instance_id).

CouponShare
Purpose: Tracks instances of users sharing coupons with friends, linking the original and new coupon instances.

Key Attributes: share_id (PK), original_user_coupon_id (FK to UserCoupons), sharer_user_id (FK to Users), receiver_user_id (FK to Users), shared_coupon_instance_id (FK to UserCoupons), shared_at, is_accepted, accepted_at.

WishlistItem
Purpose: Stores items added to a user's wishlist, categorized for matching with offers.

Key Attributes: wishlist_item_id (PK), user_id (FK), item_name, item_description, category (and inferred subcategories), is_matched_with_offer.

Relationships: One-to-many with WishlistMatches.

WishlistMatch
Purpose: Tracks when a wishlist item is matched with an offer or coupon.

Key Attributes: match_id (PK), wishlist_item_id (FK), coupon_id (FK, optional), offer_id (FK, optional), business_id (FK), matched_at, notification_sent_at.

Ad
Purpose: Defines promotional advertisements displayed to users.

Key Attributes: ad_id (PK), business_id (FK), ad_type, title, image_url, target_parameters (JSONB), start_date, end_date, cost_per_day, total_cost, is_active.

Promotion
Purpose: Defines broader promotional campaigns from businesses.

Key Attributes: promotion_id (PK), business_id (FK), title, description, target_parameters (JSONB), start_date, end_date.

Notification
Purpose: Stores all notifications sent to users.

Key Attributes: notification_id (PK), recipient_user_id (FK), sender_business_id (FK, optional), notification_type, message, deep_link_url, is_read, sent_at, throttling_group_id.

PlatformConfig
Purpose: Stores global platform configurations, such as pricing rates.

Key Attributes: config_id (PK), key_name (Unique), config_value (JSONB), description, updated_by (FK to Platform Owner/Admin), updated_at.

RevenueTracking
Purpose: Records all revenue generated by the platform.

Key Attributes: revenue_id (PK), source_type, associated_entity_id, business_id (FK), amount, transaction_date.

PlatformOwnerActivity
Purpose: Logs actions performed by the platform owner/admin.

Key Attributes: activity_id (PK), platform_owner_id (Internal ID), activity_type, target_entity_id, activity_details (JSONB), occurred_at.

UserActivity
Purpose: Logs various user actions for analytics, including check-ins, coupon redemptions, social actions, ad interactions.

Key Attributes: activity_id (PK), user_id (FK), activity_type, entity_id (FK to relevant entity), activity_data (JSONB), occurred_at.

Friend
Purpose: Tracks friendship relationships between users.

Key Attributes: friendship_id (PK), user_id (FK), friend_id (FK), status ('pending', 'accepted', 'blocked'), initiated_at, accepted_at.

## API Specification
The system will primarily expose a RESTful API through Serverless Functions (Supabase Edge Functions and Netlify Functions).

Example API Endpoints (Conceptual)
User Authentication:

POST /api/auth/signup: User registration.

Request: { email: "string", password: "string" }

Response: 200 OK { user_id, session_token }

POST /api/auth/login: User login.

Request: { email: "string", password: "string" }

Response: 200 OK { user_id, session_token }

User Profile & Dashboard:

PUT /api/users/{userId}/profile: Update user profile.

Request: { full_name?, preferred_name?, avatar_url?, city?, interests? }

Response: 200 OK

GET /api/users/{userId}/dashboard: Retrieve personalized dashboard data.

Response: 200 OK { hotOffers: Coupon[], trendingOffers: Coupon[], ads: Ad[], ... }

Coupon Management:

POST /api/users/{userId}/coupons/collect: Collect a new coupon.

Request: { coupon_id: "string" }

Response: 201 Created { user_coupon_id }

POST /api/business/{businessId}/redeem: Redeem a coupon in-store.

Request: { unique_code: "string" }

Response: 200 OK { status: "redeemed", checkin_recorded: true }

Coupon Sharing:

POST /api/users/{userId}/coupons/{userCouponId}/share: Share a coupon with a friend.

Request: { friend_id: "string" }

Response: 201 Created { share_id, new_user_coupon_id }

POST /api/users/{userId}/coupons/shared/{shareId}/accept: Accept a shared coupon.

POST /api/users/{userId}/coupons/shared/{shareId}/decline: Decline a shared coupon.

POST /api/users/{userId}/coupons/shared/{shareId}/cancel: Sender cancels pending shared coupon.

## Components
Component Architecture Overview
The system will be composed of logical components designed for clear separation of concerns, aligning with the monorepo structure.

Component List
Frontend Application (web app):

Responsibility: User Interface, user interaction, API consumption.

Key Interfaces: Renders UI components, makes HTTP requests to Backend API.

Dependencies: Shared UI components, shared types, Backend API.

Technology Stack: React, Vite, Tailwind CSS, Shadcn UI.

Backend API / Edge Functions (api app):

Responsibility: Exposing RESTful API endpoints, business logic, interacting with Supabase.

Key Interfaces: HTTP endpoints (GET, POST, PUT, DELETE) for frontend consumption.

Dependencies: Supabase Database, Supabase Auth, External Services.

Technology Stack: Supabase Edge Functions (Deno/TypeScript), Netlify Functions (Node.js/TypeScript).

Auth Service (Conceptual):

Responsibility: User/Business authentication, session management.

Key Interfaces: Login, Signup, Password Reset APIs.

Dependencies: Supabase Auth, PostgreSQL DB (for user/business data).

User Service (Conceptual):

Responsibility: Managing user profiles, preferences, activities.

Key Interfaces: Profile update, dashboard data retrieval.

Dependencies: PostgreSQL DB, Supabase Storage.

Business Service (Conceptual):

Responsibility: Managing business profiles, storefronts, offers, analytics.

Key Interfaces: Storefront management, coupon creation, analytics retrieval.

Dependencies: PostgreSQL DB, Supabase Storage.

Coupon Service (Conceptual):

Responsibility: Coupon lifecycle management (creation, collection, sharing, redemption, tracking).

Key Interfaces: Coupon creation, sharing, redemption APIs.

Dependencies: PostgreSQL DB.

Notification Service (Conceptual):

Responsibility: Sending real-time notifications based on various events.

Key Interfaces: Internal APIs for triggering notifications, WebSocket integration (Supabase Realtime).

Dependencies: PostgreSQL DB, Supabase Realtime.

Analytics Service (Conceptual):

Responsibility: Aggregating and processing data for business analytics dashboards.

Key Interfaces: Analytics data retrieval APIs.

Dependencies: PostgreSQL DB (UserActivities, UserCoupons, BusinessReviews, Ads, Promotions).

Platform Admin Service (Conceptual):

Responsibility: Managing platform-wide configurations, user/business visibility, revenue tracking.

Key Interfaces: Config update, revenue report APIs.

Dependencies: PostgreSQL DB.

Shared Types/Utilities Package (packages/shared):

Responsibility: Centralized definition of TypeScript interfaces, constants, and reusable utility functions.

Key Interfaces: Exports types and utilities.

Dependencies: None (consumed by web and api apps).

Component Diagrams
Code snippet

graph TD
    User(User) --> Frontend(Frontend App)
    Frontend --> BackendAPI(Backend API / Edge Functions)
    Business(Business) --> BackendAPI

    BackendAPI --> SupaAuth(Supabase Auth)
    BackendAPI --> SupaDB(Supabase PostgreSQL DB)
    BackendAPI --> SupaStorage(Supabase Storage)
    BackendAPI --> SupaRealtime(Supabase Realtime)

    subgraph Backend Services (Conceptual)
        SupaAuth
        UserSvc(User Service)
        BusinessSvc(Business Service)
        CouponSvc(Coupon Service)
        NotifSvc(Notification Service)
        AnalyticsSvc(Analytics Service)
        PlatformAdminSvc(Platform Admin Service)
    end

    BackendAPI --> UserSvc
    BackendAPI --> BusinessSvc
    BackendAPI --> CouponSvc
    BackendAPI --> NotifSvc
    BackendAPI --> AnalyticsSvc
    BackendAPI --> PlatformAdminSvc

    UserSvc --> SupaDB
    BusinessSvc --> SupaDB
    CouponSvc --> SupaDB
    NotifSvc --> SupaDB
    AnalyticsSvc --> SupaDB
    PlatformAdminSvc --> SupaDB

    Frontend --> SupaRealtime
    NotifSvc --> SupaRealtime
## External APIs
The primary external API integration is with Supabase, which provides critical backend-as-a-service functionalities.

API Name: Supabase API (REST)

Purpose: Authentication, managed PostgreSQL database access, file storage, and real-time data synchronization.

Documentation: https://supabase.com/docs/reference/javascript/rest-apis

Base URL: Project-specific Supabase URL.

Authentication: JWT-based (handled by Supabase Auth for client/server).

Rate Limits: Supabase default limits apply; specific plans may increase.

Integration Notes: Direct client-side Supabase calls for basic operations (auth, simple reads); serverless functions used for complex business logic and secure data mutations.

## Core Workflows
User Sign-up & First Coupon Collection Sequence
Code snippet

sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant SA as Supabase Auth
    participant SDB as Supabase DB

    U->>F: Navigate to /signup
    F->>U: Display Signup Form
    U->>F: Submit email, password
    F->>B: POST /api/auth/signup (email, password)
    B->>SA: Call Auth Service (create user)
    SA->>B: User created (user_id)
    B->>SDB: Insert initial User profile
    SDB->>B: User profile saved
    B->>F: 200 OK (user_id, session_token)
    F->>U: Redirect to /onboarding/profile
    U->>F: Complete profile form (name, avatar)
    F->>B: PUT /api/users/{user_id}/profile
    B->>SDB: Update User profile
    SDB->>B: Profile updated
    B->>F: 200 OK
    F->>U: Redirect to /onboarding/interests
    U->>F: Select city, interests
    F->>B: PUT /api/users/{user_id}/profile/interests
    B->>SDB: Update User interests
    SDB->>B: Interests saved
    B->>F: 200 OK
    F->>U: Redirect to /dashboard
    U->>F: View Dashboard (hot/trending offers)
    F->>B: GET /api/users/{user_id}/dashboard
    B->>SDB: Fetch personalized offers/ads
    SDB->>B: Data returned
    B->>F: 200 OK (dashboard data)
    F->>U: Display Dashboard
    U->>F: Click "Collect Coupon" on offer
    F->>B: POST /api/users/{user_id}/coupons/collect (coupon_id)
    B->>SDB: Insert UserCoupon instance
    SDB->>B: UserCoupon saved
    B->>F: 201 Created (user_coupon_id)
    F->>U: Display "Coupon Collected!" confirmation
## Database Schema
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
## Frontend Architecture
Component Architecture Overview
The frontend architecture will be component-based using React, organized for reusability and maintainability. Components will adhere to clear responsibilities and follow atomic design principles where applicable.

Component List
Frontend Application (web app):

Responsibility: User Interface, user interaction, API consumption.

Key Interfaces: Renders UI components, makes HTTP requests to Backend API.

Dependencies: Shared UI components, shared types, Backend API.

Technology Stack: React, Vite, Tailwind CSS, Shadcn UI.

Auth Module: Manages login, signup, password reset components.

Dashboard Modules: Components for user and business dashboards, including sections for offers, activities, analytics.

Listing Components: Reusable components for displaying lists of businesses, coupons, products (e.g., cards, carousels).

Form Components: Standardized components for user input (e.g., profile forms, coupon creation forms).

Navigation Components: Headers, sidebars, footers, search bars.

Shared UI Components (packages/ui - Conceptual): Centralized library of reusable UI components built with Shadcn UI for consistency.

State Management
Approach: React Context API / Zustand / Jotai. A combination may be used based on the scope and complexity of the state. Global state for user session and key configurations, local state for form inputs and component-specific data.

Rationale: Provides efficient state management solutions that scale from simple to complex application needs.

API Integration
Approach: Frontend services will be responsible for consuming backend APIs. These services will handle data fetching, error handling, and data transformation before passing to UI components.

Client Configuration: Use a modern HTTP client (e.g., fetch API, Axios) configured with authentication interceptors for JWT.

Routing
Approach: Client-side routing using React Router (or similar) to manage navigation between pages.

Structure: Defined routes for authenticated and unauthenticated users/businesses, including protected routes that require user authentication.

Styling Guidelines
Approach: Utility-first CSS framework (Tailwind CSS) for rapid and consistent styling. Shadcn UI components will be customized using Tailwind.

Global Theme: globals.css will include base Tailwind directives and any custom CSS variables for branding colors, typography, and spacing.

Testing Requirements
Approach: Full Testing Pyramid as defined in Technical Assumptions.

Frontend Specific: Unit tests for individual components (Jest/React Testing Library), Integration tests for component interactions, E2E tests for critical user flows (Playwright/Cypress).

## Backend Architecture
Service Architecture
SynC's backend will follow a serverless architecture, with distinct serverless functions (Supabase Edge Functions and Netlify Functions) for specific business logic.

Auth Functions: Handle user/business authentication flows.

User Management Functions: Manage user profiles, interests, activities.

Business Management Functions: Manage business profiles, storefronts, products, offers, coupons.

Social & Gamification Functions: Handle friend requests, coupon sharing, Driver calculation logic.

Analytics Functions: Aggregate data for dashboards.

Platform Admin Functions: Manage platform settings, revenue tracking, business visibility.

Database Architecture
Database: PostgreSQL, managed by Supabase.

Schema Design: Designed for normalization to reduce redundancy and ensure data integrity (see "Database Schema" section).

Data Access Layer: Serverless functions will interact with the database through a defined data access layer (e.g., Supabase client library, ORM/query builder within Edge Functions) to abstract database operations and enforce business logic.

Authentication and Authorization
Approach: Supabase Auth will handle core authentication. Authorization will be implemented within backend functions using policies (e.g., Row Level Security in PostgreSQL) and middleware to protect API routes.

Flow: Standard JWT-based authentication flow where clients send tokens with requests.

## Unified Project Structure
The project will adopt a Monorepo structure, organizing both frontend and backend applications, along with shared code, within a single repository.

SynC-Project/
├── .github/                    # CI/CD workflows (e.g., GitHub Actions for build/deploy)
│   └── workflows/
│       ├── ci.yaml
│       └── deploy.yaml
├── apps/                       # Deployable applications
│   ├── web/                    # Frontend application (React/Vite)
│   │   ├── public/             # Static assets
│   │   ├── src/
│   │   │   ├── api/            # Frontend API client services
│   │   │   ├── assets/         # Images, fonts
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── layouts/        # Page layouts
│   │   │   ├── pages/          # Route components/views
│   │   │   ├── styles/         # Global styles, Tailwind config
│   │   │   └── utils/          # Frontend utilities
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   └── api/                    # Backend API (Supabase Edge Functions/Netlify Functions)
│       ├── src/
│       │   ├── auth/           # Auth related functions
│   │   │   ├── controllers/    # API entry points
│   │   │   ├── models/         # Database interaction logic
│   │   │   ├── services/       # Business logic
│   │   │   ├── utils/          # Backend utilities
│   │   │   └── index.ts        # Serverless function entry points
│       ├── package.json
│       ├── tsconfig.json
│       └── netlify.toml        # Netlify config for functions
├── packages/                   # Shared packages/libraries
│   ├── shared-types/           # TypeScript interfaces shared across frontend/backend
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json
│   ├── ui-components/          # (Optional) Centralized Shadcn UI components
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json
│   └── config/                 # Shared configuration (ESLint, Prettier, TypeScript)
│       ├── eslint/
│       ├── typescript/
│       └── jest/
├── infrastructure/             # Infrastructure as Code (e.g., for Supabase/Netlify deployment scripts)
│   └── (IAC structure)
├── docs/                       # Project documentation (PRD, UI/UX Spec, Architecture)
│   ├── prd.md
│   ├── ui-ux-spec.md
│   └── fullstack-architecture.md
├── scripts/                    # Monorepo management scripts
├── .env.example                # Environment variables template
├── package.json                # Root package.json (with workspaces)
├── README.md
├── tsconfig.json
└── (other root config files)
## Development Workflow
Local Development Setup
Prerequisites: Node.js (LTS), Git, Supabase CLI (if local Supabase setup desired).

Initial Setup:

Clone the monorepo: git clone [repo-url]

Install root dependencies: npm install (or yarn install, pnpm install)

Install workspace dependencies: npm install -ws (or equivalent for yarn/pnpm)

Configure Supabase local environment (if applicable) or connect to remote development instance.

Development Commands:

npm run dev:web: Start frontend development server.

npm run dev:api: Start backend serverless function development (e.g., via Netlify CLI or Supabase CLI).

npm run dev: Start both frontend and backend concurrently.

npm run test: Run all unit and integration tests.

npm run test:e2e: Run end-to-end tests.

Environment Configuration
Required environment variables will be managed per application within the monorepo (.env.local for frontend, .env for backend functions) and committed to .env.example. Secrets will be managed via environment variables in deployment platforms (Netlify).

## Deployment Architecture
Deployment Strategy
Frontend Deployment: Frontend application will be deployed as a Single Page Application (SPA) or Static Site Generation (SSG) via Netlify, leveraging its global CDN for low latency.

Backend Deployment: Serverless functions will be deployed via Netlify Functions or Supabase Edge Functions, offering auto-scaling and pay-per-use billing.

Database: Supabase manages the PostgreSQL database, handling scaling, backups, and replication.

Deployment Frequency: Continuous Delivery - multiple times a day. Changes will be deployed upon successful CI/CD pipeline runs to ensure rapid iteration and continuous integration.

CI/CD Pipeline
A CI/CD pipeline (e.g., using GitHub Actions) will automate build, test, and deployment processes.

YAML

# .github/workflows/ci.yaml
name: CI

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: npm install
      - name: Run lint
        run: npm run lint
      - name: Run tests
        run: npm test
      - name: Build applications
        run: npm run build:all # Or npm run build:web, npm run build:api
      - name: Upload artifacts (optional)
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: ./dist # Or specific app dist folders
Environments
Development: Local machines, isolated for individual developer work. Used for feature development and unit testing.

Staging: Pre-production environment. Mirrors production as closely as possible. Used for integrated testing, User Acceptance Testing (UAT), and demos. Data refresh policy (e.g., weekly refresh from production data, anonymized). Access controlled.

Production: Live environment, accessible to all users and businesses. High availability and disaster recovery enabled. Strict access controls.

Environment Promotion Flow
Plaintext

(Git Push to develop) --> (CI/CD Pipeline: Build & Test) --> (Deploy to Staging)
  ^                                                             |
  |                                                             v
(Merge develop to main) ----------------------------------> (Deploy to Production)
Rollback Strategy
Primary Method: Atomic deployments and versioning of serverless functions/static assets, enabling quick rollback to previous stable versions. Database changes require careful migration scripts.

Trigger Conditions: Critical bugs detected in production, performance degradation after deployment.

Recovery Time Objective (RTO): Aim for rapid recovery (e.g., within minutes) for critical issues by rolling back.

## Security and Performance
Security Requirements
Frontend Security:

CSP Headers: Implement Content Security Policy headers to mitigate XSS attacks.

XSS Prevention: Ensure all user-generated content is properly escaped before rendering.

Secure Storage: Use browser's secure storage mechanisms (e.g., HttpOnly cookies for session tokens) for sensitive client-side data.

Backend Security:

Input Validation: Strict validation on all API inputs to prevent injection attacks (SQL, XSS).

Rate Limiting: Implement API rate limiting to prevent abuse and brute-force attacks.

CORS Policy: Properly configured Cross-Origin Resource Sharing policies.

HTTPS Enforcement: All communications over HTTPS.

Authentication Security:

Token Storage: Secure storage for JWTs (e.g., HttpOnly cookies).

Session Management: Secure session management (handled by Supabase Auth).

Password Policy: Enforce strong password policies (min length, complexity).

Performance Optimization
Frontend Performance:

Bundle Size Target: Aim for optimized bundle sizes through code splitting and lazy loading.

Loading Strategy: Implement lazy loading for routes and components.

Caching Strategy: Utilize browser caching for static assets (e.g., images, CSS, JS) and CDN caching.

Backend Performance:

Response Time Target: API response times typically < 100ms for critical operations.

Database Optimization: Indexing, query optimization, connection pooling (managed by Supabase).

Caching Strategy: Implement data caching layers (e.g., Redis for frequently accessed data) in serverless functions where appropriate.

## Testing Strategy
Testing Pyramid
Plaintext

           E2E Tests
          /         \
    Integration Tests
    /             \
Frontend Unit  Backend Unit
Test Organization
Frontend Tests:

Unit tests: apps/web/src/components/**/*.test.ts(x)

Integration tests: apps/web/src/features/**/*.test.ts(x) (testing interaction of multiple components/modules)

Backend Tests:

Unit tests: apps/api/src/services/**/*.test.ts

Integration tests: apps/api/src/controllers/**/*.test.ts (testing API endpoints with mocked external dependencies)

E2E Tests: e2e/tests/**/*.spec.ts

Test Examples
Frontend Component Test (React Testing Library/Jest):

TypeScript

// apps/web/src/components/Button/Button.test.tsx
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with correct text', () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByText(/click me/i)).toBeInTheDocument();
});
Backend API Test (Jest/Supertest for Netlify Function):

TypeScript

// apps/api/src/controllers/auth.test.ts
import request from 'supertest';
// Assume app is your Netlify function handler for testing
import { handler as authHandler } from '../functions/auth'; 

describe('POST /api/auth/signup', () => {
  it('should return 200 OK for successful signup', async () => {
    const response = await request(authHandler)
      .post('/api/auth/signup')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('user_id');
  });
});
E2E Test (Playwright):

TypeScript

// e2e/tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign up and login', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('input[name="email"]', 'e2e@example.com');
  await page.fill('input[name="password"]', 'e2ePassword');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/onboarding/profile');

  // Continue to login
  await page.goto('/login');
  await page.fill('input[name="email"]', 'e2e@example.com');
  await page.fill('input[name="password"]', 'e2ePassword');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
## Coding Standards
Critical Fullstack Rules
Type Sharing: Always define shared TypeScript interfaces and types in packages/shared-types and import from there to ensure type safety across frontend and backend.

API Calls: Frontend should never make direct HTTP calls. All API interactions must go through a dedicated frontend API service layer (e.g., apps/web/src/api/).

Environment Variables: Access configuration variables only through a centralized configuration object, never process.env directly in application code.

Error Handling: All backend API routes must use a standard error handler, returning consistent error response formats.

State Updates: Never mutate state directly in React components; always use proper state management patterns (e.g., useState, Zustand setters).

Database Interactions: Backend functions should interact with Supabase via a dedicated data access layer (e.g., apps/api/src/models/ or apps/api/src/repositories/) following the Repository Pattern.

Naming Conventions
Element	Frontend	Backend	Example
Components	PascalCase	-	UserProfile.tsx
Hooks	camelCase with 'use'	-	useAuth.ts
API Routes	-	kebab-case	/api/user-profile
Database Tables	-	snake_case	user_profiles
Database Columns	-	snake_case	first_name
Serverless Functions	kebab-case	kebab-case	get-user-profile

Export to Sheets
## Error Handling Strategy
Error Flow
Code snippet

sequenceDiagram
    participant C as Client (Frontend)
    participant API as Backend API
    participant BL as Business Logic
    participant DB as Database/External Service

    C->>API: API Request (e.g., Login)
    API->>BL: Validate Input
    alt Input Validation Error
        BL-->>API: Validation Error Response
        API-->>C: 400 Bad Request (Error Format)
        C->>C: Display Inline Validation Error
    else Business Logic / DB Interaction
        BL->>DB: Perform Database/Service Operation
        alt Database/Service Error
            DB-->>BL: Operational Error
            BL->>BL: Log Error & Map to Known Error Code
            BL-->>API: Standardized Error Response
            API-->>C: HTTP Status Code (e.g., 500, 404, 409) (Error Format)
            C->>C: Display Toast/Alert for API Error
        else Success
            DB-->>BL: Success Response
            BL-->>API: Success Response
            API-->>C: 200 OK (Data)
            C->>C: Display Success UI/Redirect
    end
Error Response Format (Standardized)
TypeScript

interface ApiError {
  error: {
    code: string;       // Unique error code (e.g., "AUTH_INVALID_CRED", "DB_UNIQUE_CONSTRAINT_VIOLATION")
    message: string;    // User-friendly message (e.g., "Invalid email or password.")
    details?: Record<string, any>; // Optional: specific validation errors, field names
    timestamp: string;  // When the error occurred (ISO 8601)
    requestId: string;  // Unique request ID for tracing (from logs)
  };
}
Frontend Error Handling
Validation Errors: Display inline error messages next to form fields.

API Errors: Interceptors in the API client will catch errors, map them to user-friendly messages using the ApiError format, and trigger toast notifications or full-screen error components.

Global Error Boundary: Implement a React Error Boundary to gracefully handle unexpected UI errors.

Backend Error Handling
Centralized Error Middleware: All API endpoints/serverless functions will use a centralized error handling middleware to catch exceptions, log details (with requestId), and return standardized ApiError responses.

Logging: Detailed error information (stack traces, request context) will be logged to a centralized logging system.

Retry Mechanisms: Implement retry logic with exponential backoff for transient external service errors.

Circuit Breakers: Implement circuit breakers for critical external services to prevent cascading failures.

## Monitoring and Observability
Monitoring Stack
Frontend Monitoring: [Inference] Web Vitals (Google Analytics/Lighthouse), error tracking (Sentry/Datadog RUM).

Backend Monitoring: [Inference] Supabase Analytics, Netlify Analytics, custom metrics (e.g., function invocations, execution time, errors) integrated with a centralized monitoring tool (e.g., Prometheus/Grafana, Datadog, New Relic).

Error Tracking: Sentry (or similar service) for real-time error reporting and alerting from both frontend and backend.

Performance Monitoring: [Inference] Integration of APM (Application Performance Monitoring) tools to track end-to-end transaction traces.

Key Metrics
Frontend Metrics: Core Web Vitals (LCP, FID, CLS), JavaScript errors, API response times, User interaction latency, Bundle size.

Backend Metrics: Request rate (RPS), Error rate (%), Average/P99 response time, Database query performance, Serverless function cold starts.

Business Metrics: Daily Active Users (DAU), Monthly Active Users (MAU), Coupon redemption rate, Driver conversion rate, Revenue per user/business.

