# Backend Architecture
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
