"use client";

import React from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

interface HeroProps {
  onShopClick: () => void;
  onExploreProduct: (productId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onExploreProduct }) => {
  return (
    <section className="relative w-full border-b border-[#EAEAEA] bg-[#F7F7F5] overflow-hidden">
      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 py-16 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Bold Editorial Typography & Breathing Room */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="flex items-center space-x-3">
              <span className="h-[1px] w-8 bg-[#1A1A1A]" />
              <span className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-500">
                OURA ARCHITECTURAL CATALOGUE
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-medium leading-[1.05] tracking-tight text-[#1A1A1A]">
                Curated technology and daily essentials.
              </h1>

              <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-md">
                Pure form, uncompromised utility. Delivered seamlessly to your space with free dispatch across Greater Accra.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onShopClick}
                className="group inline-flex items-center justify-center px-8 py-4 bg-[#1A1A1A] text-[#F7F7F5] rounded-full text-xs font-mono uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:bg-neutral-800 hover:scale-[1.02] shadow-[0_4px_14px_0_rgba(0,0,0,0.12)] cursor-pointer"
              >
                <span>Shop the Essentials</span>
                <ArrowDown
                  strokeWidth={1.5}
                  className="w-3.5 h-3.5 ml-3 transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </button>
            </div>

            <div className="pt-6 border-t border-[#EAEAEA] flex items-center space-x-6 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
              <span>ACCRA FREE DISPATCH</span>
              <span>·</span>
              <span>PAY ON DELIVERY</span>
              <span>·</span>
              <span>VERIFIED OEM</span>
            </div>
          </div>

          {/* Right Column: User's Uploaded Minimalist Living Space Image */}
          <div className="lg:col-span-7 relative">
            <div className="relative bg-[#EFEFEF] border border-[#E5E5E5] p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200">
                <Image
                  src="/assets/brand/hero-living.jpg"
                  alt="useoura living minimalist living room architectural setup"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white text-[10px] font-mono tracking-widest uppercase">
                  <span>RESIDENCE 01 // ACCRA LIVING</span>
                  <span className="bg-black/60 px-2.5 py-1 backdrop-blur-sm">FREE ACCRA COURIER</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
