// /**
//  * Payment Card Page Object
//  * Handles payment card details entry
//  */
// import { BasePage } from "./BasePage.js";
// import { expect } from "@playwright/test";

// export class PaymentCardPage extends BasePage {
//   // Locators
//   getFormTextboxes() {
//     return this.page.getByRole("textbox");
//   }

//   getHolderNameInput() {
//     return this.getFormTextboxes().nth(0);
//   }

//   getCardNumberInput() {
//     return this.getFormTextboxes().nth(1);
//   }

//   getExpirationDateInput() {
//     return this.getFormTextboxes().nth(2);
//   }

//   getCVVInput() {
//     return this.getFormTextboxes().nth(3);
//   }

//   getNickNameInput() {
//     return this.getFormTextboxes().nth(4);
//   }

//   getBillingAddressInput() {
//     return this.getFormTextboxes().nth(5);
//   }

//   getPostalCodeInput() {
//     return this.getFormTextboxes().nth(6);
//   }

//   getSubmitButton() {
//     return this.page.getByRole("button", { name: /Submit/i });
//   }

//   getExpirationErrorMessage() {
//     return this.page.locator("text=/must not be past|expired|invalid/i");
//   }

//   // Actions
//   async fillCardData(cardDetails) {
//     const {
//       holderName,
//       cardNumber,
//       expirationDate,
//       cvv,
//       nickName,
//       billingAddress,
//       postalCode,
//     } = cardDetails;

//     if (holderName) await this.getHolderNameInput().fill(holderName);
//     if (cardNumber) await this.getCardNumberInput().fill(cardNumber, { delay: 20 });
//     if (expirationDate) await this.getExpirationDateInput().fill(expirationDate);
//     if (cvv) await this.getCVVInput().fill(cvv);
//     if (nickName) await this.getNickNameInput().fill(nickName);
//     if (billingAddress) await this.getBillingAddressInput().fill(billingAddress);
//     if (postalCode) await this.getPostalCodeInput().fill(postalCode);
//   }

//   async fillAllCardDetails() {
//     const cardDetails = {
//       holderName: "John Smith",
//       cardNumber: "4532015112830366",
//       expirationDate: "12/27",
//       cvv: "123",
//       nickName: "TestCard",
//       billingAddress: "123 Main Street, New York, NY 10001",
//       postalCode: "10001",
//     };
//     await this.fillCardData(cardDetails);
//   }

//   async verifyCardValue(field, value) {
//     let input;
//     if (field === "cardNumber") {
//       input = this.getCardNumberInput();
//     }
//     const cardValue = await input.inputValue();
//     expect(cardValue).toBeDefined();
//   }

//   async submitCardDetails() {
//     await this.getSubmitButton().click();
//     await this.waitForURL(/.*\/payment-page/, 5000);
//   }

//   async enterInvalidCardAndVerify() {
//     await this.fillCardData({
//       holderName: "John Smith",
//       cardNumber: "1111111111111111",
//       expirationDate: "12/27",
//     });
//     await this.verifyCardValue("cardNumber", "1111111111111111");
//   }

//   async enterPastExpirationAndVerify() {
//     await this.fillCardData({
//       expirationDate: "12/25",
//     });

//     await this.getSubmitButton().click();

//     await expect(this.getExpirationErrorMessage()).toBeVisible({ timeout: 3000 });

//     await this.getExpirationDateInput().fill("12/27");
//     const errorStillVisible = await this.getExpirationErrorMessage()
//       .isVisible()
//       .catch(() => false);
//     expect(!errorStillVisible).toBeTruthy();
//   }
// }
