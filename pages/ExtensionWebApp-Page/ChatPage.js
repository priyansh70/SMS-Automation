// pages/ChatPage.js

export default class ChatPage {
  constructor(page) {
    this.page = page;

    // Message input box (textarea or contenteditable div)
    this.messageInput = page.locator(
      "div.editable.form-control.rounded-2.overflow-y-auto.text-dark.bg-gray.pe-13.custom-scrollbar:visible",
    );

    // Send button
    this.sendButton = page.locator("//button[@type='submit']");
  }

  async waitForLoad() {
    await this.messageInput.waitFor({ state: "visible"});
  }

  async sendMessage(text) {
    await this.messageInput.waitFor({ state: "visible" });
    await this.messageInput.click();
    await this.messageInput.type(text, {delay: 100});
    await this.sendButton.click();
  }

  async isMessageVisible(messageText) {
    return this.page
      .locator(`text=${messageText}`)
      .first()
      .isVisible()
      .catch(() => false);
  }
}
