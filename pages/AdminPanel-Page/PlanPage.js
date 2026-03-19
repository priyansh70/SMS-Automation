import BasePage from "./BasePage.js";

export default class PlanPage extends BasePage {
  constructor(page) {
    super(page);

    // Locators for Plan Management
    // Navigation
    this.planManagementLink = page.getByRole("link", {
      name: /plan management/i,
    });

    this.backLink = page.getByRole("link", { name: /back/i });

    // Form fields
    this.planTitleInput = page.getByRole("textbox", {
      name: /title|plantitle|plan title/i,
    });
    this.descriptionInput = page
      .locator('iframe[title="Rich Text Editor, Description"]')
      .contentFrame()
      .locator("body");

    this.monthlyPriceInput = page.getByRole("textbox", {
      name: /monthly price/i,
    });
    this.yearlyPriceInput = page.getByRole("textbox", {
      name: /yearly price/i,
    });

    this.successMessage = page.getByText(
      /successfully|created|updated|deleted/i,
    );

    // Buttons
    this.addButton = page.getByRole("button", { name: /add|update/i });

    // Table search
    this.tablePlanNameInput = page
      .getByRole("textbox", {
        name: "Plan Name",
      })
      .first();
    this.tablePlanTitleInput = page
      .getByRole("textbox", { name: "Plan Title" })
      .first();
    this.tableMonthlyPriceInput = page
      .getByRole("textbox", { name: "Email" })
      .first();
    this.tableYearlyPriceInput = page
      .getByRole("textbox", { name: "Phone Number" })
      .first();

    // edit and delete buttons
    this.editButton = page.locator('a[title="Edit"]').first();
    this.searchButton = page.locator("a.filter-submit").first();
  }

  // ---------- Navigation ----------
  async goToPlanManagement() {
    await this.planManagementLink.waitFor({ state: "visible" });
    await this.planManagementLink.click();
  }

  // Edit User
  async clickEdit() {
    await this.editButton.waitFor({ state: "visible" });
    await this.editButton.click();
  }

  // Search In Table
  async searchInTable(planTitle) {
    if (planTitle) {
      await this.tablePlanTitleInput.waitFor({ state: "visible" });
      await this.tablePlanTitleInput.type(planTitle);
    }

    await this.tablePlanTitleInput.first().press("Enter");
    await this.page.waitForLoadState("networkidle", { timeout: 30000 });

    // Clear input for unique identifier for verify results, if description is used for search
    if (planTitle) await this.tablePlanTitleInput.first().clear();
    await this.page.getByText(planTitle).first().waitFor({ state: "visible" });
  }

  // fill form fields
  async fillPlanForm(planDetail) {
    const { planTitle, description, monthlyPrice, yearlyPrice } = planDetail;

    if (planTitle) {
      await this.planTitleInput.clear();
      await this.planTitleInput.type(planTitle);
    }

    if (description) {
      await this.descriptionInput.press("ControlOrMeta+a");
      await this.descriptionInput.type(description);
    }

    if (monthlyPrice) {
      await this.monthlyPriceInput.clear();
      await this.monthlyPriceInput.type(monthlyPrice);
    }

    if (yearlyPrice) {
      await this.yearlyPriceInput.clear();
      await this.yearlyPriceInput.type(yearlyPrice);
    }
  }

  //   Edit Plan
  async editPlanDetails(planDetail) {
    await this.fillPlanForm(planDetail);
    await this.addButton.waitFor({ state: "visible" });
    await this.addButton.click();
  }
}
