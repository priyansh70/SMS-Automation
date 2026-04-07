import BasePage from "./BasePage";

export default class DeviceManagementPage extends BasePage {
    constructor(page) {
        super(page);

        // Navigation
        this.deviceManagementLink = page.getByRole("link", {
            name: /device management/i,
        });
        this.addLink = page.getByRole("link", { name: /add/i });
        this.backLink = page.getByRole("link", { name: /back/i });

        // Form fields
        this.deviceNameInput = page.getByPlaceholder(/Enter device name/i);
        this.osVersionInput = page.getByPlaceholder(/Example: 1, 1\.1, 1\.1\.2/i);
        this.osCheckInstructionsInput = page.getByPlaceholder(/How users can check OS version/i);

        this.successMessage = page.getByText(
            /successfully|created|updated|deleted/i,
        );

        // Buttons
        this.addButton = page.getByRole("button", { name: /add|update/i });
        this.cancelButton = page.getByRole("button", { name: /cancel/i });

        // Table search
        this.tableDeviceNameInput = page.getByPlaceholder(/Device Name/i).first();
        this.tableOsVersionInput = page.getByPlaceholder(/OS Version/i).first();
        this.tableOsCheckInstructionsInput = page.getByPlaceholder(/OS Check Instructions/i).first();
        this.tableCreatedOnInput = page.getByPlaceholder(/MM\/DD\/YYYY/i).first();

        // Actions Buttons In Table
        this.editButton = page.locator('a[title="Edit"]').first();
        this.deleteButton = page.locator('a[title="Delete"]').first();
        this.confirmDeleteButton = page.getByRole("button", {
            name: /confirm delete|delete|'Yes, Delete It'/i,
        });

        // Pagination
        this.paginationContainer = page
            .locator("div")
            .filter({ hasText: /^Previous.*Next$/ })
            .first();
    }

    // ---------- Navigation ----------
    async goToDeviceManagement() {
        await this.deviceManagementLink.waitFor({ state: "visible" });
        await this.deviceManagementLink.click();
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

    async clickDeleteButton() {
        await this.deleteButton.waitFor({ state: "visible" });
        await this.deleteButton.click();
    }

    // Fill Form
    async fillForm(deviceData, type = "add") {
        if (deviceData.deviceName) await this.deviceNameInput.fill(deviceData.deviceName);
        if (deviceData.osVersion) await this.osVersionInput.fill(deviceData.osVersion);
        if (deviceData.osCheckInstructions) await this.osCheckInstructionsInput.fill(deviceData.osCheckInstructions);
    }

    // Add Device
    async addDevice(deviceData) {
        await this.fillForm(deviceData);
        await this.addButton.waitFor({ state: "visible" });
        await this.addButton.click();
    }

    // Edit Device
    async editDevice(deviceData) {
        await this.fillForm(deviceData, "edit");
        await this.addButton.waitFor({ state: "visible" });
        await this.addButton.click();
    }

    // Delete Device
    async deleteDevice() {
        await this.clickDeleteButton();
        await this.page.waitForLoadState("networkidle", { timeout: 30000 });
        await this.confirmDeleteButton.waitFor({ state: "visible" });
        await this.confirmDeleteButton.click();
    }

    // Search In Table
    async searchInTable(deviceName) {
        if (deviceName) {
            await this.tableDeviceNameInput.waitFor({ state: "visible" });
            await this.tableDeviceNameInput.fill(deviceName);
        }

        await this.tableDeviceNameInput.first().press("Enter");
        await this.page.waitForLoadState("networkidle", { timeout: 30000 });

        // Clear input for unique identifier for verify results
        if (deviceName) await this.tableDeviceNameInput.first().clear();
        await this.page.getByText(deviceName).first().waitFor({ state: "visible" });
    }
}
