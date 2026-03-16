import {
  test,
  expect,
  chromium,
  Browser,
  BrowserContext,
  Page,
} from "@playwright/test";
import UserPage from "../../pages/AdminPanel-Page/UserPage";
import loginAdmin from "../../helpers/loginAdmin";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let userPage: UserPage;

const userData = {
  firstName: "Unlist",
  lastName: "Email",
  email: "nidhi@evincedev.com",
  mobileNumber: "3418763548",
};

test.describe("Admin Panel - User Management Tests", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    await loginAdmin(page);
    userPage = new UserPage(page);
  });

  test.beforeEach(async () => {
    await userPage.goToUserManagement();
    await page.waitForLoadState("networkidle", { timeout: 30000 });
  });

  test.afterAll(async () => {
    await browser.close();
  });

  // Edit first User of the table
  test("should edit a user successfully", async () => {
    await userPage.searchInTable(); // Use default search to find a user
    await userPage.clickEdit();
    await userPage.editUserDetails("NewFirstName", "NewLastName");
    await userPage.successMessage.first().waitFor({ state: "visible" });
  });

  // Search User - by passing user details
  test("should search for a user successfully", async () => {
    await userPage.searchInTable(userData);

    // Add assertions to verify the search results are correct
    await expect(page.getByText("Showing 1 to 1 of 1 entries")).toBeVisible();
  });

  // Delete first User of the table
  test.only("should delete a user successfully", async () => {
    // Delete first User of the table
    await userPage.searchInTable();
    await userPage.deleteUser();
    await userPage.successMessage.first().waitFor({ state: "visible" });
  });

  // Search User Test - without passing any details (should search by default values of the first row)
  test("should search for a user successfully - without passing anything", async () => {
    await userPage.searchInTable();
    // Add assertions to verify the search results are correct
    await expect(page.getByText("Showing 1 to 1 of 1 entries")).toBeVisible();
  });
});
