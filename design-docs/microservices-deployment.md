# TaskFlow Microservices - Deployment Diagram

## Overview
The deployment topology maps out containerized microservices, isolated PostgreSQL databases, RabbitMQ broker, and API Gateway running within an isolated Docker bridge network on Coolify / Docker Compose.

## Mermaid Deployment Diagram

```mermaid
flowchart TB
  Client["Client"]

  subgraph Host["Deployment Host (Docker Engine / Coolify VPS)"]
    subgraph GatewayContainer["Container: api-gateway"]
      GatewayNode["Fastify Gateway<br/>(Port 3000)"]
    end

    subgraph BridgeNet["Internal Docker Bridge Network: taskflow-net"]
      subgraph UsersServiceContainer["Container: users-service"]
        UsersNode["Users App (Node.js)<br/>Port 3001"]
      end
      subgraph UsersDBContainer["Container: users-db"]
        UsersDBNode[("PostgreSQL 16<br/>Port 5440->5432<br/>(taskflow_users)")]
      end

      subgraph TasksServiceContainer["Container: tasks-service"]
        TasksNode["Tasks App (Node.js)<br/>Port 3002"]
      end
      subgraph TasksDBContainer["Container: tasks-db"]
        TasksDBNode[("PostgreSQL 16<br/>Port 5441->5432<br/>(taskflow_tasks)")]
      end

      subgraph NotifServiceContainer["Container: notifications-service"]
        NotificationsNode["Notifications App (Node.js)<br/>Port 3003"]
      end
      subgraph NotifDBContainer["Container: notifications-db"]
        NotificationsDBNode[("PostgreSQL 16<br/>Port 5442->5432<br/>(taskflow_notifications)")]
      end

      subgraph RabbitMQContainer["Container: rabbitmq"]
        RabbitMQNode[["RabbitMQ 3 Engine<br/>AMQP: 5672 | UI: 15672"]]
      end
    end
  end

  Client -->|"HTTP (Port 3000)"| GatewayNode
  GatewayNode -->|"http://users-service:3001"| UsersNode
  GatewayNode -->|"http://tasks-service:3002"| TasksNode
  GatewayNode -->|"http://notifications-service:3003"| NotificationsNode

  UsersNode -->|"TCP 5432"| UsersDBNode
  TasksNode -->|"TCP 5432"| TasksDBNode
  NotificationsNode -->|"TCP 5432"| NotificationsDBNode

  UsersNode -->|"amqp://rabbitmq:5672"| RabbitMQNode
  TasksNode -->|"amqp://rabbitmq:5672"| RabbitMQNode
  NotificationsNode -->|"amqp://rabbitmq:5672"| RabbitMQNode
```

## Network & Deployment Specifications

### 1. Network Isolation
- **Bridge Network (`taskflow-net`):** All service containers, databases, and message broker communicate across an internal private Docker network using Docker DNS names (`users-service`, `tasks-service`, `notifications-service`, `rabbitmq`).

### 2. Port Allocation & Host Mappings
- **External Ingress:** Port `3000` on the API Gateway is exposed to host/reverse proxy.
- **Dedicated Databases (Host Port Forwarding for Local Dev / Tooling):**
  - `taskflow_users`: Host port `5440` $\rightarrow$ Container port `5432`
  - `taskflow_tasks`: Host port `5441` $\rightarrow$ Container port `5432`
  - `taskflow_notifications`: Host port `5442` $\rightarrow$ Container port `5432`
- **RabbitMQ Message Broker:**
  - Port `5672`: AMQP protocol communication
  - Port `15672`: Management Dashboard Web UI

### 3. Container Configurations & Dependencies
- **Health Checks & Startup Order:**
  - `rabbitmq` starts with healthcheck `rabbitmq-diagnostics -q ping`.
  - Database containers start with healthcheck `pg_isready -U postgres`.
  - Service containers depend on their respective databases and rabbitmq broker being healthy (`condition: service_healthy`).
- **Environment Variables:**
  - `RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672`
  - `DATABASE_URL=postgresql://postgres:postgres@<db-host>:5432/<db-name>?schema=public`
  - `PORT`: Respective service listening port (`3000`, `3001`, `3002`, `3003`).
