# E-commerce Test Automation Framework (Playwright + TypeScript)

[![E2E tests](https://github.com/Bhagya0525/Ecommerce_playwright_framework/actions/workflows/e2e.yml/badge.svg)](https://github.com/Bhagya0525/Ecommerce_playwright_framework/actions/workflows/e2e.yml)

An end-to-end test automation framework for a self-hosted [Medusa](https://medusajs.com) e-commerce store.
It combines UI tests, API tests and integration tests in one readable, maintainable project.

## What it covers

| Layer | What is tested |
|---|---|
| UI | Home page, store page, search, product selection, add to cart, cart contents, quantity change, item removal |
| Checkout (integration) | A cart created through the API, then a full guest checkout through the storefront |
| API | Product list, cart creation, adding items, error cases, response shape (Zod contract), invalid inputs, response-time budget |
| Accessibility | axe-core scan of four pages against a baseline of known issues |
| Visual | Screenshot comparison of the empty cart page |
| Network resilience | Slow search API, and a failing search API (a known issue, recorded as an expected failure) |
| Performance | API response time and page load time against generous budgets |

## Tech stack

- Playwright Test with TypeScript
- Page Object Model for UI pages
- A small API helper class for backend requests
- dotenv for configuration and secrets
- Docker (PostgreSQL for the store's database)
- Cross-browser execution on Chromium, Firefox and WebKit

## Project structure

```
api/            API helper (StoreApi.ts)
fixtures/       Custom Playwright fixtures (page objects and API helper)
pages/          Page Objects (HomePage, StorePage, ProductPage, CartPage)
postman/        Postman collection for the store API
test-data/      Shared test data (product names, sizes, prices)
tests/
  UI/           Browser tests
  api/          API tests
  integration/  Tests that combine API and UI
.github/        CI workflow (GitHub Actions)
playwright.config.ts
.env            Local settings (not committed)
Dockerfile      Image that runs the API tests in a container
```

## Design choices

- **Page Objects hold actions and locators; tests hold the assertions**, so each test shows its own pass/fail condition.
- **Stable locators:** test IDs and roles are preferred over XPath or CSS.
- **API for setup, UI for verification:** the integration test builds a cart through the API instead of clicking through the store, which makes it faster and less flaky.
- **Secrets stay out of the code:** the API key is read from `.env`, which is git-ignored.
- **One worker:** the store runs in dev mode, which builds pages on demand and can stall under parallel load.

## Prerequisites

- Node.js 20 or higher
- Docker Desktop
- Git

## Setup

1. Start the database:

```bash
docker run --name medusa-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=medusa-store -p 5432:5432 -d postgres:16
```

2. Create and start the Medusa store (backend on port 9000, storefront on port 8000):

```bash
npx create-medusa-app@latest my-store --with-nextjs-starter --db-url "postgres://postgres:postgres@localhost:5432/medusa-store"
```

3. In the Medusa admin (`http://localhost:9000/app`), go to **Settings → Publishable API Keys** and copy the key.

4. Clone this repository, then install dependencies:

```bash
npm install
npx playwright install chromium
```

5. Create a `.env` file in the project root:

```
MEDUSA_API_URL=http://localhost:9000
MEDUSA_PUBLISHABLE_KEY=pk_your_key_here
```

## Running the tests

```bash
npx playwright test                  # all tests
npx playwright test tests/api        # API tests only
npx playwright test tests/UI         # UI tests only
npx playwright test tests/integration
npx playwright test --grep "@smoke"          # quick smoke tests only
npx playwright test --grep-invert "@smoke"   # everything except smoke tests
npx playwright test --grep "@a11y"           # accessibility checks only
npx playwright test --grep "@visual"         # visual regression only
npx playwright test --grep "@perf"           # performance budgets only
npx playwright show-report           # open the HTML report
npx playwright test --project=firefox        # run on a single browser
```

## Running the API tests in Docker

The `Dockerfile` builds an image from the official Playwright image (its version matches the Playwright version in `package.json`) and runs the API tests. The `.env` file is excluded from the image, so the API key is passed in when the container runs.

```bash
docker build -t ecommerce-playwright-tests .
docker run --rm --env-file .env -e MEDUSA_API_URL=http://host.docker.internal:9000 ecommerce-playwright-tests
```

`host.docker.internal` is how a container reaches the store running on your own machine (Docker Desktop). The browser tests are not containerised yet, because that would also need the store itself to run inside Docker.

## Known issues in the application under test

The tests run against the unmodified Medusa starter store, which is rebuilt from scratch in CI. These problems are real and are recorded in the tests, not hidden:

- **Accessibility:** the footer logo link has no text, the header cart link sits inside a button (nested controls), the product accordions have unnamed buttons, and the empty-cart link has low colour contrast. The accessibility test fails only when a new violation appears or one of these is fixed.
- **Search failure:** when the search API returns an error, the storefront throws a runtime error and the product list disappears. The test for the expected behaviour is marked as an expected failure until the store handles it.
- **Quantity validation:** adding zero items is rejected, but the error message says the minimum is zero.

## Test design notes

- **Visual baselines** include the operating system in their file name. The Linux baseline used in CI was created by CI itself, and the Windows baseline stays local (git-ignored).
- **Timing budgets** are deliberately generous (2 s for the API, 5 s for a page load), because the store runs in development mode and CI machines are noisy. They catch large slowdowns, not small ones.
- **Typing in the checkout form:** WebKit drops a value set with `fill()` in the first name field, so the test types that field key by key.

## Continuous integration

The GitHub Actions workflow in `.github/workflows/e2e.yml` runs on every push and pull request. It:

1. Starts a PostgreSQL service.
2. Creates a fresh Medusa store (backend and storefront) on the CI machine.
3. Creates an admin user and reads the publishable API key from the store, so no secret is stored in the repository.
4. Starts the backend and the storefront, and warms up the storefront pages.
5. Runs the API tests, then the UI and integration tests, on Chromium.
6. Uploads the Playwright HTML report as a downloadable artifact.

## Postman collection

Import `postman/Medusa_Store_API.postman_collection.json` into Postman, then create an environment named `Medusa Local` with two variables: `base_url` (`http://localhost:9000`) and `publishable_key` (your publishable key from the Medusa admin). The collection includes a success case and an error case, each with automatic checks.

## About this project

I built this project from scratch to show how I design a test automation framework. It brings UI, API and integration tests together in one clean, readable structure, using Page Objects, an API helper class and secure configuration. I have 4 years of experience in QA, and this project is part of my move toward an SDET role. Next, I plan to build more advanced, enterprise-style frameworks, applying what I learn along the way.

## Author

Bhagyalakshmi 
Linkedin: http://www.linkedin.com/in/bhagyalakshmi-v-35210b131