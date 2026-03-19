import {
  test,
  expect,
  chromium,
  Browser,
  BrowserContext,
  Page,
} from "@playwright/test";
import PlanPage from "../../pages/AdminPanel-Page/PlanPage";
import loginAdmin from "../../helpers/loginAdmin";
import { pl } from "@faker-js/faker";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let planPage: PlanPage;

const planDetails = [
  {
    planTitle: "Basic Plan",
    description:
      "Perfect for individual users who need reliable messaging on a single device. Stay connected with secure SMS and MMS messaging, full conversation history, and seamless access on your primary device. Ideal for personal use with straightforward, hassle-free messaging.",
    monthlyPrice: "10",
    yearlyPrice: "100",
  },    
  {
    planTitle: "Premium Plan",
    description:
      "Designed for power users who need messaging everywhere. Access your messages simultaneously on unlimited devices - phone, tablet, computer, and web browsers. Enjoy real-time synchronization across all platforms with priority support and advanced device management features.",
    monthlyPrice: "20",
    yearlyPrice: "200",
  },
];

test.describe("Admin Panel - Plan Tests", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    await loginAdmin(page);
    planPage = new PlanPage(page);
  });

  test.beforeEach(async () => {
    await planPage.goToPlanManagement();
    await page.waitForLoadState("networkidle", { timeout: 30000 });
  });

  test.afterAll(async () => {
    await browser.close();
  });

  // Edit Basic Plan
  test("Should edit a Basic Plan successfully", async () => {
    await planPage.searchInTable(planDetails[0].planTitle); // Use default search to find a Plan
    await page.waitForTimeout(2000);
    await planPage.clickEdit();
    await planPage.editPlanDetails(planDetails[0]);
    await planPage.successMessage.first().waitFor({ state: "visible" });
  });

  //   Edit Premium Plan
  test("Should edit a Premium Plan successfully", async () => {
    await planPage.searchInTable(planDetails[1].planTitle); // Use default search to find a Plan
    await page.waitForTimeout(2000);
    await planPage.clickEdit();
    await planPage.editPlanDetails(planDetails[1]);
    await planPage.successMessage.first().waitFor({ state: "visible" });
  });

  // Search Plan - by passing Plan details
  test("should search for a Plan By Title successfully", async () => {
    await planPage.searchInTable(planDetails[0].planTitle);

    // Add assertions to verify the search results are correct
    await expect(page.getByText("Showing 1 to 1 of 1 entries")).toBeVisible();
  });
});
