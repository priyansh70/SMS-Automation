import { BasePage } from "./BasePage.js";
import { expect } from "@playwright/test";

export class PaymentPage extends BasePage {
  constructor(page) {
    super(page);

    // Centralized locators
    this.orderSummaryHeading = page.getByRole("heading", {
      name: /order summary/i,
    });
    this.planDescriptionText = page.getByText(
      /^Charges the customer every (twelve )?month\.$/i,
    );
    this.changePlanButton = page.getByRole("button", { name: /change plan/i });
    this.payNowButton = page.getByRole("button", { name: /pay now/i });
    this.successDialog = this.page.locator('[role="dialog"]');
    this.successMessage = this.successDialog.getByText(
      /^Payment Successful/i,
    );
    this.continueLink = page.getByRole("link", { name: /continue/i });
  }

  // ---------- Dynamic Locators ----------

  planNameText(planName) {
    return this.page.getByText(new RegExp(planName, "i"));
  }

  // priceText(amount) {
  //   return this.page.getByText(new RegExp(amount));
  // }

  // ---------- Assertions ----------

  async expectOrderSummaryVisible() {
    await expect(this.orderSummaryHeading.first()).toBeVisible();
  }

  async expectPlanDetails({ planName, billingCycle }) {
    await this.expectOrderSummaryVisible();

    if (planName) {
      await this.planNameText(planName).waitFor({ state: "visible" });
      await expect(this.planNameText(planName)).toBeVisible();
    }

    if (billingCycle) {
      await expect(this.planDescriptionText).toBeVisible();
    }

    // if (price) {
    //   await expect(this.priceText(price)).toBeVisible();
    // }
  }

  async expectChangePlanAvailable() {
    await expect(this.changePlanButton).toBeVisible();
    await expect(this.changePlanButton).toBeEnabled();
  }

  async expectPayNowEnabled() {
    await expect(this.payNowButton).toBeVisible();
    await expect(this.payNowButton).toBeEnabled();
  }

  async expectPaymentSuccess() {
    await expect(this.successDialog).toBeVisible({ timeout: 5000 });
    await expect(this.successMessage).toBeVisible();
  }

  // ---------- Actions ----------

  async clickChangePlan() {
    await this.changePlanButton.click();
    await this.waitForURL(/\/plans-and-pricing/, 5000);
  }

  async clickPayNow() {
    await this.payNowButton.click();
  }

  async completePayment() {
    await this.clickPayNow();
    await this.expectPaymentSuccess();
  }

  async continueAfterPayment(expectedUrlPattern = /smsplusapp\.com/) {
    await this.continueLink.click();
    await this.waitForURL(expectedUrlPattern, 5000);
  }
}
