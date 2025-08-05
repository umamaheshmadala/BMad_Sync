# Tech Stack
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