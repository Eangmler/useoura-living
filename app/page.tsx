"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { ProductGrid } from "@/components/ProductGrid";
import { ComboSection } from "@/components/ComboSection";
import { SmartHomeSection } from "@/components/SmartHomeSection";
import { Footer } from "@/components/Footer";
import { ProductModal } from "@/components/ProductModal";
import { CartDrawer, CartItem } from "@/components/CartDrawer";
import { SearchModal } from "@/components/SearchModal";
import { PRODUCTS, Product, getStoredProducts } from "@/lib/products";
import { saveClientStoreData, StoreData } from "@/lib/store";

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [toast, setToast] = useState<string | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("useoura_cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCart(parsed);
          setIsLoaded(true);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    }
    // Default initial item
    const initialProducts = getStoredProducts();
    setCart([
      {
        product: initialProducts[0] || PRODUCTS[0],
        quantity: 1,
      },
    ]);
    setIsLoaded(true);

    // Fetch latest server store data to ensure live catalog, hero slides & categories sync seamlessly
    fetch("/api/admin/store")
      .then((res) => (res.ok ? res.json() : null))
      .then((serverData: StoreData | null) => {
        if (serverData && serverData.products && serverData.products.length > 0) {
          saveClientStoreData(serverData);
        }
      })
      .catch((err) => console.log("Offline mode or cached store in use:", err.message));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("useoura_cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart to storage", e);
      }
    }
  }, [cart, isLoaded]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const handleAddToCart = (product: Product, quantity: number = 1, openDrawer: boolean = false) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.title} to bag`);
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const handleAddComboToCart = (comboProducts: Product[]) => {
    setCart((prev) => {
      let updated = [...prev];
      comboProducts.forEach((prod) => {
        const existing = updated.find((item) => item.product.id === prod.id);
        if (existing) {
          updated = updated.map((item) =>
            item.product.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          updated.push({ product: prod, quantity: 1 });
        }
      });
      return updated;
    });
    showToast(`Added combo bundle (${comboProducts.length} items) to bag`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleShopClick = () => {
    const el = document.getElementById("bestsellers");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExploreProduct = (productId: string) => {
    const all = getStoredProducts();
    const found = all.find((p) => p.id === productId);
    if (found) {
      setSelectedProduct(found);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-[#F7F7F5]">
      {/* Sticky Top Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectCategory={(slug) => setActiveCategory(slug)}
        activeCategory={activeCategory}
      />

      {/* Main Product-Focused Content */}
      <main className="flex-1">
        {/* 1. Hero: User's Uploaded Living Room Visual with Dieter Rams Focus */}
        <Hero
          onShopClick={handleShopClick}
          onExploreProduct={handleExploreProduct}
        />

        {/* 2. Featured Categories (Magazine Style) */}
        <FeaturedCategories
          onSelectCategory={(slug) => setActiveCategory(slug)}
          activeCategory={activeCategory}
        />

        {/* 3. Core Product Grid (2-Angle Hover & In-Stock/Discount Indicators) */}
        <ProductGrid
          onAddToCart={(prod) => handleAddToCart(prod, 1, false)}
          onQuickView={(prod) => setSelectedProduct(prod)}
          selectedCategorySlug={activeCategory}
          onSelectCategory={(slug) => setActiveCategory(slug)}
        />

        {/* 4. Curated Combos (Hardware that works hand-in-hand) */}
        <ComboSection onAddComboToCart={handleAddComboToCart} />

        {/* 5. Smart Home Engineering & In-Person Setups (with Minimalist YouTube Video) */}
        <SmartHomeSection />
      </main>

      {/* Severely Minimalist Footer */}
      <Footer />

      {/* Multi-Angle Product Inspection Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, qty) => handleAddToCart(prod, qty, true)}
      />

      {/* Slide-over Cart & Delivery Details Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Search Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
      />

      {/* Toast Feedback */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3 shadow-xl font-mono text-xs uppercase tracking-wider flex items-center space-x-3 border border-neutral-700 animate-in slide-in-from-bottom-3 duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
