import { Page, expect } from "@playwright/test";
import { PhoneNumberUtil } from "google-libphonenumber";
import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";
import { configDotenv } from "dotenv";
configDotenv();

const BASE_WEB_URL = process.env.BASE_WEB_URL;
// ==================== HELPER FUNCTIONS ====================

export function logPurchase(customerName, planName, billingCycle) {
  const logPath = path.join(process.cwd(), "data", "purchases.log");
  const entry = `${new Date().toISOString()},${customerName},${planName},${billingCycle}\n`;
  // ensure directory exists
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.appendFileSync(logPath, entry, "utf8");
}

export function generateUSNumber() {
  const phoneUtil = PhoneNumberUtil.getInstance();
  function randomDigit(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  while (true) {
    // Area Code: first digit 2–9
    const areaCode =
      randomDigit(2, 9).toString() + randomDigit(0, 9) + randomDigit(0, 9);

    // Avoid N11 (211, 311, etc.)
    if (areaCode[1] === "1" && areaCode[2] === "1") continue;

    // Central Office Code: first digit 2–9
    const centralOffice =
      randomDigit(2, 9).toString() + randomDigit(0, 9) + randomDigit(0, 9);

    // Avoid N11 + generic 555
    if (
      (centralOffice[1] === "1" && centralOffice[2] === "1") ||
      centralOffice === "555"
    )
      continue;

    const lineNumber = randomDigit(0, 9999).toString().padStart(4, "0");

    const nationalNumber = `${areaCode}${centralOffice}${lineNumber}`;

    try {
      const parsed = phoneUtil.parse(nationalNumber, "US");

      if (
        phoneUtil.isValidNumber(parsed) &&
        phoneUtil.getRegionCodeForNumber(parsed) === "US"
      ) {
        return nationalNumber; // 🔥 Only 10 digits returned
      }
    } catch (e) {
      // retry
    }
  }
}

export async function completePaymentCardDetails(page) {
  // Navigate to plans page
  const user = await completeRegistrationToPlans(page);

  // Select Basic monthly plan
  await page.getByRole("button", { name: /Basic/i }).first().click();
  await page.getByText(/10.00.*monthly/i).click();
  await page.getByRole("button", { name: /Make Payment/i }).click();

  // Fill card details
  const textboxes = page.getByRole("textbox");
  await textboxes.nth(0).fill("John Smith"); // Holder Name
  await textboxes.nth(1).fill("4532015112830366", { delay: 20 }); // Card number
  await textboxes.nth(2).fill("12/27"); // Expiration Date
  await textboxes.nth(3).fill("123"); // CVV
  await textboxes.nth(4).fill("TestCard"); // Nick Name
  await textboxes.nth(5).fill("123 Main Street, New York, NY 10001"); // Billing Address
  await textboxes.nth(6).fill("10001"); // Postal Code
  await page.getByRole("button", { name: /Submit/i }).click();

  // Wait for payment page
  await expect(page).toHaveURL(/.*\/payment-page/, { timeout: 5000 });

  // log the purchase since this helper also executes a Basic monthly purchase
  logPurchase(`${user.firstName} ${user.lastName}`, "Basic", "monthly");
}

export async function completeRegistrationToPlans(page) {
  // Navigate through device verification
  await page.goto(BASE_WEB_URL);
  await page.getByRole("button", { name: "Select Device" }).click();
  await page.getByText("Device").nth(2).click();
  await page.getByText("Yes").click();
  await page.getByText("Android 7 or Higher").click();
  await page.getByRole("button", { name: "Go to Registration" }).click();

  // Phone verification
  await page.waitForTimeout(1000); // Wait for phone input to be ready
  const phoneNumber = generateUSNumber();
  await fillMaskedPhoneInput(page, phoneNumber);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Request OTP" }).click();

  // Wait for OTP page
  await expect(page).toHaveURL(/.*\/verify-otp/, { timeout: 5000 });

  // OTP verification with code 1234
  const otpFields = page.getByRole("textbox");
  await otpFields.nth(0).type("1", { delay: 100 });
  await otpFields.nth(1).type("2", { delay: 100 });
  await otpFields.nth(2).type("3", { delay: 100 });
  await otpFields.nth(3).type("4", { delay: 100 });
  await page.getByRole("button", { name: "Submit" }).click();

  // Profile creation with random data
  const { firstName, lastName, email } = await generateUserDetails();
  await page.waitForTimeout(2000); // Wait for profile inputs to be ready
  console.log(`Generated user details: ${firstName} ${lastName}, ${email}`);

  const profileInputs = page.getByRole("textbox");
  await profileInputs.nth(0).fill(firstName);
  await profileInputs.nth(1).fill(lastName);
  await profileInputs.nth(2).fill(email);

  await page.waitForTimeout(1000); // Wait for inputs to be processed
  await page.getByRole("button", { name: "Create Profile" }).click();

  // Wait for plans page
  await expect(page).toHaveURL(/.*\/plans-and-pricing/, { timeout: 5000 });

  // return the generated user details for further processing/logging
  return { firstName, lastName, email };
}

export async function fillMaskedPhoneInput(page, phoneNumber) {
  await page.waitForTimeout(1000); // Ensure input is ready
  const phoneInput = page.getByPlaceholder("718-123-4567");
  await phoneInput.click();
  await phoneInput.clear();

  // Type each digit with delay to allow auto-formatting
  for (const digit of phoneNumber) {
    await phoneInput.type(digit, { delay: 50 });
  }

  // Additional wait for auto-formatting to complete
  await page.waitForTimeout(3000);
}

export async function generateUserDetails() {
  // Fill profile details with random data
  // const firstName = faker.person.firstName();
  const firstName = "Automation";
  const lastName = faker.person.lastName();
  const email =
    firstName +
    "." +
    lastName +
    Math.floor(Math.random() * 10000) +
    "@yopmail.com";
  return { firstName, lastName, email };
}

export function genereteAdminDetails() {
  const password = "Error@123"

  const adminDetails = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password,
    confirmPassword: password,
  };

  return adminDetails;
}
