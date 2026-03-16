import { test, expect } from "@playwright/test";
import AdminPage from "../../pages/AdminPanel-Page/AdminPage";
import { configDotenv } from "dotenv";
import { genereteAdminDetails } from "../../helpers/utils";
import loginAdmin from "../../helpers/loginAdmin";

configDotenv();

const adminDetails = genereteAdminDetails();
const editAdmin = "test.admin@yopmail.com";

test.describe("Admin Panel Tests", () => {
  let adminPage: AdminPage;
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
    adminPage = new AdminPage(page);
    await adminPage.goToAdminManagement();
  });

  // Add Admin Test
  test("Add Admin Test - Create a new admin user and verify success message", async ({
    page,
  }) => {
    await adminPage.clickAddLink();
    await adminPage.addAdmin(adminDetails);

    await expect(adminPage.successMessage).toBeVisible();
  });

  // Edit Admin Test
  test.only("Edit Admin Test - Edit an existing admin user and verify success message", async ({
    page,
  }) => {
    await adminPage.searchInTable("", "", editAdmin);
    await page.waitForLoadState("networkidle", { timeout: 30000 });
    await adminPage.clickEdit();

    const updatedDetails = genereteAdminDetails();

    await adminPage.editAdmin(updatedDetails);

    await expect(adminPage.successMessage).toBeVisible();
  });
});
