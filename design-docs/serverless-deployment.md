# TaskFlow Serverless - Deployment Diagram

## Overview
The serverless architecture is deployed onto DigitalOcean's managed cloud infrastructure using **DigitalOcean Functions** (FaaS) organized within a serverless namespace, routing traffic through DigitalOcean API Gateway / Ingress and connecting to a **DigitalOcean Managed PostgreSQL Database** with an integrated PgBouncer connection pool over a secure private network.

## Mermaid Deployment Diagram

```mermaid
flowchart TB
  User["End User / Browser"]

  subgraph DOCloud["DigitalOcean Cloud Infrastructure (Managed Platform)"]
    subgraph IngressEdge["Edge & Ingress Layer"]
      DOIngress["DigitalOcean API Gateway / App Platform<br/>(TLS Termination & Path Routing)"]
    end

    subgraph DONamespace["DigitalOcean Functions Namespace: taskflow-fn"]
      subgraph UserFnAction["Action: user/user-fn"]
        UserFn["User Function (Node.js 20 Runtime)<br/>Memory: 256MB / Timeout: 15s"]
      end

      subgraph TaskFnAction["Action: task/task-fn"]
        TaskFn["Task Function (Node.js 20 Runtime)<br/>Memory: 256MB / Timeout: 15s"]
      end

      subgraph NotifFnAction["Action: notification/notif-fn"]
        NotifFn["Notification Function (Node.js 20 Runtime)<br/>Memory: 256MB / Timeout: 15s"]
      end
    end

    subgraph DOPrivateNet["DigitalOcean Private Network / VPC"]
      subgraph ManagedDBCluster["DigitalOcean Managed PostgreSQL Cluster"]
        PgBouncer["PgBouncer Connection Pool<br/>(Port 25060 / Transaction Mode)"]
        PostgresDB[("PostgreSQL 16 Engine<br/>(Port 5432 / taskflow db)")]
      end
    end
  end

  User -->|"HTTPS (Port 443)"| DOIngress
  DOIngress -->|"Invoke /api/users"| UserFn
  DOIngress -->|"Invoke /api/tasks"| TaskFn
  DOIngress -->|"Invoke /api/notifications"| NotifFn

  UserFn -->|"DATABASE_URL (TLS / Port 25060)"| PgBouncer
  TaskFn -->|"DATABASE_URL (TLS / Port 25060)"| PgBouncer
  NotifFn -->|"DATABASE_URL (TLS / Port 25060)"| PgBouncer

  PgBouncer -->|"Pooled TCP Connections (Port 5432)"| PostgresDB
```

## Infrastructure Topology & Configuration

### 1. Serverless Compute Platform (DigitalOcean Functions)
- **Functions Namespace:** Dedicated namespace (`taskflow-fn`) deployed and managed using the `doctl serverless` CLI with `project.yml` configuration.
- **Runtime Environment:** Node.js 20 runtime (`nodejs:20`) with configurable memory limits (256MB) and execution timeouts (15s).
- **Auto-Scaling:** Automatically scales from 0 to meet concurrent request volume with zero idle compute costs.

### 2. Edge & Networking Layer
- **Ingress & TLS:** DigitalOcean API Gateway / App Platform provides automated TLS termination (HTTPS port 443) and routes public endpoints to the corresponding function actions:
  - `/api/users/*` $\rightarrow$ `packages/user/user-fn`
  - `/api/tasks/*` $\rightarrow$ `packages/task/task-fn`
  - `/api/notifications/*` $\rightarrow$ `packages/notification/notif-fn`
- **Functions Web Endpoints:** Alternatively accessible directly via secure DigitalOcean Web Action URLs (`https://faas-<region>.doserverless.co/api/v1/web/<namespace>/...`).
- **Private Network (VPC):** Function instances communicate securely with the database over DigitalOcean's private VPC network with SSL/TLS enforcement.

### 3. Managed Persistence & Connection Pooling
- **DigitalOcean Managed Database:** Managed PostgreSQL 16 cluster with automated backups, high availability, and failover support.
- **Connection Pool (PgBouncer):** Functions connect to PgBouncer on port `25060` (Transaction pooling mode) to multiplex and manage database connections, mitigating connection starvation caused by ephemeral, concurrent serverless invocations.

### 4. Environment & Secrets
- `DATABASE_URL`: Connection pool string formatted as `postgresql://<user>:<password>@<db-pool-host>:25060/taskflow?sslmode=require`.
- Environment secrets and function configurations are managed securely via `project.yml` and DigitalOcean Functions encrypted namespace parameters.
