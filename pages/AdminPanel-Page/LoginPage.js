import BasePage from "./BasePage.js";

export default class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    // Locators
    this.emailInput = page.getByLabel(/email|username/i);
    this.passwordInput = page.getByRole("textbox", {
      name: /Enter your password|Password/i,
    });
    this.togglePasswordButton = page.locator("#togglePasswordIcon");
    this.rememberMeCheckbox = page.getByRole("checkbox");
    this.loginButton = page.getByRole("button", { name: /log ?in|sign ?in/i });
    this.forgotPasswordLink = page.getByRole("link", {
      name: /forgot password/i,
    });
    this.sendResetLinkButton = page.getByRole("button", {
      name: /send reset link/i,
    });
    this.backToLoginLink = page.getByRole("link", { name: /back to login/i });
  }

  // Field actions
  async fillLoginForm(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async togglePasswordVisibility() {
    await this.togglePasswordButton.click();
  }

  async enableRememberMe() {
    await this.rememberMeCheckbox.check();
  }

  async submitLogin() {
    await this.loginButton.click();
  }

  // Password reset
  async openForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async sendResetLink(email) {
    await this.emailInput.fill(email);
    await this.sendResetLinkButton.click();
  }

  async goBackToLogin() {
    await this.backToLoginLink.click();
  }

  // Complete flows
  async login(email, password) {
    await this.fillLoginForm(email, password);
    await this.submitLogin();
  }

  async resetPassword(email) {
    await this.openForgotPassword();
    await this.sendResetLink(email);
  }
}
