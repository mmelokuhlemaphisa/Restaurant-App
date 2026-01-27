import CryptoJS from "crypto-js";

export const PAYFAST_MERCHANT_ID = "10045287";
export const PAYFAST_MERCHANT_KEY = "ksaif2dikr1f5";
export const PAYFAST_RETURN_URL = "https://your-app.com/payfast-success";
export const PAYFAST_NOTIFY_URL = "https://your-app.com/payfast-notify";
export const PAYFAST_SALT_PASSPHRASE = "YOUR_SALT_PASSPHRASE"; // optional

export function buildPayfastUrl({
  amount,
  itemName,
  email,
  orderId,
}: {
  amount: number;
  itemName: string;
  email: string;
  orderId: string;
}) {
  const data: any = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: PAYFAST_RETURN_URL,
    notify_url: PAYFAST_NOTIFY_URL,
    name_first: "Customer",
    name_last: "Order",
    email_address: email,
    m_payment_id: orderId,
    amount: amount.toFixed(2),
    item_name: itemName,
  };

  // 1) Build query string WITHOUT encoding
  const query = Object.keys(data)
    .sort()
    .map((k) => `${k}=${data[k]}`)
    .join("&");

  // 2) Add passphrase if you have one
  const signatureString = PAYFAST_SALT_PASSPHRASE
    ? `${query}&passphrase=${PAYFAST_SALT_PASSPHRASE}`
    : query;

  // 3) Generate MD5
  const signature = CryptoJS.MD5(signatureString).toString();

  return `https://sandbox.payfast.co.za/eng/process?${query}&signature=${signature}`;
}
