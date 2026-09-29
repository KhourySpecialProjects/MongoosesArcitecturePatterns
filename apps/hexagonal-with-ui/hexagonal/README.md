# TaskFlow - Hexagonal Architecture (Ports and Adapters)

## Overview

This module implements the **Hexagonal Architecture** (also known as **Ports and Adapters**, formalized by Alistair Cockburn) for the TaskFlow monolithic backend application.

The core objective of this architectural pattern is to isolate business logic (Domain Entities and Application Services) completely from external delivery mechanisms (Fastify HTTP routes), third-party frameworks, and persistence infrastructure (Prisma ORM and PostgreSQL).

```
+-----------------------------------------------------------------------------------+
|                           DRIVING (PRIMARY) ADAPTERS                              |
|   Fastify HTTP Routes (users.routes.ts, tasks.routes.ts, notifications.routes.ts) |
+-----------------------------------------------------------------------------------+
                                         │  (invokes)
                                         ▼
+-----------------------------------------------------------------------------------+
|                             DRIVING (INBOUND) PORTS                               |
|       UserUseCasePort  │  TaskUseCasePort  │  NotificationUseCasePort             |
+-----------------------------------------------------------------------------------+
                                         │  (implemented by)
                                         ▼
+-----------------------------------------------------------------------------------+
|                             HEXAGONAL DOMAIN CORE                                 |
|   Domain Entities: User, Task, Notification, Domain Events                        |
|   Application Services: UserService, TaskService, NotificationService             |
+-----------------------------------------------------------------------------------+
                                         │  (depends on)
                                         ▼
+-----------------------------------------------------------------------------------+
|                             DRIVEN (OUTBOUND) PORTS                               |
|   UserRepositoryPort  │  TaskRepositoryPort  │  NotificationRepoPort  │ EventPub  |
+-----------------------------------------------------------------------------------+
                                         ▲  (implemented by)
                                         │
+-----------------------------------------------------------------------------------+
|                           DRIVEN (SECONDARY) ADAPTERS                             |
|   Prisma Repositories (prisma-*.repository.ts)  │  InProcessEventBusAdapter       |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                        PERSISTENCE & INFRASTRUCTURE                               |
|                           PostgreSQL Database                                     |
+-----------------------------------------------------------------------------------+
```

---

## Prerequisites

- **Node.js:** `v20.x` or later
- **npm:** `v10.x` or later
- **Docker & Docker Compose:** For running PostgreSQL containers locally

---

## Local Setup Instructions

### 1. Configure Environment Variables

Copy the example environment files:

```bash
cd apps/hexagonal-with-ui/hexagonal
cp .env.example .env
cp .env.test.example .env.test
```

Default configuration in `.env`:
```ini
DATABASE_URL="postgresql://taskflow:taskflow@localhost:5432/taskflow?schema=public"
PORT=3000
```

Default configuration in `.env.test`:
```ini
DATABASE_URL="postgresql://taskflow:taskflowtest@localhost:5433/taskflow_test?schema=public"
TEST_DATABASE_URL="postgresql://taskflow:taskflowtest@localhost:5433/taskflow_test?schema=public"
```

### 2. Start PostgreSQL Databases via Docker

Start both the development database (port 5432) and the test database (port 5433):

```bash
docker compose up -d
```

### 3. Install Dependencies & Generate Prisma Client

```bash
npm install
DATABASE_URL="URL in env file" npm run prisma:generate
```

### 4. Run Database Migrations

Apply database migrations to the development database:

```bash
DATABASE_URL="URL in test env file" npm run prisma:migrate:dev
```

### 5. Start the Server

- **Development Mode (with hot reloading):**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm run build
  npm start
  ```

The server will listen on `http://0.0.0.0:3000`.

---

## Running Tests

The test suite includes both pure unit tests (using fast in-memory repository adapters without needing a database) and integration tests (validating HTTP driving adapters and in-process event propagation).

Running the tests does not require a running database.

### Run all tests:
```bash
npm test
```

### Run only domain unit tests (fast, in-memory, 0 DB dependencies):
```bash
npm run test:unit
```

### Run integration tests:
```bash
npm run test:integration
```

---

## API Endpoints Reference

### Health & Info
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Application status information |
| `GET` | `/health` | Health check endpoint |

### Users Domain
| Method | Path | Description | Request Body | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/users` | Register a new user | `{"name": "...", "email": "..."}` | `201 Created` / `400` / `409` |
| `GET` | `/users` | List all users | *None* | `200 OK` |
| `GET` | `/users/:id` | Get user by ID | *None* | `200 OK` / `404` |

### Tasks Domain
| Method | Path | Description | Request Body | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/tasks` | Create a new task (publishes `TaskAssignedEvent` if `assigneeId` is set) | `{"title": "...", "description": "...", "assigneeId": "..."}` | `201 Created` / `400` |
| `GET` | `/tasks` | List all tasks with populated assignee | *None* | `200 OK` |
| `GET` | `/tasks/:id` | Get task by ID with assignee | *None* | `200 OK` / `404` |
| `PATCH` | `/tasks/:id/assign` | Assign task to user (publishes `TaskAssignedEvent`) | `{"assigneeId": "..."}` | `200 OK` / `400` / `404` |

### Notifications Domain
| Method | Path | Description | Request Body | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/notifications/:userId` | List notifications for a user | *None* | `200 OK` / `404` |
| `PATCH` | `/notifications/:id/read` | Mark notification as read | *None* | `200 OK` / `404` |

---

## Architectural Highlights

1. **Dependency Inversion Principle (DIP):**
   - High-level policy (`UserService`, `TaskService`, `NotificationService`) depends strictly on abstractions (`*RepositoryPort`, `EventPublisherPort`), never on concrete low-level implementations (Prisma, Fastify).
2. **Framework & Driver Independence:**
   - The core business domain code is 100% vanilla TypeScript. Adapters (such as Fastify controllers or Prisma database repositories) can be replaced or substituted (e.g. for gRPC, CLI, GraphQL, or MongoDB) without modifying any domain service code.
3. **Decoupled Cross-Domain Event Communication:**
   - In-process domain event dispatching (`InProcessEventBusAdapter`) decouples the Task domain from the Notification domain. When a task is assigned, an event is emitted and consumed in-memory without synchronous cross-table coupling.
4. **Testability in Isolation:**
   - Pure domain business rules and validation invariants are thoroughly verified in `tests/unit` with mock/in-memory adapters in milliseconds, without requiring database connections or server listeners.
