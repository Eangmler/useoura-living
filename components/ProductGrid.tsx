"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PRODUCTS, Product, getStoredProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  selectedCategorySlug: string;
  onSelectCategory: (categorySlug: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  onAddToCart,
  onQuickView,
  selectedCategorySlug,
  onSelectCategory,
}) => {
  const [liveProducts, setLiveProducts] = useState<Product[]>(PRODUCTS);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLiveProducts(getStoredProducts());
      fetch("/api/admin/store")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d && d.products && d.products.length > 0) {
            setLiveProducts(d.products);
          }
        })
        .catch(() => {});
      const handleStorage = () => {
        setLiveProducts(getStoredProducts());
      };
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    }
  }, []);

  const filterTabs = useMemo(() => [
    { label: "All", slug: "all" },
    { label: "Mobile & Desk", slug: "mobile-desk" },
    { label: "Smart Home", slug: "smart-home" },
    { label: "Automotive", slug: "automotive" },
    { label: "Lifestyle", slug: "lifestyle" },
  ], []);

  const filteredProducts = useMemo(() => {
    let list = [...liveProducts];
    if (selectedCategorySlug !== "all") {
      list = list.filter((p) => p.categorySlug === selectedCategorySlug);
    }
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [liveProducts, selectedCategorySlug, sortBy]);

  return (
    <section id="bestsellers" className="w-full border-b border-[#EAEAEA] bg-[#F7F7F5] py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Clean Section Header: NO Section Numbers, NO Tag Clutter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-6 border-b border-[#EAEAEA] gap-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1A1A1A]">
            Catalogue
          </h2>

          <div className="flex items-center space-x-2 border border-neutral-300 px-3 py-1.5 bg-white self-start sm:self-auto">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">Sort:</span>
            <select
              aria-label="Sort products by price or default order"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[#1A1A1A] text-xs font-mono focus:outline-none cursor-pointer"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-6 mb-12 scrollbar-none border-b border-neutral-200">
          {filterTabs.map((tab) => {
            const isActive = selectedCategorySlug === tab.slug;
            return (
              <button
                key={tab.slug}
                onClick={() => onSelectCategory(tab.slug)}
                className={`whitespace-nowrap px-4 py-2 text-xs font-mono uppercase tracking-[0.15em] transition-all duration-200 border ${
                  isActive
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : "bg-white/80 text-neutral-600 border-neutral-300 hover:border-neutral-900 hover:text-black"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Asymmetrical Editorial Product Grid with Hover Angle Swap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredProducts.map((product, index) => {
            return (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                priority={index < 4}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
