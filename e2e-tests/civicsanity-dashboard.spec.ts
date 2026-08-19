import { expect, test } from "@playwright/test";

test("shows the CivicSanity operations overview and updates the reporting period", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Health & sanitation overview" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Key metrics" })).toContainText("Waste collected");
  await expect(page.getByRole("heading", { name: "Recent inspections" })).toBeVisible();

  const period = page.getByLabel("Reporting period");
  await period.selectOption("This quarter");
  await expect(period).toHaveValue("This quarter");
});
