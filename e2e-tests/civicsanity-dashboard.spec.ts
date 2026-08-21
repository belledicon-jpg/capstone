import { expect, test } from "@playwright/test";

test("uses the CivicSanity dashboard shell and assistant", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Health & sanitation overview" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Key metrics" })).toContainText("Waste collected");
  await expect(page.getByRole("heading", { name: "Recent inspections" })).toBeVisible();

  const period = page.getByLabel("Reporting period");
  await period.selectOption("This quarter");
  await expect(period).toHaveValue("This quarter");

  await page.getByRole("button", { name: "Collapse sidebar" }).click();
  await expect(page.getByRole("button", { name: "Expand sidebar" })).toBeVisible();

  const themeToggle = page.getByRole("button", { name: /Switch to (dark|light) theme/ });
  const initialThemeLabel = await themeToggle.getAttribute("aria-label");
  await themeToggle.click();
  await expect(themeToggle).not.toHaveAttribute("aria-label", initialThemeLabel ?? "");

  await page.getByRole("button", { name: "Open AI assistant" }).click();
  await page.getByLabel("Ask CivicSanity").fill("How is water quality?");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByLabel("CivicSanity AI assistant")).toContainText("Water quality is currently 96.8%");
});