# External APIs
The primary external API integration is with Supabase, which provides critical backend-as-a-service functionalities.

API Name: Supabase API (REST)

Purpose: Authentication, managed PostgreSQL database access, file storage, and real-time data synchronization.

Documentation: https://supabase.com/docs/reference/javascript/rest-apis

Base URL: Project-specific Supabase URL.

Authentication: JWT-based (handled by Supabase Auth for client/server).

Rate Limits: Supabase default limits apply; specific plans may increase.

Integration Notes: Direct client-side Supabase calls for basic operations (auth, simple reads); serverless functions used for complex business logic and secure data mutations.
