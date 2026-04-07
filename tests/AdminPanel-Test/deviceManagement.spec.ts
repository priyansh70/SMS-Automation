import {
    test,
    expect,
    chromium,
    Browser,
    BrowserContext,
    Page,
} from "@playwright/test";
import DeviceManagementPage from "../../pages/AdminPanel-Page/DeviceManagementPage";
import loginAdmin from "../../helpers/loginAdmin";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let deviceManagementPage: DeviceManagementPage;

const deviceData = {
    deviceName: "Automated Device",
    osVersion: "14",
    osCheckInstructions: "Go to settings -> About phone",
};

test.describe("Admin Panel - Device Management Tests", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeAll(async () => {
        browser = await chromium.launch();
        context = await browser.newContext();
        page = await context.newPage();
        await loginAdmin(page);
        deviceManagementPage = new DeviceManagementPage(page);
    });

    test.beforeEach(async () => {
        await deviceManagementPage.goToDeviceManagement();
        await page.waitForLoadState("networkidle", { timeout: 30000 });
    });

    test.afterAll(async () => {
        await browser.close();
    });

    // Add Device  
    test("should add a device successfully", async () => {
        await deviceManagementPage.clickAddLink();
        await deviceManagementPage.addDevice(deviceData);
        await deviceManagementPage.successMessage.first().waitFor({ state: "visible" });
    });

    // Edit Device
    test("should edit a device successfully", async () => {
        await deviceManagementPage.searchInTable(deviceData.deviceName);
        await page.waitForTimeout(2000);
        await deviceManagementPage.clickEditButton();

        // Update data to test edit functionality
        deviceData.deviceName = deviceData.deviceName + " Edited";
        deviceData.osVersion = "15";

        await deviceManagementPage.editDevice({ deviceName: deviceData.deviceName, osVersion: deviceData.osVersion });
        await deviceManagementPage.successMessage.first().waitFor({ state: "visible" });
    });

    // Search Device
    test("should search for a device successfully", async () => {
        await deviceManagementPage.searchInTable(deviceData.deviceName);

        // Add assertions to verify the search results are correct
        await expect(page.getByText("Showing 1 to 1 of 1 entries")).toBeVisible();
    });

    // Delete Device
    test("should delete a device successfully", async () => {
        // Delete first device from the table search result
        await deviceManagementPage.searchInTable(deviceData.deviceName);
        await deviceManagementPage.deleteDevice();
        await deviceManagementPage.successMessage.first().waitFor({ state: "visible" });
    });
});
