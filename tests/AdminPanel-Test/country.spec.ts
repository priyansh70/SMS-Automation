import {
  test,
  expect,
  chromium,
  Browser,
  BrowserContext,
  Page,
} from "@playwright/test";
import CountryPage from "../../pages/AdminPanel-Page/CountryPage";
import loginAdmin from "../../helpers/loginAdmin";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let countryPage: CountryPage;

const countryData = {
  countryName: "Automated Country",
  countryCode: "AC",
  countryPhoneCode: "14",
  countryStatus: "Active",
};

const updatedCountryData = {
  countryName: "Updated Automated Country",
  countryCode: "AC",
  countryPhoneCode: "14",
  countryStatus: "Active",
};

test.describe("Admin Panel - Country Tests", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    await loginAdmin(page);
    countryPage = new CountryPage(page);
  });

  test.beforeEach(async () => {
    await countryPage.goToCountryManagement();
    await page.waitForLoadState("networkidle", { timeout: 30000 });
  });

  //   Add Country Test
  test("Add Country", async () => {
    await countryPage.clickAddLink();
    await countryPage.addCountry(countryData);
    await countryPage.searchInTable(countryData.countryName);
  });

  //   Edit Country Test
  test("Edit Country", async () => {
    await countryPage.searchInTable(countryData.countryName);
    await countryPage.editCountry(updatedCountryData);
    await countryPage.searchInTable(updatedCountryData.countryName);
  });

  //   Search Country Test
  test("Search Country", async () => {
    await countryPage.searchInTable(updatedCountryData.countryName);
  });
});
