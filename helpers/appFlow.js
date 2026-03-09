import { DevicePage } from "../pages/Base Web App - Page/DevicePage.js";
import { RegistrationPage } from "../pages/Base Web App - Page/RegistrationPage.js";
import { ProfilePage } from "../pages/Base Web App - Page/ProfilePage.js";
import { PlansPage } from "../pages/Base Web App - Page/PlansPage.js";
import { PaymentCardPage } from "../pages/Base Web App - Page/PaymentCardPage.js";
import { PaymentPage } from "../pages/Base Web App - Page/PaymentPage.js";
import { generateUSNumber, generateUserDetails, logPurchase } from "./utils.js";
import { configDotenv } from "dotenv";
configDotenv();

const BASE_URL = process.env.BASE_URL || "https://smspluswebapp.evdpl.com/check";

export async function completeRegistrationToPlans(page) {
  // Device check
  const devicePage = new DevicePage(page);
  await devicePage.goto(BASE_URL);
  await devicePage.completeDeviceCheck();

  // Phone verification
  const registrationPage = new RegistrationPage(page);
  const phoneNumber = generateUSNumber();
  await registrationPage.completePhoneVerification(phoneNumber);

  // Profile creation
  const profilePage = new ProfilePage(page);
  const { firstName, lastName, email } = await generateUserDetails();
  await profilePage.createProfile(firstName, lastName, email);

  // Plans page should now be loaded
  const plansPage = new PlansPage(page);
  await plansPage.verifyPlansPageLoads();

  // return user details so caller can log purchase information
  return { firstName, lastName, email };
}

/**
 * Complete payment card entry flow
 */
export async function completePaymentCardDetails(page) {
  await completeRegistrationToPlans(page);

  const plansPage = new PlansPage(page);
  await plansPage.selectPlan("Basic", "monthly");
  await plansPage.proceedToPayment();

  const paymentCardPage = new PaymentCardPage(page);
  await paymentCardPage.fillAllCardDetails();
  await paymentCardPage.submitCardDetails();
}

/**
 * Complete end-to-end flow with Basic Monthly plan
 */
export async function completeBasicMonthlyFlow(page) {
  const user = await completeRegistrationToPlans(page);

  const plansPage = new PlansPage(page);
  await plansPage.selectPlan("basic", "monthly");
  await plansPage.proceedToPayment();

  const paymentCardPage = new PaymentCardPage(page);
  await paymentCardPage.fillAllCardDetails();
  await paymentCardPage.submitCardDetails();

  const paymentPage = new PaymentPage(page);
  await paymentPage.expectPlanDetails({
    planName: "Basic",
    billingCycle: "monthly",
  });
  await paymentPage.completePayment();

  // log the purchase for reporting
  logPurchase(`${user.firstName} ${user.lastName}`, "Basic", "monthly");
}

/**
 * Complete end-to-end flow with Basic Yearly plan
 */
export async function completeBasicYearlyFlow(page) {
  const user = await completeRegistrationToPlans(page);

  const plansPage = new PlansPage(page);
  await plansPage.selectPlan("basic", "yearly");
  await plansPage.proceedToPayment();

  const paymentCardPage = new PaymentCardPage(page);
  await paymentCardPage.fillAllCardDetails();
  await paymentCardPage.submitCardDetails();

  const paymentPage = new PaymentPage(page);
  await paymentPage.expectPlanDetails({
    planName: "Basic",
    billingCycle: "yearly",
  });
  await paymentPage.completePayment();

  // log
  logPurchase(`${user.firstName} ${user.lastName}`, "Basic", "yearly");
}

/**
 * Complete end-to-end flow with Premium Monthly plan
 */
export async function completePremiumMonthlyFlow(page) {
  const user = await completeRegistrationToPlans(page);

  const plansPage = new PlansPage(page);
  await plansPage.selectPlan("premium", "monthly");
  await plansPage.proceedToPayment();

  const paymentCardPage = new PaymentCardPage(page);
  await paymentCardPage.fillAllCardDetails();
  await paymentCardPage.submitCardDetails();

  const paymentPage = new PaymentPage(page);
  await paymentPage.expectPlanDetails({
    planName: "Premium",
    billingCycle: "monthly",
  });
  await paymentPage.completePayment();

  logPurchase(`${user.firstName} ${user.lastName}`, "Premium", "monthly");
}

/**
 * Complete end-to-end flow with Premium Yearly plan
 */
export async function completePremiumYearlyFlow(page) {
  const user = await completeRegistrationToPlans(page);

  const plansPage = new PlansPage(page);
  await plansPage.selectPlan("premium", "yearly");
  await plansPage.proceedToPayment();

  const paymentCardPage = new PaymentCardPage(page);
  await paymentCardPage.fillAllCardDetails();
  await paymentCardPage.submitCardDetails();

  const paymentPage = new PaymentPage(page);
  await paymentPage.expectPlanDetails({
    planName: "Premium",
    billingCycle: "yearly",
  });
  await paymentPage.completePayment();

  logPurchase(`${user.firstName} ${user.lastName}`, "Premium", "yearly");
}
