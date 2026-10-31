import { tmpdir } from "node:os";
import { join } from "node:path";
import { defineConfig, devices } from "@playwright/test";

/**
 * Browser tests run against the PRODUCTION build served like Hostinger
 * (scripts/serve.mjs mirrors .htaccess). Build first:
 *
 *   npm run build && npm run test:e2e
 *
 * The contact form talks to the real PHP endpoint in dry-run mode (needs PHP
 * on the PATH; contact tests are skipped without it). First run on a new
 * machine: npx playwright install chromium
 */
export const E2E_PRIVATE_DIR = join(tmpdir(), "serveprogen-e2e-private");

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  globalSetup: "./tests/e2e/global-setup.ts",
  use: {
    baseURL: "http://localhost:4173",
    trace: "retain-on-failure",
    // Optional: use an already-installed Chromium instead of Playwright's own.
    launchOptions: process.env.PW_CHROMIUM_PATH
      ? { executablePath: process.env.PW_CHROMIUM_PATH }
      : {},
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "node scripts/serve.mjs --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    env: { SERVEPROGEN_PRIVATE_DIR: E2E_PRIVATE_DIR },
  },
});
