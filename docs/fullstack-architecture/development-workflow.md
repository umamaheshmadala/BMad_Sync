# Development Workflow
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
