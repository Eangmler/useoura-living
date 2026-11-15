"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Plus, Minus, Check, Shield, Truck, MessageCircle } from "lucide-react";
import { Product } from "@/lib/products";
import { buildWhatsAppLink, generateOrderReference } from "@/lib/whatsapp";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : [product.image, ...(product.secondaryImage ? [product.secondaryImage] : [])];

  const currentImage = galleryImages[selectedImageIndex] || product.image;

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  const handleInstantWhatsApp = () => {
    const orderRef = generateOrderReference();
    const itemTotal = product.price * quantity;

    const url = buildWhatsAppLink({
      orderRef,
      items: [{ product, quantity }],
      customerInfo: {
        name: "",
        phone: "",
        region: "accra",
        address: "",
        landmarkNotes: "Single item instant quick-order",
      },
      total: itemTotal,
    });

    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#F7F7F5] border border-neutral-300 shadow-2xl z-10 flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close detail modal"
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-neutral-900 hover:text-white transition-colors border border-neutral-300 cursor-pointer"
        >
          <X strokeWidth={1.5} className="w-5 h-5" />
        </button>

        {/* Left Side: Multi-Angle Gallery Presentation */}
        <div className="md:w-1/2 bg-[#F0F0F0] border-b md:border-b-0 md:border-r border-[#EAEAEA] p-6 sm:p-10 flex flex-col justify-between relative">
          <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
            <span>SCHEMATIC // {product.tag}</span>
            <span>ANGLE {selectedImageIndex + 1} OF {galleryImages.length}</span>
          </div>

          {/* Main Large View */}
          <div className="relative w-full aspect-square my-6 flex items-center justify-center">
            <Image
              src={currentImage}
              alt={`${product.title} angle ${selectedImageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain mix-blend-multiply p-4 transition-all duration-300"
            />
          </div>

          {/* Multi-Angle Thumbnail Strip */}
          {galleryImages.length > 1 && (
            <div className="flex items-center space-x-2 pt-4 border-t border-neutral-300/60 overflow-x-auto pb-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-14 h-14 bg-white border p-1 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? "border-[#1A1A1A] ring-1 ring-[#1A1A1A]"
                      : "border-neutral-300 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Angle ${idx + 1}`}
                    fill
                    sizes="56px"
                    className="object-contain mix-blend-multiply"
                  />
                </button>
              ))}
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest pl-2">
                Click to switch angle
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Editorial Specifications & Action */}
        <div className="md:w-1/2 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase block">
                {product.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#1A1A1A]">
                {product.title}
              </h2>
              <div className="pt-2 flex items-baseline space-x-3">
                <span className="text-xl font-mono font-semibold text-[#1A1A1A]">
                  GH₵ {product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-mono text-neutral-400 line-through">
                    GH₵ {product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 uppercase font-medium">
                  Free Accra Courier
                </span>
              </div>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Technical Specifications Table */}
            <div className="pt-2 border-t border-[#EAEAEA] space-y-2">
              <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase block mb-2">
                Specifications
              </span>
              <div className="divide-y divide-neutral-200 border border-neutral-200 bg-white/60">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between py-1.5 px-3 text-xs font-mono">
                    <span className="text-neutral-500 uppercase">{spec.label}</span>
                    <span className="text-[#1A1A1A] font-medium text-right max-w-[60%]">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Logistics Guarantees */}
            <div className="space-y-1.5 pt-2 text-[11px] font-mono text-neutral-600">
              <div className="flex items-center space-x-2">
                <Truck strokeWidth={1.5} className="w-3.5 h-3.5 text-neutral-700" />
                <span>Complimentary Uber Courier in Greater Accra</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield strokeWidth={1.5} className="w-3.5 h-3.5 text-neutral-700" />
                <span>Payment on Delivery (Accra) or MoMo confirmed dispatch</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="pt-4 border-t border-[#EAEAEA] space-y-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-neutral-300 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="p-2 hover:bg-neutral-100 text-[#1A1A1A]"
                >
                  <Minus strokeWidth={1.5} className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-mono font-medium text-[#1A1A1A]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="p-2 hover:bg-neutral-100 text-[#1A1A1A]"
                >
                  <Plus strokeWidth={1.5} className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`flex-grow py-3.5 px-6 font-mono text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  !product.inStock
                    ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                    : added
                    ? "bg-emerald-700 text-white"
                    : "bg-[#1A1A1A] text-white hover:bg-neutral-800"
                }`}
              >
                {!product.inStock ? (
                  <span>Sold Out</span>
                ) : added ? (
                  <>
                    <Check strokeWidth={1.5} className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <span>Add to Bag — GH₵ {(product.price * quantity).toFixed(2)}</span>
                )}
              </button>
            </div>

            {/* Instant WhatsApp Quick Order */}
            {product.inStock && (
              <button
                onClick={handleInstantWhatsApp}
                className="w-full py-3 bg-[#25D366] hover:bg-[#1fa851] text-white font-mono text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <MessageCircle strokeWidth={2} className="w-4 h-4 fill-current" />
                <span>Instant Order on WhatsApp</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
