"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface HeroSlide {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
}

interface HeroProps {
  onShopClick: () => void;
  onExploreProduct: (productId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  const slides: HeroSlide[] = [
    {
      id: "slide-living-oled",
      type: "image",
      src: "/assets/brand/hero-living.jpg",
      title: "Curated technology and daily essentials.",
    },
    {
      id: "slide-ambient-video",
      type: "video",
      src: "https://assets.mixkit.co/videos/preview/mixkit-living-room-in-a-modern-apartment-41488-large.mp4",
      poster: "/assets/brand/hero-living.jpg",
      title: "Quiet smart living.",
    },
    {
      id: "slide-official-model",
      type: "image",
      src: "/assets/brand/model/kisseh_official_model.jpg",
      title: "Pure form, uncompromised utility.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 6000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex]);

  const activeSlide = slides[currentIndex];

  return (
    <section className="relative w-full h-[75vh] sm:h-[82vh] lg:h-[90vh] bg-neutral-950 overflow-hidden select-none">
      {/* Full-Screen Landscape Media Container */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
            }`}
          >
            {slide.type === "video" ? (
              <video
                src={slide.src}
                poster={slide.poster}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="w-full h-full object-cover object-center"
              />
            )}

            {/* Gradient Overlays for Cinematic Depth & Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        );
      })}

      {/* Editorial Content Overlay (Minimal, Product Focused, Heavy Negative Space) */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:py-16 pointer-events-none">
        {/* Top Meta Tag */}
        <div className="pointer-events-auto">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/70">
            USEOURA LIVING
          </span>
        </div>

        {/* Bottom Headline & Call To Action */}
        <div className="space-y-6 max-w-2xl pointer-events-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.08]">
            {activeSlide.title}
          </h1>

          <div className="pt-2">
            <button
              onClick={onShopClick}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#1A1A1A] hover:bg-neutral-200 rounded-full text-xs font-mono uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-xl cursor-pointer"
            >
              <span>Shop Catalogue</span>
              <ArrowDown strokeWidth={1.5} className="w-3.5 h-3.5 ml-3" />
            </button>
          </div>
        </div>

        {/* Bottom Bar: Minimalist Slide Progress Lines & Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20 pointer-events-auto">
          {/* Slide Dash Indicators */}
          <div className="flex items-center space-x-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="group py-2 focus:outline-none"
              >
                <div
                  className={`h-[2px] transition-all duration-300 ${
                    currentIndex === idx
                      ? "w-12 bg-white"
                      : "w-6 bg-white/40 group-hover:bg-white/70"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Prev / Next Minimal Buttons */}
          <div className="flex items-center space-x-2 text-white">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
            >
              <ChevronLeft strokeWidth={1.5} className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
              className="p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none text-white/70 hover:text-white"
            >
              {isPlaying ? (
                <Pause strokeWidth={1.5} className="w-3.5 h-3.5" />
              ) : (
                <Play strokeWidth={1.5} className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
            >
              <ChevronRight strokeWidth={1.5} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
