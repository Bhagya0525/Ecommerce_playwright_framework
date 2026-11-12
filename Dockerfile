FROM mcr.microsoft.com/playwright:v1.64.1-noble

WORKDIR /app

# Install dependencies first, so Docker can reuse this step when only the tests change
COPY package*.json ./
RUN npm ci

COPY . .

# By default, run the API tests (they need no browser window)
CMD ["npx", "playwright", "test", "tests/api", "--project=chromium"]