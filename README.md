# SDET Automation Platform

[![SDET Automation Tests](https://github.com/antfra125/sdet-automation-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/antfra125/sdet-automation-platform/actions/workflows/ci.yml)

A containerized API test automation platform built with **Playwright, TypeScript, Express, PostgreSQL and Docker**, with automated testing through GitHub Actions.

The project focuses on reliable API testing, database verification, reusable fixtures and CI/CD integration.

## Tech Stack

`Playwright` · `TypeScript` · `Node.js` · `Express` · `PostgreSQL` · `Docker` · `GitHub Actions`

## Architecture

```text
Playwright API Tests
        |
        v
    Express API
        |
        v
    PostgreSQL
```

Docker Compose orchestrates all services, using health checks to ensure the API and database are ready before testing.

## Test Coverage

The suite currently includes **6 automated tests** covering:

- API requests and HTTP status validation.
- Positive and negative product scenarios.
- Product creation, retrieval and deletion.
- Direct PostgreSQL data verification.
- Reusable Playwright fixtures with automatic test data cleanup.

## Running the Tests

**Requirements:** Docker Desktop and Docker Compose.

Clone the repository:

```bash
git clone https://github.com/antfra125/sdet-automation-platform.git
cd sdet-automation-platform/ecommers-api
```

Create a `.env` file inside `ecommers-api`:

```env
DB_PASSWORD=your_local_database_password
```

Run the complete test suite:

```bash
docker compose --profile test up --build --abort-on-container-exit --exit-code-from tests
```

Docker automatically starts PostgreSQL, initializes the database, starts the API and executes the Playwright tests.

## CI/CD

GitHub Actions runs the automated test suite on pushes and pull requests targeting `main`.

The pipeline builds the Docker environment, executes the tests and reports the results automatically.

## Next Steps

- Expand API test coverage and edge cases.
- Add API schema validation.
- Improve test reporting with CI artifacts.
- Introduce database migrations.

---

*Built as a hands-on SDET portfolio project demonstrating API automation, database testing and CI/CD practices.*