export const STORE_CONFIG = {
  storeName: "useoura living",
  currency: "GH₵",
  country: "Ghana",
  defaultWhatsAppNumber: "233248147952", // +233 24 814 7952
  displayWhatsAppNumber: "+233 24 814 7952",
  accraFreeDeliveryThreshold: 400,
  accraDeliveryFee: 25,
  outsideAccraDeliveryFee: 45,
  momoPaymentDetails: {
    network: "MTN Mobile Money / Telecel Cash",
    accountName: "USEOURA LIVING",
    note: "Official merchant payment details provided via WhatsApp assistant.",
  },
};

export const getWhatsAppNumber = (): string => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("useoura_whatsapp_number");
    if (saved) return saved.replace(/[^0-9]/g, "");
  }
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, "") ||
    STORE_CONFIG.defaultWhatsAppNumber
  );
};

export const setCustomWhatsAppNumber = (num: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("useoura_whatsapp_number", num.replace(/[^0-9]/g, ""));
  }
};
