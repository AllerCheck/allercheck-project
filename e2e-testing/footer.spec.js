import { test, expect } from "@playwright/test";

test.describe("Footer Tests", () => {
  test("FT-01: Footer wird korrekt gerendert", async ({ page }) => {
    await page.goto("http://localhost:5173");
    const footer = page.locator("footer").first();
    await expect(footer).toBeVisible();
    await expect(
      footer.locator("text=AllerCheck. All rights reserved.")
    ).toBeVisible();
  });

  test("FT-02: Footer enthält Copyright-Text", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await expect(page.locator("text=© ")).toBeVisible();
  });

  test("FT-03: Contact Modal öffnet und schließt", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await page.click("text=Contact");
    await expect(page.locator("text=If you have any questions")).toBeVisible();
    await page.click("text=Close");
    await expect(
      page.locator("text=If you have any questions")
    ).not.toBeVisible();
  });

  test("FT-04: Impress Modal öffnet und schließt", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await page.click("text=Impress");
    await expect(page.locator("text=AllerCheck GmbH")).toBeVisible();
    await page.click("text=Close");
    await expect(page.locator("text=AllerCheck GmbH")).not.toBeVisible();
  });

  test("FT-05: Policies Modal öffnet und schließt", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await page.click("text=Policies");
    await expect(page.locator("text=Our policies ensure")).toBeVisible();
    await page.click("text=Close");
    await expect(page.locator("text=Our policies ensure")).not.toBeVisible();
  });

  test("FT-06: Data Protection Modal öffnet und schließt", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await page.click("text=Data Protection");
    await expect(
      page.locator("text=We are committed to protecting your personal data.")
    ).toBeVisible();
    await page.click("text=Close");
    await expect(
      page.locator("text=We are committed to protecting your personal data.")
    ).not.toBeVisible();
  });

  test("FT-07: Footer Links haben Hover-Effekt", async ({ page }) => {
    await page.goto("http://localhost:5173");
    const link = page.locator("text=Contact");
    await link.hover();
    const color = await link.evaluate((el) => getComputedStyle(el).color);
    expect(color).not.toBe("rgb(255, 255, 255)"); // Adjust based on the actual hover effect
  });
});
