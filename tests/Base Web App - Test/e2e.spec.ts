// spec: specs/sms-plus-registration-payment.plan.md
// End-to-End Flow Suite (Refactored)

import { test, expect } from "@playwright/test";
import { generateUSNumber, generateUserDetails } from "../../helpers/utils.js";
import {
  completeBasicMonthlyFlow,
  completeBasicYearlyFlow,
  completePremiumMonthlyFlow,
  completePremiumYearlyFlow,
} from "../../helpers/appFlow.js";

import { DevicePage } from "../../pages/Base Web App - Page/DevicePage.js";
import { RegistrationPage } from "../../pages/Base Web App - Page/RegistrationPage.js";
import { ProfilePage } from "../../pages/Base Web App - Page/ProfilePage.js";
import { PlansPage } from "../../pages/Base Web App - Page/PlansPage.js";
import { PaymentCardPage } from "../../pages/Base Web App - Page/PaymentCardPage.js";
import { PaymentPage } from "../../pages/Base Web App - Page/PaymentPage.js";

test.describe("End-to-End Flow Suite", () => {
  test("5.1 Basic Monthly Subscription", async ({ page }) => {
    await completeBasicMonthlyFlow(page);
  });

  test("5.2 Basic Yearly Subscription", async ({ page }) => {
    await completeBasicYearlyFlow(page);
  });

  test("5.3 Premium Monthly Subscription", async ({ page }) => {
    await completePremiumMonthlyFlow(page);
  });

  test("5.4 Premium Yearly Subscription", async ({ page }) => {
    await completePremiumYearlyFlow(page);
  });
});
