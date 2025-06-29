# NestJS Clean Architecture Template

A production-ready NestJS project template following Clean Architecture principles with support for both MySQL (via TypeORM) and MongoDB (via Mongoose), along with advanced operational features for enterprise-grade applications.

## Architecture Overview

This template follows Clean Architecture principles, which separates the application into four distinct layers:

1. **Domain Layer**: Contains the business entities and repository interfaces.
2. **Application Layer**: Contains the use cases and application-specific business rules.
3. **Infrastructure Layer**: Contains the implementations of the repository interfaces and other external concerns.
4. **Presentation Layer**: Contains the controllers, DTOs, and modules that handle HTTP requests.

## Features

- **Clean Architecture**: Properly separated concerns for better maintainability and testability.
- **Dual Database Support**: Works with both MySQL (TypeORM) and MongoDB (Mongoose).
- **Database Migrations**: TypeORM migrations for reliable database schema updates.
- **Health Checks**: Liveness and readiness probes for Kubernetes and other container orchestrators.
- **Asynchronous Job Processing**: Background job processing with BullMQ and Redis.
- **Distributed Caching**: Redis-based caching with cache-aside pattern implementation.
- **Feature Flagging**: Runtime feature toggling to safely deploy and test new features.
- **Metrics Monitoring**: Prometheus metrics for application monitoring.
- **Configuration Management**: Environment-based configuration using @nestjs/config.
- **Input Validation**: Request validation using class-validator and a global ValidationPipe.
- **API Documentation**: Swagger documentation using @nestjs/swagger.
- **TypeScript**: Fully typed codebase with TypeScript.
- **Rate Limiting**: Protection against DDoS and brute force attacks.
- **Structured Logging**: JSON-based logging for better observability.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL or MongoDB instance
- Redis server (for queues and caching)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nestjs-clean-architecture-template
```

2. Install dependencies:

```bash
npm install
```

3. Create an `.env` file based on the `.env.example`:

```bash
cp .env.example .env
```

4. Edit the `.env` file to configure your database and Redis:

For MySQL:

```
DATABASE_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=nestjs_clean_arch

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_CACHE_DB=1

# Feature Flags
FEATURE_NEW_USER_ENDPOINT=true
```

For MongoDB:

```
DATABASE_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/nestjs_clean_arch

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_CACHE_DB=1

# Feature Flags
FEATURE_NEW_USER_ENDPOINT=true
```

### Running the Application

Before starting the application, if you're using MySQL, you should run the migrations:

```bash
# Create a new migration (if you've made schema changes)
npm run migration:generate -- db/migrations/your-migration-name

# Run pending migrations
npm run migration:run
```

Start the development server:

```bash
npm run start:dev
```

The API will be available at http://localhost:3000

The Swagger documentation will be available at http://localhost:3000/api

### Health Check Endpoints

The application includes health check endpoints:

- **Liveness Probe**: `/health/live` - Checks if the application is running
- **Readiness Probe**: `/health/ready` - Checks if the application is ready to accept traffic

These can be configured in Kubernetes or other container orchestrators for better application lifecycle management.

## Project Structure

```
/src
├── application/
│   ├── use-cases/
│   │   └── user/
│   │       ├── dtos/
│   │       ├── create-user.use-case.ts
│   │       └── find-user-by-email.use-case.ts
│   └── jobs/
│       └── notification.consumer.ts
├── domain/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── repositories/
│   │   └── user.repository.ts
│   └── exceptions/
│       ├── domain.exception.ts
│       └── user-already-exists.exception.ts
├── infrastructure/
│   ├── cache/
│   │   └── cache.module.ts
│   ├── database/
│   │   ├── mysql/
│   │   │   ├── models/
│   │   │   │   └── user.model.ts
│   │   │   ├── repositories/
│   │   │   │   └── user.repository.impl.ts
│   │   │   └── mysql-database.module.ts
│   │   └── mongodb/
│   │       ├── schemas/
│   │       │   └── user.schema.ts
│   │       ├── repositories/
│   │       │   └── user.repository.impl.ts
│   │       └── mongodb-database.module.ts
│   ├── feature-flags/
│   │   ├── feature-flag.module.ts
│   │   └── feature-flag.service.ts
│   ├── metrics/
│   │   ├── counters/
│   │   │   └── user-metrics.ts
│   │   ├── metrics.controller.ts
│   │   └── metrics.module.ts
│   └── queues/
│       └── queues.module.ts
├── presentation/
│   ├── modules/
│   │   ├── health/
│   │   │   ├── health.controller.ts
│   │   │   └── health.module.ts
│   │   └── user/
│   │       ├── dtos/
│   │       │   └── create-user-request.dto.ts
│   │       ├── user.controller.ts
│   │       ├── user.module.mysql.ts
│   │       └── user.module.mongodb.ts
│   └── shared/
│       ├── decorators/
│       │   └── feature-flag.decorator.ts
│       ├── filters/
│       │   └── global-exception.filter.ts
│       └── guards/
│           └── feature-flag.guard.ts
├── app.module.ts
├── app.module.mysql.ts
├── app.module.mongodb.ts
└── main.ts
/db
├── data-source.ts
└── migrations/
    └── 1701234567890-initial.ts
```

## API Endpoints

### Users

#### Create User (Protected by Feature Flag)

- **URL**: /users
- **Method**: POST
- **Feature Flag**: `new-user-endpoint`
- **Request Body**:

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "StrongP@ssw0rd"
}
```

- **Response**:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "John Doe"
}
```

#### Find User by Email (Cached)

- **URL**: /users/:email
- **Method**: GET
- **Response**:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Health Checks

#### Liveness Probe

- **URL**: /health/live
- **Method**: GET
- **Response**: Health status with uptime details

#### Readiness Probe

- **URL**: /health/ready
- **Method**: GET
- **Response**: Health status with database connection details

### Metrics

- **URL**: /metrics
- **Method**: GET
- **Response**: Prometheus metrics

## Advanced Features

### Database Migrations

The template includes TypeORM migrations support with the following commands:

```bash
npm run migration:generate -- db/migrations/name  # Generate a new migration
npm run migration:create -- db/migrations/name    # Create an empty migration
npm run migration:run                            # Run pending migrations
npm run migration:revert                         # Revert the last migration
```

### Asynchronous Job Processing

The template uses BullMQ with Redis for background job processing. The current implementation:

- Queues welcome emails when a new user is created
- Can be extended with additional job types
- Uses retries with exponential backoff for resilience

### Distributed Caching

Redis-based caching is implemented using:

- Cache-aside pattern in the `FindUserByEmailUseCase`
- NestJS CacheModule with Redis store
- Cache interceptors for HTTP-level caching

### Feature Flagging

Feature flags allow toggling features at runtime:

- Configure via environment variables (`FEATURE_*`)
- Protected routes with `@FeatureFlag()` decorator and `FeatureFlagGuard`
- Centralized management in `FeatureFlagService`

## Switching Between Databases

To switch between MySQL and MongoDB, update the `DATABASE_TYPE` variable in your `.env` file:

- For MySQL: `DATABASE_TYPE=mysql`
- For MongoDB: `DATABASE_TYPE=mongodb`

The application will automatically use the corresponding repository implementations and database configurations.

## DevOps Integration

### Docker

The application can be containerized using the included Dockerfile and docker-compose.yml.

Build the Docker image:

```bash
docker build -t nestjs-clean-arch .
```

Run with docker-compose:

```bash
docker-compose up -d
```

### Kubernetes

Use the health check endpoints for Kubernetes probes:

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 15
  periodSeconds: 5
```

### Monitoring

The `/metrics` endpoint provides Prometheus-compatible metrics that can be scraped and visualized using:

- Prometheus for metrics collection
- Grafana for dashboards
- Alert Manager for alerts

## Best Practices

This template implements several best practices:

1. **Separation of Concerns**: Clean Architecture ensures that business logic is isolated from infrastructure concerns.

2. **Repository Pattern**: Abstracts data access from business logic.

3. **Dependency Injection**: Uses NestJS's DI container for managing dependencies.

4. **Domain-Driven Design**: Follows DDD principles for better domain modeling.

5. **SOLID Principles**: Adheres to SOLID principles for better code organization.

6. **Observability**: Structured logging, metrics, and health checks for better monitoring.

7. **Resilience**: Retries, timeouts, and circuit breakers for improved reliability.
