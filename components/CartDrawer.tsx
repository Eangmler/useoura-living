"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  HelpCircle,
  Settings2,
} from "lucide-react";
import { Product } from "@/lib/products";
import { STORE_CONFIG, getWhatsAppNumber, setCustomWhatsAppNumber } from "@/lib/config";
import {
  CustomerOrderDetails,
  generateOrderReference,
  buildWhatsAppLink,
} from "@/lib/whatsapp";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<"cart" | "delivery">("cart");
  const [region, setRegion] = useState<"accra" | "outside-accra">("accra");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [landmarkNotes, setLandmarkNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNumberConfig, setShowNumberConfig] = useState(false);
  const [phoneConfigInput, setPhoneConfigInput] = useState("");
  const [activeWhatsAppNumber, setActiveWhatsAppNumber] = useState(STORE_CONFIG.defaultWhatsAppNumber);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const num = getWhatsAppNumber();
      setActiveWhatsAppNumber(num);
      setPhoneConfigInput(num);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const isAccra = region === "accra";

  const handleProceedToWhatsApp = () => {
    setIsSubmitting(true);
    const orderRef = generateOrderReference();

    const customerDetails: CustomerOrderDetails = {
      name: customerName,
      phone: customerPhone,
      region: region,
      address: deliveryAddress,
      landmarkNotes: landmarkNotes,
    };

    const url = buildWhatsAppLink({
      orderRef,
      items,
      customerInfo: customerDetails,
      total,
      customNumber: activeWhatsAppNumber,
    });

    if (typeof window !== "undefined") {
      try {
        const orderData = {
          orderRef,
          items,
          customerDetails,
          total,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(`order_${orderRef}`, JSON.stringify(orderData));
      } catch (e) {
        console.error(e);
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      window.open(url, "_blank");
    }, 400);
  };

  const handleSavePhoneConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneConfigInput.replace(/[^0-9]/g, "");
    if (clean) {
      setCustomWhatsAppNumber(clean);
      setActiveWhatsAppNumber(clean);
      setShowNumberConfig(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-[#F7F7F5] border-l border-[#EAEAEA] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#EAEAEA] flex items-center justify-between bg-white">
            <div className="flex items-center space-x-3">
              {step === "delivery" && (
                <button
                  onClick={() => setStep("cart")}
                  aria-label="Back to items"
                  className="p-1 -ml-1 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
                >
                  <ArrowLeft strokeWidth={1.5} className="w-5 h-5" />
                </button>
              )}
              <ShoppingBag strokeWidth={1.5} className="w-4 h-4 text-[#1A1A1A]" />
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] font-semibold text-[#1A1A1A]">
                  {step === "cart" ? "Shopping Bag" : "Delivery Details"}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {step === "cart"
                    ? `${items.reduce((acc, i) => acc + i.quantity, 0)} OBJECTS IN BAG`
                    : "FREE GREATER ACCRA DISPATCH INCLUDED"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowNumberConfig(!showNumberConfig)}
                title="Configure destination WhatsApp number"
                className="p-1.5 text-neutral-400 hover:text-[#1A1A1A] hover:bg-neutral-100 transition-colors"
              >
                <Settings2 strokeWidth={1.5} className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                aria-label="Close bag drawer"
                className="p-1.5 hover:bg-neutral-100 text-neutral-600 transition-colors"
              >
                <X strokeWidth={1.5} className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* WhatsApp Destination Quick Switcher Banner */}
          {showNumberConfig && (
            <div className="bg-[#1A1A1A] text-white p-4 border-b border-neutral-700 animate-in slide-in-from-top-2 text-xs font-mono">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] tracking-wider uppercase text-neutral-400">
                  Store Owner: WhatsApp Target Number
                </span>
                <button
                  onClick={() => setShowNumberConfig(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSavePhoneConfig} className="flex gap-2">
                <input
                  type="text"
                  value={phoneConfigInput}
                  onChange={(e) => setPhoneConfigInput(e.target.value)}
                  placeholder="233248147952"
                  className="flex-1 bg-neutral-900 border border-neutral-700 px-3 py-1.5 text-xs text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-white text-black font-semibold text-[10px] uppercase hover:bg-neutral-200"
                >
                  Save
                </button>
              </form>
              <p className="text-[9px] text-neutral-400 mt-1">
                Active: +{activeWhatsAppNumber}
              </p>
            </div>
          )}

          {/* STEP 1: CART ITEMS VIEW */}
          {step === "cart" && (
            <>
              {/* Delivery Benefit Ribbon */}
              <div className="bg-[#EFEFEF] px-6 py-2.5 border-b border-neutral-200 text-[11px] font-mono text-neutral-600 flex items-center justify-between">
                <span>✓ ALL PRICES INCLUDE FREE GREATER ACCRA DISPATCH</span>
                <span className="text-[#1A1A1A] font-semibold">UBER COURIER</span>
              </div>

              {/* Cart Item List */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-[#EAEAEA]">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-neutral-200/60 flex items-center justify-center">
                      <ShoppingBag strokeWidth={1.25} className="w-8 h-8 text-neutral-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-medium text-[#1A1A1A]">
                        Your bag is empty
                      </p>
                      <p className="text-xs text-neutral-500 font-mono">
                        Explore curated tech essentials for your space.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="mt-4 px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                    >
                      Browse Catalogue
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.product.id} className="py-5 flex space-x-4 items-center">
                      <div className="relative w-20 h-20 bg-[#F0F0F0] border border-neutral-200 p-2 shrink-0 flex items-center justify-center">
                        <Image
                          src={item.product.image}
                          alt={item.product.title}
                          fill
                          sizes="80px"
                          className="object-contain mix-blend-multiply p-1"
                        />
                      </div>

                      <div className="flex-1 space-y-1">
                        <h4 className="text-xs sm:text-sm font-medium text-[#1A1A1A] leading-snug">
                          {item.product.title}
                        </h4>
                        <p className="text-xs font-mono font-semibold text-neutral-800">
                          GH₵ {(item.product.price * item.quantity).toFixed(2)}
                        </p>

                        <div className="pt-2 flex items-center justify-between">
                          <div className="flex items-center border border-neutral-300 bg-white">
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.product.id, item.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                              className="px-2 py-1 text-neutral-600 hover:bg-neutral-100"
                            >
                              <Minus strokeWidth={1.5} className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-mono font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.product.id, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                              className="px-2 py-1 text-neutral-600 hover:bg-neutral-100"
                            >
                              <Plus strokeWidth={1.5} className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            aria-label="Remove item"
                            className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                          >
                            <Trash2 strokeWidth={1.5} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Actions for Step 1 */}
              {items.length > 0 && (
                <div className="p-5 sm:p-6 border-t border-[#EAEAEA] bg-white space-y-4">
                  <div className="flex justify-between items-baseline font-mono text-xs">
                    <span className="text-neutral-500 uppercase tracking-wider">TOTAL (FREE ACCRA DISPATCH)</span>
                    <span className="text-base font-semibold text-[#1A1A1A]">
                      GH₵ {total.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => setStep("delivery")}
                    className="w-full py-4 bg-[#1A1A1A] text-white font-mono text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <span>Proceed to Delivery & WhatsApp</span>
                    <ArrowRight strokeWidth={1.5} className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-neutral-400 uppercase">
                    <ShieldCheck strokeWidth={1.5} className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Payment on Delivery (Accra) · Direct WhatsApp Routing</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: DELIVERY ADDRESS & WHATSAPP ROUTING */}
          {step === "delivery" && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto">
              <div className="p-5 sm:p-6 space-y-6">
                {/* Region Selector */}
                <div className="space-y-3">
                  <label className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-[#1A1A1A] block">
                    1. Select Delivery Destination
                  </label>

                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Option: Greater Accra */}
                    <div
                      onClick={() => setRegion("accra")}
                      className={`cursor-pointer p-3.5 border transition-all ${
                        isAccra
                          ? "bg-white border-[#1A1A1A] ring-1 ring-[#1A1A1A]"
                          : "bg-neutral-50 border-neutral-300 hover:border-neutral-400"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isAccra
                                ? "border-[#1A1A1A] bg-[#1A1A1A]"
                                : "border-neutral-400"
                            }`}
                          >
                            {isAccra && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <div>
                            <span className="text-xs font-mono font-semibold text-[#1A1A1A] block">
                              Greater Accra Region
                            </span>
                            <span className="text-[11px] text-neutral-500 font-mono">
                              Accra, Tema, Spintex, East Legon, Kasoa corridor
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 font-medium">
                          Pay on Delivery
                        </span>
                      </div>
                      <div className="mt-2 text-[10px] font-mono text-emerald-700 pl-6 font-medium">
                        ✓ Free Delivery via Uber Courier Included
                      </div>
                    </div>

                    {/* Option: Outside Accra */}
                    <div
                      onClick={() => setRegion("outside-accra")}
                      className={`cursor-pointer p-3.5 border transition-all ${
                        !isAccra
                          ? "bg-white border-[#1A1A1A] ring-1 ring-[#1A1A1A]"
                          : "bg-neutral-50 border-neutral-300 hover:border-neutral-400"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              !isAccra
                                ? "border-[#1A1A1A] bg-[#1A1A1A]"
                                : "border-neutral-400"
                            }`}
                          >
                            {!isAccra && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <div>
                            <span className="text-xs font-mono font-semibold text-[#1A1A1A] block">
                              Outside Accra (Other Regions)
                            </span>
                            <span className="text-[11px] text-neutral-500 font-mono">
                              Kumasi, Takoradi, Sunyani, Cape Coast, Tamale, etc.
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-amber-100 text-amber-900 font-medium">
                          Pre-payment Required
                        </span>
                      </div>
                      <div className="mt-2 text-[10px] font-mono text-neutral-500 pl-6">
                        Dispatched via VIP station parcel / regional courier
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Address Form (Optional - won't block) */}
                <div className="space-y-4 pt-2 border-t border-[#EAEAEA]">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-[#1A1A1A]">
                      2. Delivery Address (Optional)
                    </label>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">
                      Skip if in a hurry
                    </span>
                  </div>

                  <div className="bg-neutral-100 border border-neutral-200/90 p-3 text-[11px] font-mono text-neutral-600 leading-relaxed flex items-start space-x-2">
                    <HelpCircle strokeWidth={1.5} className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    <span>
                      Entering your address pre-fills your WhatsApp order. If left empty, you can simply share it on chat.
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Kwame Mensah"
                        className="w-full bg-white border border-neutral-300 p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. 024 123 4567"
                        className="w-full bg-white border border-neutral-300 p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1">
                        Delivery Address / Digital GPS
                      </label>
                      <textarea
                        rows={2}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="e.g. GA-183-9024, 14 Senchi St, Airport Residential Area, Accra"
                        className="w-full bg-white border border-neutral-300 p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-black resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1">
                        Landmark / Special Instructions
                      </label>
                      <input
                        type="text"
                        value={landmarkNotes}
                        onChange={(e) => setLandmarkNotes(e.target.value)}
                        placeholder="e.g. Near Shell Filling Station, call before arrival"
                        className="w-full bg-white border border-neutral-300 p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Policy Banner */}
                <div
                  className={`p-3.5 border font-mono text-xs ${
                    isAccra
                      ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                      : "bg-amber-50/80 border-amber-300 text-amber-950"
                  }`}
                >
                  <div className="font-semibold uppercase tracking-wider text-[11px] mb-1 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-current" />
                    <span>
                      {isAccra
                        ? "Payment on Delivery (Accra)"
                        : "Payment Required Prior to Dispatch"}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    {isAccra
                      ? "Pay via Cash or Mobile Money when the Uber courier arrives at your doorstep."
                      : "Orders outside Greater Accra require confirmed payment via MoMo before parcel dispatch."}
                  </p>
                </div>
              </div>

              {/* Bottom Sticky Action: Complete on WhatsApp */}
              <div className="p-5 sm:p-6 border-t border-[#EAEAEA] bg-white space-y-4">
                <div className="space-y-1 font-mono text-xs">
                  <div className="flex justify-between items-baseline text-sm font-semibold text-[#1A1A1A]">
                    <span>TOTAL AMOUNT DUE</span>
                    <span>GH₵ {total.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 font-mono">
                    ✓ Includes Free Greater Accra Courier
                  </p>
                </div>

                {/* Primary WhatsApp Button */}
                <button
                  onClick={handleProceedToWhatsApp}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#25D366] hover:bg-[#1fa851] text-white font-mono text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-200 flex items-center justify-center space-x-2.5 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <MessageCircle strokeWidth={2} className="w-5 h-5 fill-current" />
                  <span>
                    {isSubmitting
                      ? "Generating Order..."
                      : `Complete Order on WhatsApp (GH₵ ${total.toFixed(2)})`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
