import { spawnSync } from "node:child_process";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { serviceSlugs } from "../../app/content/services";

const ROUTES = [
  "/",
  "/about",
  "/services",
  ...serviceSlugs.map((s) => `/services/${s}`),
  "/work",
  "/process",
  "/insights",
  "/contact",
  "/privacy",
  "/terms",
];

const hasPhp = spawnSync("php", ["-v"]).status === 0;

/** Collects console errors and failed requests for a page. */
function watch(page: Page) {
  const problems: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") problems.push(`console: ${m.text()}`);
  });
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  page.on("response", (r) => {
    if (r.status() >= 400) problems.push(`${r.status()} ${new URL(r.url()).pathname}`);
  });
  return problems;
}

test.describe("every public page", () => {
  for (const route of ROUTES) {
    test(`${route} renders, is accessible and error-free`, async ({ page }) => {
      const problems = watch(page);
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/ServeProGen/);
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description?.length).toBeGreaterThan(40);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);

      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      // Soft assertions: report console errors and accessibility findings together.
      expect.soft(problems, "console errors / failed requests").toEqual([]);
      expect
        .soft(
          axe.violations.map((v) => `${v.id}: ${v.nodes.length}`),
          "axe",
        )
        .toEqual([]);
    });
  }
});

test("no internal link is broken", async ({ page, request }) => {
  const hrefs = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route);
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((as) => as.map((a) => a.getAttribute("href") ?? ""))) {
      hrefs.add(href.split("#")[0]!.split("?")[0]!);
    }
  }
  const broken: string[] = [];
  for (const href of hrefs) {
    const res = await request.get(href || "/");
    if (res.status() !== 200) broken.push(`${href} → ${res.status()}`);
  }
  expect(broken).toEqual([]);
  expect(hrefs.size).toBeGreaterThanOrEqual(14);
});

test("unknown URLs, drafts and internal pages return the branded 404", async ({
  page,
}) => {
  for (const path of [
    "/does-not-exist",
    "/work/dastarkhwan",
    "/insights/from-dataset-to-edge",
    "/brand",
  ]) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "isn’t part of the system",
    );
  }
});

test("trailing slashes redirect to clean URLs", async ({ page }) => {
  await page.goto("/services/");
  expect(new URL(page.url()).pathname).toBe("/services");
});

test("draft content never ships in production", async ({ page }) => {
  await page.goto("/work");
  await expect(page.getByText("Detailed case studies are on their way.")).toBeVisible();
  await expect(page.getByText("Draft", { exact: true })).toHaveCount(0);
  await page.goto("/insights");
  await expect(page.getByText("Our first articles are being written.")).toBeVisible();
  const robots = await page.request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /");
});

test.describe("navigation", () => {
  test("desktop Services menu works with the keyboard", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Services" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.getByRole("link", { name: /AI & Machine Learning/ }).first(),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("mobile menu traps focus, locks scroll and closes on Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    await expect(page.locator("#main")).toHaveAttribute("inert", "");
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe(
      "hidden",
    );
    for (let i = 0; i < 15; i++) await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => Boolean(document.activeElement?.closest("header"))),
    ).toBe(true);
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

  test("mobile menu links navigate and close the menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-menu").getByRole("link", { name: /About/ }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
  });

  test("skip link moves focus to the main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });
});

test.describe("contact form", () => {
  test("shows accessible validation errors", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: /Send inquiry/ }).click();
    await expect(page.getByText("Please enter your full name.")).toBeVisible();
    await expect(page.getByLabel("Full name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Choose the service you need.")).toBeVisible();
  });

  test("submits to the PHP endpoint and reports dry-run honestly", async ({ page }) => {
    test.skip(!hasPhp, "PHP is not installed");
    await page.goto("/contact?service=ai-ml");
    await page.getByLabel("Full name").fill("Ada Tester");
    await page.getByLabel("Business email").fill("ada@example.com");
    await expect(page.getByLabel("Service required")).toHaveValue(
      "AI & Machine Learning",
    );
    await page
      .getByLabel("Project description")
      .fill("We would like a computer vision prototype for counting items.");
    await page.getByRole("checkbox").check();
    await page.waitForTimeout(3200); // the server rejects forms filled in under 3 seconds
    await page.getByRole("button", { name: /Send inquiry/ }).click();
    await expect(page.getByText("Test mode: your message was not sent.")).toBeVisible();
    await expect(page.getByText("Your message has been sent")).toHaveCount(0);
  });
});

test.describe("resilience", () => {
  test("content is readable without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Engineering Intelligence.",
    );
    await expect(
      page.getByText("Five disciplines. One engineering standard."),
    ).toBeVisible();
    await page.goto("/services/ai-ml");
    await expect(page.getByRole("heading", { name: "What we deliver" })).toBeVisible();
    await context.close();
  });

  test("reduced motion shows final layouts without the 3D scene", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await expect(page.locator("canvas")).toHaveCount(0);
    const hidden = await page
      .locator("[data-reveal]")
      .evaluateAll(
        (els) => els.filter((e) => getComputedStyle(e).opacity !== "1").length,
      );
    expect(hidden).toBe(0);
    await context.close();
  });

  test("the 3D hero loads on capable devices", async ({ page }) => {
    const problems = watch(page);
    await page.goto("/?hero=full", { waitUntil: "networkidle" });
    await expect(page.locator("canvas")).toHaveCount(1, { timeout: 15_000 });
    expect(problems).toEqual([]);
  });
});

test.describe("responsive layout", () => {
  const widths = [360, 390, 430, 768, 1024, 1366, 1440, 1920];
  for (const width of widths) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of [
        "/",
        "/about",
        "/services/ai-ml",
        "/work",
        "/process",
        "/contact",
      ]) {
        await page.goto(route);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow, `${route} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }

  test("hero headline and primary CTA fit a 1366×768 laptop", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/");
    const cta = page.getByRole("main").getByRole("link", { name: /Start a Project/ });
    const box = await cta.boundingBox();
    expect(box && box.y + box.height).toBeLessThanOrEqual(768 - 24);
  });
});
