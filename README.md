# The New Yorker Blog Clone

A full-stack editorial blog application for discovering, reading, and managing stories. The project includes a React and TypeScript frontend, an Express API, and a PostgreSQL database hosted on Neon.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database](#database)
- [API overview](#api-overview)
- [Recent improvements](#recent-improvements)
- [Available scripts](#available-scripts)

## Features

- Browse stories by category and editorial post type.
- Search and discover recent stories, magazine features, and previously published stories.
- View individual stories, author profiles, and saved posts.
- Register, sign in, refresh sessions, and sign out using secure HTTP-only cookies.
- Create, edit, and delete posts when authenticated.
- Manage categories. A category cannot be deleted while posts still use it.
- Track post views and search activity to provide a personalized **For You** feed to signed-in users.
- Generate post recommendations using vector embeddings.
- Responsive layouts, lazy-loaded content, loading states, and a user-friendly error boundary.

Post types are `News`, `Books & Culture`, `Fiction & Poetry`, `Humor & Cartoons`, and `Magazine`.

## Technology

### Frontend

- React 18, TypeScript, and Vite
- React Router
- Redux Toolkit and React Redux for client authentication state
- TanStack Query for server state and caching
- Tailwind CSS and Radix UI
- Swiper for the homepage magazine slider
- Axios for API requests
- `react-error-boundary` for functional React error boundaries

### Backend and services

- Node.js 26 and Express
- TypeScript and Drizzle ORM
- Neon serverless PostgreSQL with the `pgvector` extension
- JWT authentication, bcrypt password hashing, and HTTP-only cookies
- Hugging Face Transformers for post embeddings
- Upstash QStash for background embedding jobs

## Architecture

```text
frontend/                 React single-page application
  src/
    api/                  API handlers and TanStack Query hooks
    components/           Shared, editorial, and UI components
    context/              Redux authentication store
    pages/                Route-level pages
    router/               Application layout and route guards

backend/                  Express API and background-job handlers
  controller/             HTTP request handlers
  db/                     Drizzle schema, connection, and migrations
  middleware/             Authentication and request verification
  routes/                 API route definitions
  services/               Search, recommendations, and embeddings
```

The frontend and backend are separate npm projects, each with its own `package.json`.

## Getting started

### Prerequisites

- Node.js 26 and npm
- A PostgreSQL database. Neon is used by the hosted application.
- QStash credentials if you want to run asynchronous embedding jobs.

### Install dependencies

From the repository root:

```bash
npm --prefix backend install
npm --prefix frontend install
```

### Configure the environment

Create `backend/.env` and `frontend/.env.local` as described in [Environment variables](#environment-variables). Never commit environment files or credentials.

### Initialize the database

From the `backend` directory:

```bash
npm run db:migrate
```

To apply the current schema directly during local development, the backend also provides `npm run db:push`.

### Start the application

Run the API and frontend in separate terminals:

```bash
# Terminal 1
cd backend
npm run dev
```

```bash
# Terminal 2
cd frontend
npm run dev
```

Vite prints the local frontend URL when it starts (typically `http://localhost:5173`). The API defaults to `http://localhost:5000`; check `GET /api/test` to confirm it is running.

## Environment variables

### Backend (`backend/.env`)

| Variable | Required | Purpose |
|---|---:|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Drizzle and migrations. |
| `PORT` | No | API port; defaults to `5000`. |
| `NODE_ENV` | No | Set to `production` to enable production cookie and CORS settings. |
| `FRONTEND_URL_DEV` | For local development | Allowed frontend origin when not in production. |
| `FRONTEND_URL` | For production | Allowed frontend origin in production. |
| `APP_BASE_URL` | For background jobs | Public base URL used when publishing embedding jobs. |
| `QSTASH_TOKEN` | For background jobs | QStash API token. |
| `QSTASH_URL` | If configured | Optional QStash API base URL. |
| `QSTASH_CURRENT_SIGNING_KEY` | For background jobs | Current QStash request-signing key. |
| `QSTASH_NEXT_SIGNING_KEY` | For background jobs | Next QStash request-signing key used during key rotation. |
| `JOB_DISPATCH_SECRET` | If using the dispatch endpoint | Secret for the pending-job dispatch endpoint. |

Example local development configuration:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
PORT=5000
NODE_ENV=development
FRONTEND_URL_DEV=http://localhost:5173
APP_BASE_URL=http://localhost:5000
QSTASH_TOKEN=your_qstash_token
QSTASH_CURRENT_SIGNING_KEY=your_current_signing_key
QSTASH_NEXT_SIGNING_KEY=your_next_signing_key
```

Use the actual public API URL for `APP_BASE_URL` when running background jobs in a deployed environment.

### Frontend (`frontend/.env.local`)

| Variable | Required | Purpose |
|---|---:|---|
| `VITE_API_URL_DEV` | For development | API base URL used by Vite's development server. |
| `VITE_API_URL` | For production | API base URL used by production builds. |

Example:

```env
VITE_API_URL_DEV=http://localhost:5000
VITE_API_URL=https://api.example.com
```

Vite exposes variables prefixed with `VITE_` to browser code; do not put secrets in frontend environment variables.

## Database

The Drizzle schema is defined in `backend/db/schema.ts`; migration files are in `backend/db/drizzle/`.

From the `backend` directory:

```bash
npm run db:generate   # Generate a migration from schema changes
npm run db:migrate    # Apply pending migrations
npm run db:push       # Push schema changes directly (local development)
npm run db:studio     # Open Drizzle Studio
```

Use migrations to track and deploy schema changes. `db:push` is intended for local development rather than production deployments.

## API overview

The API is mounted under `/api`. Authenticated endpoints require a valid session cookie.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/test` | Check API availability. |
| `POST` | `/api/auth/register` | Register a user. |
| `POST` | `/api/auth/login` | Sign in and create session cookies. |
| `POST` | `/api/auth/refresh` | Refresh the current session. |
| `POST` | `/api/auth/logout` | Clear session cookies. |
| `GET` | `/api/posts` | List posts; supports category, post type, search, pagination, and sorting query parameters. |
| `GET` | `/api/posts/missed` | Get paginated posts published before today. |
| `GET` | `/api/posts/:id` | Get a post. |
| `POST` | `/api/posts` | Create a post (authenticated). |
| `PUT` | `/api/posts/:id` | Update a post (authenticated). |
| `DELETE` | `/api/posts/:id` | Delete a post (authenticated). |
| `GET` | `/api/posts/:id/recommendations` | Get similar posts; accepts `limit` from 1 to 20. |
| `GET` | `/api/categories` | List categories. |
| `POST` | `/api/categories` | Create a category (authenticated). |
| `DELETE` | `/api/categories/:id` | Delete an unused category (authenticated); returns `409` if posts still use it. |
| `GET` | `/api/users/:id` | Get a user profile. |
| `PUT` | `/api/users/:id` | Update a user or saved-post data (authenticated). |
| `DELETE` | `/api/users/:id` | Delete a user (authenticated). |
| `GET` | `/api/events` | Get posts associated with the current visitor's activity; accepts a `limit` query parameter. |
| `POST` | `/api/events` | Record a post-view or search event. |

Post list endpoints accept `limit` and `page` query parameters where applicable. See the route and controller files for validation and response shapes.

## Recent improvements

- **Safer category deletion:** The API rejects deletion when any post references a category, so users do not have to delete posts they do not own. The UI explains how to resolve the conflict.
- **Functional error boundary:** Unhandled rendering errors display a recovery screen with reload and homepage actions; route errors also have a fallback.
- **Magazine-driven homepage slider:** The hero loads the latest `Magazine` posts and renders their real images, titles, authors, and next-story teaser, with loading, error, and empty states.
- **Personalized feed gated by authentication:** The homepage only displays and fetches **For You** recommendations when a user is present.
- **Event feed limit respected:** The frontend passes the requested event limit through, and the API limits returned unique posts accordingly.
- **Shared missed-post grid:** The homepage's “In Case You Missed It” section reuses the shared `Grid` component for loading placeholders and post cards while keeping lazy loading and its archive link.

## Available scripts

### Frontend (`frontend/`)

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check and create a production build. |
| `npm run lint` | Run ESLint on the frontend source. |
| `npm run preview` | Preview the production build locally. |

### Backend (`backend/`)

| Command | Description |
|---|---|
| `npm run dev` | Start the API with Node watch mode. |
| `npm start` | Start the API. |
| `npm run db:generate` | Generate Drizzle migrations. |
| `npm run db:migrate` | Apply Drizzle migrations. |
| `npm run db:push` | Push the schema directly to the database. |
| `npm run db:studio` | Open Drizzle Studio. |
