"use client";

import React from "react";
import { Cpu, ShieldCheck, Sun, Magnet } from "lucide-react";

export const CraftsmanshipSection: React.FC = () => {
  const materials = [
    {
      number: "01",
      icon: Cpu,
      title: "Anodized Space Aluminum",
      subtitle: "205-Grit Tactile Finish",
      description: "Monolithic CNC-machined aerospace alloy providing passive heat dissipation, structural rigidity, and a cool, matte tactile feel that resists fingerprints.",
      spec: "100% Recyclable Alloy · Zero Plastic Housing",
    },
    {
      number: "02",
      icon: ShieldCheck,
      title: "Ballistic Double-Braid",
      subtitle: "25,000+ Lifecycle Bends",
      description: "High-density nylon weave engineered with integrated strain-relief collars and smart E-Marker power chips to deliver lossless 100W charging.",
      spec: "Ballistic Nylon Outer · Tinned Copper Core",
    },
    {
      number: "03",
      icon: Sun,
      title: "Asymmetrical 45° Optics",
      subtitle: "Ra ≥ 95 Color Rendering Index",
      description: "Precision light guides direct task lighting solely onto your desk mat and keyboard, cutting off screen bounce and preventing digital eye fatigue.",
      spec: "Zero Screen Glare · Stepless 2700K - 6500K",
    },
    {
      number: "04",
      icon: Magnet,
      title: "N52 Neodymium Array",
      subtitle: "Aerospace High-Holding Force",
      description: "A circular arrangement of sixteen N52 rare-earth magnets calibrated for instantaneous snap-lock alignment with fluid 360° damping ball joints.",
      spec: "16x N52 Array · 3M VHB Thermal Adhesive",
    },
  ];

  return (
    <section className="w-full border-b border-[#EAEAEA] bg-[#F7F7F5] py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#EAEAEA] gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block">
              DIETER RAMS PRINCIPLE 06 // HONEST DESIGN
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1A1A1A]">
              Materials & Precision
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono text-neutral-500 max-w-md">
            Lofree-inspired tactile finishes meet Braun utilitarian durability. Hardware designed not to distract, but to endure.
          </p>
        </div>

        {/* 4-Column Material Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {materials.map((mat) => {
            const IconComponent = mat.icon;

            return (
              <div
                key={mat.number}
                className="group bg-[#F0F0F0] border border-[#E5E5E5] hover:border-[#1A1A1A] p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-md"
              >
                <div className="space-y-6">
                  {/* Top Bar: Icon & Serial Number */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full border border-neutral-300 bg-white flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                      <IconComponent strokeWidth={1.5} className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono tracking-widest text-neutral-400">
                      {mat.number}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-[#1A1A1A] tracking-tight">
                      {mat.title}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                      {mat.subtitle}
                    </span>
                  </div>

                  {/* Technical Body */}
                  <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                    {mat.description}
                  </p>
                </div>

                {/* Footer Micro Spec Pill */}
                <div className="pt-6 mt-6 border-t border-neutral-300/60">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 block">
                    {mat.spec}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
