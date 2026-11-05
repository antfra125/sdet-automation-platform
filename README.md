# SDET Automation Platform

[![SDET Automation Tests](https://github.com/antfra125/sdet-automation-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/antfra125/sdet-automation-platform/actions/workflows/ci.yml)

An API test automation project built with **Playwright, TypeScript, Node.js, Express, PostgreSQL, and Docker**, featuring automated CI testing through GitHub Actions.

The project demonstrates practical SDET concepts, including API test automation, database verification, reusable test fixtures, test data cleanup, and containerized test execution.

## Tech Stack

| Technology | Purpose |
|---|---|
| TypeScript | API and test implementation |
| Playwright | Automated API testing |
| Node.js / Express | REST API under test |
| PostgreSQL | Persistent product data |
| Docker Compose | Container orchestration |
| GitHub Actions | Continuous integration |

## Architecture

The project consists of three services:

- **Express API:** Handles product requests and communicates with PostgreSQL.
- **PostgreSQL:** Stores product data and initializes the database schema automatically.
- **Playwright:** Executes automated API tests and verifies database operations.

Docker Compose manages service dependencies and health checks to ensure the database and API are ready before tests begin.

## Project Structure

```text
sdet-automation-platform/
├── .github/
│   └── workflows/
│       └── ci.yml
├── ecommers-api/
│   ├── db/
│   │   └── init.sql
│   ├── src/
│   │   ├── db.ts
│   │   └── server.ts
│   ├── Dockerfile
│   └── compose.yaml
├── sdet-automation-platform/
│   ├── tests/
│   │   ├── api/
│   │   │   ├── products.spec.ts
│   │   │   ├── product-fixture.spec.ts
│   │   │   ├── product-database.spec.ts
│   │   │   └── product-cleanup.spec.ts
│   │   └── fixtures/
│   │       ├── product.fixture.ts
│   │       ├── database.fixture.ts
│   │       └── index.ts
│   ├── Dockerfile
│   └── playwright.config.ts
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | API health check |
| GET | `/api/products` | Retrieve products |
| GET | `/api/products/:id` | Retrieve a product by ID |
| POST | `/api/products` | Create a product |
| DELETE | `/api/products/:id` | Delete a product |

## Automated Test Coverage

The current test suite contains six automated tests covering:

1. Retrieving products through the API.
2. Rejecting invalid product data.
3. Creating, retrieving, and deleting a product.
4. Retrieving a product created through a reusable fixture.
5. Verifying that a product is persisted in PostgreSQL.
6. Verifying that a deleted product is removed from PostgreSQL.

Tests use assertions to validate HTTP responses, returned data, and database state.

### Test Fixtures

Reusable Playwright fixtures handle test setup and cleanup.

The product fixture creates a product before the test and removes it afterward. The database fixture provides a PostgreSQL connection for direct database verification.

This approach reduces duplicated setup code and helps keep tests independent.

## Running the Project

### Prerequisites

- Docker Desktop
- Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/antfra125/sdet-automation-platform.git
cd sdet-automation-platform/ecommers-api
```

### 2. Configure environment variables

Create a `.env` file inside `ecommers-api`:

```env
DB_PASSWORD=your_local_database_password
```

The `.env` file is excluded from version control.

### 3. Run the automated tests

```bash
docker compose --profile test up --build --abort-on-container-exit --exit-code-from tests
```

Docker Compose will:

- Start PostgreSQL and initialize the database schema.
- Start the Express API.
- Wait for service health checks.
- Execute the Playwright test suite.
- Return the test container's exit code.

### 4. Clean up

```bash
docker compose --profile test down
```

The PostgreSQL volume is preserved by default.

## Continuous Integration

GitHub Actions automatically runs the test suite on pushes and pull requests targeting `main`.

The CI workflow:

1. Checks out the repository.
2. Configures the database password using a GitHub Actions secret.
3. Builds and starts the Docker services.
4. Executes the Playwright tests.
5. Reports the result in GitHub Actions.
6. Cleans up the CI environment.

The CI status badge at the top of this README displays the latest workflow status.

## Future Improvements

- Expand positive and negative API test coverage.
- Add API response schema validation.
- Improve test reporting and upload reports as CI artifacts.
- Introduce database migrations for schema changes.
- Add more complex API workflows and test scenarios.

## Purpose

This project is part of a hands-on SDET portfolio focused on developing practical skills in test automation, backend testing, CI/CD, and reliable test infrastructure.

The goal is to build maintainable automated tests that can run consistently across local development and continuous integration environments.