"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Check, ArrowRight, Sparkles, Layers } from "lucide-react";
import { Product, PRODUCTS } from "@/lib/products";

interface Hotspot {
  id: string;
  productId: string;
  title: string;
  price: number;
  spec: string;
  xPercent: number; // Percentage from left (0 - 100)
  yPercent: number; // Percentage from top (0 - 100)
  image: string;
}

interface DeskSetupSectionProps {
  onAddToCart: (product: Product, quantity?: number, openDrawer?: boolean) => void;
  onQuickView: (product: Product) => void;
  onAddBundleToCart: (products: Product[]) => void;
}

export const DeskSetupSection: React.FC<DeskSetupSectionProps> = ({
  onAddToCart,
  onQuickView,
  onAddBundleToCart,
}) => {
  const [activeHotspotId, setActiveHotspotId] = useState<string>("hotspot-lightbar");
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [bundleAdded, setBundleAdded] = useState(false);

  // Curated hotspots mapped to actual catalog products
  const hotspots: Hotspot[] = [
    {
      id: "hotspot-lightbar",
      productId: "prod-monitor-light-bar",
      title: "Minimalist Monitor Light Bar",
      price: 580,
      spec: "Asymmetrical 45° Optics · Ra ≥ 95 CRI",
      xPercent: 28,
      yPercent: 38,
      image: "https://cdn.shopify.com/s/files/1/0831/7042/7131/files/lightbar-01_1024x1024.png?v=1790582645",
    },
    {
      id: "hotspot-mat",
      productId: "prod-xxl-desk-mat",
      title: "XXL Solid Color Desk Mat",
      price: 220,
      spec: "Vegan PU Leather & Natural Cork Base",
      xPercent: 48,
      yPercent: 64,
      image: "https://cdn.shopify.com/s/files/1/0831/7042/7131/files/deskmat-01_1024x1024.png?v=1790582650",
    },
    {
      id: "hotspot-mount",
      productId: "prod-magsafe-car-mount",
      title: "Magnetic Stand & Dock",
      price: 175,
      spec: "16x N52 Neodymium Magnetic Array",
      xPercent: 74,
      yPercent: 57,
      image: "https://cdn.shopify.com/s/files/1/0831/7042/7131/files/mount-01_1024x1024.png?v=1790582655",
    },
    {
      id: "hotspot-cable",
      productId: "prod-anker-100w-cable",
      title: "Anker 100W Braided Cable",
      price: 175,
      spec: "Double-Braided Nylon · 25,000 Bends",
      xPercent: 38,
      yPercent: 55,
      image: "https://cdn.shopify.com/s/files/1/0831/7042/7131/files/white-01_2d4272ab-2d5a-428d-8f79-c52ac1e98345_2878x_1.png?v=1790582640",
    },
    {
      id: "hotspot-power",
      productId: "prod-apple-35w-dual",
      title: "Apple 35W Dual Port Adapter",
      price: 210,
      spec: "Dynamic Dual USB-C GaN Power Delivery",
      xPercent: 86,
      yPercent: 62,
      image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MNWP3?wid=1144&hei=1144&fmt=jpeg&qlt=90",
    },
  ];

  const activeHotspot = hotspots.find((h) => h.id === activeHotspotId) || hotspots[0];
  const activeProduct = PRODUCTS.find((p) => p.id === activeHotspot.productId);

  const handleAddSingle = (productId: string) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (!prod) return;
    onAddToCart(prod, 1, false);
    setAddedProductId(productId);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  const handleBundleComplete = () => {
    const bundleProducts = hotspots
      .map((h) => PRODUCTS.find((p) => p.id === h.productId))
      .filter(Boolean) as Product[];

    onAddBundleToCart(bundleProducts);
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 2400);
  };

  const bundleTotal = hotspots.reduce((sum, h) => sum + h.price, 0); // 1,360
  const bundleDiscountPrice = 1220; // Save GH₵ 140

  return (
    <section className="w-full border-b border-[#EAEAEA] bg-[#F7F7F5] py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Editorial Section Header (Lofree-Inspired 2m² Narrative) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#EAEAEA] gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block">
              THE 2M² SANCTUARY · CURATED WORKSPACE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1A1A1A]">
              The 2m² Space
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-neutral-500 max-w-md">
            You spend your most creative hours inside two square meters. Explore the interactive components engineered to eliminate clutter and friction.
          </p>
        </div>

        {/* Interactive Workspace Stage */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] bg-neutral-900 border border-neutral-300 shadow-2xl overflow-hidden select-none">
          {/* Base High-Resolution Setup Photo */}
          <Image
            src="/assets/brand/hero/hero-warm-desk.jpg"
            alt="The 2m² Curated Workspace Setup"
            fill
            sizes="100vw"
            className="object-cover object-center filter contrast-105"
            priority
          />

          {/* Ambient Dark Gradient for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Interactive Hotspot Pins */}
          {hotspots.map((spot) => {
            const isActive = spot.id === activeHotspotId;

            return (
              <div
                key={spot.id}
                style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                onClick={() => setActiveHotspotId(spot.id)}
                onMouseEnter={() => setActiveHotspotId(spot.id)}
              >
                {/* Rhythmic Ambient Ping Ring */}
                <span className="absolute -inset-2 rounded-full bg-white/40 animate-ping pointer-events-none" />

                {/* Tactile Pin Button */}
                <button
                  aria-label={`Inspect ${spot.title}`}
                  className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-md ${
                    isActive
                      ? "bg-white text-[#1A1A1A] scale-110 ring-4 ring-white/50"
                      : "bg-[#1A1A1A]/80 text-white hover:bg-white hover:text-[#1A1A1A] hover:scale-105"
                  }`}
                >
                  <Plus
                    strokeWidth={2}
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isActive ? "rotate-45" : ""
                    }`}
                  />
                </button>
              </div>
            );
          })}

          {/* Floating Product Preview Card (Lofree Tactile Popover) */}
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md z-30 pointer-events-auto">
            <div className="bg-[#F7F7F5]/95 backdrop-blur-md border border-neutral-300 p-5 sm:p-6 shadow-2xl flex items-center space-x-5 transition-all">
              {/* Product Thumbnail with Multiply Blend */}
              <div
                onClick={() => activeProduct && onQuickView(activeProduct)}
                className="relative w-20 h-20 bg-white border border-neutral-200 shrink-0 cursor-pointer p-2 overflow-hidden group/thumb"
              >
                <Image
                  src={activeHotspot.image}
                  alt={activeHotspot.title}
                  fill
                  sizes="80px"
                  className="object-contain mix-blend-multiply group-hover/thumb:scale-105 transition-transform"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0 space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400 block truncate">
                  HOTSPOT OBJECT
                </span>
                <h4
                  onClick={() => activeProduct && onQuickView(activeProduct)}
                  className="text-sm sm:text-base font-medium text-[#1A1A1A] truncate cursor-pointer hover:text-neutral-600 transition-colors"
                >
                  {activeHotspot.title}
                </h4>
                <div className="text-[11px] font-mono text-neutral-500 truncate">
                  {activeHotspot.spec}
                </div>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-sm font-mono font-semibold text-[#1A1A1A]">
                    GH₵ {activeHotspot.price.toFixed(2)}
                  </span>

                  <button
                    onClick={() => handleAddSingle(activeHotspot.productId)}
                    className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider font-medium transition-all flex items-center space-x-1 ${
                      addedProductId === activeHotspot.productId
                        ? "bg-emerald-700 text-white"
                        : "bg-[#1A1A1A] text-white hover:bg-neutral-800"
                    }`}
                  >
                    {addedProductId === activeHotspot.productId ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Setup Bundle Bar (Complete 2m² Setup) */}
        <div className="mt-8 bg-white border border-neutral-300 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] font-semibold text-[#1A1A1A]">
                The Complete 2m² Setup Suite
              </span>
            </div>
            <p className="text-xs font-mono text-neutral-500">
              Includes Monitor Light Bar, XXL Desk Mat, 100W Braided Cable, Magnetic Dock & 35W Dual Charger.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl font-mono font-semibold text-[#1A1A1A]">
                GH₵ {bundleDiscountPrice.toFixed(2)}
              </span>
              <span className="text-sm font-mono text-neutral-400 line-through">
                GH₵ {bundleTotal.toFixed(2)}
              </span>
              <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 font-medium">
                Save GH₵ 140.00
              </span>
            </div>

            <button
              onClick={handleBundleComplete}
              className={`w-full sm:w-auto px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-md ${
                bundleAdded
                  ? "bg-emerald-700 text-white"
                  : "bg-[#1A1A1A] hover:bg-neutral-800 text-white"
              }`}
            >
              {bundleAdded ? (
                <>
                  <Check strokeWidth={2} className="w-4 h-4" />
                  <span>Suite Added to Bag</span>
                </>
              ) : (
                <>
                  <Layers strokeWidth={1.5} className="w-4 h-4" />
                  <span>Bundle The 2m² Setup</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
