# Technical Assumptions
This section gathers the high-level technical decisions and preferences that will guide the Architect in designing SynC's system. These assumptions, once confirmed, will serve as critical constraints and foundational choices for all subsequent technical work.

Repository Structure: Monorepo
Given the full-stack nature of SynC (React/Vite frontend, Supabase/Netlify serverless backend), a Monorepo structure is recommended.

Rationale: This approach facilitates shared code (e.g., TypeScript types, utility functions) between frontend and backend, simplifies dependency management, and can streamline CI/CD pipelines, which is beneficial for a project aiming for rapid development and consistency across layers.

Trade-offs: While offering benefits for shared code and unified pipelines, monorepos can introduce complexity in managing dependencies for very large teams or across vastly different technology stacks.

Service Architecture: Serverless
SynC's backend explicitly leverages Serverless functions using Supabase Edge Functions and Netlify for custom API endpoints.

Rationale: This aligns with the non-functional requirements for scalability (support for 10,000+ concurrent users), cost-effectiveness, and automatic scaling without managing traditional servers. Supabase provides managed PostgreSQL, Auth, and Storage, complementing the serverless compute model.

Trade-offs: Serverless offers significant scalability and reduced operational overhead but can introduce challenges like 'cold starts' (initial latency for infrequently used functions) and potential vendor lock-in for specific features.

Testing Requirements: Full Testing Pyramid
To meet the reliability goal of 99.9% uptime and ensure robust functionality, a Full Testing Pyramid approach is assumed.

Rationale: This includes:

Unit Tests: For individual components and functions (both frontend and backend).

Integration Tests: To verify interactions between modules and services (e.g., frontend API calls to backend, backend interacting with Supabase).

End-to-End (E2E) Tests: To validate critical user flows across the entire application, ensuring the system works as a whole.
This comprehensive strategy ensures high code quality, reduces bugs, and supports the goal of no assumptions in subsequent development by AI agents.

Additional Technical Assumptions and Requests
Frontend Framework: React with Vite as the build tool for fast development and optimal performance.

UI Component Library/Styling: Tailwind CSS and Shadcn for consistent, modern, and accessible UI development.

Backend Database: PostgreSQL, managed via Supabase, for relational data storage.

Authentication: Supabase Auth for user and business authentication.

Deployment: Netlify for frontend hosting and serverless function deployment.

Dependency Management Note: While not anticipated in this greenfield setup, any future specific library versions or unusual configurations that might cause conflicts or require special handling (e.g., polyfills, environment-specific configurations) should be explicitly documented.

Areas Requiring Deeper Architectural Investigation & Technical Risks
This section explicitly flags areas that may require more detailed design, pose significant technical risks, or need specific mitigation strategies beyond the high-level assumptions.

Real-time Updates for High Concurrency: The requirement for "Real-time updates for social and business activity" (NFR2) for "10,000+ concurrent users" (NFR5) will require careful architectural design around WebSocket implementation, pub/sub patterns, and backend message queues (e.g., using Supabase Realtime or a dedicated service) to handle load efficiently.

Gamification Algorithm Backend Complexity: The "Driver" status calculation (FR59), involving multiple weighted metrics and dynamic weightage changes, will need a robust and efficient backend implementation to avoid performance bottlenecks and ensure data consistency.

Multi-level Categorization Accuracy: The automated categorization of Wishlist items (Story 2.6) and business products (Story 2.2) will require a precise and scalable mechanism to ensure accuracy for matching and targeting. Initial design will define the categorization rules, but refinement may require ML/AI investigation post-MVP.

Coupon Lifecycle State Management: The complex coupon lifecycle (creation, sharing, acceptance, decline, redemption, expiry, cancellation by sender) (Story 3.5, 3.6) requires meticulous state management and transaction integrity in the backend to prevent fraud and ensure accurate tracking.

Internal Documentation Requirements
To ensure consistency and clarity for all developers (human and AI agents), the following internal documentation standards are required:

Code Documentation: All functions, components, and modules shall include comprehensive inline documentation (e.g., JSDoc/TSDoc for TypeScript code) describing their purpose, parameters, return values, and any side effects.

API Documentation: All API endpoints (both REST and serverless functions) shall be documented using an OpenAPI/Swagger specification (or similar tool for tRPC/GraphQL if adopted later). This documentation should define methods, paths, request/response schemas, and authentication requirements.

Architectural Decision Records (ADRs): Key architectural decisions and their rationale shall be formally documented as Architectural Decision Records (ADRs). Each ADR will capture the decision, context, alternatives considered, and consequences.

Technical Specifications: For complex features or modules, supplementary technical specification documents (e.g., detailing data flows, state machines, or complex algorithms) shall be created.
