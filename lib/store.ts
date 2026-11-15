import { Product, INITIAL_PRODUCTS } from "./products";

// =====================================================================
// USEOURA LIVING E-COMMERCE CLIENT STORE (100% Browser & Webpack Safe)
// =====================================================================

export interface HeroSlide {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  active: boolean;
}

export interface StoreCategory {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Catalog Manager" | "Logistics / Dispatcher" | "Sales / Support";
  addedAt: string;
  status: "active" | "invited";
}

export interface AdminSettings {
  pin: string;
  whatsappNumber: string;
  storeName: string;
  currency: string;
  smartHomeVideoUrl?: string;
}

export interface StoreData {
  products: Product[];
  categories: StoreCategory[];
  heroSlides: HeroSlide[];
  teamMembers: TeamMember[];
  settings: AdminSettings;
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-pixel-white",
    type: "image",
    src: "/assets/brand/hero/hero-pixel-white.jpg",
    title: "Curated technology and daily essentials.",
    active: true,
  },
  {
    id: "slide-gadgets-collection",
    type: "image",
    src: "/assets/brand/hero/hero-gadgets-collection.jpg",
    title: "Pure form, uncompromised utility.",
    active: true,
  },
  {
    id: "slide-warm-desk",
    type: "image",
    src: "/assets/brand/hero/hero-warm-desk.jpg",
    title: "Architectural tools engineered for daily life.",
    active: true,
  },
  {
    id: "slide-ambient-video",
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-living-room-in-a-modern-apartment-41488-large.mp4",
    poster: "/assets/brand/hero/hero-pixel-white.jpg",
    title: "Quiet smart living.",
    active: true,
  },
];

export const DEFAULT_CATEGORIES: StoreCategory[] = [
  {
    id: "mobile-desk",
    name: "Mobile & Desk Tech",
    image: "/assets/brand/hero/hero-warm-desk.jpg",
    description: "Architectural accessories, precision charging, and ergonomic clarity engineered for the high-focus workstation.",
  },
  {
    id: "smart-home",
    name: "Smart Home Automation",
    image: "/assets/raw-products/prod-27-wifi-smart-light-switch.jpg",
    description: "Unobtrusive intelligence that anticipates your habits without drawing attention to itself.",
  },
  {
    id: "automotive",
    name: "Automotive Upgrades",
    image: "/assets/brand/hero/hero-gadgets-collection.jpg",
    description: "Transform your daily commute into an extension of your minimalist living environment.",
  },
  {
    id: "lifestyle",
    name: "Minimalist Lifestyle",
    image: "/assets/products/lifestyle/smart-visual-ear-cleaner-lifestyle.webp",
    description: "Discreet tools that integrate with your personal rhythm.",
  },
];

export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-owner-01",
    name: "Ernest Angmler",
    email: "eangmler@gmail.com",
    role: "Owner",
    addedAt: "2026-11-15",
    status: "active",
  },
  {
    id: "team-dispatch-02",
    name: "Accra Fleet Dispatch",
    email: "dispatch@useoura.com",
    role: "Logistics / Dispatcher",
    addedAt: "2026-11-15",
    status: "active",
  },
];

export const DEFAULT_SETTINGS: AdminSettings = {
  pin: "oura2026",
  whatsappNumber: "233248147952",
  storeName: "useoura living",
  currency: "GH₵",
  smartHomeVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-living-room-in-a-modern-apartment-41488-large.mp4",
};

export const DEFAULT_STORE_DATA: StoreData = {
  products: INITIAL_PRODUCTS,
  categories: DEFAULT_CATEGORIES,
  heroSlides: DEFAULT_HERO_SLIDES,
  teamMembers: DEFAULT_TEAM_MEMBERS,
  settings: DEFAULT_SETTINGS,
};

// Storage keys
const STORAGE_KEY_STORE = "useoura_full_store";
const STORAGE_KEY_PIN = "useoura_admin_pin";

export function getClientStoreData(): StoreData {
  if (typeof window === "undefined") return DEFAULT_STORE_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STORE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        products: parsed.products && parsed.products.length > 0 ? parsed.products : DEFAULT_STORE_DATA.products,
        categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : DEFAULT_STORE_DATA.categories,
        heroSlides: parsed.heroSlides && parsed.heroSlides.length > 0 ? parsed.heroSlides : DEFAULT_STORE_DATA.heroSlides,
        teamMembers: parsed.teamMembers || DEFAULT_STORE_DATA.teamMembers,
        settings: parsed.settings || DEFAULT_STORE_DATA.settings,
      };
    }
  } catch (e) {
    console.error("Failed to parse local store data", e);
  }
  return DEFAULT_STORE_DATA;
}

export function saveClientStoreData(data: StoreData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_STORE, JSON.stringify(data));
    localStorage.setItem("useoura_admin_products", JSON.stringify(data.products));
    localStorage.setItem(STORAGE_KEY_PIN, data.settings.pin);
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Failed to save store data to localStorage", e);
  }
}

export function getAdminPin(): string {
  if (typeof window === "undefined") return DEFAULT_SETTINGS.pin;
  try {
    const storedPin = localStorage.getItem(STORAGE_KEY_PIN);
    if (storedPin) return storedPin;
    const store = getClientStoreData();
    if (store.settings?.pin) return store.settings.pin;
  } catch (e) {
    // fallback
  }
  return DEFAULT_SETTINGS.pin;
}
