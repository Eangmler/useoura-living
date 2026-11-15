export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  priceFormatted: string;
  category: "Mobile & Desk Tech" | "Smart Home Automation" | "Automotive Upgrades" | "Minimalist Lifestyle";
  categorySlug: "mobile-desk" | "smart-home" | "automotive" | "lifestyle";
  image: string; // Primary isolated angle
  secondaryImage: string; // Hover detail / secondary angle
  images: string[]; // Gallery of angles
  fallbackImage?: string;
  badge?: string;
  specs: { label: string; value: string }[];
  tag: string;
  inStock: boolean;
  isLimited?: boolean;
  hasDiscount?: boolean;
  featured?: boolean;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-touch-ambient-lamp",
    title: "Touch Control Ambient Lamp",
    description: "Cordless 16-color touch-dimmable light engineered for quiet bedside and workspace illumination. 800mAh rechargeable battery with stepless brightness tuning.",
    price: 185.00,
    originalPrice: 220.00,
    priceFormatted: "GH₵ 185.00",
    category: "Smart Home Automation",
    categorySlug: "smart-home",
    image: "/assets/products/smart-home/touch-ambient-lamp-isolated.webp",
    secondaryImage: "/assets/products/smart-home/touch-ambient-lamp-lifestyle.webp",
    images: [
      "/assets/products/smart-home/touch-ambient-lamp-isolated.webp",
      "/assets/products/smart-home/touch-ambient-lamp-lifestyle.webp",
      "/assets/products/smart-home/touch-ambient-lamp-story.webp"
    ],
    badge: "Cordless 16-RGB",
    specs: [
      { label: "Battery", value: "800mAh USB-C Rechargeable (Up to 14 hrs runtime)" },
      { label: "Lighting", value: "16-Color RGB + 2700K Warm White" },
      { label: "Control", value: "Capacitive top touch sensor (Tap to switch, hold to dim)" },
      { label: "Chassis", value: "Matte optical diffuser & anodized base" }
    ],
    tag: "HOME // 07",
    inStock: true,
    hasDiscount: true,
    featured: true,
  },
  {
    id: "prod-under-pillow-sleep-speaker",
    title: "Under-Pillow Sleep Soundbar",
    description: "Ultra-thin bone conduction soundbar engineered for private bedtime acoustics and deep restorative sleep. Slips under any pillow with zero bulk or discomfort.",
    price: 210.00,
    originalPrice: 250.00,
    priceFormatted: "GH₵ 210.00",
    category: "Minimalist Lifestyle",
    categorySlug: "lifestyle",
    image: "/assets/products/lifestyle/under-pillow-sleep-speaker-isolated.webp",
    secondaryImage: "/assets/products/lifestyle/under-pillow-sleep-speaker-lifestyle.webp",
    images: [
      "/assets/products/lifestyle/under-pillow-sleep-speaker-isolated.webp",
      "/assets/products/lifestyle/under-pillow-sleep-speaker-lifestyle.webp",
      "/assets/products/lifestyle/under-pillow-sleep-speaker-story.webp"
    ],
    badge: "Bone Conduction",
    specs: [
      { label: "Sound", value: "Bone Conduction Resonance (Audible only on pillow)" },
      { label: "Timer", value: "30 / 60 Min Sleep Auto-Off Timer" },
      { label: "Connectivity", value: "Bluetooth 5.3 + White Noise Generator" },
      { label: "Profile", value: "Sub-12mm ultra-flat aerodynamic chassis" }
    ],
    tag: "AUDIO // 08",
    inStock: true,
    hasDiscount: true,
    featured: true,
  },
  {
    id: "prod-smart-wifi-ir-remote",
    title: "Smart Wi-Fi IR Controller Hub",
    description: "360-degree universal infrared transmitter engineered to automate legacy air conditioners, home theater systems, fans, and televisions into your smart living ecosystem.",
    price: 160.00,
    originalPrice: 190.00,
    priceFormatted: "GH₵ 160.00",
    category: "Smart Home Automation",
    categorySlug: "smart-home",
    image: "/assets/products/smart-home/smart-wifi-ir-remote-isolated.webp",
    secondaryImage: "/assets/products/smart-home/smart-wifi-ir-remote-lifestyle.webp",
    images: [
      "/assets/products/smart-home/smart-wifi-ir-remote-isolated.webp",
      "/assets/products/smart-home/smart-wifi-ir-remote-lifestyle.webp",
      "/assets/products/smart-home/smart-wifi-ir-remote-story.webp"
    ],
    badge: "360° IR Blaster",
    specs: [
      { label: "Coverage", value: "360-degree omnidirectional up to 10m line-of-sight" },
      { label: "Database", value: "Over 80,000+ IR appliances (AC, TV, Fans, Receivers)" },
      { label: "Protocol", value: "Wi-Fi 2.4GHz + Smart Life / Tuya / HomeKit Shortcuts" },
      { label: "Power", value: "Continuous USB 5V/1A low-draw supply" }
    ],
    tag: "HOME // 09",
    inStock: true,
    hasDiscount: true,
    featured: false,
  },
  {
    id: "prod-baseus-65w-car",
    title: "Baseus 65W Triple Port Car Charger",
    description: "Fast-charge laptops and phones on the go. Matte space aluminum.",
    price: 210.00,
    originalPrice: 240.00,
    priceFormatted: "GH₵ 210.00",
    category: "Automotive Upgrades",
    categorySlug: "automotive",
    image: "https://baseus.com.au/cdn/shop/files/tzcckx-0g-3_1000x.jpg?v=1736398705",
    secondaryImage: "https://www.baseus.com/cdn/shop/products/Baseus_USB-A_USB-C_Car_Charger_65W_1_front.jpg?v=1667906382",
    images: [
      "https://baseus.com.au/cdn/shop/files/tzcckx-0g-3_1000x.jpg?v=1736398705",
      "https://www.baseus.com/cdn/shop/products/Baseus_USB-A_USB-C_Car_Charger_65W_1_front.jpg?v=1667906382",
      "https://baseusofficialstore.com/wp-content/uploads/2024/02/H9948450fb6ce410a8b88143f092e9be61.jpg_.webp"
    ],
    fallbackImage: "https://www.baseus.com/cdn/shop/products/Baseus_USB-A_USB-C_Car_Charger_65W_1_front.jpg?v=1667906382",
    badge: "GaN Fast Charge",
    specs: [
      { label: "Output", value: "65W Max (USB-C1 + C2 + USB-A)" },
      { label: "Display", value: "Real-time LED voltage meter" },
      { label: "Compatibility", value: "12V-24V car sockets, PD 3.0 & QC 4.0" },
      { label: "Finish", value: "Matte space aluminum" }
    ],
    tag: "AUTO // 01",
    inStock: true,
    hasDiscount: true,
    featured: true,
  },
  {
    id: "prod-apple-35w-dual",
    title: "Apple 35W Dual Port Power Adapter",
    description: "Compact dual USB-C charging brick with folding pins.",
    price: 210.00,
    originalPrice: 230.00,
    priceFormatted: "GH₵ 210.00",
    category: "Mobile & Desk Tech",
    categorySlug: "mobile-desk",
    image: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MNWP3?wid=1144&hei=1144&fmt=jpeg&qlt=90",
    secondaryImage: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MW2H3?wid=1144&hei=1144&fmt=jpeg&qlt=90",
    images: [
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MNWP3?wid=1144&hei=1144&fmt=jpeg&qlt=90",
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MW2H3?wid=1144&hei=1144&fmt=jpeg&qlt=90"
    ],
    badge: "Official Spec",
    specs: [
      { label: "Ports", value: "2x USB-C (Intelligent power sharing)" },
      { label: "Power", value: "35W dynamic distribution" },
      { label: "Prongs", value: "Folding compact architectural pins" },
      { label: "Safety", value: "Overcurrent & thermal protection" }
    ],
    tag: "DESK // 02",
    inStock: true,
    featured: true,
  },
  {
    id: "prod-anker-100w-cable",
    title: "Anker 100W Braided USB-C Cable",
    description: "Ultra-durable nylon fast-charging cable with silicone strap.",
    price: 175.00,
    priceFormatted: "GH₵ 175.00",
    category: "Mobile & Desk Tech",
    categorySlug: "mobile-desk",
    image: "https://cdn.shopify.com/s/files/1/0831/7042/7131/files/white-01_2d4272ab-2d5a-428d-8f79-c52ac1e98345_2878x_1.png?v=1790582640",
    secondaryImage: "https://m.media-amazon.com/images/I/61Nl8WqE14L._AC_SL1500_.jpg",
    images: [
      "https://cdn.shopify.com/s/files/1/0831/7042/7131/files/white-01_2d4272ab-2d5a-428d-8f79-c52ac1e98345_2878x_1.png?v=1790582640",
      "https://m.media-amazon.com/images/I/61Nl8WqE14L._AC_SL1500_.jpg"
    ],
    badge: "100W PD",
    specs: [
      { label: "Throughput", value: "100W (20V/5A E-Marker Chip)" },
      { label: "Build", value: "Double-braided ballistic nylon" },
      { label: "Bend Rating", value: "25,000+ lifecycle bends" },
      { label: "Length", value: "1.8m (6ft) with silicone strap" }
    ],
    tag: "DESK // 03",
    inStock: true,
    featured: false,
  },
  {
    id: "prod-tuya-zigbee-hub",
    title: "Tuya Smart Zigbee 3.0 Hub",
    description: "The brain for your smart home ecosystem. Ultra-low latency mesh.",
    price: 330.00,
    priceFormatted: "GH₵ 330.00",
    category: "Smart Home Automation",
    categorySlug: "smart-home",
    image: "http://zigbeesmart.com/cdn/shop/files/be4aeff2-3b23-464e-88a5-eefbe098d3b1.png?v=1790695067",
    secondaryImage: "https://smartxbd.com/wp-content/uploads/2025/10/Tuya-ZigBee-3.0-Wired-LAN-Port-Gateway-Hub-RJ45-Port-Bridge-Hub-for-Smart-Home-01.jpg.webp",
    images: [
      "http://zigbeesmart.com/cdn/shop/files/be4aeff2-3b23-464e-88a5-eefbe098d3b1.png?v=1790695067",
      "https://smartxbd.com/wp-content/uploads/2025/10/Tuya-ZigBee-3.0-Wired-LAN-Port-Gateway-Hub-RJ45-Port-Bridge-Hub-for-Smart-Home-01.jpg.webp"
    ],
    fallbackImage: "https://smartxbd.com/wp-content/uploads/2025/10/Tuya-ZigBee-3.0-Wired-LAN-Port-Gateway-Hub-RJ45-Port-Bridge-Hub-for-Smart-Home-01.jpg.webp",
    badge: "Zigbee 3.0",
    specs: [
      { label: "Protocol", value: "Zigbee 3.0 + 2.4GHz Wi-Fi" },
      { label: "Device Capacity", value: "Up to 128 connected sub-devices" },
      { label: "Latency", value: "Ultra-low local offline execution" },
      { label: "Platform", value: "Smart Life / Tuya / Home Assistant" }
    ],
    tag: "HOME // 04",
    inStock: true,
    featured: true,
  },
  {
    id: "prod-monitor-light-bar",
    title: "Minimalist Monitor Light Bar",
    description: "Mechanical switch, anti-glare screen lighting with wireless dial.",
    price: 580.00,
    originalPrice: 650.00,
    priceFormatted: "GH₵ 580.00",
    category: "Mobile & Desk Tech",
    categorySlug: "mobile-desk",
    image: "https://image.benq.com/is/image/benqco/black-45-nocable?$ResponsivePreset$",
    secondaryImage: "https://image.benq.com/is/image/benqco/black-90?$ResponsivePreset$",
    images: [
      "https://image.benq.com/is/image/benqco/black-45-nocable?$ResponsivePreset$",
      "https://image.benq.com/is/image/benqco/black-90?$ResponsivePreset$"
    ],
    badge: "Asymmetric Optic",
    specs: [
      { label: "Optics", value: "Asymmetric optical design (Zero screen glare)" },
      { label: "Control", value: "Wireless weighted rotary dial switch" },
      { label: "Color Temp", value: "2700K - 6500K stepless adjustment" },
      { label: "Chassis", value: "CNC machined aviation-grade alloy" }
    ],
    tag: "DESK // 05",
    inStock: true,
    hasDiscount: true,
    featured: true,
  },
  {
    id: "prod-xxl-desk-mat",
    title: "XXL Solid Color Desk Mat",
    description: "Premium faux leather workspace protector. 900x400mm.",
    price: 220.00,
    priceFormatted: "GH₵ 220.00",
    category: "Mobile & Desk Tech",
    categorySlug: "mobile-desk",
    image: "https://www.thetlwh.com/cdn/shop/files/IMG_1145.jpg?v=1769607274",
    secondaryImage: "https://www.thetlwh.com/cdn/shop/files/IMG_1144.jpg?v=1769607274",
    images: [
      "https://www.thetlwh.com/cdn/shop/files/IMG_1145.jpg?v=1769607274",
      "https://www.thetlwh.com/cdn/shop/files/IMG_1144.jpg?v=1769607274"
    ],
    badge: "900 x 400 mm",
    specs: [
      { label: "Dimensions", value: "900mm x 400mm x 2.2mm" },
      { label: "Surface", value: "Waterproof vegan micro-textured grain" },
      { label: "Base", value: "Anti-slip suede underside" },
      { label: "Maintenance", value: "Wipe-clean spill-proof barrier" }
    ],
    tag: "DESK // 06",
    inStock: true,
    featured: false,
  },
  {
    id: "prod-mag-phone-mount",
    title: "Magnetic Dashboard Phone Mount",
    description: "360° rotating sleek car mount with 16x N52 Neodymium array.",
    price: 175.00,
    priceFormatted: "GH₵ 175.00",
    category: "Automotive Upgrades",
    categorySlug: "automotive",
    image: "https://www.hubcart.co/cdn/shop/files/magsafe-car-phone-holder-product.webp?v=1787150395&width=240",
    secondaryImage: "https://m.media-amazon.com/images/I/71R2c8W2k9L._AC_SL1500_.jpg",
    images: [
      "https://www.hubcart.co/cdn/shop/files/magsafe-car-phone-holder-product.webp?v=1787150395&width=240",
      "https://m.media-amazon.com/images/I/71R2c8W2k9L._AC_SL1500_.jpg"
    ],
    fallbackImage: "https://baseus.com.au/cdn/shop/files/tzcckx-0g-3_1000x.jpg?v=1736398705",
    badge: "MagSafe Array",
    specs: [
      { label: "Magnets", value: "16x N52 Neodymium rare-earth ring" },
      { label: "Mounting", value: "3M VHB automotive aerospace adhesive" },
      { label: "Articulation", value: "Damped 360-degree ball joint" },
      { label: "Profile", value: "Ultra-slim 8mm dashboard footprint" }
    ],
    tag: "AUTO // 07",
    inStock: true,
    featured: false,
  },
  {
    id: "prod-dji-mic-mini",
    title: "DJI Mic Mini",
    description: "Discreet, ultra-light wireless audio. 10g featherweight.",
    price: 750.00,
    originalPrice: 820.00,
    priceFormatted: "GH₵ 750.00",
    category: "Minimalist Lifestyle",
    categorySlug: "lifestyle",
    image: "https://www-cdn.djiits.com/cms/uploads/ccc4ffb9056d4089b73613bb2a1ae6ba@374*374.png",
    secondaryImage: "https://www-cdn.djiits.com/cms/uploads/03258b0feafa252996da77a7a0aaa14d@374*374.png",
    images: [
      "https://www-cdn.djiits.com/cms/uploads/ccc4ffb9056d4089b73613bb2a1ae6ba@374*374.png",
      "https://www-cdn.djiits.com/cms/uploads/03258b0feafa252996da77a7a0aaa14d@374*374.png"
    ],
    fallbackImage: "https://www-cdn.djiits.com/cms/uploads/03258b0feafa252996da77a7a0aaa14d@374*374.png",
    badge: "10g Audio",
    specs: [
      { label: "Weight", value: "10 grams (Virtually invisible)" },
      { label: "Audio", value: "48kHz 24-bit studio omnidirectional" },
      { label: "Transmission", value: "400m stable interference-free range" },
      { label: "Battery", value: "48 hours with charging case" }
    ],
    tag: "AUDIO // 08",
    inStock: true,
    isLimited: true,
    featured: true,
  },
];

// Helper to get products merging default with any Admin overrides from localStorage
export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return INITIAL_PRODUCTS;
  try {
    const fullStore = localStorage.getItem("useoura_full_store");
    if (fullStore) {
      const parsedStore = JSON.parse(fullStore);
      if (parsedStore && Array.isArray(parsedStore.products) && parsedStore.products.length > 0) {
        return parsedStore.products;
      }
    }
    const stored = localStorage.getItem("useoura_admin_products");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading admin products", e);
  }
  return INITIAL_PRODUCTS;
}

export const PRODUCTS = INITIAL_PRODUCTS;

export const CATEGORIES = [
  {
    id: "mobile-desk",
    number: "01",
    name: "Mobile & Desk Tech",
    description: "Architectural accessories, precision charging, and ergonomic clarity engineered for the high-focus workstation.",
    count: "04 Objects",
    image: "/assets/brand/hero/hero-warm-desk.jpg",
    headline: "Form follow function.",
    details: "High-speed GaN adapters, double-braided cabling, and glare-free illumination.",
  },
  {
    id: "smart-home",
    number: "02",
    name: "Smart Home Automation",
    description: "Unobtrusive intelligence that anticipates your habits without drawing attention to itself.",
    count: "01 System",
    image: "/assets/raw-products/prod-27-wifi-smart-light-switch.jpg",
    headline: "Quiet infrastructure.",
    details: "Ultra-low latency Zigbee 3.0 mesh gateways and automated climate controls.",
  },
  {
    id: "automotive",
    number: "03",
    name: "Automotive Upgrades",
    description: "Transform your daily commute into an extension of your minimalist living environment.",
    count: "02 Tools",
    image: "/assets/brand/hero/hero-gadgets-collection.jpg",
    headline: "Travel with purpose.",
    details: "Aerospace magnetic car docks and 65W rapid triple-port chargers.",
  },
  {
    id: "lifestyle",
    number: "04",
    name: "Minimalist Lifestyle",
    description: "Discreet tools that integrate with your personal rhythm, from studio-grade acoustic capture to everyday carry.",
    count: "01 Essential",
    image: "/assets/products/lifestyle/smart-visual-ear-cleaner-lifestyle.webp",
    headline: "Daily precision.",
    details: "Featherweight wireless capture systems and tactile desk protection.",
  },
];
