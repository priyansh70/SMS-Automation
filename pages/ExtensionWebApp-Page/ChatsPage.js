export default class ChatsPage {
  constructor(page) {
    this.page = page;

    // Compose / new message button (pencil icon, fab, or labelled button)
    this.composeButton = page.locator("#dropdownBasic2");

    this.recipientInput = page.getByPlaceholder("Enter Number");
    this.startChatButton = page
      .locator("button")
      .filter({ hasText: /start chat|new chat|start/i })
      .first();
  }

  async waitForLoad() {
    await this.page.waitForLoadState("networkidle");
    await this.page
      .waitForURL(
        (url) => url.pathname !== "/" && !url.pathname.includes("login"),
        { timeout: 15000 },
      )
      .catch(() => {});
  }

  async clickCompose() {
    await this.composeButton.waitFor({ state: "visible" });
    await this.composeButton.click();
  }

  async startChatWith(mobileNumber) {
    await this.recipientInput.waitFor({ state: "visible" });
    await this.recipientInput.type(mobileNumber, { delay: 100 });

    await this.startChatButton.waitFor({ state: "visible" });
    await this.startChatButton.click();
  }

  async openChatWith(mobileNumber) {
    // latter it will be improve to support click on chat item in the list to open the chat, for now we will use new message flow to open the chat with specific user
    await this.clickCompose();
    await this.startChatWith(mobileNumber);
  }
}
