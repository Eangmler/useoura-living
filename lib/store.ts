import fs from "fs";
import path from "path";
import axios from "axios";
import { Product, INITIAL_PRODUCTS } from "./products";
import {
  AppSettings,
  CompetitorTarget,
  ContentConcept,
  PublishJob,
  DmLog,
  TesterAccount,
  TesterReview,
} from "./types";

// =====================================================================
// 1. USEOURA LIVING E-COMMERCE STORE SYSTEM
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
    id: "slide-living-oled",
    type: "image",
    src: "/assets/brand/hero-living.jpg",
    title: "Curated technology and daily essentials.",
    active: true,
  },
  {
    id: "slide-warm-desk",
    type: "image",
    src: "/assets/brand/hero/hero-warm-desk.jpg",
    title: "Pure form, uncompromised utility.",
    active: true,
  },
  {
    id: "slide-gadgets-collection",
    type: "image",
    src: "/assets/brand/hero/hero-gadgets-collection.jpg",
    title: "Architectural tools engineered for daily life.",
    active: true,
  },
  {
    id: "slide-pixel-white",
    type: "image",
    src: "/assets/brand/hero/hero-pixel-white.jpg",
    title: "Ecosystems designed to work hand-in-hand.",
    active: true,
  },
  {
    id: "slide-ambient-video",
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-living-room-in-a-modern-apartment-41488-large.mp4",
    poster: "/assets/brand/hero-living.jpg",
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


// =====================================================================
// 2. LEGACY / SHARED DB PERSISTENCE (Powers /api/ routes)
// =====================================================================

interface DBData {
  settings: AppSettings;
  competitors: CompetitorTarget[];
  calendar: ContentConcept[];
  publishJobs: PublishJob[];
  dmLogs: DmLog[];
  testers: TesterAccount[];
  reviews: TesterReview[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "store.json");
const TMP_FILE = path.join("/tmp", "viralpulse_store.json");

const defaultSettings: AppSettings = {
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  apifyToken: process.env.APIFY_TOKEN || "",
  aiProvider: (process.env.AI_PROVIDER as "openai" | "gemini") || "openai",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  metaAppId: process.env.META_APP_ID || "",
  metaAppSecret: process.env.META_APP_SECRET || "",
  metaAccessToken: process.env.META_ACCESS_TOKEN || "",
  metaPageId: process.env.META_PAGE_ID || "",
  instagramAccountId: process.env.INSTAGRAM_ACCOUNT_ID || "",
  metaWebhookVerifyToken: process.env.META_WEBHOOK_VERIFY_TOKEN || "viralsaas_meta_verify_token",
  tiktokAppId: process.env.TIKTOK_APP_ID || "",
  tiktokAppSecret: process.env.TIKTOK_APP_SECRET || "",
  tiktokAccessToken: process.env.TIKTOK_ACCESS_TOKEN || "",
  tiktokOpenId: process.env.TIKTOK_OPEN_ID || "",
  tiktokWebhookVerifyToken: process.env.TIKTOK_WEBHOOK_VERIFY_TOKEN || "viralsaas_tiktok_verify_token",
  dmTriggerKeyword: process.env.DM_DEFAULT_TRIGGER_KEYWORD || "LINK",
  dmResponseTemplate:
    process.env.DM_DEFAULT_RESPONSE_TEMPLATE ||
    "Hey! Thanks for your comment on our video. Here is the link you requested: {{link}}",
  dmTargetUrl: process.env.DM_DEFAULT_TARGET_URL || "https://kisseh.com/thinkoutloud",
  kvRestApiUrl: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
  kvRestApiToken: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
  vercelAuthToken: process.env.VERCEL_AUTH_TOKEN || "",
  vercelProjectId: process.env.VERCEL_PROJECT_ID || "",
  vercelTeamId: process.env.VERCEL_TEAM_ID || "",
};

const defaultCompetitors: CompetitorTarget[] = [
  {
    id: "comp-1",
    platform: "instagram",
    handle: "danmartell",
    profileUrl: "https://www.instagram.com/danmartell/",
    category: "SaaS & High-Performance Business",
    active: true,
  },
  {
    id: "comp-2",
    platform: "instagram",
    handle: "hertz_fauzan",
    profileUrl: "https://www.instagram.com/hertz_fauzan/",
    category: "Visual Storytelling & Filmmaking",
    active: true,
  },
  {
    id: "comp-3",
    platform: "tiktok",
    handle: "@danmartell",
    profileUrl: "https://www.tiktok.com/@danmartell",
    category: "Short-form SaaS Advice",
    active: true,
  },
];

const defaultTesters: TesterAccount[] = [
  {
    id: "tester-1",
    name: "Tester 1 (Creative & Hooks)",
    passcode: "test-alpha",
    role: "tester",
    active: true,
    notes: "Reviewing AI hooks, viral patterns & calendar concepts",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tester-2",
    name: "Tester 2 (Video & Media)",
    passcode: "test-beta",
    role: "tester",
    active: true,
    notes: "Reviewing Studio Publisher & video uploading",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tester-3",
    name: "Tester 3 (Growth & DMs)",
    passcode: "test-gamma",
    role: "tester",
    active: true,
    notes: "Reviewing DM automation triggers & lead capture",
    createdAt: new Date().toISOString(),
  },
];

let inMemoryData: DBData = {
  settings: defaultSettings,
  competitors: defaultCompetitors,
  calendar: [],
  publishJobs: [],
  dmLogs: [],
  testers: defaultTesters,
  reviews: [],
};

async function readData(): Promise<DBData> {
  const kvUrl = inMemoryData.settings.kvRestApiUrl || process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = inMemoryData.settings.kvRestApiToken || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    try {
      const res = await axios.get(`${kvUrl}/get/viralpulse_data`, {
        headers: { Authorization: `Bearer ${kvToken}` },
        timeout: 4000,
      });
      if (res.data?.result) {
        const parsed = typeof res.data.result === "string" ? JSON.parse(res.data.result) : res.data.result;
        inMemoryData = {
          ...inMemoryData,
          ...parsed,
          testers: parsed.testers && parsed.testers.length > 0 ? parsed.testers : defaultTesters,
          reviews: parsed.reviews || [],
          settings: {
            ...defaultSettings,
            ...(parsed.settings || {}),
          },
        };
        return inMemoryData;
      }
    } catch (err: any) {
      console.warn("[Storage] Cloud KV read failed, using local store:", err.message);
    }
  }

  // Check .data/store.json
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      inMemoryData = {
        ...inMemoryData,
        ...parsed,
        testers: parsed.testers && parsed.testers.length > 0 ? parsed.testers : defaultTesters,
        reviews: parsed.reviews || [],
        settings: {
          ...defaultSettings,
          ...(parsed.settings || {}),
        },
      };
      return inMemoryData;
    }
  } catch (err) {
    // Expected in read-only environment
  }

  // Check /tmp/viralpulse_store.json
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = fs.readFileSync(TMP_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      inMemoryData = {
        ...inMemoryData,
        ...parsed,
        testers: parsed.testers && parsed.testers.length > 0 ? parsed.testers : defaultTesters,
        reviews: parsed.reviews || [],
        settings: {
          ...defaultSettings,
          ...(parsed.settings || {}),
        },
      };
      return inMemoryData;
    }
  } catch (err) {
    // Ignore
  }

  return inMemoryData;
}

async function writeData(data: DBData): Promise<void> {
  inMemoryData = data;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    // Read-only environment on Vercel lambda is expected
  }

  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    // Ignore
  }

  const kvUrl = data.settings.kvRestApiUrl || process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = data.settings.kvRestApiToken || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    try {
      await axios.post(
        `${kvUrl}/set/viralpulse_data`,
        JSON.stringify(data),
        {
          headers: {
            Authorization: `Bearer ${kvToken}`,
            "Content-Type": "application/json",
          },
          timeout: 4000,
        }
      );
    } catch (err: any) {
      console.warn("[Storage] Cloud KV write failed:", err.message);
    }
  }
}

async function syncToVercelEnv(settings: AppSettings): Promise<void> {
  const token = settings.vercelAuthToken || process.env.VERCEL_AUTH_TOKEN;
  const projectId = settings.vercelProjectId || process.env.VERCEL_PROJECT_ID;
  const teamId = settings.vercelTeamId || process.env.VERCEL_TEAM_ID;

  if (!token || !projectId) return;

  const envMap: Record<string, string | undefined> = {
    APIFY_TOKEN: settings.apifyToken,
    AI_PROVIDER: settings.aiProvider,
    OPENAI_API_KEY: settings.openaiApiKey,
    GEMINI_API_KEY: settings.geminiApiKey,
    META_ACCESS_TOKEN: settings.metaAccessToken,
    INSTAGRAM_ACCOUNT_ID: settings.instagramAccountId,
    META_APP_ID: settings.metaAppId,
    META_APP_SECRET: settings.metaAppSecret,
    META_WEBHOOK_VERIFY_TOKEN: settings.metaWebhookVerifyToken,
    TIKTOK_ACCESS_TOKEN: settings.tiktokAccessToken,
    TIKTOK_APP_ID: settings.tiktokAppId,
    TIKTOK_APP_SECRET: settings.tiktokAppSecret,
    TIKTOK_OPEN_ID: settings.tiktokOpenId,
    DM_DEFAULT_TRIGGER_KEYWORD: settings.dmTriggerKeyword,
    DM_DEFAULT_TARGET_URL: settings.dmTargetUrl,
  };

  const teamQuery = teamId ? `?teamId=${teamId}` : "";

  for (const [key, val] of Object.entries(envMap)) {
    if (!val || val.includes("••••")) continue;

    try {
      await axios.post(
        `https://api.vercel.com/v10/projects/${projectId}/env${teamQuery}`,
        {
          key,
          value: val,
          type: "encrypted",
          target: ["production", "preview", "development"],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err: any) {
      if (err.response?.status === 400 || err.response?.data?.error?.code === "ENV_ALREADY_EXISTS") {
        try {
          const listRes = await axios.get(
            `https://api.vercel.com/v9/projects/${projectId}/env${teamQuery}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const existing = listRes.data?.envs?.find((e: any) => e.key === key);
          if (existing?.id) {
            await axios.patch(
              `https://api.vercel.com/v9/projects/${projectId}/env/${existing.id}${teamQuery}`,
              { value: val },
              { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
          }
        } catch (patchErr) {
          // ignore error
        }
      }
    }
  }
}

export const db = {
  getSettings: async (): Promise<AppSettings> => {
    const data = await readData();
    return data.settings;
  },

  updateSettings: async (newSettings: Partial<AppSettings>): Promise<AppSettings> => {
    const data = await readData();
    data.settings = { ...data.settings, ...newSettings };
    await writeData(data);

    if (data.settings.vercelAuthToken && data.settings.vercelProjectId) {
      syncToVercelEnv(data.settings).catch((err) =>
        console.warn("[Vercel Sync] Background sync error:", err.message)
      );
    }

    return data.settings;
  },

  getCompetitors: async (): Promise<CompetitorTarget[]> => {
    const data = await readData();
    return data.competitors;
  },

  addCompetitor: async (competitor: Omit<CompetitorTarget, "id">): Promise<CompetitorTarget> => {
    const data = await readData();
    const newEntry: CompetitorTarget = {
      ...competitor,
      id: "comp-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    };
    data.competitors.push(newEntry);
    await writeData(data);
    return newEntry;
  },

  deleteCompetitor: async (id: string): Promise<void> => {
    const data = await readData();
    data.competitors = data.competitors.filter((c) => c.id !== id);
    await writeData(data);
  },

  toggleCompetitor: async (id: string): Promise<CompetitorTarget | undefined> => {
    const data = await readData();
    const target = data.competitors.find((c) => c.id === id);
    if (target) {
      target.active = !target.active;
      await writeData(data);
    }
    return target;
  },

  getCalendar: async (): Promise<ContentConcept[]> => {
    const data = await readData();
    return data.calendar;
  },

  saveCalendarConcepts: async (concepts: ContentConcept[]): Promise<void> => {
    const data = await readData();
    data.calendar = concepts;
    await writeData(data);
  },

  updateConceptStatus: async (
    id: string,
    status: ContentConcept["status"]
  ): Promise<ContentConcept | undefined> => {
    const data = await readData();
    const item = data.calendar.find((c) => c.id === id);
    if (item) {
      item.status = status;
      await writeData(data);
    }
    return item;
  },

  getPublishJobs: async (): Promise<PublishJob[]> => {
    const data = await readData();
    return data.publishJobs;
  },

  addPublishJob: async (job: Omit<PublishJob, "id" | "createdAt">): Promise<PublishJob> => {
    const data = await readData();
    const newJob: PublishJob = {
      ...job,
      id: "pub-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
    };
    data.publishJobs.unshift(newJob);
    await writeData(data);
    return newJob;
  },

  updatePublishJob: async (id: string, updates: Partial<PublishJob>): Promise<void> => {
    const data = await readData();
    const job = data.publishJobs.find((j) => j.id === id);
    if (job) {
      Object.assign(job, updates);
      await writeData(data);
    }
  },

  getDmLogs: async (): Promise<DmLog[]> => {
    const data = await readData();
    return data.dmLogs;
  },

  addDmLog: async (log: Omit<DmLog, "id" | "timestamp">): Promise<DmLog> => {
    const data = await readData();
    const newLog: DmLog = {
      ...log,
      id: "dm-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toISOString(),
    };
    data.dmLogs.unshift(newLog);
    if (data.dmLogs.length > 100) {
      data.dmLogs = data.dmLogs.slice(0, 100);
    }
    await writeData(data);
    return newLog;
  },

  getTesters: async (): Promise<TesterAccount[]> => {
    const data = await readData();
    return data.testers || defaultTesters;
  },

  addTester: async (tester: Omit<TesterAccount, "id" | "createdAt">): Promise<TesterAccount> => {
    const data = await readData();
    const newTester: TesterAccount = {
      ...tester,
      id: "tester-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
    };
    if (!data.testers) data.testers = [...defaultTesters];
    data.testers.push(newTester);
    await writeData(data);
    return newTester;
  },

  updateTester: async (id: string, updates: Partial<TesterAccount>): Promise<TesterAccount | undefined> => {
    const data = await readData();
    if (!data.testers) data.testers = [...defaultTesters];
    const item = data.testers.find((t) => t.id === id);
    if (item) {
      Object.assign(item, updates);
      await writeData(data);
    }
    return item;
  },

  deleteTester: async (id: string): Promise<void> => {
    const data = await readData();
    if (!data.testers) data.testers = [...defaultTesters];
    data.testers = data.testers.filter((t) => t.id !== id);
    await writeData(data);
  },

  getReviews: async (): Promise<TesterReview[]> => {
    const data = await readData();
    return data.reviews || [];
  },

  addReview: async (review: Omit<TesterReview, "id" | "createdAt">): Promise<TesterReview> => {
    const data = await readData();
    if (!data.reviews) data.reviews = [];
    const newReview: TesterReview = {
      ...review,
      id: "rev-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
    };
    data.reviews.unshift(newReview);
    await writeData(data);
    return newReview;
  },
};
