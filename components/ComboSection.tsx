"use client";

import React, { useState } from "react";
import Image from "next/image";
import { COMBOS, Combo } from "@/lib/combos";
import { Product, PRODUCTS } from "@/lib/products";
import { Plus, Check, MessageCircle } from "lucide-react";
import { buildWhatsAppLink, generateOrderReference } from "@/lib/whatsapp";

interface ComboSectionProps {
  onAddComboToCart: (products: Product[]) => void;
}

export const ComboSection: React.FC<ComboSectionProps> = ({ onAddComboToCart }) => {
  const [addedComboId, setAddedComboId] = useState<string | null>(null);

  const handleAddCombo = (combo: Combo) => {
    const comboProducts: Product[] = [];
    combo.items.forEach((item) => {
      const match = PRODUCTS.find((p) => p.id === item.productId);
      if (match) comboProducts.push(match);
    });

    onAddComboToCart(comboProducts);
    setAddedComboId(combo.id);
    setTimeout(() => setAddedComboId(null), 1800);
  };

  const handleInstantWhatsAppCombo = (combo: Combo) => {
    const orderRef = generateOrderReference();
    const comboCartItems = combo.items
      .map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId);
        if (!product) return null;
        return { product, quantity: item.quantity };
      })
      .filter(Boolean) as { product: Product; quantity: number }[];

    const url = buildWhatsAppLink({
      orderRef,
      items: comboCartItems,
      customerInfo: {
        name: "",
        phone: "",
        region: "accra",
        address: "",
        landmarkNotes: `Combo: ${combo.title}`,
      },
      total: combo.comboPrice,
    });

    window.open(url, "_blank");
  };

  return (
    <section className="w-full border-b border-[#EAEAEA] bg-[#F7F7F5] py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Clean Header - NO Section numbers, NO paragraphs */}
        <div className="flex items-end justify-between mb-12 pb-6 border-b border-[#EAEAEA]">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1A1A1A]">
            Combos
          </h2>
        </div>

        {/* Combos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {COMBOS.map((combo) => {
            const isAdded = addedComboId === combo.id;

            return (
              <div
                key={combo.id}
                className="group flex flex-col justify-between bg-[#F0F0F0] border border-[#E5E5E5] hover:border-[#1A1A1A] p-6 sm:p-8 transition-all duration-300"
              >
                {/* Badge */}
                <div className="flex justify-end mb-4">
                  <span className="text-[10px] font-mono tracking-wider font-semibold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5">
                    {combo.badge}
                  </span>
                </div>

                {/* Floating Imagery */}
                <div className="relative w-full aspect-[4/3] bg-white border border-neutral-200 p-6 mb-6 flex items-center justify-center overflow-hidden">
                  <Image
                    src={combo.image}
                    alt={combo.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content: Title & Items list ONLY - NO petty paragraphs */}
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-xl font-medium text-[#1A1A1A] tracking-tight">
                    {combo.title}
                  </h3>

                  {/* Included items bullet list */}
                  <div className="py-3 border-y border-neutral-300/60 space-y-1.5 text-xs font-mono text-neutral-600">
                    {combo.items.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full" />
                        <span>{item.title}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing row */}
                  <div className="pt-2 flex items-baseline justify-between font-mono">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-lg font-semibold text-[#1A1A1A]">
                        GH₵ {combo.comboPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-neutral-400 line-through">
                        GH₵ {combo.originalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => handleAddCombo(combo)}
                      className={`w-full py-3 font-mono text-xs uppercase tracking-wider font-medium transition-all flex items-center justify-center space-x-2 border ${
                        isAdded
                          ? "bg-emerald-700 text-white border-emerald-700"
                          : "bg-[#1A1A1A] text-white border-[#1A1A1A] hover:bg-neutral-800"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check strokeWidth={1.5} className="w-4 h-4" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <Plus strokeWidth={1.5} className="w-4 h-4" />
                          <span>Add Combo to Bag</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleInstantWhatsAppCombo(combo)}
                      className="w-full py-2.5 bg-[#25D366] hover:bg-[#1fa851] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center space-x-2"
                    >
                      <MessageCircle strokeWidth={2} className="w-3.5 h-3.5 fill-current" />
                      <span>Order on WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
