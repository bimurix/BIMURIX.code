import { defineConfig, devices } from "@playwright/test";

// decision: ADR-004 — port 3100 réservé à Bimurix.
const baseURL = "http://localhost:3100";

export default defineConfig({
  testDir: "tests/e2e",
  globalSetup: "./tests/e2e/warm-up.ts",
  timeout: 45_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: { baseURL, trace: "on-first-retry" },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
  // R3 : PLAYWRIGHT_PROD=1 teste le build de production (référence stable ; le mode dev compile chaque route à la demande).
  // Préalable : node scripts/next-dev-env.mjs build (même dataset et clés locales qu'en dev).
  webServer: {
    command: process.env.PLAYWRIGHT_PROD
      ? "node scripts/next-dev-env.mjs start"
      : "pnpm dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
