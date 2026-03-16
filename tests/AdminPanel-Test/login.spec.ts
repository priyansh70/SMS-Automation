import { test, expect } from "@playwright/test";
import LoginPage from "../../pages/AdminPanel-Page/LoginPage";
import { configDotenv } from "dotenv";
configDotenv();
const ADMIN_PANEL_URL = process.env.ADMIN_PANEL_URL;
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

test.describe("Login Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(ADMIN_PANEL_URL);
  });

  test("User can login with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(EMAIL, PASSWORD);
    await expect(page).not.toHaveURL(/login/);
  });

  test("User cannot login with invalid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login("testuser@example.com", "wrongpassword");
    await expect(
      page.getByText(
        /invalid|incorrect|error|email address|not match any account/i,
      ),
    ).toBeVisible();
    // await expect(page.getByText(/The email address provided does not match any account. Please check and try again./i)).toBeVisible();
  });

  test("User can open forgot password page", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openForgotPassword();
    await expect(page).toHaveURL(/forgot|reset/i);
  });

  test("User can request password reset link", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.resetPassword(EMAIL);
    await expect(
      page.getByText(/link has been sent|email sent|check your inbox/i),
    ).toBeVisible();
  });

  test("User can toggle password visibility", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.fillLoginForm(EMAIL, PASSWORD);
    await loginPage.togglePasswordVisibility();

    await expect(loginPage.passwordInput).toHaveAttribute("type", "text");
  });

  test("User can enable remember me checkbox", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.enableRememberMe();
    await expect(loginPage.rememberMeCheckbox).toBeChecked();
  });
});
