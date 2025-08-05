# Components
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