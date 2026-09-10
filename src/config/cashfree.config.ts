import { Cashfree, CFEnvironment } from "cashfree-pg";

const getEnvironment = (): CFEnvironment => {
  return process.env.CASHFREE_ENV === "PRODUCTION"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;
};

const appId = process.env.APP_ID || "";
const secretKey = process.env.SECRET_KEY || "";

if (!appId || !secretKey) {
  console.warn("⚠️ Warning: Cashfree APP_ID or SECRET_KEY missing in environment variables.");
}

export const cashfreeClient = new Cashfree(
  getEnvironment(),
  appId,
  secretKey
);
