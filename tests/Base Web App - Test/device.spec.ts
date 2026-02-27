import { test, expect } from "@playwright/test";
import { DevicePage } from "../../pages/Base Web App - Page/DevicePage.js";

test.describe("Device Verification Suite", () => {
  test("1.1 Select device and confirm compatibility", async ({ page }) => {
    const devicePage = new DevicePage(page);
    await devicePage.goto("https://smspluswebapp.evdpl.com/check");
    await devicePage.verifyDeviceCheckPageLoads();
    await devicePage.selectDevice();

    const updatedButton = page
      .getByRole("button")
      .filter({ hasText: "Device" })
      .first();
    await expect(updatedButton).toBeVisible();

    await expect(devicePage.getDataPlanQuestion()).toBeVisible();
  });

  test("1.2 Confirm data plan availability", async ({ page }) => {
    const devicePage = new DevicePage(page);
    await devicePage.goto("https://smspluswebapp.evdpl.com/check");
    await devicePage.selectDevice();
    await devicePage.confirmDataPlan();

    await expect(page.locator("strong")).toContainText("Android 7");
    await expect(devicePage.getOSVersionHeading()).toBeVisible();
    await expect(devicePage.getAndroid7HigherOption()).toBeVisible();
    await expect(devicePage.getLowerOption()).toBeVisible();
  });

  test("1.3 Select OS version - Android 7 or Higher", async ({ page }) => {
    const devicePage = new DevicePage(page);
    await devicePage.goto("https://smspluswebapp.evdpl.com/check");
    await devicePage.selectDevice();
    await devicePage.confirmDataPlan();
    await devicePage.selectOSVersion("android7");

    const goToRegistrationButton = devicePage.getGoToRegistrationButton();
    await expect(goToRegistrationButton).toBeVisible();
    await expect(goToRegistrationButton).toBeEnabled();
  });

  test("1.4 Verify no data plan scenario - user cannot proceed", async ({
    page,
  }) => {
    const devicePage = new DevicePage(page);
    await devicePage.goto("https://smspluswebapp.evdpl.com/check");
    await devicePage.selectDevice();
    await devicePage.getNoButton().click();
    test.skip();
  });

  test("1.5 Verify lower OS version scenario - not supported", async ({
    page,
  }) => {
    const devicePage = new DevicePage(page);
    await devicePage.goto("https://smspluswebapp.evdpl.com/check");
    await devicePage.selectDevice();
    await devicePage.confirmDataPlan();
    await devicePage.selectOSVersion("lower");
    test.skip();
  });
});
