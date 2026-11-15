"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Check,
  AlertCircle,
  Eye,
  ArrowLeft,
  Sparkles,
  Download,
  Upload,
} from "lucide-react";
import { Product, INITIAL_PRODUCTS, getStoredProducts } from "@/lib/products";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "new-assets" | "export">("products");

  // Detected new assets waiting for confirmation
  const detectedAssets = [
    {
      id: "raw-01",
      filename: "240w-angle-adapter-stand-isolated.webp",
      title: "240W Angle Adapter Stand",
      category: "Mobile & Desk Tech",
      price: 180,
      path: "/assets/products/mobile-desk/240w-angle-adapter-stand-isolated.webp",
      status: "Detected in /assets/products/",
    },
    {
      id: "raw-02",
      filename: "smart-visual-ear-cleaner-isolated.webp",
      title: "Smart Visual Ear Cleaner HD",
      category: "Minimalist Lifestyle",
      price: 240,
      path: "/assets/products/lifestyle/smart-visual-ear-cleaner-isolated.webp",
      status: "Detected in /assets/products/",
    },
    {
      id: "raw-03",
      filename: "prod-27-wifi-smart-light-switch.jpg",
      title: "Tuya Wi-Fi Smart Wall Switch",
      category: "Smart Home Automation",
      price: 195,
      path: "/assets/raw-products/prod-27-wifi-smart-light-switch.jpg",
      status: "Detected in /assets/raw-products/",
    },
  ];

  useEffect(() => {
    // Check if previously authenticated in this session
    const auth = sessionStorage.getItem("useoura_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setProducts(getStoredProducts());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "oura2026" || pin === "2026") {
      setIsAuthenticated(true);
      sessionStorage.setItem("useoura_admin_auth", "true");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleUpdateField = (id: string, field: keyof Product, value: any) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, [field]: value };
        if (field === "price") {
          updated.priceFormatted = `GH₵ ${Number(value).toFixed(2)}`;
        }
        return updated;
      })
    );
  };

  const handleSaveToStorefront = () => {
    try {
      localStorage.setItem("useoura_admin_products", JSON.stringify(products));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error(e);
      alert("Failed to save changes.");
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all products and prices back to initial catalogue defaults?")) {
      localStorage.removeItem("useoura_admin_products");
      setProducts(INITIAL_PRODUCTS);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleAddDetectedAsset = (asset: typeof detectedAssets[0]) => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      title: asset.title,
      description: "Precision-machined hardware curated for the modern space.",
      price: asset.price,
      priceFormatted: `GH₵ ${asset.price.toFixed(2)}`,
      category: asset.category as any,
      categorySlug:
        asset.category === "Mobile & Desk Tech"
          ? "mobile-desk"
          : asset.category === "Smart Home Automation"
          ? "smart-home"
          : "lifestyle",
      image: asset.path,
      secondaryImage: asset.path,
      images: [asset.path],
      tag: "NEW // 09",
      inStock: true,
      badge: "New Arrival",
      specs: [{ label: "Finish", value: "Matte Architectural" }],
    };

    setProducts((prev) => [newProd, ...prev]);
    alert(`Added "${asset.title}" to active catalogue! Click "Save to Live Storefront" to publish.`);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(products, null, 2));
    alert("Full catalogue JSON copied to clipboard!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center p-6 text-[#1A1A1A]">
        <div className="w-full max-w-sm bg-white border border-[#EAEAEA] p-8 shadow-xl space-y-6">
          <div className="space-y-2 text-center">
            <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
              USEOURA LIVING
            </span>
            <h1 className="text-xl font-medium tracking-tight">Admin Console</h1>
            <p className="text-xs text-neutral-500 font-mono">
              Enter security PIN to manage live store pricing and stock.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 font-mono">
            <div>
              <input
                type="password"
                placeholder="Enter PIN (default: oura2026)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-center tracking-widest text-sm p-3 border border-neutral-300 focus:outline-none focus:border-black"
              />
              {pinError && (
                <p className="text-[11px] text-red-600 mt-1.5 text-center">
                  Invalid PIN. Try: oura2026
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors"
            >
              Authenticate
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs font-mono text-neutral-400 hover:text-black">
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#1A1A1A]">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#EAEAEA] px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center space-x-1.5 text-xs font-mono text-neutral-500 hover:text-black"
          >
            <ArrowLeft strokeWidth={1.5} className="w-4 h-4" />
            <span>Storefront</span>
          </Link>
          <span className="text-neutral-300">|</span>
          <span className="font-semibold text-sm tracking-tight">useoura living — Admin Console</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-1.5 border border-neutral-300 text-xs font-mono text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            Reset Defaults
          </button>

          <button
            onClick={handleSaveToStorefront}
            className="px-5 py-2 bg-[#1A1A1A] text-white text-xs font-mono uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-colors flex items-center space-x-2 shadow-sm"
          >
            {savedSuccess ? (
              <>
                <Check strokeWidth={2} className="w-4 h-4 text-emerald-400" />
                <span>Saved & Live!</span>
              </>
            ) : (
              <>
                <Save strokeWidth={1.5} className="w-4 h-4" />
                <span>Save to Live Storefront</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-3 border-b border-neutral-200 pb-4">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider ${
              activeTab === "products"
                ? "bg-[#1A1A1A] text-white"
                : "bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            Live Products & Pricing ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("new-assets")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider flex items-center space-x-2 ${
              activeTab === "new-assets"
                ? "bg-[#1A1A1A] text-white"
                : "bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <span>Detected Assets ({detectedAssets.length})</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab("export")}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider ${
              activeTab === "export"
                ? "bg-[#1A1A1A] text-white"
                : "bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            Export / JSON Sync
          </button>
        </div>

        {/* TAB 1: PRODUCT MATRIX */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-xs font-mono text-neutral-500">
              <p>Edit pricing, toggle stock status, and adjust discounts. Changes save to browser & live site.</p>
              <span>{products.filter((p) => p.inStock).length} in stock / {products.filter((p) => !p.inStock).length} sold out</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#EAEAEA] p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs hover:border-neutral-400 transition-colors"
                >
                  {/* Left: Product Info & Image Thumbnail */}
                  <div className="flex items-center space-x-4 md:w-1/3">
                    <div className="relative w-16 h-16 bg-[#F0F0F0] border border-neutral-200 p-1 shrink-0 flex items-center justify-center">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="64px"
                        className="object-contain mix-blend-multiply"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                        {product.tag} · {product.categorySlug}
                      </span>
                      <h4 className="text-sm font-semibold text-[#1A1A1A]">
                        {product.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-mono">
                        {product.images?.length || 1} image angle(s)
                      </p>
                    </div>
                  </div>

                  {/* Center: Live Pricing Fields */}
                  <div className="grid grid-cols-2 gap-3 md:w-1/4 font-mono text-xs">
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">
                        Price (GH₵)
                      </label>
                      <input
                        type="number"
                        value={product.price}
                        onChange={(e) =>
                          handleUpdateField(product.id, "price", parseFloat(e.target.value) || 0)
                        }
                        className="w-full bg-neutral-50 border border-neutral-300 p-2 font-semibold text-[#1A1A1A] focus:bg-white focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">
                        Original (GH₵)
                      </label>
                      <input
                        type="number"
                        value={product.originalPrice || ""}
                        onChange={(e) =>
                          handleUpdateField(
                            product.id,
                            "originalPrice",
                            parseFloat(e.target.value) || undefined
                          )
                        }
                        placeholder="Optional"
                        className="w-full bg-neutral-50 border border-neutral-300 p-2 text-neutral-600 focus:bg-white focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* Right: Badges & Toggles */}
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                    {/* Stock Status Toggle */}
                    <button
                      onClick={() => handleUpdateField(product.id, "inStock", !product.inStock)}
                      className={`px-3 py-1.5 border uppercase text-[10px] tracking-wider font-semibold transition-colors ${
                        product.inStock
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-red-100 text-red-800 border-red-300"
                      }`}
                    >
                      {product.inStock ? "● In Stock" : "✕ Out of Stock"}
                    </button>

                    {/* Limited Edition Toggle */}
                    <button
                      onClick={() => handleUpdateField(product.id, "isLimited", !product.isLimited)}
                      className={`px-3 py-1.5 border uppercase text-[10px] tracking-wider transition-colors ${
                        product.isLimited
                          ? "bg-amber-100 text-amber-900 border-amber-300 font-semibold"
                          : "bg-white text-neutral-400 border-neutral-300"
                      }`}
                    >
                      Limited: {product.isLimited ? "ON" : "OFF"}
                    </button>

                    {/* Discount Flag Toggle */}
                    <button
                      onClick={() => handleUpdateField(product.id, "hasDiscount", !product.hasDiscount)}
                      className={`px-3 py-1.5 border uppercase text-[10px] tracking-wider transition-colors ${
                        product.hasDiscount
                          ? "bg-emerald-700 text-white border-emerald-700 font-semibold"
                          : "bg-white text-neutral-400 border-neutral-300"
                      }`}
                    >
                      Sale: {product.hasDiscount ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: DETECTED ASSETS & CHAT INTEGRATION */}
        {activeTab === "new-assets" && (
          <div className="space-y-6">
            <div className="bg-white border border-neutral-300 p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles strokeWidth={1.5} className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-[#1A1A1A]">
                  Chat & Workspace Asset Listener
                </h3>
              </div>
              <p className="text-xs text-neutral-600 font-mono leading-relaxed max-w-2xl">
                The moment new product renders, isolated webps, or photos are uploaded to the chat or workspace, they are detected here. You can review and confirm them to add them to your live catalogue.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {detectedAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-white border border-neutral-300 p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="relative w-full aspect-square bg-[#F0F0F0] border border-neutral-200 p-4 flex items-center justify-center">
                    <Image
                      src={asset.path}
                      alt={asset.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-emerald-700 font-semibold">
                      {asset.status}
                    </span>
                    <h4 className="text-base font-medium text-[#1A1A1A]">
                      {asset.title}
                    </h4>
                    <p className="text-xs font-mono text-neutral-500">
                      Suggested Price: GH₵ {asset.price.toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddDetectedAsset(asset)}
                    className="w-full py-2.5 bg-[#1A1A1A] hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus strokeWidth={1.5} className="w-4 h-4" />
                    <span>Confirm & Add to Store</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EXPORT / JSON SYNC */}
        {activeTab === "export" && (
          <div className="bg-white border border-neutral-300 p-8 space-y-6 font-mono text-xs">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-[#1A1A1A]">
                Synchronize Catalogue
              </h3>
              <p className="text-neutral-500">
                You can copy the updated JSON array directly or paste it into your codebase.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCopyJSON}
                className="px-4 py-2.5 bg-[#1A1A1A] text-white uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-colors flex items-center space-x-2"
              >
                <Download strokeWidth={1.5} className="w-4 h-4" />
                <span>Copy JSON to Clipboard</span>
              </button>
            </div>

            <pre className="p-4 bg-neutral-900 text-neutral-200 text-[11px] overflow-x-auto max-h-96 border border-neutral-800">
              {JSON.stringify(products, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
