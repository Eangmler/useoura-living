"use client";

import React from "react";
import { MessageCircle, Check } from "lucide-react";
import { getWhatsAppNumber } from "@/lib/config";

export const SmartHomeSection: React.FC = () => {
  const handleBookConsultation = () => {
    const num = getWhatsAppNumber();
    const message = `Hello *useoura living*, I would like to book a *Smart Home Setup & Custom Configuration* consultation in Accra.`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section className="w-full border-b border-[#EAEAEA] bg-[#F7F7F5] py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Clean Header - NO Section Numbers, NO Paragraph Blurbs */}
        <div className="flex items-end justify-between mb-12 pb-6 border-b border-[#EAEAEA]">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1A1A1A]">
            Smart Home Setups
          </h2>
        </div>

        {/* Video & Consultation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Responsive Minimalist YouTube Embed */}
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
          </div>

          {/* Right: Setup Capabilities & Booking */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#1A1A1A]">
                Turnkey Automation. Zero Visible Wires.
              </h3>
            </div>

            {/* Clean Feature List */}
            <div className="space-y-3.5 text-xs font-mono text-neutral-700">
              <div className="flex items-start space-x-3">
                <Check strokeWidth={2} className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Local Offline Execution (operates during internet downtime)</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check strokeWidth={2} className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Concealed architectural wiring and flush switches</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check strokeWidth={2} className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Zigbee 3.0 mesh & Apple Home / Home Assistant bridges</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check strokeWidth={2} className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>On-site walkthrough and installation across Greater Accra</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <button
                onClick={handleBookConsultation}
                className="w-full py-4 bg-[#1A1A1A] hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-[0.2em] font-medium transition-all flex items-center justify-center space-x-3 shadow-md"
              >
                <MessageCircle strokeWidth={1.5} className="w-4 h-4" />
                <span>Book Consultation on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
