import { BasePage } from "./BasePage.js";
import { expect } from "@playwright/test";

export class PlansPage extends BasePage {
  // Locators
  getPageHeading() {
    return this.page.getByRole("heading", { name: "Plans & Pricing" });
  }

  getPlanButton(planName) {
    return this.page
      .getByRole("button", { name: new RegExp(planName, "i") })
      .first();
  }

  getPlanSection(planName) {
    return this.page.locator(".accordion-item").filter({
      has: this.page.locator("strong", { hasText: planName }),
    });
  }

  async expandPlan(planName) {
    const section = this.getPlanSection(planName);
    const button = section.locator(".accordion-button");

    const expanded = await button.getAttribute("aria-expanded");
    if (expanded === "false") {
      await button.click();
    }
  }

  // getYearlyOption(planName) {
  //   return this.getPlanSection(planName)
  //     .locator(".accordion-body")
  //     .getByText(/yearly/i);
  // }

  // getMonthlyOption(planName) {
  //   return this.getPlanSection(planName)
  //     .locator(".accordion-body")
  //     .getByText(/monthly/i);
  // }

  getMakePaymentButton() {
    return this.page.getByRole("button", { name: /Make Payment/i });
  }

  // getDurationOptions() {
  //   return {
  //     monthly: /monthly/i,
  //     yearly: /yearly/i,
  //   };
  // }

  // Actions
  async verifyPlansPageLoads() {
    await expect(this.getPageHeading()).toBeVisible();
  }
  async selectPlan(planName, billingType) {
    await this.expandPlan(planName);

    await this.getPlanSection(planName)
      .locator(".accordion-body")
      .getByText(new RegExp(billingType, "i"))
      .click();
  }

  async proceedToPayment() {
    const btn = this.getMakePaymentButton();
    await expect(btn).toBeEnabled();
    await btn.click();
    await this.waitForURL(/.*\/manage-card/, 5000);
  }

  async verifyMakePaymentDisabled() {
    const btn = this.getMakePaymentButton();
    const isDisabled = await btn.isDisabled();
    expect(isDisabled).toBeTruthy();
  }
}
