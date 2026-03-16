// pages/LoginPage.js

export default class LoginPage {
  constructor(page) {
    this.page = page;
    this.phoneInput = page.getByPlaceholder("718-123-4567");
    this.agreementCheckbox = page.getByRole("checkbox");
    this.requestOtpButton = page
      .locator("button")
      .filter({ hasText: /request otp|send otp|get otp/i })
      .first();
    this.otpInput = page.getByRole("textbox");
    this.submitButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /submit|verify|login|sign in/i })
      .first();
  }

  async goto(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState("networkidle");
  }

  async login(phoneNumber, otp = "1234") {
    // Step 1: Fill phone number
    await this.phoneInput.waitFor({ state: "visible" });
    await this.enterPhoneNumber(phoneNumber);

    // Step 2: Accept agreement
    const isChecked = await this.agreementCheckbox
      .isChecked()
      .catch(() => false);
    if (!isChecked) {
      await this.agreementCheckbox.check();
    }

    // Step 3: Request OTP
    await this.requestOtpButton.click();
    await this.page.waitForURL(/.*\/verify-otp/, { timeout: 5000 });

    // Step 4: Enter OTP
    await this.page.waitForTimeout(1000); // Wait for OTP input to be ready
    await this.enterOTP(otp);

    // Step 5: Submit
    await this.submitButton.waitFor({ state: "visible" });
    await this.submitButton.click();

    // Wait for navigation away from login page
    await this.page
      .waitForURL((url) => !url.pathname.includes("login"), { timeout: 15000 })
      .catch(() => {});

    // Optionally, wait for some element on the post-login page to confirm successful login
    await this.page.waitForLoadState("networkidle");
  }

  async enterOTP(code = "1234") {
    const otpFields = this.otpInput;
    const digits = code.split("");
    for (let i = 0; i < digits.length; i++) {
      await otpFields.nth(i).type(digits[i], { delay: 100 });
    }
  }

  async enterPhoneNumber(phoneNumber) {
    await this.page.waitForTimeout(1000);
    const phoneInput = this.phoneInput;
    await phoneInput.click();
    await phoneInput.clear();

    for (const digit of phoneNumber) {
      await phoneInput.type(digit, { delay: 50 });
    }
    await this.page.waitForTimeout(3000);
  }
}
