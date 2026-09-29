# TaskFlow Serverless - Component Diagram

## Overview
The serverless architecture decomposes TaskFlow into modular, lightweight Function-as-a-Service (FaaS) execution units hosted on **DigitalOcean Functions**, orchestrated through an API gateway/ingress layer and persisting state to a DigitalOcean Managed PostgreSQL database.

## Mermaid Component Diagram

```mermaid
flowchart TB
  Client["Client / Web Browser"]

  subgraph IngressLayer["DigitalOcean Ingress & Gateway Layer"]
    APIGateway["API Gateway / App Platform Router<br/>(HTTPS Ingress & Path Routing)"]
  end

  subgraph DOFunctions["DigitalOcean Functions Namespace (taskflow-fn)"]
    subgraph UserPackage["Package: user"]
      UserFn["User Functions<br/>(Create / Get User)"]
    end
    
    subgraph TaskPackage["Package: task"]
      TaskFn["Task Functions<br/>(Create / List / Assign Task)"]
    end
    
    subgraph NotifPackage["Package: notification"]
      NotifFn["Notification Functions<br/>(List / Read Notification)"]
    end
  end

  subgraph PersistenceLayer["DigitalOcean Managed Persistence Layer"]
    PgBouncer["PgBouncer Connection Pool<br/>(Port 25060)"]
    PostgresDB[("DigitalOcean Managed PostgreSQL<br/>(Users, Tasks, Notifications)")]
  end

  Client -->|"HTTPS REST Requests"| APIGateway
  APIGateway -->|"Route /api/users/*"| UserFn
  APIGateway -->|"Route /api/tasks/*"| TaskFn
  APIGateway -->|"Route /api/notifications/*"| NotifFn

  UserFn -->|"SQL Queries (Pooled)"| PgBouncer
  TaskFn -->|"SQL Queries (Pooled)"| PgBouncer
  NotifFn -->|"SQL Queries (Pooled)"| PgBouncer

  PgBouncer -->|"Managed Database Connections"| PostgresDB
```

## Architectural Analysis & Interactions

### 1. DigitalOcean Ingress & API Routing
- **HTTP Routing & Ingress:** Client requests enter via DigitalOcean API Gateway / App Platform routing or direct Functions Web Action endpoints (`https://faas-<region>.doserverless.co/api/v1/web/<namespace>/...`).
- **Route Definitions:**
  - `ANY /api/users/*` $\rightarrow$ `user` package functions
  - `ANY /api/tasks/*` $\rightarrow$ `task` package functions
  - `ANY /api/notifications/*` $\rightarrow$ `notification` package functions

### 2. Ephemeral Compute Units (DigitalOcean Serverless Functions)
- **Granular Serverless Packages:** Functions are deployed into logical packages (`user`, `task`, `notification`) running on Node.js runtime environments (`nodejs:20`).
- **On-Demand Elastic Execution:** Functions scale from zero on demand, executing statelessly during HTTP request lifecycles without persistent server overhead.
- **Synchronous Execution Model:** User, task, and notification operations execute synchronously via respective function actions, maintaining independent failure isolation per endpoint.

### 3. Managed Persistence & Connection Pooling
- **Managed PostgreSQL Database:** Persistent relational storage for `User`, `Task`, and `Notification` domain entities.
- **PgBouncer Connection Pooling:** Because serverless functions scale horizontally and rapidly spin up concurrent ephemeral instances, incoming connections are routed through an integrated PgBouncer connection pool to prevent database connection exhaustion.
