import CryptoJS from "crypto-js";

export const PAYFAST_MERCHANT_ID = "YOUR_MERCHANT_ID";
export const PAYFAST_MERCHANT_KEY = "YOUR_MERCHANT_KEY";
export const PAYFAST_RETURN_URL = "https://your-app.com/payfast-success";
export const PAYFAST_CANCEL_URL = "https://your-app.com/payfast-cancel";
export const PAYFAST_NOTIFY_URL = "https://your-app.com/payfast-notify";

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
  const data = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: PAYFAST_RETURN_URL,
    cancel_url: PAYFAST_CANCEL_URL,
    notify_url: PAYFAST_NOTIFY_URL,
    name_first: "Customer",
    name_last: "Order",
    email_address: email,
    m_payment_id: orderId,
    amount: amount.toFixed(2),
    item_name: itemName,
  };

  // Build signature
  const query = Object.keys(data)
    .sort()
    .map((k) => `${k}=${encodeURIComponent((data as any)[k])}`)
    .join("&");

  const signature = CryptoJS.MD5(query).toString();

  return `https://www.payfast.co.za/eng/process?${query}&signature=${signature}`;
}
