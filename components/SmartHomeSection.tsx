"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MessageCircle, Check, Play, Pause, Volume2, VolumeX, ExternalLink } from "lucide-react";
import { getWhatsAppNumber } from "@/lib/config";
import { getClientStoreData } from "@/lib/store";

export const SmartHomeSection: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>(
    "https://assets.mixkit.co/videos/preview/mixkit-living-room-in-a-modern-apartment-41488-large.mp4"
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasIframeError, setHasIframeError] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadVideo = () => {
        const store = getClientStoreData();
        if (store.settings?.smartHomeVideoUrl) {
          setVideoUrl(store.settings.smartHomeVideoUrl);
        }
      };
      loadVideo();
      window.addEventListener("storage", loadVideo);
      return () => window.removeEventListener("storage", loadVideo);
    }
  }, []);

  const handleBookConsultation = () => {
    const num = getWhatsAppNumber();
    const message = `Hello *useoura living*, I would like to book a *Smart Home Setup & Custom Configuration* consultation in Accra.`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Helper to extract YouTube video ID if provided
  const getYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = getYouTubeId(videoUrl);
  const isDirectVideo = !youtubeId && (videoUrl.includes(".mp4") || videoUrl.includes(".webm") || videoUrl.includes("mixkit.co") || !videoUrl.includes("youtube"));

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
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
          {/* Responsive Minimalist Video Player */}
          <div className="lg:col-span-7">
            <div className="relative aspect-video w-full bg-neutral-900 border border-neutral-300 shadow-xl overflow-hidden group">
              {youtubeId && !hasIframeError ? (
                /* YouTube Embed with Clean Parameterized URL */
                <iframe
                  className="w-full h-full object-cover"
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=1&modestbranding=1&rel=0`}
                  title="Minimalist Smart Home Automation & Configuration"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={() => setHasIframeError(true)}
                />
              ) : (
                /* Native HTML5 Ambient Video Player (Reliable, Zero Third-Party Blocks) */
                <div className="relative w-full h-full flex items-center justify-center bg-neutral-950">
                  <video
                    ref={videoRef}
                    src={
                      hasIframeError
                        ? "https://assets.mixkit.co/videos/preview/mixkit-living-room-in-a-modern-apartment-41488-large.mp4"
                        : videoUrl
                    }
                    poster="/assets/brand/hero-living.jpg"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Video Controls Bar */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
                    <button
                      onClick={togglePlay}
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                      className="px-3 py-1.5 bg-black/70 hover:bg-black text-white text-[10px] font-mono uppercase tracking-wider rounded flex items-center space-x-1.5 backdrop-blur-sm transition-all"
                    >
                      {isPlaying ? (
                        <>
                          <Pause strokeWidth={1.5} className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play strokeWidth={1.5} className="w-3.5 h-3.5" />
                          <span>Play</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={toggleMute}
                      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                      className="p-2 bg-black/70 hover:bg-black text-white rounded backdrop-blur-sm transition-all"
                    >
                      {isMuted ? (
                        <VolumeX strokeWidth={1.5} className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 strokeWidth={1.5} className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Status Badge in Corner */}
              <div className="absolute top-3 left-3 bg-black/70 text-white text-[9px] font-mono px-2.5 py-1 uppercase tracking-widest backdrop-blur-sm pointer-events-none z-10">
                LIVING ARCHITECTURE · ACCRA
              </div>
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
                className="w-full py-4 bg-[#1A1A1A] hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-[0.2em] font-medium transition-all flex items-center justify-center space-x-3 shadow-md cursor-pointer"
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
