# Unified Project Structure
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