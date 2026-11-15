"use client";

import React from "react";
import { MessageCircle, Check, Wrench, Shield, Sparkles } from "lucide-react";
import { getWhatsAppNumber } from "@/lib/config";

export const SmartHomeSection: React.FC = () => {
  const handleBookConsultation = () => {
    const num = getWhatsAppNumber();
    const message = `Hello *useoura living*, I would like to inquire about your *Smart Home Setups & Custom Configurations* service for my residence/workspace in Accra. Please share available consultation slots and package details.`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section className="w-full border-b border-[#EAEAEA] bg-[#F7F7F5] py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#EAEAEA] gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-500">
              <span className="w-2 h-[1px] bg-neutral-900" />
              <span>SERVICES // 05</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1A1A1A]">
              Smart Home Engineering
            </h2>
          </div>

          <div className="max-w-md text-xs sm:text-sm text-neutral-500 font-normal leading-relaxed">
            We don&apos;t just sell hardware — we design, configure, and install integrated smart home ecosystems across Greater Accra with zero visible wires.
          </div>
        </div>

        {/* Video & Editorial Service Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Responsive Minimalist YouTube Architectural Embed */}
          <div className="lg:col-span-7">
            <div className="relative aspect-video w-full bg-neutral-900 border border-neutral-300 shadow-xl overflow-hidden">
              <iframe
                className="w-full h-full object-cover"
                src="https://www.youtube-nocookie.com/embed/5O_U8N32R48?rel=0&modestbranding=1"
                title="Minimalist Smart Home Automation & Configuration"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-3 flex justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
              <span>CASE STUDY: ARCHITECTURAL AMBIENCE</span>
              <span>ZIGBEE 3.0 / MATTE FINISH</span>
            </div>
          </div>

          {/* Right: Service Principles & Booking CTA */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 block">
                IN-PERSON SETUP // GREATER ACCRA
              </span>
              <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#1A1A1A]">
                Turnkey Automation. Zero Visual Clutter.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                Our technical team handles everything from local Zigbee 3.0 mesh configuration, smart circuit breaker integration, to flush ambient lighting and automated curtain controls.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-3 text-xs font-mono text-neutral-700">
              <div className="flex items-start space-x-3">
                <Check strokeWidth={2} className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Local Offline Execution (operates seamlessly even during ISP downtime)</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check strokeWidth={2} className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Zero exposed wiring — clean architectural channel integration</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check strokeWidth={2} className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Apple Home, Google Home & Home Assistant custom bridges</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check strokeWidth={2} className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>On-site walkthrough and post-installation support in Accra</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 border-t border-[#EAEAEA] space-y-3">
              <button
                onClick={handleBookConsultation}
                className="w-full py-4 bg-[#1A1A1A] hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-[0.2em] font-medium transition-all flex items-center justify-center space-x-3 shadow-md"
              >
                <MessageCircle strokeWidth={1.5} className="w-4 h-4" />
                <span>Book Smart Home Consultation</span>
              </button>
              <p className="text-[10px] font-mono text-neutral-400 text-center uppercase tracking-wider">
                Direct WhatsApp scheduling with our Accra engineering team
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
