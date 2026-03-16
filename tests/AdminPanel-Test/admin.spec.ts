import {
  test,
  expect,
  chromium,
  Browser,
  BrowserContext,
  Page,
} from "@playwright/test";
import AdminPage from "../../pages/AdminPanel-Page/AdminPage";
import { genereteAdminDetails } from "../../helpers/utils";
import loginAdmin from "../../helpers/loginAdmin";

const adminDetails = genereteAdminDetails();
const editAdmin = "test.admin@yopmail.com";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let adminPage: AdminPage;

test.describe("Admin Panel Tests", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    await loginAdmin(page);
    adminPage = new AdminPage(page);
  });

  test.beforeEach(async () => {
    await adminPage.goToAdminManagement();
    await page.waitForLoadState("networkidle", { timeout: 30000 });
  });

  test.afterAll(async () => {
    await browser.close();
  });

  // Add Admin Test
  test("Add Admin Test - Create a new admin user and verify success message", async () => {
    await adminPage.clickAddLink();
    await adminPage.addAdmin(adminDetails);

    await expect(adminPage.successMessage).toBeVisible();
  });

  // Edit Admin Test
  test("Edit Admin Test - Edit an existing admin user and verify success message", async () => {
    await adminPage.searchInTable(adminDetails);
    await page.waitForLoadState("networkidle", { timeout: 30000 });
    await adminPage.clickEdit();

    const updatedDetails = genereteAdminDetails();

    await adminPage.editAdmin(updatedDetails);

    await expect(adminPage.successMessage).toBeVisible();
  });

  // Search Admin Test
  test("Search Admin Test - Search for an admin user and verify results", async () => {
    await adminPage.searchInTable(adminDetails);
    await page.waitForLoadState("networkidle", { timeout: 30000 });
  });

  // Delete Admin Test
  test("Delete Admin Test - Delete an existing admin user and verify success message", async () => {
    await adminPage.searchInTable(adminDetails);
    await page.waitForLoadState("networkidle", { timeout: 30000 });
    await adminPage.deleteAdmin();
    await expect(adminPage.successMessage.first()).toBeVisible();
  });
});
