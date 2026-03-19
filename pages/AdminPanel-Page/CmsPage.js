import BasePage from "./BasePage";

export default class CmsPage extends BasePage {
    constructor(page) {
        super(page);

        // Navigation
        this.cmsManagementLink = page.getByRole("link", {
            name: /cms management/i,
        });
        this.addLink = page.getByRole("link", { name: /add/i });
        this.backLink = page.getByRole("link", { name: /back/i });

        // Form fields
        this.selectKeyInput = page.getByRole('textbox', { name: /select|---select---/i })
        this.titleInput = page.getByRole("textbox", { name: /title/i });
        // this.descriptionInput = page.getByRole("textbox", { name: /description/i });
        this.descriptionInput = page.frameLocator('[title="Rich Text Editor, Content"]').getByText('This element is inside iframe', { exact: true })
        this.statusInput = page.getByRole('combobox', { name: /status/i })

        this.successMessage = page.getByText(
            /successfully|created|updated|deleted/i,
        );

        // Buttons
        this.addButton = page.getByRole("button", { name: /add|update/i });

        // Table search
        this.tableTitleInput = page.getByRole("textbox", { name: "Title" });
        this.tableDescriptionInput = page.locator('iframe[title="Rich Text Editor, Content"]').contentFrame().locator('body');
        this.tableKeyInput = page.getByRole("textbox", { name: "Key" }).first();

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
    async goToCmsManagement() {
        await this.cmsManagementLink.waitFor({ state: "visible" });
        await this.cmsManagementLink.click();
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

    async clickDeleteButton() {
        await this.deleteButton.waitFor({ state: "visible" });
        await this.deleteButton.click();
    }

    // Fill Form
    async fillForm(cmsData, type = "add") {
        let keyContent;
        if (cmsData.title) await this.titleInput.type(cmsData.title);
        if (cmsData.description) {
            await this.tableDescriptionInput.type(cmsData.description);
        }

        if (type !== "edit") {
            if (cmsData.keys && cmsData.keys.length) {
                await this.selectKeyInput.click();
                for (const key of cmsData.keys) {
                    const option = this.page.getByRole("option", { name: key });
                    if (await option.count()) {
                        keyContent = option.textContent();
                        await option.first().click();
                        break; // stop after selecting first available key
                    }
                }
            }
            if (cmsData.status) await this.statusInput.selectOption(cmsData.status);
        }
        return keyContent;
    }

    // Add Cms
    async addCms(cmsData) {
        const key = await this.fillForm(cmsData);
        await this.addButton.waitFor({ state: "visible" });
        await this.addButton.click();
        return key;
    }

    // Edit Cms
    async editCms(cmsData) {
        await this.fillForm(cmsData, "edit");
        await this.addButton.waitFor({ state: "visible" });
        await this.addButton.click();
    }

    // Delete Cms
    async deleteCms() {
        await this.clickDeleteButton();
        await this.page.waitForLoadState("networkidle", { timeout: 30000 });
        await this.confirmDeleteButton.waitFor({ state: "visible" });
        await this.confirmDeleteButton.click();
    }

    // Search In Table
    async searchInTable(key) {
        if (key) {
            await this.tableKeyInput.waitFor({ state: "visible" });
            await this.tableKeyInput.type(key);
        }

        await this.tableKeyInput.first().press("Enter");
        await this.page.waitForLoadState("networkidle", { timeout: 30000 });

        // Clear input for unique identifier for verify results, if description is used for search
        if (key) await this.tableKeyInput.first().clear();
        await this.page.getByText(key).first().waitFor({ state: "visible" });
    }
}



