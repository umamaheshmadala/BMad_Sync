# Coding Standards
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