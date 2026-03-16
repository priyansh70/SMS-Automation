import LoginPage from "../pages/AdminPanel-Page/LoginPage";
import { configDotenv } from "dotenv";

configDotenv();

export default async function loginAdmin(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto(process.env.ADMIN_PANEL_URL);
  await loginPage.login(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
}
