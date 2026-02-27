/**
 * Registration/Login Page Object
 * Handles phone verification and OTP input
 */
import { BasePage } from "./BasePage.js";
import { expect } from "@playwright/test";

export class RegistrationPage extends BasePage {
  // Locators
  getPhoneInput() {
    return this.page.getByPlaceholder("718-123-4567");
  }

  getAgreementCheckbox() {
    return this.page.getByRole("checkbox");
  }

  getRequestOTPButton() {
    return this.page.getByRole("button", { name: "Request OTP" });
  }

  getErrorMessage() {
    return this.page.locator("text=/Wrong number|invalid|oops/i");
  }

  // OTP Page Locators
  getOTPFields() {
    return this.page.getByRole("textbox");
  }

  getSubmitButton() {
    return this.page.getByRole("button", { name: "Submit" });
  }

  getPhoneNumberDisplay(pattern) {
    return this.page.getByText(pattern);
  }

  getResendOTPText() {
    return this.page.locator("text=/Resend OTP|Didn't you receive|resend/i");
  }

  getResendQuestion() {
    return this.page.getByText(/Didn't you receive any code/i);
  }

  // Actions
  async enterPhoneNumber(phoneNumber) {
    await this.wait(1000);
    const phoneInput = this.getPhoneInput();
    await phoneInput.click();
    await phoneInput.clear();

    for (const digit of phoneNumber) {
      await phoneInput.type(digit, { delay: 50 });
    }
    await this.wait(3000);
  }

  async checkAgreement() {
    await this.getAgreementCheckbox().check();
  }

  async requestOTP() {
    await this.getRequestOTPButton().click();
    await this.waitForURL(/.*\/verify-otp/, 5000);
  }

  async enterOTP(code = "1234") {
    const otpFields = this.getOTPFields();
    const digits = code.split("");
    for (let i = 0; i < digits.length; i++) {
      await otpFields.nth(i).type(digits[i], { delay: 100 });
    }
  }

  async verifyOTP() {
    await this.enterOTP("1234");
    await this.getSubmitButton().click();
  }

  async verifyPhoneDisplayed(pattern) {
    await expect(this.getPhoneNumberDisplay(pattern)).toBeVisible();
  }

  async verifyResendOptionAvailable() {
    await expect(this.getResendOTPText()).toBeVisible({ timeout: 3000 });
    await expect(this.getResendQuestion()).toBeVisible();
  }

  async completePhoneVerification(phoneNumber) {
    await this.enterPhoneNumber(phoneNumber);
    await this.checkAgreement();
    await this.requestOTP();
    await this.verifyOTP();
    await this.waitForURL(/.*\/profile/, 5000);
  }
}
