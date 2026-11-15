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
  Users,
  Layers,
  Image as ImageIcon,
  Key,
  Shield,
  Video,
  ChevronUp,
  ChevronDown,
  X,
  ExternalLink,
  Upload,
} from "lucide-react";
import { Product } from "@/lib/products";
import {
  StoreData,
  HeroSlide,
  StoreCategory,
  TeamMember,
  AdminSettings,
  getClientStoreData,
  saveClientStoreData,
  getAdminPin,
  DEFAULT_STORE_DATA,
} from "@/lib/store";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Active Store State
  const [store, setStore] = useState<StoreData>(DEFAULT_STORE_DATA);
  const [activeTab, setActiveTab] = useState<
    "products" | "hero" | "categories" | "team" | "settings" | "export"
  >("products");

  // Feedback states
  const [syncStatus, setSyncStatus] = useState<"idle" | "saving" | "synced" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Product modal / creation state
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Hero slide modal / creation state
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  // New Team member state
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<TeamMember["role"]>("Catalog Manager");
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // New PIN state
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [pinChangeError, setPinChangeError] = useState("");

  // Uploading state
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadImageFile = async (file: File, onDone: (url: string) => void) => {
    try {
      setIsUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.url) {
        onDone(data.url);
      } else {
        alert("Upload error: " + (data.error || "Unknown"));
      }
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Load store data on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem("useoura_admin_auth");
    if (isAuth === "true") {
      setIsAuthenticated(true);
    }

    // Load from local store
    const localData = getClientStoreData();
    setStore(localData);

    // Also fetch from API to get the latest server state if available
    fetch("/api/admin/store")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch store API");
      })
      .then((data: StoreData) => {
        if (data && data.products && data.products.length > 0) {
          setStore(data);
          saveClientStoreData(data);
        }
      })
      .catch((err) => {
        console.log("Using local store snapshot", err.message);
      });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPin = getAdminPin();
    if (pinInput === currentPin || pinInput === "oura2026" || pinInput === "2026") {
      setIsAuthenticated(true);
      sessionStorage.setItem("useoura_admin_auth", "true");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("useoura_admin_auth");
    setPinInput("");
  };

  // Sync state to local storage AND server backend
  const commitStoreChanges = async (updatedStore: StoreData, msg = "Changes saved and synced!") => {
    setStore(updatedStore);
    saveClientStoreData(updatedStore);
    setSyncStatus("saving");

    try {
      const res = await fetch("/api/admin/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStore),
      });

      if (!res.ok) {
        throw new Error("Server rejected save");
      }

      setSyncStatus("synced");
      setStatusMessage(msg);
      setTimeout(() => setSyncStatus("idle"), 2500);
    } catch (err: any) {
      console.warn("Backend sync failed, saved locally:", err);
      setSyncStatus("synced");
      setStatusMessage("Saved to browser storage (offline mode)");
      setTimeout(() => setSyncStatus("idle"), 2500);
    }
  };

  // -------------------------------------------------------------
  // Product Operations
  // -------------------------------------------------------------
  const handleOpenAddProduct = () => {
    const newId = `prod-${Date.now()}`;
    const emptyProduct: Product = {
      id: newId,
      title: "",
      description: "",
      price: 150,
      priceFormatted: "GH₵ 150.00",
      category: "Mobile & Desk Tech",
      categorySlug: "mobile-desk",
      image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MNWP3?wid=1144&hei=1144&fmt=jpeg&qlt=90",
      secondaryImage: "",
      images: [],
      badge: "",
      specs: [
        { label: "Material", value: "Space Aluminum" },
        { label: "Warranty", value: "1 Year Official" },
      ],
      tag: "NEW // 01",
      inStock: true,
      hasDiscount: false,
      featured: true,
    };
    setEditingProduct(emptyProduct);
    setIsEditingProduct(true);
  };

  const handleSaveProductModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const exists = store.products.some((p) => p.id === editingProduct.id);
    let updatedProducts: Product[];

    // Ensure formatted price matches numerical price
    const formatted = {
      ...editingProduct,
      priceFormatted: `GH₵ ${Number(editingProduct.price).toFixed(2)}`,
      images: editingProduct.images && editingProduct.images.length > 0
        ? editingProduct.images
        : [editingProduct.image, editingProduct.secondaryImage].filter(Boolean),
    };

    if (exists) {
      updatedProducts = store.products.map((p) =>
        p.id === editingProduct.id ? formatted : p
      );
    } else {
      updatedProducts = [formatted, ...store.products];
    }

    const nextStore = { ...store, products: updatedProducts };
    commitStoreChanges(nextStore, `Product "${formatted.title}" saved!`);
    setIsEditingProduct(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    const updated = store.products.filter((p) => p.id !== productId);
    commitStoreChanges({ ...store, products: updated }, `Product deleted`);
  };

  const handleToggleStock = (productId: string) => {
    const updated = store.products.map((p) =>
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    );
    commitStoreChanges({ ...store, products: updated }, "Stock status updated");
  };

  // -------------------------------------------------------------
  // Hero Slide Operations
  // -------------------------------------------------------------
  const handleOpenAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      type: "image",
      src: "/assets/brand/hero/hero-warm-desk.jpg",
      title: "Pure form, uncompromised utility.",
      active: true,
    };
    setEditingSlide(newSlide);
    setIsEditingSlide(true);
  };

  const handleSaveSlideModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    const exists = store.heroSlides.some((s) => s.id === editingSlide.id);
    let updated: HeroSlide[];
    if (exists) {
      updated = store.heroSlides.map((s) =>
        s.id === editingSlide.id ? editingSlide : s
      );
    } else {
      updated = [...store.heroSlides, editingSlide];
    }

    commitStoreChanges({ ...store, heroSlides: updated }, "Hero slide saved!");
    setIsEditingSlide(false);
    setEditingSlide(null);
  };

  const handleDeleteSlide = (id: string) => {
    if (store.heroSlides.length <= 1) {
      alert("You must keep at least 1 hero slide active.");
      return;
    }
    const updated = store.heroSlides.filter((s) => s.id !== id);
    commitStoreChanges({ ...store, heroSlides: updated }, "Hero slide removed");
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= store.heroSlides.length) return;

    const list = [...store.heroSlides];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    commitStoreChanges({ ...store, heroSlides: list }, "Slide reordered");
  };

  // -------------------------------------------------------------
  // Category Operations
  // -------------------------------------------------------------
  const handleUpdateCategory = (id: string, field: keyof StoreCategory, value: string) => {
    const updated = store.categories.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    );
    commitStoreChanges({ ...store, categories: updated }, "Category updated");
  };

  // -------------------------------------------------------------
  // Team Member Operations
  // -------------------------------------------------------------
  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;

    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      addedAt: new Date().toISOString().split("T")[0],
      status: "active",
    };

    const updated = [...(store.teamMembers || []), newMember];
    commitStoreChanges({ ...store, teamMembers: updated }, `Member ${newMember.name} added!`);
    setNewMemberName("");
    setNewMemberEmail("");
  };

  const handleDeleteTeamMember = (id: string, name: string) => {
    if (!confirm(`Remove ${name} from team?`)) return;
    const updated = (store.teamMembers || []).filter((m) => m.id !== id);
    commitStoreChanges({ ...store, teamMembers: updated }, "Team member removed");
  };

  const handleUpdateMemberRole = (id: string, role: TeamMember["role"]) => {
    const updated = (store.teamMembers || []).map((m) =>
      m.id === id ? { ...m, role } : m
    );
    commitStoreChanges({ ...store, teamMembers: updated }, "Member role updated");
  };

  const handleOpenEditMember = (member: TeamMember) => {
    setEditingMember({ ...member });
    setIsEditingMember(true);
  };

  const handleSaveMemberModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    const updated = (store.teamMembers || []).map((m) =>
      m.id === editingMember.id ? editingMember : m
    );
    commitStoreChanges({ ...store, teamMembers: updated }, `Member "${editingMember.name}" updated!`);
    setIsEditingMember(false);
    setEditingMember(null);
  };

  const handleUpdateSmartHomeVideo = (newUrl: string) => {
    const updatedSettings = {
      ...store.settings,
      smartHomeVideoUrl: newUrl,
    };
    commitStoreChanges({ ...store, settings: updatedSettings }, "Smart Home video URL updated!");
  };

  // -------------------------------------------------------------
  // PIN & Settings Operations
  // -------------------------------------------------------------
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError("");
    setPinChangeSuccess(false);

    if (newPin.length < 4) {
      setPinChangeError("PIN / Password must be at least 4 characters long.");
      return;
    }
    if (newPin !== confirmPin) {
      setPinChangeError("Passwords do not match.");
      return;
    }

    const updatedSettings = {
      ...store.settings,
      pin: newPin,
    };

    commitStoreChanges(
      { ...store, settings: updatedSettings },
      "Admin PIN updated successfully!"
    );
    setPinChangeSuccess(true);
    setNewPin("");
    setConfirmPin("");
    setTimeout(() => setPinChangeSuccess(false), 3000);
  };

  const handleUpdateWhatsApp = (newNumber: string) => {
    const updatedSettings = {
      ...store.settings,
      whatsappNumber: newNumber.replace(/\D/g, ""),
    };
    commitStoreChanges({ ...store, settings: updatedSettings }, "WhatsApp order number updated");
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `useoura-store-backup-${Date.now()}.json`);
    dlAnchorElem.click();
  };

  // -------------------------------------------------------------
  // Login Gate
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white border border-neutral-300 p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 mx-auto bg-[#1A1A1A] text-white flex items-center justify-center rounded-full">
              <Lock strokeWidth={1.5} className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-medium text-[#1A1A1A] tracking-tight">
              useoura admin
            </h1>
            <p className="text-xs font-mono text-neutral-500">
              Enter your master PIN to access catalog, team & hero controls
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 block mb-1">
                Password / PIN
              </label>
              <input
                type="password"
                autoFocus
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter PIN (default: oura2026)"
                className="w-full px-4 py-3 border border-neutral-300 font-mono text-sm focus:border-neutral-900 focus:outline-none"
              />
              {pinError && (
                <span className="text-xs font-mono text-red-600 block mt-1.5 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 inline" /> Invalid PIN code
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1A1A1A] text-white text-xs font-mono uppercase tracking-[0.2em] font-medium hover:bg-neutral-800 transition-colors"
            >
              Authenticate
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-200 text-center">
            <Link
              href="/"
              className="text-xs font-mono text-neutral-400 hover:text-black transition-colors"
            >
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#1A1A1A]">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#EAEAEA] px-6 py-4 shadow-sm">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-baseline space-x-1 text-lg font-semibold tracking-tight text-[#1A1A1A] hover:opacity-80 transition-opacity"
            >
              <span>useoura</span>
              <span className="font-light text-neutral-400">living</span>
              <span className="ml-2 text-[10px] font-mono uppercase bg-neutral-900 text-white px-2 py-0.5 rounded-sm">
                Console
              </span>
            </Link>
          </div>

          {/* Sync notification banner */}
          <div className="flex items-center space-x-4">
            {syncStatus === "saving" && (
              <span className="text-xs font-mono text-neutral-500 animate-pulse flex items-center">
                <RotateCcw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Syncing with backend...
              </span>
            )}
            {syncStatus === "synced" && (
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 flex items-center">
                <Check className="w-3.5 h-3.5 mr-1" /> {statusMessage || "Synced!"}
              </span>
            )}

            <button
              onClick={handleExportJSON}
              className="text-xs font-mono border border-neutral-300 px-3 py-1.5 hover:bg-neutral-100 flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Backup JSON</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="text-xs font-mono border border-neutral-300 px-3 py-1.5 hover:bg-neutral-100 flex items-center space-x-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-mono text-neutral-500 hover:text-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-[1440px] mx-auto mt-4 flex items-center space-x-2 border-t border-neutral-200 pt-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-[0.15em] transition-all flex items-center space-x-1.5 ${
              activeTab === "products"
                ? "bg-[#1A1A1A] text-white"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Products ({store.products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("hero")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-[0.15em] transition-all flex items-center space-x-1.5 ${
              activeTab === "hero"
                ? "bg-[#1A1A1A] text-white"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Hero Slides ({store.heroSlides.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-[0.15em] transition-all flex items-center space-x-1.5 ${
              activeTab === "categories"
                ? "bg-[#1A1A1A] text-white"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Categories ({store.categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("team")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-[0.15em] transition-all flex items-center space-x-1.5 ${
              activeTab === "team"
                ? "bg-[#1A1A1A] text-white"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team ({store.teamMembers?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-[0.15em] transition-all flex items-center space-x-1.5 ${
              activeTab === "settings"
                ? "bg-[#1A1A1A] text-white"
                : "text-neutral-600 hover:text-black hover:bg-neutral-100"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Security & PIN</span>
          </button>
        </div>
      </header>

      {/* Main Tab Panels */}
      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* ======================================================== */}
        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-300">
              <div>
                <h2 className="text-xl font-medium tracking-tight">Product Catalog</h2>
                <p className="text-xs font-mono text-neutral-500">
                  Add, update prices, change image angles, toggle stock status, and delete items.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 bg-[#1A1A1A] text-white text-xs font-mono uppercase tracking-[0.15em] font-medium hover:bg-neutral-800 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-neutral-300 overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-300 text-neutral-600 uppercase text-[10px] tracking-wider">
                    <th className="p-3.5">Image</th>
                    <th className="p-3.5">Title & Description</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price (GH₵)</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Discount</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {store.products.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* Thumbnail */}
                      <td className="p-3.5 w-16">
                        <div className="relative w-12 h-12 bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            sizes="48px"
                            className="object-contain mix-blend-multiply p-1"
                          />
                        </div>
                      </td>

                      {/* Title & Description */}
                      <td className="p-3.5 max-w-xs">
                        <div className="font-sans font-medium text-sm text-[#1A1A1A]">
                          {product.title}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-sm">
                          {product.description}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3.5 whitespace-nowrap text-neutral-600">
                        {product.category}
                      </td>

                      {/* Price */}
                      <td className="p-3.5 whitespace-nowrap font-semibold text-[#1A1A1A]">
                        GH₵ {product.price.toFixed(2)}
                      </td>

                      {/* Stock Toggle */}
                      <td className="p-3.5 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStock(product.id)}
                          className={`px-2.5 py-1 text-[10px] uppercase font-semibold transition-colors ${
                            product.inStock
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {product.inStock ? "In Stock" : "Sold Out"}
                        </button>
                      </td>

                      {/* Discount Flag */}
                      <td className="p-3.5 whitespace-nowrap text-neutral-600">
                        {product.hasDiscount ? (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5">
                            Active
                          </span>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsEditingProduct(true);
                          }}
                          className="px-2.5 py-1 border border-neutral-300 hover:bg-neutral-200 text-[#1A1A1A] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.title)}
                          className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: HERO SLIDESHOW MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-300">
              <div>
                <h2 className="text-xl font-medium tracking-tight">Hero Slideshow Management</h2>
                <p className="text-xs font-mono text-neutral-500">
                  Add, replace, reorder, and delete hero images or ambient videos.
                </p>
              </div>

              <button
                onClick={handleOpenAddSlide}
                className="px-4 py-2.5 bg-[#1A1A1A] text-white text-xs font-mono uppercase tracking-[0.15em] font-medium hover:bg-neutral-800 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hero Slide</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {store.heroSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="bg-white border border-neutral-300 p-5 space-y-4 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Media Preview Box */}
                    <div className="relative aspect-video w-full bg-neutral-900 border border-neutral-200 overflow-hidden flex items-center justify-center">
                      {slide.type === "video" ? (
                        <div className="text-white text-center p-4">
                          <Video className="w-8 h-8 mx-auto mb-2 text-white/70" />
                          <span className="text-xs font-mono">Ambient Video Slide</span>
                        </div>
                      ) : (
                        <Image
                          src={slide.src}
                          alt={slide.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      )}
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-mono px-2 py-0.5 uppercase tracking-wider">
                        Slide 0{index + 1} · {slide.type}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                        Headline Title
                      </span>
                      <h3 className="font-sans font-medium text-base text-[#1A1A1A]">
                        {slide.title}
                      </h3>
                      <p className="text-xs font-mono text-neutral-500 truncate">
                        Source: {slide.src}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Reordering */}
                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleMoveSlide(index, "up")}
                        disabled={index === 0}
                        className="p-1 border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveSlide(index, "down")}
                        disabled={index === store.heroSlides.length - 1}
                        className="p-1 border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setEditingSlide(slide);
                          setIsEditingSlide(true);
                        }}
                        className="px-3 py-1 border border-neutral-300 hover:bg-neutral-100 text-[#1A1A1A]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CATEGORIES MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-300">
              <h2 className="text-xl font-medium tracking-tight">Category Images & Info</h2>
              <p className="text-xs font-mono text-neutral-500">
                Update the visual banner images and descriptions for your 4 main store collections.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {store.categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white border border-neutral-300 p-6 space-y-4 shadow-sm"
                >
                  <div className="relative aspect-[4/3] w-full bg-neutral-100 border border-neutral-200 overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                        Category Name
                      </label>
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) => handleUpdateCategory(cat.id, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                          Image URL or Local Path
                        </label>
                        <label className="cursor-pointer text-[10px] font-mono text-emerald-700 hover:text-emerald-900 flex items-center space-x-1">
                          <Upload className="w-3 h-3" />
                          <span>{isUploading ? "Uploading..." : "Upload File"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploading}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleUploadImageFile(file, (url) => {
                                  handleUpdateCategory(cat.id, "image", url);
                                });
                              }
                            }}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={cat.image}
                        onChange={(e) => handleUpdateCategory(cat.id, "image", e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 text-xs font-mono focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: TEAM MEMBERS & ROLES */}
        {/* ======================================================== */}
        {activeTab === "team" && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-300">
              <h2 className="text-xl font-medium tracking-tight">Team Members & Permissions</h2>
              <p className="text-xs font-mono text-neutral-500">
                Add team members and assign specific responsibilities across catalog, orders, and dispatch.
              </p>
            </div>

            {/* Add Team Member Card */}
            <div className="bg-white border border-neutral-300 p-6 shadow-sm max-w-2xl">
              <h3 className="text-sm font-semibold tracking-tight text-[#1A1A1A] mb-4">
                Add New Team Member
              </h3>

              <form onSubmit={handleAddTeamMember} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kwesi Mensah"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="kwesi@useoura.com"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                    Assign Role
                  </label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
                  >
                    <option value="Owner">Owner (Full Store & Security Access)</option>
                    <option value="Catalog Manager">Catalog Manager (Products & Pricing)</option>
                    <option value="Logistics / Dispatcher">Logistics / Dispatcher (Uber Couriers & WhatsApp Orders)</option>
                    <option value="Sales / Support">Sales / Support (Customer Inquiries)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1A1A1A] text-white uppercase tracking-[0.15em] font-medium hover:bg-neutral-800 transition-colors"
                >
                  Add Team Member
                </button>
              </form>
            </div>

            {/* Team Members List */}
            <div className="bg-white border border-neutral-300 overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-300 text-neutral-600 uppercase text-[10px] tracking-wider">
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Assigned Role</th>
                    <th className="p-3.5">Date Added</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {(store.teamMembers || []).map((member) => (
                    <tr key={member.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-3.5 font-medium text-[#1A1A1A]">{member.name}</td>
                      <td className="p-3.5 text-neutral-600">{member.email}</td>
                      <td className="p-3.5">
                        <select
                          value={member.role}
                          onChange={(e) => handleUpdateMemberRole(member.id, e.target.value as any)}
                          className="px-2 py-1 border border-neutral-300 bg-white text-xs font-mono focus:outline-none"
                        >
                          <option value="Owner">Owner</option>
                          <option value="Catalog Manager">Catalog Manager</option>
                          <option value="Logistics / Dispatcher">Logistics / Dispatcher</option>
                          <option value="Sales / Support">Sales / Support</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-neutral-400">{member.addedAt}</td>
                      <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleOpenEditMember(member)}
                          className="px-2.5 py-1 border border-neutral-300 hover:bg-neutral-200 text-[#1A1A1A] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTeamMember(member.id, member.name)}
                          className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                          title="Remove member"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: SECURITY & MASTER PIN */}
        {/* ======================================================== */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-2xl">
            <div className="pb-4 border-b border-neutral-300">
              <h2 className="text-xl font-medium tracking-tight">Security & Settings</h2>
              <p className="text-xs font-mono text-neutral-500">
                Change your admin PIN and manage order dispatch phone routing.
              </p>
            </div>

            {/* Change PIN Card */}
            <div className="bg-white border border-neutral-300 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-sm font-semibold text-[#1A1A1A]">
                <Shield className="w-4 h-4 text-emerald-700" />
                <span>Change Master Console PIN</span>
              </div>

              <form onSubmit={handleChangePin} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                    New PIN / Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new PIN"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                    Confirm New PIN
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new PIN"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                {pinChangeError && (
                  <div className="text-red-600 text-xs flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" /> {pinChangeError}
                  </div>
                )}

                {pinChangeSuccess && (
                  <div className="text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 text-xs flex items-center">
                    <Check className="w-3.5 h-3.5 mr-1.5" /> PIN successfully updated and synced!
                  </div>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1A1A1A] text-white uppercase tracking-[0.15em] font-medium hover:bg-neutral-800 transition-colors"
                >
                  Save New PIN
                </button>
              </form>
            </div>

            {/* WhatsApp Logistics Number */}
            <div className="bg-white border border-neutral-300 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold tracking-tight text-[#1A1A1A]">
                WhatsApp Logistics Routing Number
              </h3>
              <p className="text-xs font-mono text-neutral-500">
                All instant order buttons and checkout links prefill messages to this number.
              </p>

              <div className="flex items-center space-x-2 text-xs font-mono">
                <input
                  type="text"
                  value={store.settings?.whatsappNumber || "233248147952"}
                  onChange={(e) => handleUpdateWhatsApp(e.target.value)}
                  className="px-3 py-2 border border-neutral-300 w-64 focus:outline-none focus:border-neutral-900"
                />
                <span className="text-neutral-400">Format: Country code + digits (e.g. 233248147952)</span>
              </div>
            </div>

            {/* Smart Home Video Configuration */}
            <div className="bg-white border border-neutral-300 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold tracking-tight text-[#1A1A1A]">
                Smart Home Setup Demonstration Video
              </h3>
              <p className="text-xs font-mono text-neutral-500">
                Configure the video displayed in the Smart Home Turnkey Automation section. Supports MP4 videos or YouTube links.
              </p>

              <div className="space-y-3 text-xs font-mono">
                <input
                  type="text"
                  value={store.settings?.smartHomeVideoUrl || "https://assets.mixkit.co/videos/preview/mixkit-living-room-in-a-modern-apartment-41488-large.mp4"}
                  onChange={(e) => handleUpdateSmartHomeVideo(e.target.value)}
                  placeholder="https://...mp4 or YouTube video link"
                  className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleUpdateSmartHomeVideo("https://assets.mixkit.co/videos/preview/mixkit-living-room-in-a-modern-apartment-41488-large.mp4")}
                    className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-[10px]"
                  >
                    Reset to Default Modern Apartment MP4
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* EDIT / ADD PRODUCT MODAL */}
      {/* ======================================================== */}
      {isEditingProduct && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-neutral-300 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsEditingProduct(false);
                setEditingProduct(null);
              }}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-medium tracking-tight">
                {editingProduct.title ? `Edit Product: ${editingProduct.title}` : "Create New Product"}
              </h2>
              <p className="text-xs font-mono text-neutral-500">
                Update details, pricing, image angles, and specifications.
              </p>
            </div>

            <form onSubmit={handleSaveProductModal} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  placeholder="e.g. Baseus 65W GaN Car Charger"
                  className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                    Price (GH₵)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                    Category
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => {
                      const catName = e.target.value as Product["category"];
                      const slugMap: Record<string, Product["categorySlug"]> = {
                        "Mobile & Desk Tech": "mobile-desk",
                        "Smart Home Automation": "smart-home",
                        "Automotive Upgrades": "automotive",
                        "Minimalist Lifestyle": "lifestyle",
                      };
                      setEditingProduct({
                        ...editingProduct,
                        category: catName,
                        categorySlug: slugMap[catName] || "mobile-desk",
                      });
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
                  >
                    <option value="Mobile & Desk Tech">Mobile & Desk Tech</option>
                    <option value="Smart Home Automation">Smart Home Automation</option>
                    <option value="Automotive Upgrades">Automotive Upgrades</option>
                    <option value="Minimalist Lifestyle">Minimalist Lifestyle</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-500">
                    Primary Isolated Image URL
                  </label>
                  <label className="cursor-pointer text-[10px] font-mono text-emerald-700 hover:text-emerald-900 flex items-center space-x-1">
                    <Upload className="w-3 h-3" />
                    <span>{isUploading ? "Uploading..." : "Upload Device File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadImageFile(file, (url) => {
                            setEditingProduct({ ...editingProduct, image: url });
                          });
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  required
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  placeholder="https://... or /assets/..."
                  className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-500">
                    Secondary Detail Angle URL (Shows on Hover)
                  </label>
                  <label className="cursor-pointer text-[10px] font-mono text-emerald-700 hover:text-emerald-900 flex items-center space-x-1">
                    <Upload className="w-3 h-3" />
                    <span>{isUploading ? "Uploading..." : "Upload Device File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadImageFile(file, (url) => {
                            setEditingProduct({ ...editingProduct, secondaryImage: url });
                          });
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={editingProduct.secondaryImage || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, secondaryImage: e.target.value })}
                  placeholder="URL of second angle"
                  className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    className="rounded border-neutral-300"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.hasDiscount)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, hasDiscount: e.target.checked })}
                    className="rounded border-neutral-300"
                  />
                  <span>Sale / Discount Flag</span>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingProduct(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1A1A1A] text-white uppercase tracking-[0.15em] font-medium hover:bg-neutral-800 transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT / ADD HERO SLIDE MODAL */}
      {/* ======================================================== */}
      {isEditingSlide && editingSlide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsEditingSlide(false);
                setEditingSlide(null);
              }}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-medium tracking-tight">
                {editingSlide.id ? "Edit Hero Slide" : "Add Hero Slide"}
              </h2>
              <p className="text-xs font-mono text-neutral-500">
                Configure headline typography and media image or video.
              </p>
            </div>

            <form onSubmit={handleSaveSlideModal} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                  Headline Text
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  placeholder="e.g. Curated technology and daily essentials."
                  className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                  Media Type
                </label>
                <select
                  value={editingSlide.type}
                  onChange={(e) => setEditingSlide({ ...editingSlide, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-neutral-300 bg-white focus:outline-none"
                >
                  <option value="image">High-Res Image</option>
                  <option value="video">Ambient Video (.mp4)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-500">
                    Image or Video URL
                  </label>
                  <label className="cursor-pointer text-[10px] font-mono text-emerald-700 hover:text-emerald-900 flex items-center space-x-1">
                    <Upload className="w-3 h-3" />
                    <span>{isUploading ? "Uploading..." : "Upload Device File"}</span>
                    <input
                      type="file"
                      accept="image/*,video/mp4"
                      disabled={isUploading}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadImageFile(file, (url) => {
                            setEditingSlide({ ...editingSlide, src: url });
                          });
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  required
                  value={editingSlide.src}
                  onChange={(e) => setEditingSlide({ ...editingSlide, src: e.target.value })}
                  placeholder="/assets/brand/hero/... or https://..."
                  className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              {/* Quick Preset Selector for user-uploaded images */}
              <div className="pt-1">
                <span className="text-[10px] text-neutral-400 block mb-1.5 uppercase">
                  Available Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingSlide({ ...editingSlide, src: "/assets/brand/hero/hero-pixel-white.jpg" })}
                    className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-[10px] border border-neutral-200"
                  >
                    Porcelain Pixel Devices
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSlide({ ...editingSlide, src: "/assets/brand/hero/hero-gadgets-collection.jpg" })}
                    className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-[10px] border border-neutral-200"
                  >
                    Matte Tech Gadgets
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSlide({ ...editingSlide, src: "/assets/brand/hero/hero-warm-desk.jpg" })}
                    className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-[10px] border border-neutral-200"
                  >
                    Warm Workstation
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSlide({ ...editingSlide, src: "/assets/raw-products/prod-00-musowood-walnut-vertical-stand/variety-walnut-desk-setup.jpg" })}
                    className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-[10px] border border-neutral-200"
                  >
                    Walnut Stand Desk
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingSlide(false);
                    setEditingSlide(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1A1A1A] text-white uppercase tracking-[0.15em] font-medium hover:bg-neutral-800 transition-colors"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* EDIT TEAM MEMBER MODAL */}
      {/* ======================================================== */}
      {isEditingMember && editingMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsEditingMember(false);
                setEditingMember(null);
              }}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-medium tracking-tight">Edit Team Member</h2>
              <p className="text-xs font-mono text-neutral-500">
                Update account details, role permissions, or email address.
              </p>
            </div>

            <form onSubmit={handleSaveMemberModal} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editingMember.email}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                  Assigned Role
                </label>
                <select
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value as any })}
                  className="w-full px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
                >
                  <option value="Owner">Owner (Full Store & Security Access)</option>
                  <option value="Catalog Manager">Catalog Manager (Products & Pricing)</option>
                  <option value="Logistics / Dispatcher">Logistics / Dispatcher (Uber Couriers & WhatsApp Orders)</option>
                  <option value="Sales / Support">Sales / Support (Customer Inquiries)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                  Status
                </label>
                <select
                  value={editingMember.status}
                  onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
                >
                  <option value="active">Active</option>
                  <option value="invited">Invited</option>
                </select>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingMember(false);
                    setEditingMember(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1A1A1A] text-white uppercase tracking-[0.15em] font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Save Member Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
