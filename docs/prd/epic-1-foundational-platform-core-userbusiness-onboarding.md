# Epic 1: Foundational Platform & Core User/Business Onboarding
Epic Goal: Establish the core application infrastructure, secure user and business authentication, and enable basic profile management for both user types to allow initial engagement.

Story 1.1: Platform Setup & Core Repository Initialization (Priority: High)
As a developer,

I want the core project repository and environment configured,

so that other development tasks can begin on a standardized foundation.

Acceptance Criteria:

Project repository initialized with a main branch.

Basic monorepo structure set up (apps/web, apps/api, packages/shared).

Frontend (React/Vite) project bootstrapped within apps/web.

Backend (Supabase Edge Functions/Netlify) project structure initialized within apps/api.

Shared TypeScript types package created within packages/shared.

Basic package.json configurations for root and sub-projects are set up.

Git ignored files configured.

Initial README.md created with basic setup instructions.

Story 1.2: User Authentication Core Flows (Priority: High)
As a new user,

I want to sign up and log in securely,

so that I can access the SynC platform.

Acceptance Criteria:

User registration page implemented with email/password fields.

User login page implemented with email/password fields.

Supabase Auth integrated for user signup and login.

Basic routing for authenticated/unauthenticated states implemented.

Error handling displayed for invalid credentials or registration failures.

User session is securely managed upon login.

Local Testability: API endpoint POST /api/auth/signup returns 200 OK with user session data upon valid payload ({"email": "test@example.com", "password": "securepassword"}). Verification via curl command or Postman.

Local Testability: API endpoint POST /api/auth/login returns 200 OK with user session data upon valid payload. Verification via curl command or Postman.

Story 1.3: User Profile Creation & Basic Management (Priority: High)
As a new user,

I want to create and manage my basic profile,

so that my identity is established on the platform.

Acceptance Criteria:

User profile creation form allows input for full name, preferred name, and a basic avatar selection/upload.

Supabase Storage integrated for avatar upload/storage.

User profile data is stored and retrieved from Supabase database.

Basic user profile viewing page is accessible to the logged-in user.

Users table in Supabase stores user_id, email, full_name, preferred_name, avatar_url, and created_at.

Local Testability: Developer can verify the new user profile entry in the Users table by performing a direct SQL query (e.g., SELECT full_name, preferred_name, avatar_url FROM public.Users WHERE user_id = '[newly_created_user_id]').

Story 1.4: Business Authentication Core Flows (Priority: High)
As a business owner,

I want to sign up and log in securely,

so that I can access the SynC business dashboard.

Acceptance Criteria:

Business owner registration page implemented with email/password fields.

Business owner login page implemented with email/password fields.

Supabase Auth integrated for business signup and login (distinct accounts from regular users).

Basic routing for authenticated/unauthenticated business states implemented.

Error handling displayed for invalid credentials or registration failures.

Business session is securely managed upon login.

Local Testability: API endpoint POST /api/business/signup returns 200 OK with business session data upon valid payload. Verification via curl command or Postman.

Local Testability: API endpoint POST /api/business/login returns 200 OK with business session data upon valid payload. Verification via curl command or Postman.

Story 1.5: Business Profile Creation & Basic Management (Priority: High)
As a new business owner,

I want to create and manage my basic business profile,

so that my business presence is established on the platform.

Acceptance Criteria:

Business profile creation form allows input for business name, address, Google location URL, contact info, open/close times, holidays and logo upload.

Supabase Storage integrated for logo upload/storage.

Business profile data is stored and retrieved from Supabase database.

Basic business profile viewing page is accessible to the logged-in business owner.

Businesses table in Supabase stores business_id, email, business_name, address, google_location_url, contact_info, logo_url, and created_at.

Local Testability: Developer can verify the new business entry in the Businesses table by performing a direct SQL query (e.g., SELECT business_name, address FROM public.Businesses WHERE business_id = '[newly_created_business_id]').
