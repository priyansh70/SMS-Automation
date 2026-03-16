import BasePage from "./BasePage.js";

export default class UserPage extends BasePage {
  constructor(page) {
    super(page);

    // Locators for User Management
    // Navigation
    this.userManagementLink = page.getByRole("link", {
      name: /users management/i,
    });

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
      .getByRole("textbox", {
        name: "First Name",
      })
      .first();
    this.tableLastNameInput = page
      .getByRole("textbox", { name: "Last Name" })
      .first();
    this.tableEmailInput = page.getByRole("textbox", { name: "Email" }).first();
    this.tablePhoneNumberInput = page
      .getByRole("textbox", { name: "Phone Number" })
      .first();

    // edit and delete buttons
    this.editButton = page.locator('a[title="Edit"]').first();
    this.deleteButton = page.locator('a[title="Delete"]').first();
    this.searchButton = page.locator("a.filter-submit").first();
    this.confirmDeleteButton = page.getByRole("button", {
      name: /confirm delete|delete|'Yes, Delete It'/i,
    });
  }

  // ---------- Navigation ----------
  async goToUserManagement() {
    await this.userManagementLink.waitFor({ state: "visible" });
    await this.userManagementLink.click();
  }

  // Edit User
  async clickEdit() {
    await this.editButton.waitFor({ state: "visible" });
    await this.editButton.click();
  }

  // Delete User
  async deleteUser() {
    await this.deleteButton.waitFor({ state: "visible" });
    await this.deleteButton.click();
    await this.page.waitForLoadState("networkidle", { timeout: 30000 });
    await this.confirmDeleteButton.waitFor({ state: "visible" });
    await this.confirmDeleteButton.click();
  }

  //   Searching for a user in the table
  /**
   * @param {{
   *  firstName?: string,
   *  lastName?: string,
   *  email?: string,
   *  mobileNumber?: string
   * }} param0
   */
  async searchInTable({
    firstName = null,
    lastName = null,
    email = null,
    mobileNumber = null,
  } = {}) {
    const isNoArgs = [firstName, lastName, email, mobileNumber].every(
      (v) => !v,
    );

    if (isNoArgs) {
      // Get first row's email to use as the search identifier
      console.log(
        "No search criteria provided, using first row's email for search.",
      );
      const firstRowEmail = await this.page
        .locator("#userDataTable tbody tr:first-child td:nth-child(4)")
        .innerText();

      console.log(`First row email: ${firstRowEmail.trim()}`);

      await this.tableEmailInput.waitFor({ state: "visible" });
      await this.tableEmailInput.type(firstRowEmail.trim());

      await this.searchButton.click();
      await this.tableEmailInput.clear();

      await this.page
        .getByText(firstRowEmail.trim())
        .first()
        .waitFor({ state: "visible" });

      return;
    }

    // Type into filters based on provided arguments
    if (firstName) {
      await this.tableFirstNameInput.waitFor({ state: "visible" });
      await this.tableFirstNameInput.click();
      await this.tableFirstNameInput.type(firstName);
    }
    if (lastName) {
      await this.tableLastNameInput.waitFor({ state: "visible" });
      await this.tableLastNameInput.click();
      await this.tableLastNameInput.type(lastName);
    }
    if (email) {
      await this.tableEmailInput.waitFor({ state: "visible" });
      await this.tableEmailInput.click();
      await this.tableEmailInput.type(email);
    }
    if (mobileNumber) {
      await this.tablePhoneNumberInput.waitFor({ state: "visible" });
      await this.tablePhoneNumberInput.click();
      await this.tablePhoneNumberInput.type(mobileNumber);
    }

    await this.searchButton.click();

    await this.tableEmailInput.clear();
    await this.tablePhoneNumberInput.clear();
    await this.tableFirstNameInput.clear();
    await this.tableLastNameInput.clear();

    // Verify results using the most specific identifier available
    const verifyText = mobileNumber || email || firstName || lastName;
    await this.page.getByText(verifyText).waitFor({ state: "visible" });
  }

  // fill form fields
  async fillUserForm(firstName, lastName) {
    await this.firstNameInput.clear();
    await this.firstNameInput.type(firstName);

    await this.lastNameInput.clear();
    await this.lastNameInput.type(lastName);
  }

  async editUserDetails(firstName, lastName) {
    await this.fillUserForm(firstName, lastName);
    await this.addButton.waitFor({ state: "visible" });
    await this.addButton.click();
  }
}
