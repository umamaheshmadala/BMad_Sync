# SynC Project

This is a monorepo containing the frontend (React/Vite), backend (Supabase Edge Functions/Netlify Functions), and shared types for the SynC project.

## Project Structure

- `apps/web`: Frontend application (React/Vite)
- `apps/api`: Backend API (Supabase Edge Functions/Netlify Functions)
- `packages/shared-types`: TypeScript interfaces shared across frontend/backend
- `docs`: Project documentation
- `e2e`: End-to-end tests

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/sync-project.git
    cd sync-project
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Frontend Development:**

    Navigate to the `apps/web` directory and start the development server:

    ```bash
    cd apps/web
    npm run dev
    ```

    The frontend application should now be running at `http://localhost:5173/`.

4.  **Backend Development (Optional - for local testing/development of functions):

    (Further instructions for local Supabase Edge Function development will be added here.)

## Running Tests

-   **Frontend Tests:**

    ```bash
    cd apps/web
    npm test
    ```

-   **Backend Tests:**

    ```bash
    cd apps/api
    npm test
    ```

-   **End-to-End Tests:**

    ```bash
    npm run test:e2e
    ```

## Deployment

(Deployment instructions will be added here.)