/**
 * Base Page Object - common methods for all pages
 */
export class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Safely click a locator: try normal click, on failure retry with force.
   */
  async safeClick(locator) {
    try {
      await locator.click();
    } catch (err) {
      try {
        await locator.click({ force: true });
      } catch (e) {
        throw err;
      }
    }
  }

  /**
   * Navigate to a URL
   */
  async goto(url) {
    await this.page.goto(url);
  }

  /**
   * Wait for URL to match pattern
   */
  async waitForURL(pattern, timeout = 5000) {
    await this.page.waitForURL(pattern, { timeout });
  }

  /**
   * Wait for timeout (ms)
   */
  async wait(ms) {
    await this.page.waitForTimeout(ms);
  }
}
