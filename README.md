# E-commerce Test Automation Framework (Playwright + TypeScript)

An end-to-end test automation framework for a self-hosted [Medusa](https://medusajs.com) e-commerce store.
It combines UI tests, API tests and integration tests in one readable, maintainable project.

## What it covers

| Layer | What is tested |
|---|---|
| UI | Home page, store page, product selection, add to cart, cart contents and total |
| API | Product list, cart creation, adding items to a cart |
| Integration | A cart created through the API appears correctly in the storefront |

## Tech stack

- Playwright Test with TypeScript
- Page Object Model for UI pages
- A small API helper class for backend requests
- dotenv for configuration and secrets
- Docker (PostgreSQL for the store's database)
- Cross-browser execution on Chromium, Firefox and WebKit

## Project structure

```
api/          API helper (StoreApi.ts)
postman/      Postman collection for the store API
pages/        Page Objects (StorePage, ProductPage, CartPage)
tests/
  UI/         Browser tests
  api/        API tests
  integration/ Tests that combine API and UI
playwright.config.ts
.env          Local settings (not committed)
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
npx playwright show-report           # open the HTML report
npx playwright test --project=firefox        # run on a single browser
```
## Postman collection

Import `postman/Medusa_Store_API.postman_collection.json` into Postman, then create an environment named `Medusa Local` with two variables: `base_url` (`http://localhost:9000`) and `publishable_key` (your publishable key from the Medusa admin). The collection includes a success case and an error case, each with automatic checks.

## About this project

I built this project from scratch to show how I design a test automation framework. It brings UI, API and integration tests together in one clean, readable structure, using Page Objects, an API helper class and secure configuration. I have 4 years of experience in QA, and this project is part of my move toward an SDET role. Next, I plan to build more advanced, enterprise-style frameworks, applying what I learn along the way.

## Author

Bhagyalakshmi 
Linkedin: http://www.linkedin.com/in/bhagyalakshmi-v-35210b131