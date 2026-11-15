import { CartItem } from "@/components/CartDrawer";
import { STORE_CONFIG, getWhatsAppNumber } from "@/lib/config";

export interface CustomerOrderDetails {
  name: string;
  phone: string;
  region: "accra" | "outside-accra";
  address: string;
  landmarkNotes: string;
}

export function generateOrderReference(): string {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `OL-${randomDigits}`;
}

export function formatWhatsAppOrderMessage({
  orderRef,
  items,
  customerInfo,
  subtotal,
  deliveryFee,
  total,
}: {
  orderRef: string;
  items: CartItem[];
  customerInfo: CustomerOrderDetails;
  subtotal: number;
  deliveryFee: number;
  total: number;
}): string {
  const isAccra = customerInfo.region === "accra";
  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Build items list
  const itemsText = items
    .map(
      (item, idx) =>
        `• ${item.quantity}x ${item.product.title} (GH₵ ${item.product.price.toFixed(
          2
        )} each = GH₵ ${(item.product.price * item.quantity).toFixed(2)})`
    )
    .join("\n");

  const addressProvided = customerInfo.address.trim().length > 0;
  const nameProvided = customerInfo.name.trim().length > 0;
  const phoneProvided = customerInfo.phone.trim().length > 0;

  // Assistant Directive block
  let directiveText = "";
  if (isAccra) {
    if (!addressProvided) {
      directiveText =
        "[ACTION REQUIRED: Customer selected Greater Accra with Payment on Delivery. Delivery address was NOT provided on the website. Please greet the customer, confirm their order items, and ask for their exact delivery address/digital address and phone number to schedule dispatch.]";
    } else {
      directiveText =
        "[ACTION REQUIRED: Customer is in Greater Accra and eligible for Payment on Delivery. Address has been provided. Please confirm their order and notify them of the dispatch delivery time window.]";
    }
  } else {
    if (!addressProvided) {
      directiveText =
        "[ACTION REQUIRED: Customer is located OUTSIDE Greater Accra. Pre-payment is strictly required before delivery dispatch. Address was NOT provided on the website. Please provide our official Mobile Money payment details for GH₵ " +
        total.toFixed(2) +
        ", and request their exact regional delivery town and phone number once payment is confirmed.]";
    } else {
      directiveText =
        "[ACTION REQUIRED: Customer is located OUTSIDE Greater Accra. Pre-payment is strictly required before parcel dispatch. Address is provided. Please provide our official Mobile Money payment details for GH₵ " +
        total.toFixed(2) +
        ". Once customer sends transaction proof, proceed to book regional courier dispatch.]";
    }
  }

  return `📦 *NEW ORDER — USEOURA LIVING*
*Order Ref:* #${orderRef}
*Date:* ${dateStr}

🛒 *ORDERED ITEMS:*
${itemsText}

💰 *PAYMENT SUMMARY:*
• Subtotal: GH₵ ${subtotal.toFixed(2)}
• Delivery: ${
    deliveryFee === 0
      ? "FREE (Complimentary Oura Dispatch)"
      : `GH₵ ${deliveryFee.toFixed(2)} (${
          isAccra ? "Greater Accra Fleet" : "Regional Parcel Dispatch"
        })`
  }
• *TOTAL AMOUNT DUE: GH₵ ${total.toFixed(2)}*

📍 *DELIVERY INFORMATION:*
• Customer Name: ${nameProvided ? customerInfo.name.trim() : "Not provided on web"}
• Phone: ${phoneProvided ? customerInfo.phone.trim() : "Not provided on web"}
• Region: ${
    isAccra
      ? "Greater Accra (Accra, Tema, Kasoa corridor)"
      : "Outside Accra / Other Regions (Regional Dispatch)"
  }
• Address: ${
    addressProvided
      ? customerInfo.address.trim()
      : "[NOT ENTERED ON WEB — ASSISTANT TO REQUEST]"
  }
• Delivery Notes / Landmark: ${
    customerInfo.landmarkNotes.trim() || "None specified"
  }

💳 *PAYMENT POLICY:*
• Policy: ${
    isAccra
      ? "Payment on Delivery Available (Cash or MoMo on arrival)"
      : "Pre-Payment Required Before Dispatch (Mobile Money / MoMo)"
  }

🤖 *META AI ASSISTANT DIRECTIVE:*
${directiveText}`;
}

export function buildWhatsAppLink({
  orderRef,
  items,
  customerInfo,
  subtotal,
  deliveryFee,
  total,
  customNumber,
}: {
  orderRef: string;
  items: CartItem[];
  customerInfo: CustomerOrderDetails;
  subtotal: number;
  deliveryFee: number;
  total: number;
  customNumber?: string;
}): string {
  const rawMessage = formatWhatsAppOrderMessage({
    orderRef,
    items,
    customerInfo,
    subtotal,
    deliveryFee,
    total,
  });

  const targetNumber = customNumber || getWhatsAppNumber();
  const cleanNumber = targetNumber.replace(/[^0-9]/g, "");

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(rawMessage)}`;
}
