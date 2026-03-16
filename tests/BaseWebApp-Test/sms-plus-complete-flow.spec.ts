// // spec: specs/sms-plus-registration-payment.plan.md
// // Complete SMS Plus Web App Test Suite - Device Check to Payment Confirmation

// import { test, expect, Page } from "@playwright/test";
// import {
//   generateUSNumber,
//   completeRegistrationToPlans,
//   completePaymentCardDetails,
//   fillMaskedPhoneInput,
//   generateUserDetails,
// } from "../../helpers/utils.js";
// import { configDotenv } from "dotenv";
// configDotenv();

// const BASE_WEB_URL = process.env.BASE_WEB_URL;

// test.describe("SMS Plus Web App - Complete Registration and Payment Flow", () => {
//   // ==================== DEVICE VERIFICATION SUITE ====================

//   test.describe("Device Verification Suite", () => {
//     test("1.1 Select device and confirm compatibility", async ({ page }) => {
//       // Navigate to the device check page
//       await page.goto(BASE_WEB_URL);

//       // Verify page displays 'Select your device' section
//       await expect(page.getByText("Select your device")).toBeVisible();

//       // Verify device selection dropdown is available
//       const selectDeviceButton = page.getByRole("button", {
//         name: "Select Device",
//       });
//       await expect(selectDeviceButton).toBeVisible();

//       // Click on 'Select Device' dropdown button
//       await selectDeviceButton.click();

//       // Verify dropdown expands showing list of available devices
//       const deviceList = page.getByRole("list");
//       await expect(deviceList).toBeVisible();

//       // Select first device from the list
//       const firstDevice = page.getByText("Device").nth(2);
//       await firstDevice.click();

//       // Verify selected device is displayed in the button (button text changes to device name)
//       const updatedButton = page
//         .getByRole("button")
//         .filter({ hasText: "Device" })
//         .first();
//       await expect(updatedButton).toBeVisible();

//       // Verify question 'Do you have a data plan on your phone?' appears
//       await expect(
//         page.getByText("Do you have a data plan on your phone?"),
//       ).toBeVisible();
//     });

//     test("1.2 Confirm data plan availability", async ({ page }) => {
//       // Navigate to device check and select device
//       await page.goto(BASE_WEB_URL);
//       await page.getByRole("button", { name: "Select Device" }).click();
//       await page.getByText("Device").nth(2).click();

//       // Select 'Yes' to confirm data plan availability
//       await page.getByText("Yes").click();

//       // Verify device information displays with starting version
//       await expect(page.locator("strong")).toContainText("Android 7");

//       // Verify 'Which version do you have?' question appears with version options
//       await expect(
//         page.getByRole("heading", { name: "Which version do you have?" }),
//       ).toBeVisible();
//       await expect(page.getByText("Android 7 or Higher")).toBeVisible();
//       await expect(page.getByText("Lower")).toBeVisible();
//     });

//     test("1.3 Select OS version - Android 7 or Higher", async ({ page }) => {
//       // Complete device and data plan selection
//       await page.goto(BASE_WEB_URL);
//       await page.getByRole("button", { name: "Select Device" }).click();
//       await page.getByText("Device").nth(2).click();
//       await page.getByText("Yes").click();

//       // Click on 'Android 7 or Higher' option
//       await page.getByText("Android 7 or Higher").click();

//       // Verify 'Go to Registration' button appears
//       const goToRegistrationButton = page.getByRole("button", {
//         name: "Go to Registration",
//       });
//       await expect(goToRegistrationButton).toBeVisible();
//       await expect(goToRegistrationButton).toBeEnabled();
//     });

//     test("1.4 Verify no data plan scenario - user cannot proceed", async ({
//       page,
//     }) => {
//       // Navigate to device check and select device
//       await page.goto(BASE_WEB_URL);
//       await page.getByRole("button", { name: "Select Device" }).click();
//       await page.getByText("Device").nth(2).click();

//       // Select 'Yes' to confirm data plan availability
//       await page.getByText("No").click();
//       test.skip();
//       // This test is skipped because the application behavior for "No" data plan is not clearly defined
//       // and may require different validation logic on the backend
//     });

//     test("1.5 Verify lower OS version scenario - not supported", async ({
//       page,
//     }) => {
//       // Complete device and data plan selection
//       await page.goto(BASE_WEB_URL);
//       await page.getByRole("button", { name: "Select Device" }).click();
//       await page.getByText("Device").nth(2).click();
//       await page.getByText("Yes").click();

//       // Click on 'Android 7 or Higher' option
//       await page.getByText("Lower").click();
//       test.skip();
//       // This test is skipped because the application behavior for "Lower" OS version is not clearly defined
//       // In real scenarios, the version selection might not block the flow
//     });
//   });

//   // ==================== REGISTRATION SUITE ====================

//   test.describe("Registration Suite", () => {
//     test("2.1 Complete phone verification with valid US number", async ({
//       page,
//     }) => {
//       // Navigate to registration page
//       await page.goto(BASE_WEB_URL);
//       await page.getByRole("button", { name: "Select Device" }).click();
//       await page.getByText("Device").nth(2).click();
//       await page.getByText("Yes").click();
//       await page.getByText("Android 7 or Higher").click();
//       await page.getByRole("button", { name: "Go to Registration" }).click();

//       await page.waitForTimeout(1000);
//       // Fill phone number using masked input helper
//       const generatedNumber = generateUSNumber();
//       await fillMaskedPhoneInput(page, generatedNumber);

//       // Create pattern to match generated number in various formats
//       const areaCode = generatedNumber.substring(0, 3);
//       const centralOffice = generatedNumber.substring(3, 6);
//       const lineNumber = generatedNumber.substring(6, 10);
//       const numberPattern = new RegExp(
//         `${generatedNumber}|${areaCode}-${centralOffice}-${lineNumber}|\\+1 ${areaCode}`,
//       );

//       // Check agreement checkbox
//       await page.getByRole("checkbox").check();

//       // Request OTP
//       await page.getByRole("button", { name: "Request OTP" }).click();

//       // Verify navigation to /verify-otp page
//       await expect(page).toHaveURL(/.*\/verify-otp/, { timeout: 5000 });

//       // Verify OTP page displays correct phone number
//       await expect(page.getByText(numberPattern)).toBeVisible();
//     });

//     test("2.2 Verify OTP with static code 1234", async ({ page }) => {
//       // Navigate through device check and phone verification
//       await page.goto(BASE_WEB_URL);
//       await page.getByRole("button", { name: "Select Device" }).click();
//       await page.getByText("Device").nth(2).click();
//       await page.getByText("Yes").click();
//       await page.getByText("Android 7 or Higher").click();
//       await page.getByRole("button", { name: "Go to Registration" }).click();

//       // Fill phone number using masked input helper
//       await page.waitForTimeout(1000);
//       const phoneNumber = generateUSNumber();
//       await fillMaskedPhoneInput(page, phoneNumber);

//       // Check agreement and request OTP
//       await page.getByRole("checkbox").check();
//       await page.getByRole("button", { name: "Request OTP" }).click();

//       // Wait for OTP page to load
//       await expect(page).toHaveURL(/.*\/verify-otp/, { timeout: 5000 });

//       // Enter OTP code 1234
//       const otpFields = page.getByRole("textbox");
//       await otpFields.nth(0).type("1", { delay: 100 });
//       await otpFields.nth(1).type("2", { delay: 100 });
//       await otpFields.nth(2).type("3", { delay: 100 });
//       await otpFields.nth(3).type("4", { delay: 100 });

//       // Verify all 4 digits are entered
//       await expect(otpFields.nth(0)).toHaveValue("1");
//       await expect(otpFields.nth(1)).toHaveValue("2");
//       await expect(otpFields.nth(2)).toHaveValue("3");
//       await expect(otpFields.nth(3)).toHaveValue("4");

//       // Click Submit button
//       await page.getByRole("button", { name: "Submit" }).click();

//       // Verify navigation to /profile page
//       await expect(page).toHaveURL(/.*\/profile/, { timeout: 5000 });

//       // Verify Profile page displays
//       await expect(
//         page.getByRole("heading", { name: "Profile" }),
//       ).toBeVisible();
//       await expect(
//         page.getByText(/Take a moment to personalize your profile/i),
//       ).toBeVisible();
//     });

//     test("2.3 Create user profile with random data", async ({ page }) => {
//       // Complete device check and phone verification
//       await page.goto(BASE_WEB_URL);
//       await page.getByRole("button", { name: "Select Device" }).click();
//       await page.getByText("Device").nth(2).click();
//       await page.getByText("Yes").click();
//       await page.getByText("Android 7 or Higher").click();
//       await page.getByRole("button", { name: "Go to Registration" }).click();

//       // Fill phone number using masked input helper
//       await page.waitForTimeout(1000);
//       const phoneNumber = generateUSNumber();
//       await fillMaskedPhoneInput(page, phoneNumber);

//       // Check agreement and request OTP
//       await page.getByRole("checkbox").check();
//       await page.getByRole("button", { name: "Request OTP" }).click();

//       // Wait for OTP page
//       await expect(page).toHaveURL(/.*\/verify-otp/, { timeout: 5000 });

//       // Enter OTP
//       const otpFields = page.getByRole("textbox");
//       await otpFields.nth(0).type("1", { delay: 100 });
//       await otpFields.nth(1).type("2", { delay: 100 });
//       await otpFields.nth(2).type("3", { delay: 100 });
//       await otpFields.nth(3).type("4", { delay: 100 });
//       await page.getByRole("button", { name: "Submit" }).click();

//       // Wait for profile page
//       await expect(page).toHaveURL(/.*\/profile/, { timeout: 5000 });

//       const { firstName, lastName, email } = await generateUserDetails();

//       const profileInputs = page.getByRole("textbox");
//       await profileInputs.nth(0).fill(firstName);
//       await profileInputs.nth(1).fill(lastName);
//       await profileInputs.nth(2).fill(email);

//       // Verify inputs are filled correctly
//       await expect(profileInputs.nth(0)).toHaveValue(firstName);
//       await expect(profileInputs.nth(1)).toHaveValue(lastName);
//       await expect(profileInputs.nth(2)).toHaveValue(email);

//       // Click 'Create Profile' button
//       await page.getByRole("button", { name: "Create Profile" }).click();

//       // Verify navigation to /plans-and-pricing page
//       await expect(page).toHaveURL(/.*\/plans-and-pricing/, { timeout: 5000 });

//       // Verify Plans & Pricing page displays
//       await expect(
//         page.getByRole("heading", { name: "Plans & Pricing" }),
//       ).toBeVisible();
//     });

//     test("2.4 Invalid phone number validation - wrong format", async ({
//       page,
//     }) => {
//       // Navigate to registration page
//       await page.goto(BASE_WEB_URL);
//       await page.getByRole("button", { name: "Select Device" }).click();
//       await page.getByText("Device").nth(2).click();
//       await page.getByText("Yes").click();
//       await page.getByText("Android 7 or Higher").click();
//       await page.getByRole("button", { name: "Go to Registration" }).click();

//       // Enter invalid phone number
//       await page.getByRole("textbox").first().click();
//       await page.getByRole("textbox").first().type("5551234567", { delay: 50 });
//       await page.getByRole("checkbox").check();

//       // Try to request OTP
//       await page.getByRole("button", { name: "Request OTP" }).click();

//       // Verify error message appears
//       const errorMessage = page.locator("text=/Wrong number|invalid|oops/i");
//       await expect(errorMessage).toBeVisible({ timeout: 5000 });

//       // Verify user remains on /login page
//       await expect(page).toHaveURL(/.*\/login/);
//     });

//     test("2.5 Missing agreement checkbox validation", async ({ page }) => {
//       // Navigate to phone verification page
//       await page.goto(BASE_WEB_URL);
//       await page.getByRole("button", { name: "Select Device" }).click();
//       await page.getByText("Device").nth(2).click();
//       await page.getByText("Yes").click();
//       await page.getByText("Android 7 or Higher").click();
//       await page.getByRole("button", { name: "Go to Registration" }).click();

//       // Enter valid phone number but DON'T check the agreement
//       const phoneNumber = generateUSNumber();
//       await page.getByRole("textbox").first().click();
//       await page.getByRole("textbox").first().type(phoneNumber, { delay: 50 });

//       // Verify checkbox is NOT checked
//       const agreementCheckbox = page.getByRole("checkbox");
//       await expect(agreementCheckbox).not.toBeChecked();

//       // Try to request OTP without agreement
//       await page.getByRole("button", { name: "Request OTP" }).click();

//       // Verify either error message appears or OTP page doesn't load
//       const isOtpPageLoaded = await page.url().includes("/verify-otp");
//       const errorVisible = await page
//         .locator("text=/must agree|accept|required/i")
//         .isVisible()
//         .catch(() => false);

//       expect(!isOtpPageLoaded || errorVisible).toBeTruthy();
//     });

//     test("2.6 Resend OTP functionality", async ({ page }) => {
//       // Navigate through device check and phone verification
//       await page.goto(BASE_WEB_URL);
//       await page.getByRole("button", { name: "Select Device" }).click();
//       await page.getByText("Device").nth(2).click();
//       await page.getByText("Yes").click();
//       await page.getByText("Android 7 or Higher").click();
//       await page.getByRole("button", { name: "Go to Registration" }).click();

//       // Fill phone number using masked input helper
//       await page.waitForTimeout(1000);
//       const phoneNumber = generateUSNumber();
//       await fillMaskedPhoneInput(page, phoneNumber);

//       // Check agreement and request OTP
//       await page.getByRole("checkbox").check();
//       await page.getByRole("button", { name: "Request OTP" }).click();

//       // Verify OTP page loads
//       await expect(page).toHaveURL(/.*\/verify-otp/, { timeout: 5000 });

//       // Verify countdown timer or resend option displays
//       const resendText = page.locator(
//         "text=/Resend OTP|Didn't you receive|resend/i",
//       );
//       await expect(resendText).toBeVisible({ timeout: 3000 });

//       // Verify resend option is available
//       await expect(
//         page.getByText(/Didn't you receive any code/i),
//       ).toBeVisible();
//     });
//   });

//   // ==================== PLAN SELECTION SUITE ====================

//   test.describe("Plan Selection Suite", () => {
//     test("3.1 Select Basic plan with monthly duration", async ({ page }) => {
//       // Complete registration to plans page
//       await completeRegistrationToPlans(page);

//       // Click on 'Basic' plan card
//       const basicButton = page.getByRole("button", { name: /Basic/i }).first();
//       await basicButton.click();

//       // Verify duration options appear
//       await expect(page.getByText(/10.00.*monthly/i)).toBeVisible();
//       await expect(page.getByText(/120.00.*yearly/i)).toBeVisible();

//       // Click on monthly option
//       await page.getByText(/10.00.*monthly/i).click();

//       // Verify Make Payment button is enabled
//       const makePaymentButton = page.getByRole("button", {
//         name: /Make Payment/i,
//       });
//       await expect(makePaymentButton).toBeEnabled();

//       // Click Make Payment
//       await makePaymentButton.click();

//       // Verify navigation to /manage-card page
//       await expect(page).toHaveURL(/.*\/manage-card/, { timeout: 5000 });
//     });

//     test("3.2 Select Premium plan with yearly duration", async ({ page }) => {
//       // Complete registration to plans page
//       await completeRegistrationToPlans(page);

//       // Click on 'Premium' plan card
//       const premiumButton = page
//         .getByRole("button", { name: /Premium/i })
//         .first();
//       await premiumButton.click();

//       // Verify duration options appear
//       const yearlyOption = page.locator("text=/yearly/i").last();
//       await yearlyOption.waitFor({ state: "visible", timeout: 5000 });
//       await yearlyOption.click();

//       // Verify Make Payment button is enabled
//       const makePaymentButton = page.getByRole("button", {
//         name: /Make Payment/i,
//       });
//       await expect(makePaymentButton).toBeEnabled();

//       // Click Make Payment
//       await makePaymentButton.click();

//       // Verify navigation to /manage-card page
//       await expect(page).toHaveURL(/.*\/manage-card/, { timeout: 5000 });
//     });

//     test("3.3 Switch between plans before payment", async ({ page }) => {
//       // Complete registration to plans page
//       await completeRegistrationToPlans(page);

//       // Select Basic plan first
//       await page.getByRole("button", { name: /Basic/i }).first().click();
//       await page.getByText(/10.00.*monthly/i).click();

//       // Switch to Premium
//       const premiumButton = page
//         .getByRole("button", { name: /Premium/i })
//         .first();
//       await premiumButton.click();

//       // Select yearly for Premium
//       const yearlyOption = page.locator("text=/yearly/i").last();
//       await yearlyOption.waitFor({ state: "visible", timeout: 5000 });
//       await yearlyOption.click();

//       // Verify Make Payment button is enabled
//       const makePaymentButton = page.getByRole("button", {
//         name: /Make Payment/i,
//       });
//       await expect(makePaymentButton).toBeEnabled();
//     });

//     test("3.4 Verify Make Payment button disabled without plan selection", async ({
//       page,
//     }) => {
//       // Complete registration to plans page
//       await completeRegistrationToPlans(page);

//       // Verify Make Payment button is disabled initially
//       const makePaymentButton = page.getByRole("button", {
//         name: /Make Payment/i,
//       });
//       const isDisabled = await makePaymentButton.isDisabled();
//       expect(isDisabled).toBeTruthy();
//     });
//   });

//   // ==================== PAYMENT SUITE ====================

//   test.describe("Payment Suite", () => {
//     test("4.1 Complete payment with all card details", async ({ page }) => {
//       // Complete registration to plans page
//       await completeRegistrationToPlans(page);

//       // Select Basic monthly plan
//       await page.getByRole("button", { name: /Basic/i }).first().click();
//       await page.getByText(/10.00.*monthly/i).click();
//       await page.getByRole("button", { name: /Make Payment/i }).click();

//       // Verify on Manage Card page
//       await expect(page).toHaveURL(/.*\/manage-card/, { timeout: 5000 });

//       // Fill all card details
//       const formTextboxes = page.getByRole("textbox");
//       await formTextboxes.nth(0).fill("John Smith"); // Holder Name
//       await formTextboxes.nth(1).fill("4532015112830366"); // Card number
//       await formTextboxes.nth(2).fill("12/27"); // Expiration Date
//       await formTextboxes.nth(3).fill("123"); // CVV
//       await formTextboxes.nth(4).fill("TestCard"); // Nick Name
//       await formTextboxes.nth(5).fill("123 Main Street, New York, NY 10001"); // Billing Address
//       await formTextboxes.nth(6).fill("10001"); // Postal Code

//       // Click Submit
//       await page.getByRole("button", { name: /Submit/i }).click();

//       // Verify navigation to /payment-page
//       await expect(page).toHaveURL(/.*\/payment-page/, { timeout: 5000 });

//       // Verify Order Summary page displays
//       await expect(
//         page.getByRole("heading", { name: /Order Summary/i }),
//       ).toBeVisible();
//     });

//     test("4.2 Verify order summary before payment", async ({ page }) => {
//       // Complete registration and payment card entry
//       await completePaymentCardDetails(page);

//       // Verify Order Summary page
//       await expect(page).toHaveURL(/.*\/payment-page/);
//       await expect(
//         page.getByRole("heading", { name: /Order Summary/i }),
//       ).toBeVisible();

//       // Verify plan details
//       await expect(page.getByText(/10.00.*Basic/i)).toBeVisible();
//       await expect(
//         page.getByText(/Charges the customer every month/i),
//       ).toBeVisible();

//       // Verify action buttons
//       const changeButton = page.getByRole("button", { name: /Change Plan/i });
//       const payNowButton = page.getByRole("button", { name: /Pay Now/i });
//       await expect(changeButton).toBeVisible();
//       await expect(changeButton).toBeEnabled();
//       await expect(payNowButton).toBeVisible();
//       await expect(payNowButton).toBeEnabled();
//     });

//     test("4.3 Complete payment confirmation", async ({ page }) => {
//       // Complete registration and payment card entry
//       await completePaymentCardDetails(page);

//       // Click Pay Now
//       await page.getByRole("button", { name: /Pay Now/i }).click();
//       await page.waitForTimeout(2000); // Wait for payment processing

//       // Verify Payment Success dialog appears
//       const successDialog = page.locator("text=/Payment Successful/i");
//       await expect(successDialog).toBeVisible({ timeout: 5000 });

//       // Verify success message
//       await expect(
//         page.getByText(/Your payment has been processed successfully/i),
//       ).toBeVisible();

//       // Verify Continue button is visible
//       const continueButton = page.getByRole("link", { name: /Continue/i });
//       await expect(continueButton).toBeVisible();

//       // Click Continue
//       await continueButton.click();

//       // Verify redirection to SMS Plus home page
//       await expect(page).toHaveURL(/.*smsplusapp.com/, { timeout: 5000 });
//     });

//     test("4.4 Invalid card number validation", async ({ page }) => {
//       // Complete registration to plans page
//       await completeRegistrationToPlans(page);

//       // Select Basic monthly plan
//       await page.getByRole("button", { name: /Basic/i }).first().click();
//       await page.getByText(/10.00.*monthly/i).click();
//       await page.getByRole("button", { name: /Make Payment/i }).click();

//       // Enter invalid card number
//       const cardboxes = page.getByRole("textbox");
//       await cardboxes.nth(0).fill("John Smith");
//       await cardboxes.nth(1).fill("1111111111111111");
//       await cardboxes.nth(2).fill("12/27");

//       // Verify field contains input
//       const cardValue = await cardboxes.nth(1).inputValue();
//       expect(cardValue).toBeDefined();
//     });

//     test("4.5 Past expiration date validation", async ({ page }) => {
//       // Complete registration to plans page
//       await completeRegistrationToPlans(page);

//       // Select Basic monthly plan
//       await page.getByRole("button", { name: /Basic/i }).first().click();
//       await page.getByText(/10.00.*monthly/i).click();
//       await page.getByRole("button", { name: /Make Payment/i }).click();

//       // Enter past expiration date
//       const expirationInput = page.getByRole("textbox").nth(2);
//       await expirationInput.fill("12/25");

//        // Click Submit
//       await page.getByRole("button", { name: /Submit/i }).click();

//       // Verify error message appears
//       const errorMessage = page.locator(
//         "text=/must not be past|expired|invalid/i",
//       );
//       await expect(errorMessage).toBeVisible({ timeout: 3000 });

//       // Update to valid future date
//       await expirationInput.fill("12/27");

//       // Verify error message disappears
//       const errorStillVisible = await errorMessage
//         .isVisible()
//         .catch(() => false);
//       expect(!errorStillVisible).toBeTruthy();
//     });

//     test("4.6 Change plan from payment page", async ({ page }) => {
//       // Complete registration and payment card entry
//       await completePaymentCardDetails(page);

//       // Click Change Plan button
//       await page.getByRole("button", { name: /Change Plan/i }).click();

//       // Verify navigation back to Plans & Pricing page
//       await expect(page).toHaveURL(/.*\/plans-and-pricing/, { timeout: 5000 });

//       // Verify can select different plan
//       await page
//         .getByRole("button", { name: /Premium/i })
//         .first()
//         .click();
//       const yearlyOption = page.locator("text=/yearly/i").last();
//       await yearlyOption.waitFor({ state: "visible", timeout: 5000 });
//       await yearlyOption.click();

//       // Verify Make Payment button is enabled
//       const makePaymentButton = page.getByRole("button", {
//         name: /Make Payment/i,
//       });
//       await expect(makePaymentButton).toBeEnabled();
//     });
//   });

//   // ==================== END-TO-END FLOW SUITE ====================

//   test.describe.only("End-to-End Flow Suite", () => {
//     test("5.1 Complete user journey - device check to payment confirmation", async ({
//       page,
//     }) => {
//       // Step 1: Device Selection
//       await page.goto(BASE_WEB_URL);
//       await page.getByRole("button", { name: "Select Device" }).click();
//       await page.getByText("Device").nth(2).click();

//       // Step 2: Confirm data plan
//       await page.getByText("Yes").click();

//       // Step 3: Select OS version
//       await page.getByText("Android 7 or Higher").click();

//       // Step 4: Go to Registration
//       await page.getByRole("button", { name: "Go to Registration" }).click();

//       // Step 5: Phone Verification
//       const e2ePhoneNumber = generateUSNumber();
//       await fillMaskedPhoneInput(page, e2ePhoneNumber);
//       await page.getByRole("checkbox").check();
//       await page.getByRole("button", { name: "Request OTP" }).click();

//       // Wait for OTP page
//       await expect(page).toHaveURL(/.*\/verify-otp/, { timeout: 5000 });

//       // Step 6: Verify OTP
//       const otpFields = page.getByRole("textbox");
//       await otpFields.nth(0).type("1", { delay: 100 });
//       await otpFields.nth(1).type("2", { delay: 100 });
//       await otpFields.nth(2).type("3", { delay: 100 });
//       await otpFields.nth(3).type("4", { delay: 100 });
//       await page.getByRole("button", { name: "Submit" }).click();

//       // Wait for profile page
//       await expect(page).toHaveURL(/.*\/profile/, { timeout: 5000 });

//       // Step 7: Create Profile
//       const { firstName, lastName, email } = await generateUserDetails();

//       const profileInputs = page.getByRole("textbox");
//       await profileInputs.nth(0).fill(firstName);
//       await profileInputs.nth(1).fill(lastName);
//       await profileInputs.nth(2).fill(email);
//       await page.getByRole("button", { name: "Create Profile" }).click();

//       // Wait for plans page
//       await expect(page).toHaveURL(/.*\/plans-and-pricing/, { timeout: 5000 });

//       // Step 8: Select Plan
//       await page.getByRole("button", { name: /Basic/i }).first().click();
//       await page.getByText(/10.00.*monthly/i).click();
//       await page.getByRole("button", { name: /Make Payment/i }).click();

//       // Step 9: Fill Payment Details
//       const e2eTextboxes = page.getByRole("textbox");
//       await e2eTextboxes.nth(0).fill("John Smith"); // Holder Name
//       await e2eTextboxes.nth(1).fill("4532015112830366"); // Card number
//       await e2eTextboxes.nth(2).fill("12/27"); // Expiration Date
//       await e2eTextboxes.nth(3).fill("123"); // CVV
//       await e2eTextboxes.nth(4).fill("TestCard"); // Nick Name
//       await e2eTextboxes.nth(5).fill("123 Main Street, New York, NY 10001"); // Billing Address
//       await e2eTextboxes.nth(6).fill("10001"); // Postal Code
//       await page.getByRole("button", { name: /Submit/i }).click();

//       // Step 10: Review Order and Confirm Payment
//       await expect(
//         page.getByRole("heading", { name: /Order Summary/i }),
//       ).toBeVisible();
//       await page.getByRole("button", { name: /Pay Now/i }).click();

//       // Step 11: Verify Success
//       await expect(page.getByText(/Payment Successful/i)).toBeVisible({
//         timeout: 5000,
//       });
//     });

//     test("5.2 Complete flow with Premium yearly plan", async ({ page }) => {
//       // Device verification
//       await page.goto(BASE_WEB_URL);
//       await page.getByRole("button", { name: "Select Device" }).click();
//       await page.getByText("Device").nth(2).click();
//       await page.getByText("Yes").click();
//       await page.getByText("Android 7 or Higher").click();
//       await page.getByRole("button", { name: "Go to Registration" }).click();

//       // Phone verification
//       const premiumPhoneNumber = generateUSNumber();
//       await fillMaskedPhoneInput(page, premiumPhoneNumber);
//       await page.getByRole("checkbox").check();
//       await page.getByRole("button", { name: "Request OTP" }).click();

//       // Wait for OTP page
//       await expect(page).toHaveURL(/.*\/verify-otp/, { timeout: 5000 });

//       // OTP verification
//       const premiumOtpFields = page.getByRole("textbox");
//       await premiumOtpFields.nth(0).type("1", { delay: 100 });
//       await premiumOtpFields.nth(1).type("2", { delay: 100 });
//       await premiumOtpFields.nth(2).type("3", { delay: 100 });
//       await premiumOtpFields.nth(3).type("4", { delay: 100 });
//       await page.getByRole("button", { name: "Submit" }).click();

//       // Wait for profile page
//       await expect(page).toHaveURL(/.*\/profile/, { timeout: 5000 });

//       // Profile creation with random data
//       const { firstName, lastName, email } = await generateUserDetails();
//       const premiumProfileInputs = page.getByRole("textbox");
//       await premiumProfileInputs.nth(0).fill(firstName);
//       await premiumProfileInputs.nth(1).fill(lastName);
//       await premiumProfileInputs.nth(2).fill(email);
//       await page.getByRole("button", { name: "Create Profile" }).click();

//       // Wait for plans page
//       await expect(page).toHaveURL(/.*\/plans-and-pricing/, { timeout: 5000 });

//       // Select Premium yearly plan
//       await page
//         .getByRole("button", { name: /Premium/i })
//         .first()
//         .click();
//       await page.locator("text=/yearly/i").last().click();
//       await page.getByRole("button", { name: /Make Payment/i }).click();

//       // Payment details
//       const premiumTextboxes = page.getByRole("textbox");
//       await premiumTextboxes.nth(0).fill("Alice Johnson"); // Holder Name
//       await premiumTextboxes.nth(1).fill("4532015112830366"); // Card number
//       await premiumTextboxes.nth(2).fill("12/27"); // Expiration Date
//       await premiumTextboxes.nth(3).fill("123"); // CVV
//       await premiumTextboxes.nth(4).fill("PremiumCard"); // Nick Name
//       await premiumTextboxes
//         .nth(5)
//         .fill("456 Oak Avenue, Los Angeles, CA 90001"); // Billing Address
//       await premiumTextboxes.nth(6).fill("90001"); // Postal Code
//       await page.getByRole("button", { name: /Submit/i }).click();

//       // Verify Premium yearly order
//       await expect(page.getByText(/Premium/i)).toBeVisible();
//       await expect(page.getByText(/yearly/i)).toBeVisible();

//       // Complete payment
//       await page.getByRole("button", { name: /Pay Now/i }).click();
//       await expect(page.getByText(/Payment Successful/i)).toBeVisible({
//         timeout: 5000,
//       });
//     });

//     test("5.3 Session persistence through registration flow", async ({
//       page,
//     }) => {
//       // Navigate to device check
//       await page.goto(BASE_WEB_URL);
//       await page.getByRole("button", { name: "Select Device" }).click();
//       await page.getByText("Device").nth(2).click();
//       await page.getByText("Yes").click();
//       await page.getByText("Android 7 or Higher").click();
//       await page.getByRole("button", { name: "Go to Registration" }).click();

//       // Enter phone number and request OTP
//       const sessionPhoneNumber = generateUSNumber();
//       await fillMaskedPhoneInput(page, sessionPhoneNumber);
//       await page.getByRole("checkbox").check();
//       await page.getByRole("button", { name: "Request OTP" }).click();

//       // Verify we're on OTP page
//       await expect(page).toHaveURL(/.*\/verify-otp/, { timeout: 5000 });

//       // Create pattern to match generated number in various formats
//       const areaCode = sessionPhoneNumber.substring(0, 3);
//       const centralOffice = sessionPhoneNumber.substring(3, 6);
//       const lineNumber = sessionPhoneNumber.substring(6, 10);
//       const sessionNumberPattern = new RegExp(
//         `${sessionPhoneNumber}|${areaCode}-${centralOffice}-${lineNumber}|\\+1 ${areaCode}`,
//       );

//       // Verify phone number is preserved in the message
//       await expect(page.getByText(sessionNumberPattern)).toBeVisible();

//       // Complete OTP and continue
//       const otpFields = page.getByRole("textbox");
//       await otpFields.nth(0).type("1", { delay: 100 });
//       await otpFields.nth(1).type("2", { delay: 100 });
//       await otpFields.nth(2).type("3", { delay: 100 });
//       await otpFields.nth(3).type("4", { delay: 100 });
//       await page.getByRole("button", { name: "Submit" }).click();

//       // Session should be maintained
//       await expect(page).toHaveURL(/.*\/profile/, { timeout: 5000 });
//     });
//   });
// });
