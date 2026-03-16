import { test, expect, Browser, BrowserContext, Page } from "@playwright/test";
import LoginPage from "../../pages/ExtensionWebApp-Page/LoginPage";
import ChatsPage from "../../pages/ExtensionWebApp-Page/ChatsPage";
import ChatPage from "../../pages/ExtensionWebApp-Page/ChatPage";
import { configDotenv } from "dotenv";
import { faker } from "@faker-js/faker";
configDotenv();

// ─── Test data ──────────────────────────────────────────────────────────────
const USER_X_PHONE = process.env.USER_X_PHONE;
const USER_Y_PHONE = process.env.USER_Y_PHONE;
const OTP = process.env.OTP;
const MSG_FROM_X = faker.lorem.sentence({ min: 5, max: 10 }) + " [from User X]";
const MSG_FROM_Y = faker.lorem.sentence({ min: 5, max: 10 }) + " [from User Y]";
const EXTENSION_WEB_URL = process.env.EXTENSION_WEB_URL;
// ────────────────────────────────────────────────────────────────────────────

test.describe("Multi-User Chat Suite", () => {
  test("1.1 Send and receive messages between two users", async ({
    browser,
  }: {
    browser: Browser;
  }) => {
    // ── Create two isolated browser contexts ─────────────────────────────────
    const contextX: BrowserContext = await browser.newContext({
      recordVideo: { dir: "test-results/" },
    });
    const contextY: BrowserContext = await browser.newContext({
      recordVideo: { dir: "test-results/" },
    });

    const pageX: Page = await contextX.newPage();
    const pageY: Page = await contextY.newPage();

    // ── Instantiate page objects ─────────────────────────────────────────────
    const loginX = new LoginPage(pageX);
    const loginY = new LoginPage(pageY);

    const chatsX = new ChatsPage(pageX);
    const chatsY = new ChatsPage(pageY);

    const chatX = new ChatPage(pageX);
    const chatY = new ChatPage(pageY);

    try {
      // ── Step 1 & 2: User X — navigate and log in ───────────────────────────
      await test.step("User X: Navigate to login page", async () => {
        await loginX.goto(EXTENSION_WEB_URL);
        await expect(pageX).toHaveURL(/smsplusextensionapp/);
      });

      await test.step("User X: Log in", async () => {
        await loginX.login(USER_X_PHONE, OTP);
        // Confirm redirect away from login
        await expect(pageX).toHaveURL(/chats/i);
      });

      // ── Step 3: User Y — navigate and log in ───────────────────────────────
      await test.step("User Y: Navigate to login page", async () => {
        await loginY.goto(EXTENSION_WEB_URL);
        await expect(pageY).toHaveURL(/smsplusextensionapp/);
      });

      await test.step("User Y: Log in", async () => {
        await loginY.login(USER_Y_PHONE, OTP);
        await expect(pageY).toHaveURL(/chats/i);
      });

      // ── Step 4: User X creates chat with User Y and sends message ─────────────
      await test.step("User X: Create chat with User Y and send message", async () => {
        await chatsX.clickCompose();
        await chatsX.startChatWith(USER_Y_PHONE);
        await chatX.waitForLoad();

        await chatX.sendMessage(MSG_FROM_X);

        // Verify message appears on User X side
        await pageX
          .getByText(MSG_FROM_X)
          .first()
          .waitFor({ state: "visible", timeout: 15000 });
        await expect(pageX.getByText(MSG_FROM_X).first()).toBeVisible();
      });

      // ── Step 5: User Y receives message from User X ──────────────────────────
      await test.step("User Y: Wait for message from User X", async () => {
        await chatsY.openChatWith(USER_X_PHONE);
        await pageY.waitForTimeout(20000); // Small wait to ensure chat is fully loaded
        await pageY.reload(); // Reload to ensure latest messages are fetched
        await pageY
          .getByText(MSG_FROM_X)
          .first()
          .waitFor({ state: "visible", timeout: 45000 });

        await expect(pageY.getByText(MSG_FROM_X).first()).toBeVisible();
      });

      // ── Step 6: User Y replies to User X ─────────────────────────────────────
      await test.step("User Y: Reply to User X", async () => {
        await chatY.sendMessage(MSG_FROM_Y);

        // Verify message on User Y side
        await pageY
          .getByText(MSG_FROM_Y)
          .first()
          .waitFor({ state: "visible", timeout: 15000 });
        await expect(pageY.getByText(MSG_FROM_Y).first()).toBeVisible();
      });
      ``;
      // ── Step 7: User X receives reply from User Y ────────────────────────────
      await test.step("User X: Wait for reply from User Y", async () => {
        await pageY.waitForTimeout(20000); // Small wait to ensure chat is fully loaded
        await pageY.reload(); // Reload to ensure latest messages are fetched
        await pageX
          .getByText(MSG_FROM_Y)
          .first()
          .waitFor({ state: "visible", timeout: 45000 });

        await expect(pageX.getByText(MSG_FROM_Y).first()).toBeVisible();
      });
    } finally {
      // Always clean up contexts, even on failure
      await contextX.close();
      await contextY.close();
    }
  });
});
