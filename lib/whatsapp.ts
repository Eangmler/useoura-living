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
  total,
}: {
  orderRef: string;
  items: CartItem[];
  customerInfo: CustomerOrderDetails;
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

  const itemsText = items
    .map(
      (item) =>
        `• ${item.quantity}x ${item.product.title} (GH₵ ${(
          item.product.price * item.quantity
        ).toFixed(2)})`
    )
    .join("\n");

  const addressProvided = customerInfo.address.trim().length > 0;
  const nameProvided = customerInfo.name.trim().length > 0;
  const phoneProvided = customerInfo.phone.trim().length > 0;

  return `📦 *NEW ORDER — USEOURA LIVING*
*Order Ref:* #${orderRef}
*Date:* ${dateStr}

🛒 *ORDERED ITEMS:*
${itemsText}

💰 *TOTAL AMOUNT DUE:* GH₵ ${total.toFixed(2)}
*(Includes Free Greater Accra Delivery)*

📍 *DELIVERY DETAILS:*
• Customer: ${nameProvided ? customerInfo.name.trim() : "Not provided on web"}
• Phone: ${phoneProvided ? customerInfo.phone.trim() : "Not provided on web"}
• Region: ${
    isAccra
      ? "Greater Accra (Payment on Delivery Eligible)"
      : "Outside Accra (Pre-payment Required)"
  }
• Address: ${
    addressProvided
      ? customerInfo.address.trim()
      : "[NOT PROVIDED ON WEB — TO BE CONFIRMED ON CHAT]"
  }
• Notes / Landmark: ${
    customerInfo.landmarkNotes.trim() || "None specified"
  }`;
}

export function buildWhatsAppLink({
  orderRef,
  items,
  customerInfo,
  total,
  customNumber,
}: {
  orderRef: string;
  items: CartItem[];
  customerInfo: CustomerOrderDetails;
  total: number;
  customNumber?: string;
}): string {
  const rawMessage = formatWhatsAppOrderMessage({
    orderRef,
    items,
    customerInfo,
    total,
  });

  const targetNumber = customNumber || getWhatsAppNumber();
  const cleanNumber = targetNumber.replace(/[^0-9]/g, "");

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(rawMessage)}`;
}
