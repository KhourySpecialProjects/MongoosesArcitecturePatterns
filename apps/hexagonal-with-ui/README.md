# TaskFlow - Hexagonal Architecture with React UI

## Overview

This module provides a complete full-stack implementation of the **TaskFlow** application using the **Hexagonal Architecture (Ports and Adapters)** on the backend and a modular **React Single-Page Application (SPA)** on the frontend.

Traffic from client browsers is routed through an **Nginx Reverse Proxy** containerized with the UI, ensuring that only the UI reverse proxy communicates directly with the internal Fastify backend server.

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT BROWSER                                   |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼ (Port 80)
+-----------------------------------------------------------------------------------+
|                         UI CONTAINER (Nginx Reverse Proxy)                        |
|   - Static React SPA (/usr/share/nginx/html)                                      |
|   - Reverse Proxy (/api/* -> http://hexagonal:3000/*)                             |
+-----------------------------------------------------------------------------------+
                                         │ (Internal Docker Network)
                                         ▼
+-----------------------------------------------------------------------------------+
|                          HEXAGONAL BACKEND MONOLITH                               |
|   - Driving Adapters: Fastify HTTP Routes (/users, /tasks, /notifications)        |
|   - Inbound / Outbound Ports                                                      |
|   - Domain Services: UserService, TaskService, NotificationService                |
|   - Driven Adapters: Prisma Repositories & In-Process Event Bus                   |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                           POSTGRESQL DATABASE (5432)                              |
+-----------------------------------------------------------------------------------+
```

---

## Features

The React application implements the following key features:
- **Register a new user:** Create user accounts with full name and unique email address.
- **List all users:** Display all registered users in a responsive table with quick inspection actions.
- **View a user by ID:** Lookup and inspect detailed user records by UUID.
- **Create a new task:** Submit tasks with titles, descriptions, and optional assignees.
- **Assign a task to a user:** Select and assign tasks to registered users.
- **View a task by ID with assignee info:** View detailed task information with populated assignee profile.
- **View all notifications of a user:** Select or look up any user to display their event notification feed.
- **Mark a notification as read:** Toggle unread notifications to read status.

---

## Architectural & Design Principles

1. **Small, Single-Responsibility React Components:**
   - Visual presentation is decomposed into focused atomic components (`Button`, `InputField`, `SelectField`, `Card`, `Badge`, `AlertBanner`, `LoadingSpinner`, `EmptyState`) and domain components (`UserRegistrationForm`, `UserListTable`, `TaskCreationForm`, `TaskDetailCard`, `NotificationList`, etc.).
2. **Custom Hook Encapsulation:**
   - All state management, form inputs, validation, event handling, and asynchronous API calls are encapsulated within custom hooks (`useUsers`, `useCreateUser`, `useUserDetail`, `useTasks`, `useCreateTask`, `useTaskDetail`, `useAssignTask`, `useNotifications`). Components strictly render UI.
3. **Centralized API Communication Module:**
   - HTTP transport, error serialization, and response parsing are extracted into `src/services/api-client.ts` and domain services (`user.service.ts`, `task.service.ts`, `notification.service.ts`).
4. **Centralized String Constants:**
   - UI strings, labels, placeholders, titles, and error messages are centralized in `src/constants/strings.ts`.
5. **TSDoc Documentation:**
   - Every component function and custom hook includes comprehensive TSDoc top-level documentation with parameters and return descriptions without inline code comments.
6. **Reverse Proxy Isolation:**
   - The backend service does not expose ports to the external host; only the Nginx reverse proxy running inside the UI container has network access to the backend.

---

## Project Structure

```
apps/hexagonal-with-ui/
├── docker-compose.yml           # Full-stack Docker orchestration
├── README.md                    # This documentation file
├── hexagonal/                   # Hexagonal backend module
│   ├── Dockerfile               # Backend Dockerfile
│   ├── prisma/                  # Database schema & migrations
│   ├── src/                     # Core domain, ports, adapters, Fastify app
│   └── package.json
└── ui/                          # React frontend module
    ├── Dockerfile               # Multi-stage build + Nginx production container
    ├── nginx.conf               # Nginx SPA serving & /api/ reverse proxy configuration
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── index.css
        ├── constants/           # String constants dictionary
        ├── types/               # TypeScript domain interfaces & DTOs
        ├── services/            # API client and backend service wrappers
        ├── hooks/               # Custom hooks with interaction & state logic
        └── components/          # Single-responsibility presentation components
            ├── common/          # Atomic reusable UI components
            ├── layout/          # App shell, header, navigation tabs
            ├── users/           # User registration, listing, and inspection
            ├── tasks/           # Task creation, assignment, and lookup
            └── notifications/   # User notification feed & mark-as-read
```

---

## Running Full-Stack with Docker Compose

### 1. Prerequisites
- **Docker** and **Docker Compose** installed.

### 2. Start all Services
From the `apps/hexagonal-with-ui` directory:

```bash
cd apps/hexagonal-with-ui
docker compose up --build -d
```

This will:
1. Start the **PostgreSQL** database container and test database container.
2. Build and run the **Hexagonal backend** (running Prisma migrations automatically).
3. Build the **React UI** into optimized static assets and launch **Nginx** reverse proxy on port `80`.

### 3. Access the Application
Open your browser and navigate to:
```
http://localhost:80/
```

- React UI is served from `http://localhost/`
- API calls to `/api/*` are reverse-proxied to `http://hexagonal:3000/*`
- Backend port `3000` is **not** exposed to the host machine.

### 4. Stop the Services
```bash
docker compose down
```

---

## Local Development (Without Docker)

If you wish to run the backend and UI in development mode with hot reloading:

### 1. Start the Local PostgreSQL Database
```bash
cd apps/hexagonal-with-ui/hexagonal
docker compose up -d postgres
```

### 2. Configure Backend Environment & Run Migrations
```bash
cd apps/hexagonal-with-ui/hexagonal
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate:dev
npm run dev
```
The backend will run on `http://localhost:3000`.

### 3. Start the React UI Development Server
In a separate terminal:
```bash
cd apps/hexagonal-with-ui/ui
npm install
npm run dev
```
The Vite development server will run on `http://localhost:5173`. Vite's built-in dev proxy will automatically forward `/api/*` requests to `http://localhost:3000`.

---

## Deployment on Coolify

The application is configured for deployment on **Coolify** using the **Docker Compose** resource type.

### Step 1: Create a New Docker Compose Resource
1. Log in to your Coolify dashboard.
2. Select your Project and Environment.
3. Click **+ Add Resource** -> **Docker Compose**.
4. Select your **Git Repository** (or GitHub app) and specify your deployment branch.

### Step 2: Configure Compose Settings in Coolify
In the Coolify resource configuration:
- **Base Directory:** `/apps/hexagonal-with-ui`
- **Docker Compose Location:** `docker-compose.yml` (Coolify detects this automatically within the Base Directory).

### Step 3: Configure Environment Variables
Verify that the `DATABASE_URL` environment variable for the `hexagonal` backend matches your production PostgreSQL settings. In `docker-compose.yml`, internal Docker networking is configured by default:
```ini
DATABASE_URL=postgresql://taskflow:taskflow@postgres:5432/taskflow?schema=public
PORT=3000
```
*Note:* If you are using a managed PostgreSQL instance provisioned as an external resource in Coolify, replace `DATABASE_URL` in Coolify's Environment Variables tab with the connection string of your managed database.

### Step 4: Configure Domain & Routing
1. In Coolify's settings for the `ui` service, configure your desired public domain (e.g. `https://taskflow.yourdomain.com`).
2. Coolify will route incoming public web traffic to the `ui` container (port `80`).
3. The Nginx reverse proxy in the `ui` container will route all static frontend requests to the SPA and proxy `/api/*` requests to the internal `hexagonal` backend service over Docker's internal network.

### Step 5: Deploy
Click **Deploy** in Coolify. Coolify will build the container images, run database migrations on container launch, and start the full-stack system.
