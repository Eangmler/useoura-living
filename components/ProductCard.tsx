"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Check, Eye } from "lucide-react";
import { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  priority?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  priority = false,
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedAngleIndex, setSelectedAngleIndex] = useState<number | null>(null);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const gallery = (product.images && product.images.length > 0)
    ? product.images
    : [product.image, product.secondaryImage].filter(Boolean);

  const hasSecondary = Boolean(product.secondaryImage && product.secondaryImage !== product.image);

  // Active display image: manual swatch selection takes priority, then hover flip, then primary
  const displayedImage = selectedAngleIndex !== null
    ? gallery[selectedAngleIndex] || product.image
    : isHovered && hasSecondary
    ? product.secondaryImage
    : product.image;

  return (
    <div
      onClick={() => onQuickView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setSelectedAngleIndex(null);
      }}
      className={`group cursor-pointer flex flex-col justify-between bg-[#F7F7F5] border border-[#EAEAEA] hover:border-[#1A1A1A] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        !product.inStock ? "opacity-75" : ""
      } ${className}`}
    >
      {/* Top Tag Bar: Lofree-Style Spec Pill on Left, Status on Right */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between min-h-[32px]">
        {product.badge ? (
          <span className="text-[9px] font-mono tracking-widest uppercase border border-neutral-300/80 bg-white/80 px-2 py-0.5 text-neutral-600">
            {product.badge}
          </span>
        ) : (
          <span />
        )}

        <div>
          {!product.inStock ? (
            <span className="text-[9px] font-mono tracking-wider text-red-700 font-semibold bg-red-100 px-2 py-0.5 uppercase">
              Sold Out
            </span>
          ) : product.hasDiscount ? (
            <span className="text-[9px] font-mono tracking-wider text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 uppercase">
              Sale
            </span>
          ) : null}
        </div>
      </div>

      {/* Floating Image Container with Two-Angle Transition & Micro Swatches */}
      <div className="relative w-full aspect-square bg-[#F0F0F0] flex items-center justify-center p-8 sm:p-10 lg:p-12 overflow-hidden transition-colors group-hover:bg-[#EBEBEB]">
        {/* Subtle dot matrix grid background inside image card */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#999_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Displayed Image */}
        <div className="relative w-full h-full flex items-center justify-center transition-all duration-500 group-hover:scale-105">
          <Image
            src={imageError && product.fallbackImage ? product.fallbackImage : displayedImage}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            onError={() => setImageError(true)}
            className="object-contain mix-blend-multiply p-4 transition-all duration-300"
          />
        </div>

        {/* Lofree-Style Interactive Finish / Angle Swatches (Bottom Left) */}
        {gallery.length > 1 && (
          <div
            className="absolute bottom-3 left-4 flex items-center space-x-1.5 z-20 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {gallery.slice(0, 3).map((_, idx) => {
              const isSelected = selectedAngleIndex === idx || (selectedAngleIndex === null && idx === 0 && !isHovered);

              return (
                <button
                  key={idx}
                  aria-label={`View angle ${idx + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAngleIndex(idx);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#1A1A1A] border-[#1A1A1A] scale-110 ring-2 ring-neutral-300"
                      : "bg-white border-neutral-400 hover:border-black opacity-60 hover:opacity-100"
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 px-3 py-1.5 bg-[#1A1A1A] text-white text-[10px] font-mono uppercase tracking-[0.2em] rounded-full flex items-center space-x-1.5 shadow-md hover:bg-neutral-800"
        >
          <Eye strokeWidth={1.5} className="w-3 h-3" />
          <span>View</span>
        </button>
      </div>

      {/* Product Information Body: Title, Price & Action Row */}
      <div className="p-5 sm:p-6 space-y-4">
        <h3 className="text-base sm:text-lg font-medium text-[#1A1A1A] tracking-tight group-hover:text-neutral-700 transition-colors">
          {product.title}
        </h3>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-[#EAEAEA] flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-base font-semibold text-[#1A1A1A] font-mono">
              GH₵ {product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs font-mono text-neutral-400 line-through">
                GH₵ {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            aria-label={`Add ${product.title} to bag`}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
              !product.inStock
                ? "bg-neutral-200 text-neutral-400 border-neutral-300 cursor-not-allowed"
                : added
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-white text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
            }`}
          >
            {!product.inStock ? (
              <span className="text-[10px]">Sold Out</span>
            ) : added ? (
              <>
                <Check strokeWidth={2} className="w-3.5 h-3.5" />
                <span className="text-[10px]">Added</span>
              </>
            ) : (
              <>
                <Plus strokeWidth={1.5} className="w-3.5 h-3.5" />
                <span className="text-[10px]">Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
