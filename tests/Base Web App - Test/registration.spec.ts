// spec: specs/sms-plus-registration-payment.plan.md
// Registration Suite (extracted)

import { test, expect } from "@playwright/test";
import { generateUSNumber, generateUserDetails } from "../../helpers/utils.js";
import { DevicePage } from "../../pages/Base Web App - Page/DevicePage.js";
import { RegistrationPage } from "../../pages/Base Web App - Page/RegistrationPage.js";
import { ProfilePage } from "../../pages/Base Web App - Page/ProfilePage.js";
import { PlansPage } from "../../pages/Base Web App - Page/PlansPage.js";

test.describe("Registration Suite", () => {
  test("2.1 Complete phone verification with valid US number", async ({
    page,
  }) => {
    const devicePage = new DevicePage(page);
    await devicePage.goto("https://smspluswebapp.evdpl.com/check");
    await devicePage.completeDeviceCheck();

    const registrationPage = new RegistrationPage(page);
    const generatedNumber = generateUSNumber();
    await registrationPage.enterPhoneNumber(generatedNumber);

    const areaCode = generatedNumber.substring(0, 3);
    const centralOffice = generatedNumber.substring(3, 6);
    const lineNumber = generatedNumber.substring(6, 10);
    const numberPattern = new RegExp(
      `${generatedNumber}|${areaCode}-${centralOffice}-${lineNumber}|\\+1 ${areaCode}`
    );

    await registrationPage.checkAgreement();
    await registrationPage.requestOTP();
    await registrationPage.verifyPhoneDisplayed(numberPattern);
  });

  test("2.2 Verify OTP with static code 1234", async ({ page }) => {
    const devicePage = new DevicePage(page);
    await devicePage.goto("https://smspluswebapp.evdpl.com/check");
    await devicePage.completeDeviceCheck();

    const registrationPage = new RegistrationPage(page);
    const phoneNumber = generateUSNumber();
    await registrationPage.completePhoneVerification(phoneNumber);

    const profilePage = new ProfilePage(page);
    await profilePage.verifyProfilePageLoads();
    await expect(profilePage.getPageHeading()).toBeVisible();
  });

  test("2.3 Create user profile with random data", async ({ page }) => {
    const devicePage = new DevicePage(page);
    await devicePage.goto("https://smspluswebapp.evdpl.com/check");
    await devicePage.completeDeviceCheck();

    const registrationPage = new RegistrationPage(page);
    const phoneNumber = generateUSNumber();
    await registrationPage.completePhoneVerification(phoneNumber);

    const profilePage = new ProfilePage(page);
    const { firstName, lastName, email } = await generateUserDetails();
    await profilePage.createProfile(firstName, lastName, email);

    const plansPage = new PlansPage(page);
    await plansPage.verifyPlansPageLoads();
  });

  test("2.4 Invalid phone number validation - wrong format", async ({
    page,
  }) => {
    const devicePage = new DevicePage(page);
    await devicePage.goto("https://smspluswebapp.evdpl.com/check");
    await devicePage.completeDeviceCheck();

    const registrationPage = new RegistrationPage(page);
    await registrationPage.getPhoneInput().click();
    await registrationPage.getPhoneInput().type("5551234567", { delay: 50 });
    await registrationPage.checkAgreement();
    
    // Click button without expecting navigation (validation should fail)
    await registrationPage.getRequestOTPButton().click();
    
    // Wait for error message instead of navigation
    await expect(registrationPage.getErrorMessage()).toBeVisible({
      timeout: 5000,
    });
  });

  test("2.5 Missing agreement checkbox validation", async ({ page }) => {
    const devicePage = new DevicePage(page);
    await devicePage.goto("https://smspluswebapp.evdpl.com/check");
    await devicePage.completeDeviceCheck();

    const registrationPage = new RegistrationPage(page);
    const phoneNumber = generateUSNumber();
    await registrationPage.getPhoneInput().click();
    await registrationPage.getPhoneInput().type(phoneNumber, { delay: 50 });

    const agreementCheckbox = registrationPage.getAgreementCheckbox();
    await expect(agreementCheckbox).not.toBeChecked();

    // Click button without expecting navigation (validation should fail)
    await registrationPage.getRequestOTPButton().click();

    // Wait for error message related to agreement checkbox
    const errorMessage = page.locator("text=/must agree|accept|required|checkbox|terms/i");
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test("2.6 Resend OTP functionality", async ({ page }) => {
    const devicePage = new DevicePage(page);
    await devicePage.goto("https://smspluswebapp.evdpl.com/check");
    await devicePage.completeDeviceCheck();

    const registrationPage = new RegistrationPage(page);
    const phoneNumber = generateUSNumber();
    await registrationPage.enterPhoneNumber(phoneNumber);
    await registrationPage.checkAgreement();
    await registrationPage.requestOTP();
    
    // Wait a bit for OTP page to fully load
    await registrationPage.wait(2000);

    // Check for resend link - using different selectors for better coverage
    const resendLocators = [
      page.locator("text=/Didn't you receive any code/i"),
      page.locator("text=/Resend|resend/i"),
      page.getByRole("button", { name: /resend/i })
    ];
    
    let found = false;
    for (const locator of resendLocators) {
      if (await locator.isVisible({ timeout: 2000 }).catch(() => false)) {
        found = true;
        break;
      }
    }
    
    expect(found).toBeTruthy();
  });
});
