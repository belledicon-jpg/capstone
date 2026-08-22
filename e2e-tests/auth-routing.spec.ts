import { expect, test } from "@playwright/test";

test("signup remains public and no longer links to a login page", async ({ page }) => {
  await page.goto("/signup");

  await expect(page.getByRole("heading", { name: "Create your GovServe account" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send OTP" })).toBeVisible();
  await expect(page.locator('a[href="/login"]')).toHaveCount(0);
});

test("login route is removed", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  await expect(page.getByText("Oops! Page not found")).toBeVisible();
});
