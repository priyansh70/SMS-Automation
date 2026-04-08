import BasePage from "./BasePage";

export default class CountryPage extends BasePage {
  constructor(page) {
    super(page);

    // Navigation
    this.countryManagementLink = page.getByRole("link", {
      name: /country management/i,
    });
    this.addLink = page.getByRole("link", { name: /add/i });
    this.backLink = page.getByRole("link", { name: /back/i });

    // Form fields
    this.countryNameInput = page
      .getByRole("textbox", {
        name: /country name/i,
      })
      .first();
    this.countryCodeInput = page
      .getByRole("textbox", {
        name: /country code/i,
      })
      .first();
    this.countryPhoneCodeInput = page
      .getByRole("textbox", {
        name: /country phone code|phone code/i,
      })
      .first();
    this.countryStatusSelect = page.getByRole("combobox", { name: /status/i });

    this.successMessage = page.getByText(
      /successfully|created|updated|deleted/i,
    );

    // Buttons
    this.addButton = page.getByRole("button", { name: /add|update/i });
    this.cancelButton = page.getByRole("button", { name: /cancel/i });

    // Table search
    this.tableCountryNameInput = page.getByPlaceholder(/Country Name/i).first();
    this.tableCountryCodeInput = page.getByPlaceholder(/Country Code/i).first();
    this.tablePhoneCodeInput = page.getByPlaceholder(/Phone Code/i).first();

    // Actions Buttons In Table
    this.editButton = page.locator('a[title="Edit"]').first();

    // Pagination
    this.paginationContainer = page
      .locator("div")
      .filter({ hasText: /^Previous.*Next$/ })
      .first();
  }

  // ---------- Navigation ----------
  async goToCountryManagement() {
    await this.countryManagementLink.waitFor({ state: "visible" });
    await this.countryManagementLink.click();
  }

  async clickAddLink() {
    await this.addLink.waitFor({ state: "visible" });
    await this.addLink.click();
  }

  async clickEditButton() {
    await this.editButton.waitFor({ state: "visible" });
    await this.editButton.click();
  }

  async clickBack() {
    await this.backLink.waitFor({ state: "visible" });
    await this.backLink.click();
  }

  async clickCancel() {
    await this.cancelButton.waitFor({ state: "visible" });
    await this.cancelButton.click();
  }

  // Fill Form
  async fillForm(countryData, type = "add") {
    if (type === "edit") {
      await this.countryPhoneCodeInput.fill("");
      await this.countryNameInput.fill("");
      await this.countryCodeInput.fill("");
    }

    if (countryData.countryName) {
      await this.countryNameInput.type(countryData.countryName, { delay: 100 });
    }

    if (countryData.countryCode) {
      await this.countryCodeInput.type(countryData.countryCode, { delay: 100 });
    }

    if (countryData.countryPhoneCode) {
      await this.countryPhoneCodeInput.type(countryData.countryPhoneCode, {
        delay: 100,
      });
    }

    if (countryData.countryStatus)
      await this.countryStatusSelect.selectOption({
        label: countryData.countryStatus,
      });
  }

  // Add Country
  async addCountry(countryData) {
    await this.fillForm(countryData);
    await this.addButton.waitFor({ state: "visible" });
    await this.addButton.click();
  }

  // Edit Country
  async editCountry(countryData) {
    await this.clickEditButton();
    await this.page.waitForTimeout(1000); // Wait for form to load
    await this.fillForm(countryData, "edit");
    await this.page.waitForTimeout(1000); // Wait for form to load
    await this.addButton.waitFor({ state: "visible" });
    await this.addButton.click();
  }

  // Search In Table
  async searchInTable(countryName) {
    if (countryName) {
      await this.tableCountryNameInput.waitFor({ state: "visible" });
      await this.tableCountryNameInput.type(countryName);
    }

    await this.tableCountryNameInput.press("Enter");
    await this.page.waitForLoadState("networkidle", { timeout: 30000 });

    // Clear input for unique identifier for verify results
    if (countryName) await this.tableCountryNameInput.clear();
    await this.page
      .getByText(countryName)
      .first()
      .waitFor({ state: "visible" });
    await this.page.waitForLoadState("networkidle", { timeout: 30000 });
  }
}
