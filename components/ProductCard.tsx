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

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const hasSecondary = Boolean(product.secondaryImage && product.secondaryImage !== product.image);

  return (
    <div
      onClick={() => onQuickView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group cursor-pointer flex flex-col justify-between bg-[#F7F7F5] border border-[#EAEAEA] hover:border-[#1A1A1A] transition-all duration-300 ${
        !product.inStock ? "opacity-75" : ""
      } ${className}`}
    >
      {/* Top Header of Card: Technical Serial Tag & Category */}
      <div className="p-4 sm:p-5 pb-3 flex items-center justify-between border-b border-[#EAEAEA]/80 text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400">
        <span>{product.tag}</span>
        <div className="flex items-center space-x-1.5">
          {!product.inStock ? (
            <span className="text-red-700 font-semibold bg-red-100 px-1.5 py-0.5">
              OUT OF STOCK
            </span>
          ) : product.isLimited ? (
            <span className="text-amber-800 font-semibold bg-amber-100 px-1.5 py-0.5">
              LIMITED
            </span>
          ) : product.hasDiscount ? (
            <span className="text-emerald-800 font-semibold bg-emerald-100 px-1.5 py-0.5">
              SALE
            </span>
          ) : product.badge ? (
            <span className="text-[#1A1A1A] font-medium bg-neutral-200/70 px-1.5 py-0.5">
              {product.badge}
            </span>
          ) : null}
        </div>
      </div>

      {/* Floating Image Container with Two-Angle Hover Transition */}
      <div className="relative w-full aspect-square bg-[#F0F0F0] flex items-center justify-center p-10 sm:p-12 overflow-hidden transition-colors group-hover:bg-[#EBEBEB]">
        {/* Subtle dot matrix grid background inside image card */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#999_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Primary Image */}
        <div
          className={`relative w-full h-full flex items-center justify-center transition-all duration-500 ${
            hasSecondary && isHovered ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <Image
            src={imageError && product.fallbackImage ? product.fallbackImage : product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            onError={() => setImageError(true)}
            className="object-contain mix-blend-multiply p-4"
          />
        </div>

        {/* Secondary Detailed Angle on Hover */}
        {hasSecondary && (
          <div
            className={`absolute inset-0 flex items-center justify-center p-10 sm:p-12 transition-all duration-500 ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-110 pointer-events-none"
            }`}
          >
            <Image
              src={product.secondaryImage}
              alt={`${product.title} detail angle`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain mix-blend-multiply p-4"
            />
          </div>
        )}

        {/* Angle indicator indicator tag on hover */}
        {hasSecondary && (
          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-mono tracking-widest uppercase bg-white/80 px-1.5 py-0.5 text-neutral-500">
            {isHovered ? "DETAIL ANGLE" : "PRIMARY"}
          </div>
        )}

        {/* Hover Quick View pill */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 px-3.5 py-1.5 bg-[#1A1A1A] text-white text-[10px] font-mono uppercase tracking-[0.2em] rounded-full flex items-center space-x-1.5 shadow-md hover:bg-neutral-800"
        >
          <Eye strokeWidth={1.5} className="w-3 h-3" />
          <span>Inspect Angles</span>
        </button>
      </div>

      {/* Product Information Body */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow space-y-4">
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-medium text-[#1A1A1A] tracking-tight group-hover:text-neutral-700 transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-neutral-500 font-normal leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-neutral-400 block uppercase tracking-widest">
              PRICE (FREE ACCRA DISPATCH)
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-sm sm:text-base font-semibold text-[#1A1A1A] font-mono">
                GH₵ {product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs font-mono text-neutral-400 line-through">
                  GH₵ {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            aria-label={`Add ${product.title} to bag`}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-200 border ${
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
