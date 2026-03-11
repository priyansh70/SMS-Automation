import { test, expect } from "@playwright/test";
import { ExtensionRegistrationPage } from "../../pages/Extension Web App - Page/ExtensionRegistrationPage.js";
import { configDotenv } from "dotenv";
configDotenv();

const EXT_WEB_URL = process.env.EXTENSION_WEB_URL;

// simple smoke test for extension web login flow

test.describe("Extension Web App - Login", () => {
  test("should authenticate using static Phone and OTP", async ({ page }) => {
    const regPage = new ExtensionRegistrationPage(page);
    await regPage.goto(EXT_WEB_URL);

    // Use static credentials as specified
    const phoneNumber = process.env.USER_X_PHONE;
    await regPage.completePhoneVerification(phoneNumber);

    // After successful login, verify we're on the main page with Messages or Dashboard
    const successIndicator = page.locator("text=/Messages|Dashboard|Welcome|Profile/i");
    await expect(successIndicator.first()).toBeVisible({ timeout: 5000 });
  });
});
