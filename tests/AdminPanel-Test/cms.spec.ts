import {
    test,
    expect,
    chromium,
    Browser,
    BrowserContext,
    Page,
} from "@playwright/test";
import CmsPage from "../../pages/AdminPanel-Page/CmsPage";
import loginAdmin from "../../helpers/loginAdmin";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let cmsPage: CmsPage;

const cmsData = {
    keys: [
        "Home",
        "About",
        "Contact",
        "Blog",
        "Services",
        "FAQ",
        "Testimonials",
        "Portfolio",
        "Careers",
        "Events",
        "Support",
        "Resources",
        "Gallery",
        "Products",
        "Pricing",
        "Team"
    ],
    title: "Title",
    description: "Description",
    status: "Draft",
};

let createdCMSWithKey: String;

test.describe("Admin Panel - CMS Tests", () => {
    test.describe.configure({ mode: "serial" });

    test.beforeAll(async () => {
        browser = await chromium.launch();
        context = await browser.newContext();
        page = await context.newPage();
        await loginAdmin(page);
        cmsPage = new CmsPage(page);
    });

    test.beforeEach(async () => {
        await cmsPage.goToCmsManagement();
        await page.waitForLoadState("networkidle", { timeout: 30000 });
    });

    test.afterAll(async () => {
        await browser.close();
    });

    // Add CMS  
    test("should add a cms successfully", async () => {
        await cmsPage.clickAddLink();
        createdCMSWithKey = await cmsPage.addCms(cmsData);
        await cmsPage.successMessage.first().waitFor({ state: "visible" });
    });

    // Edit CMS
    test("should edit a CMS successfully", async () => {
        await cmsPage.searchInTable(createdCMSWithKey); // Use default search to find a cms
        await page.waitForTimeout(2000);
        await cmsPage.clickEditButton();
        await cmsPage.editCms({ title: "Edited Title", description: "Edited Description" });
        await cmsPage.successMessage.first().waitFor({ state: "visible" });
    });

    // Search CMS - by passing cms details
    test("should search for a cms successfully", async () => {
        await cmsPage.searchInTable(createdCMSWithKey);

        // Add assertions to verify the search results are correct
        await expect(page.getByText("Showing 1 to 1 of 1 entries")).toBeVisible();
    });

    // Delete CMS
    test("should delete a cms successfully", async () => {
        // Delete first cms of the table
        await cmsPage.searchInTable(createdCMSWithKey);
        await cmsPage.deleteCms();
        await cmsPage.successMessage.first().waitFor({ state: "visible" });
    });
});
