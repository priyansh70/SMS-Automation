import BasePage from "./BasePage.js";

export default class AdminPage extends BasePage {
  constructor(page) {
    super(page);

    // Navigation
    this.adminManagementLink = page.getByRole("link", {
      name: /admin management/i,
    });
    this.addLink = page.getByRole("link", { name: /add/i });
    this.backLink = page.getByRole("link", { name: /back/i });

    // Form fields
    this.firstNameInput = page.getByRole("textbox", { name: /first name/i });
    this.lastNameInput = page.getByRole("textbox", { name: /last name/i });
    this.emailInput = page.getByRole("textbox", { name: /^email/i });
    this.passwordInput = page.getByRole("textbox", { name: /^password/i });
    this.confirmPasswordInput = page.getByRole("textbox", {
      name: /confirm password/i,
    });
    this.successMessage = page.getByText(
      /successfully|created|updated|deleted/i,
    );

    // Buttons
    this.addButton = page.getByRole("button", { name: /add|update/i });

    // Table search
    this.tableFirstNameInput = page
      .locator("#adminDataTable")
      .getByRole("textbox", { name: "First Name" });
    this.tableLastNameInput = page
      .locator("#adminDataTable")
      .getByRole("textbox", { name: "Last Name" });
    this.tableEmailInput = page
      .locator("#adminDataTable")
      .getByRole("textbox", { name: "Email" });

    // Actions Buttons In Table
    this.editButton = page.locator('a[title="Edit"]').first();
    this.deleteButton = page.locator('a[title="Delete"]').first();
    this.confirmDeleteButton = page.getByRole("button", {
      name: /confirm delete|delete|'Yes, Delete It'/i,
    });

    // Pagination
    this.paginationContainer = page
      .locator("div")
      .filter({ hasText: /^Previous1Next$/ })
      .first();
  }

  // ---------- Navigation ----------
  async goToAdminManagement() {
    await this.adminManagementLink.waitFor({ state: "visible" });
    await this.adminManagementLink.click();
  }

  async clickAddLink() {
    await this.addLink.waitFor({ state: "visible" });
    await this.addLink.click();
  }

  async clickBack() {
    await this.backLink.waitFor({ state: "visible" });
    await this.backLink.click();
  }

  // ---------- Field Actions (useful for validation tests) ----------
  async fillFirstName(firstName) {
    await this.firstNameInput.waitFor({ state: "visible" });
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName) {
    await this.lastNameInput.waitFor({ state: "visible" });
    await this.lastNameInput.fill(lastName);
  }

  async fillEmail(email) {
    await this.emailInput.waitFor({ state: "visible" });
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput.waitFor({ state: "visible" });
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(confirmPassword) {
    await this.confirmPasswordInput.waitFor({ state: "visible" });
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  // Table Actions
  async clickEdit() {
    await this.editButton.waitFor({ state: "visible" });
    await this.editButton.click();
  }

  async clickDelete() {
    await this.deleteButton.waitFor({ state: "visible" });
    await this.deleteButton.click();
  }

  async confirmDelete() {
    await this.confirmDeleteButton.waitFor({ state: "visible" });
    await this.confirmDeleteButton.click();
  }

  // ---------- Form Actions ----------
  async fillAdminForm(admin, type = "add") {
    const { firstName, lastName, email, password, confirmPassword } = admin;

    if (type === "edit") {
      await this.firstNameInput.clear();
      await this.lastNameInput.clear();
    }

    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);

    if (type !== "edit") {
      await this.fillEmail(email);
      await this.fillPassword(password);
      await this.fillConfirmPassword(confirmPassword);
    }
  }

  async addAdmin(admin) {
    await this.fillAdminForm(admin);
    await this.addButton.waitFor({ state: "visible" });
    await this.addButton.click();
  }

  async editAdmin(admin) {
    await this.fillAdminForm(admin, "edit");
    await this.addButton.waitFor({ state: "visible" });
    await this.addButton.click();
  }

  // ---------- Table Search ----------
  async searchInTable({ firstName, lastName, email }) {
    if (firstName) {
      await this.tableFirstNameInput.waitFor({ state: "visible" });
      await this.tableFirstNameInput.type(firstName);
    }

    if (lastName) {
      await this.tableLastNameInput.waitFor({ state: "visible" });
      await this.tableLastNameInput.type(lastName);
    }
    if (email) {
      await this.tableEmailInput.waitFor({ state: "visible" });
      await this.tableEmailInput.type(email);
    }
    await this.tableEmailInput.first().press("Enter");

    // Clear input for unique identifier for verify results, if email is used for search
    if (email) await this.tableEmailInput.first().clear();
    await this.page.getByText(email).first().waitFor({ state: "visible" });
  }

  async deleteAdmin() {
    await this.clickDelete();
    await this.page.waitForLoadState("networkidle", { timeout: 30000 });
    await this.confirmDelete();
  }
}
