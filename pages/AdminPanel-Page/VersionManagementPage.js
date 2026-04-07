import BasePage from "./BasePage";

export default class VersionManagementPage extends BasePage {
    constructor(page) {
        super(page);

        // Navigation
        this.versionManagementLink = page.getByRole("link", {
            name: /version management/i,
        });

        // Add Button (top right on page)
        this.addButton = page.getByRole("button", { name: /\+ Add|Add/i }).first();

        // Form fields (Modal: "Add Version")
        this.versionInput = page.locator('div').filter({ hasText: /^Version\s*\*/ }).locator('input[type="text"]').first();
        this.apkFileInput = page.locator('input[type="file"]').first();
        this.versionTypeSelect = page.locator('div').filter({ hasText: /^Version Type\s*\*/ }).locator('select').first();
        this.notesInput = page.locator('div').filter({ hasText: /^Notes\s*\*/ }).locator('textarea').first();

        this.successMessage = page.getByText(
            /successfully|created|updated|deleted/i,
        );

        // Buttons in Add Modal
        this.saveButton = page.getByRole("button", { name: /save/i });
        this.clearButton = page.getByRole("button", { name: /clear/i });

        // Table search placeholders
        this.tableVersionInput = page.getByPlaceholder(/Version/i).first();
        this.tableUploadedDateInput = page.getByPlaceholder(/MM\/DD\/YYYY/i).first();
        this.tableNotesInput = page.getByPlaceholder(/Notes/i).first();
        // The table type search is a select element
        this.tableTypeSelect = page.locator('thead select, tr.filter select, table select').first();

        // Actions Buttons In Table (Download icon)
        this.downloadButton = page.locator('a[title="Download"], button[title="Download"], .fa-download').first();

        // Pagination
        this.paginationContainer = page
            .locator("div")
            .filter({ hasText: /^Previous.*Next$/ })
            .first();
    }

    // ---------- Navigation ----------
    async goToVersionManagement() {
        await this.versionManagementLink.waitFor({ state: "visible" });
        await this.versionManagementLink.click();
    }

    async clickAddButton() {
        await this.addButton.waitFor({ state: "visible" });
        await this.addButton.click();
    }

    async clickDownloadButton() {
        await this.downloadButton.waitFor({ state: "visible" });
        await this.downloadButton.click();
    }

    async clickClear() {
        await this.clearButton.waitFor({ state: "visible" });
        await this.clearButton.click();
    }

    // Fill Form
    async fillForm(versionData) {
        if (versionData.version) {
            await this.versionInput.waitFor({ state: "visible" });
            await this.versionInput.fill(versionData.version);
        }
        if (versionData.apkFilePath) {
            await this.apkFileInput.setInputFiles(versionData.apkFilePath);
        }
        if (versionData.versionType) {
            await this.versionTypeSelect.selectOption({ label: versionData.versionType });
        }
        if (versionData.notes) {
            await this.notesInput.fill(versionData.notes);
        }
    }

    // Add Version
    async addVersion(versionData) {
        await this.fillForm(versionData);
        await this.saveButton.waitFor({ state: "visible" });
        await this.saveButton.click();
    }

    // Search In Table
    async searchInTable(searchValue, column = "version") {
        let searchInput;
        
        if (column === "version") {
            searchInput = this.tableVersionInput;
        } else if (column === "notes") {
            searchInput = this.tableNotesInput;
        }

        if (searchInput && searchValue) {
            await searchInput.waitFor({ state: "visible" });
            await searchInput.fill(searchValue);
            await searchInput.press("Enter");
            await this.page.waitForLoadState("networkidle", { timeout: 30000 });

            // Clear input for unique identifier for verify results
            await searchInput.clear();
            await this.page.getByText(searchValue).first().waitFor({ state: "visible" });
        }
    }
}
