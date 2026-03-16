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
    this.successMessage = page.getByText(/successfully|created|updated/i);

    // Buttons
    this.addButton = page.getByRole("button", { name: /add|update/i });

    // Table search
    this.tableLastNameInput = page.getByPlaceholder(/last name/i);
    this.tableEmailInput = page.getByPlaceholder(/email/i);

    // Actions Buttons In Table
    this.editButton = page.getByTitle("Edit");
    this.deleteButton = page.getByTitle("Delete");

    // Pagination
    this.paginationContainer = page
      .locator("div")
      .filter({ hasText: /^Previous1Next$/ })
      .first();
  }

  // ---------- Navigation ----------
  async goToAdminManagement() {
    await this.adminManagementLink.click();
  }

  async clickAddLink() {
    await this.addLink.click();
  }

  async clickBack() {
    await this.backLink.click();
  }

  // ---------- Field Actions (useful for validation tests) ----------
  async fillFirstName(firstName) {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName) {
    await this.lastNameInput.fill(lastName);
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(confirmPassword) {
    await this.confirmPasswordInput.fill(confirmPassword);
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
    await this.addButton.click();
  }

  async editAdmin(admin) {
    await this.fillAdminForm(admin, "edit");
    await this.addButton.click();
  }

  // ---------- Table Search ----------
  async searchInTable(firstName, lastName, email) {
    if (firstName) await this.tableFirstNameInput.fill(firstName);
    if (lastName) await this.tableLastNameInput.fill(lastName);
    if (email) await this.tableEmailInput.fill(email);
    await this.tableEmailInput.first().press("Enter");

    // Clear input for unique identifier for verify results, if email is used for search
    if (email) await this.tableEmailInput.first().clear();
    await this.page.getByText(email).first().waitFor({ state: "visible" });
  }

  // Table Actions
  async clickEdit() {
    await this.editButton.waitFor({ state: "visible" });
    await this.editButton.click();
  }

  async clickDelete() {
    await this.deleteButton.click();
  }
}
