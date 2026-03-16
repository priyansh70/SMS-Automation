// spec: specs/sms-plus-registration-payment.plan.md
// End-to-End Flow Suite (Refactored)

import { test, expect } from "@playwright/test";
import {
  completeBasicMonthlyFlow,
  completeBasicYearlyFlow,
  completePremiumMonthlyFlow,
  completePremiumYearlyFlow,
} from "../../helpers/appFlow.js";


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
