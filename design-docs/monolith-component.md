# TaskFlow Monolith - Component Diagram

## Overview
The Monolithic architecture packages all TaskFlow capabilities (User Management, Task Management, and Notifications) into a single Fastify application running in a single Node.js process with a single PostgreSQL database.

## Mermaid Component Diagram

```mermaid
flowchart TB
  Client["Client / Web Browser"]

  subgraph Monolith["TaskFlow Monolith Application (Single Process)"]
    Server["Fastify HTTP Server"]
    
    subgraph RouteControllers["Route Controllers"]
      UserRoutes["User Routes<br/>(users.ts)"]
      TaskRoutes["Task Routes<br/>(tasks.ts)"]
      NotificationRoutes["Notification Routes<br/>(notifications.ts)"]
    end
    
    subgraph DataAccess["Data Access"]
      PrismaClient["Prisma ORM Client<br/>(db.ts)"]
    end
  end

  subgraph DB["PostgreSQL Database<br/>(taskflow)"]
    UserTable[("User Table")]
    TaskTable[("Task Table")]
    NotificationTable[("Notification Table")]
  end

  Client -->|HTTP / REST API| Server
  Server -->|/users| UserRoutes
  Server -->|/tasks| TaskRoutes
  Server -->|/notifications| NotificationRoutes

  UserRoutes -->|Query / Mutation| PrismaClient
  TaskRoutes -->|Query / Mutation| PrismaClient
  NotificationRoutes -->|Query / Mutation| PrismaClient

  TaskRoutes -. "Direct Sync Write<br/>(Naive Synchronous Coupling)" .-> NotificationTable
  PrismaClient -->|"SQL (Connection Pool)"| UserTable
  PrismaClient -->|"SQL (Connection Pool)"| TaskTable
  PrismaClient -->|"SQL (Connection Pool)"| NotificationTable
```

## Architectural Analysis & Interactions

### 1. Unified Process & Memory Model
- **Single Process Execution:** All routes and controllers (`users`, `tasks`, `notifications`) execute inside the same Node.js runtime and Fastify server instance.
- **Shared Memory & Heap:** Application state, connection pools, and runtime dependencies are shared across domains.

### 2. Route Controllers & Endpoints
- `UserRoutes` (`/users`): Handles user registration (`POST /users`), user retrieval (`GET /users`), and single user lookup (`GET /users/:id`).
- `TaskRoutes` (`/tasks`): Handles task creation (`POST /tasks`), listing (`GET /tasks`), details (`GET /tasks/:id`), and task assignment (`PATCH /tasks/:id/assign`).
- `NotificationRoutes` (`/notifications`): Handles retrieving user notifications (`GET /notifications/:userId`) and marking notifications as read (`PATCH /notifications/:id/read`).

### 3. Data Access & Synchronous Coupling
- **Shared Prisma Client:** A single `PrismaClient` instance manages connection pooling and query execution to the centralized PostgreSQL instance (`taskflow`).
- **In-Band Synchronous Notification Creation:** When a task is created or assigned with an `assigneeId`, `TaskRoutes` executes a direct synchronous insert to the `Notification` table within the same HTTP request lifecycle. A failure or delay in notification writing directly impacts task assignment latency and availability.
