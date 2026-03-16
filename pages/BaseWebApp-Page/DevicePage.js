/**
 * Device Check Page Object
 * Handles device selection and compatibility checks
 */
import { BasePage } from "./BasePage.js";
import { expect } from "@playwright/test";

export class DevicePage extends BasePage {
  // Locators
  getSelectDeviceButton() {
    return this.page.getByRole("button", { name: "Select Device" });
  }

  getSelectYourDeviceText() {
    return this.page.getByText("Select your device");
  }

  getDeviceList() {
    return this.page.getByRole("list");
  }

  getFirstDeviceOption() {
    return this.page.getByText("Device").nth(2);
  }

  getDataPlanQuestion() {
    return this.page.getByText("Do you have a data plan on your phone?");
  }

  getYesButton() {
    return this.page.getByText("Yes");
  }

  getNoButton() {
    return this.page.getByText("No");
  }

  getOSVersionHeading() {
    return this.page.getByRole("heading", { name: "Which version do you have?" });
  }

  getAndroid7HigherOption() {
    return this.page.getByText("Android 7 or Higher");
  }

  getLowerOption() {
    return this.page.getByText("Lower");
  }

  getGoToRegistrationButton() {
    return this.page.getByRole("button", { name: "Go to Registration" });
  }

  // Actions
  async verifyDeviceCheckPageLoads() {
    await expect(this.getSelectYourDeviceText()).toBeVisible();
    await expect(this.getSelectDeviceButton()).toBeVisible();
  }

  async selectDevice() {
    await this.getSelectDeviceButton().click();
    await expect(this.getDeviceList()).toBeVisible();
    await this.getFirstDeviceOption().click();
  }

  async confirmDataPlan() {
    await expect(this.getDataPlanQuestion()).toBeVisible();
    await this.getYesButton().click();
  }

  async selectOSVersion(version = "android7") {
    await expect(this.getOSVersionHeading()).toBeVisible();
    if (version === "android7") {
      await this.getAndroid7HigherOption().click();
    } else if (version === "lower") {
      await this.getLowerOption().click();
    }
  }

  async proceedToRegistration() {
    const btn = this.getGoToRegistrationButton();
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
    await btn.click();
  }

  async completeDeviceCheck() {
    await this.verifyDeviceCheckPageLoads();
    await this.selectDevice();
    await this.confirmDataPlan();
    await this.selectOSVersion("android7");
    await this.proceedToRegistration();
  }
}
