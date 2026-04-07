import {
    test,
    expect,
    chromium,
    Browser,
    BrowserContext,
    Page,
} from "@playwright/test";
import VersionManagementPage from "../../pages/AdminPanel-Page/VersionManagementPage";
import loginAdmin from "../../helpers/loginAdmin";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let versionManagementPage: VersionManagementPage;

const versionData = {
    version: "1.9.9",
    apkFilePath: { 
        name: "test-app.apk",
        mimeType: "application/vnd.android.package-archive",
        buffer: Buffer.from("test file content")
    },
    versionType: "With Registration",
    notes: "Automated test notes",
};

test.describe("Admin Panel - Version Management Tests", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeAll(async () => {
        browser = await chromium.launch();
        context = await browser.newContext();
        page = await context.newPage();
        await loginAdmin(page);
        versionManagementPage = new VersionManagementPage(page);
    });

    test.beforeEach(async () => {
        await versionManagementPage.goToVersionManagement();
        await page.waitForLoadState("networkidle", { timeout: 30000 });
    });

    test.afterAll(async () => {
        await browser.close();
    });

    // Add Version  
    test("should add a version successfully", async () => {
        await versionManagementPage.clickAddButton();
        await versionManagementPage.addVersion(versionData);
        await versionManagementPage.successMessage.first().waitFor({ state: "visible" });
    });

    // Search Version
    test("should search for a version successfully", async () => {
        await versionManagementPage.searchInTable(versionData.version, "version");

        // Add assertions to verify the search results are correct
        await expect(page.getByText("Showing 1 to 1 of 1 entries").or(page.getByRole("cell", { name: versionData.version }))).toBeVisible();
    });

    // Download Version
    test("should download a version successfully", async () => {
        await versionManagementPage.searchInTable(versionData.version, "version");
        
        const downloadPromise = page.waitForEvent('download');
        await versionManagementPage.clickDownloadButton();
        const download = await downloadPromise;

        // Verify that a file started downloading
        expect(download.suggestedFilename()).toBeTruthy();
    });
});
