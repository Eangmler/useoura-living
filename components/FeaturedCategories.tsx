"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { StoreCategory, getClientStoreData, DEFAULT_CATEGORIES } from "@/lib/store";

interface FeaturedCategoriesProps {
  onSelectCategory: (categorySlug: string) => void;
  activeCategory: string;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  onSelectCategory,
  activeCategory,
}) => {
  const [categories, setCategories] = useState<StoreCategory[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadCategories = () => {
        const store = getClientStoreData();
        if (store.categories && store.categories.length > 0) {
          setCategories(store.categories);
        }
      };

      loadCategories();
      window.addEventListener("storage", loadCategories);
      return () => window.removeEventListener("storage", loadCategories);
    }
  }, []);

  return (
    <section className="w-full border-b border-[#EAEAEA] bg-[#F7F7F5] py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Clean Header - NO Section numbers, NO paragraphs */}
        <div className="flex items-end justify-between mb-12 pb-6 border-b border-[#EAEAEA]">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1A1A1A]">
            Categories
          </h2>
        </div>

        {/* Minimal Magazine Style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category) => {
            const isSelected = activeCategory === category.id;

            return (
              <div
                key={category.id}
                onClick={() => {
                  onSelectCategory(category.id);
                  const el = document.getElementById("bestsellers");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`group cursor-pointer relative bg-[#F0F0F0] border transition-all duration-300 flex flex-col justify-between overflow-hidden p-6 sm:p-8 ${
                  isSelected
                    ? "border-[#1A1A1A] ring-1 ring-[#1A1A1A]"
                    : "border-[#E5E5E5] hover:border-neutral-900"
                }`}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200 mb-6">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover grayscale contrast-105 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                </div>

                {/* Name & Arrow */}
                <div className="flex items-center justify-between pt-2">
                  <h3 className="text-lg sm:text-xl font-medium tracking-tight text-[#1A1A1A] group-hover:text-neutral-700 transition-colors">
                    {category.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center bg-white group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-200">
                    <ArrowUpRight
                      strokeWidth={1.25}
                      className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
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
