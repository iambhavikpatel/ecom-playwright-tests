import { expect, test } from "@playwright/test";

test.describe("UI Components Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.automationexercise.com/");
    await page.locator('a[href="/login"]').click();
    await expect(page.getByRole("heading", { name: "New User Signup!" })).toBeVisible();
  });

  test("1st Test: Fill the input values", async ({ page }) => {
    await page.getByRole("textbox", { name: "Name" }).fill("Bhavik Patel");
    const inputEmailField = await page
      .locator("form")
      .filter({ hasText: "Signup" })
      .getByPlaceholder("Email Address");
    await inputEmailField.fill("dummy@dummy.com");
  });

  test("2nd Test: Signup shows required-field validation when name and email are blank", async ({
    page,
  }) => {
    const name = page.locator('[data-qa="signup-name"]');
    const email = page.locator('[data-qa="signup-email"]');

    await page.click('[data-qa="signup-button"]');

    // Form wasn't submitted: still on /login
    await expect(page).toHaveURL(/\/login/);

    // Name is the first invalid field, so the browser shows the tooltip on it.
    // Wording differs per browser ("Please fill out this field." in Chromium/Firefox,
    // "Fill out this field" in WebKit), so match case-insensitively.
    const nameMsg = await name.evaluate(
      (el: HTMLInputElement) => el.validationMessage,
    );
    expect(nameMsg).toMatch(/fill out this field/i);

    // Both fields are invalid because they are required and empty
    expect(
      await name.evaluate((el: HTMLInputElement) => el.validity.valueMissing),
    ).toBe(true);
    expect(
      await email.evaluate((el: HTMLInputElement) => el.validity.valueMissing),
    ).toBe(true);

    // Same check using the :invalid pseudo-class
    await expect(page.locator('[data-qa="signup-name"]:invalid')).toHaveCount(
      1,
    );
    await expect(page.locator('[data-qa="signup-email"]:invalid')).toHaveCount(
      1,
    );
  });

  test("3rd Test: Sucessfull Signup", async ({ page }) => {
    //Fill in Details
    await page.getByRole("textbox", { name: "Name" }).fill("Warren");
    const inputEmailField = await page
      .locator("form")
      .filter({ hasText: "Signup" })
      .getByPlaceholder("Email Address");
    await inputEmailField.fill("test13@test13.com");

    await page.click('[data-qa="signup-button"]');

    //after successfull login
    await expect(page).toHaveURL(/\/signup$/);
    //const boldElement = page.locator('b', {hasText: 'Enter Account Information'})
    await expect(page.locator('.login-form', { hasText: 'Enter Account Information' })).toBeVisible();
    // in case of duplicate email
    // await page.getByText('Email Address already exist!', {exact: true})
  });
});
