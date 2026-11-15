export interface ComboItem {
  id: string;
  productId: string;
  title: string;
  quantity: number;
}

export interface Combo {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  originalPrice: number;
  comboPrice: number;
  savings: number;
  image: string;
  items: ComboItem[];
  badge: string;
}

export const COMBOS: Combo[] = [
  {
    id: "combo-commute-kit",
    tag: "COMBO // 01",
    title: "The Executive Commute System",
    subtitle: "High-speed charging & magnetic docking for your vehicle.",
    description: "Equip your car with the Baseus 65W triple-port GaN charger, the 16-magnet N52 dashboard mount, and Anker's 100W ballistic nylon cable. Pure road clarity.",
    originalPrice: 560.0,
    comboPrice: 505.0,
    savings: 55.0,
    image: "https://baseus.com.au/cdn/shop/files/tzcckx-0g-3_1000x.jpg?v=1736398705",
    badge: "SAVE GH₵ 55",
    items: [
      { id: "c1", productId: "prod-baseus-65w-car", title: "Baseus 65W Car Charger", quantity: 1 },
      { id: "c2", productId: "prod-mag-phone-mount", title: "Magnetic Dashboard Mount", quantity: 1 },
      { id: "c3", productId: "prod-anker-100w-cable", title: "Anker 100W Braided Cable", quantity: 1 },
    ],
  },
  {
    id: "combo-workstation-system",
    tag: "COMBO // 02",
    title: "The Minimalist Workstation System",
    subtitle: "Anti-glare illumination, architectural dual-power & desk protection.",
    description: "The definitive workstation foundation: the Minimalist Monitor Light Bar with wireless dial switch, Apple 35W Dual Port adapter, and XXL vegan leather desk pad.",
    originalPrice: 1010.0,
    comboPrice: 900.0,
    savings: 110.0,
    image: "https://image.benq.com/is/image/benqco/black-45-nocable?$ResponsivePreset$",
    badge: "SAVE GH₵ 110",
    items: [
      { id: "w1", productId: "prod-monitor-light-bar", title: "Minimalist Monitor Light Bar", quantity: 1 },
      { id: "w2", productId: "prod-apple-35w-dual", title: "Apple 35W Dual Port Adapter", quantity: 1 },
      { id: "w3", productId: "prod-xxl-desk-mat", title: "XXL Solid Color Desk Mat", quantity: 1 },
    ],
  },
  {
    id: "combo-smart-starter",
    tag: "COMBO // 03",
    title: "Smart Living Starter Node",
    subtitle: "Zigbee 3.0 mesh gateway paired with glare-free ambient lighting.",
    description: "Initiate your home automation with the Tuya Zigbee 3.0 hub coordinating up to 128 devices, paired with screen-bar task lighting.",
    originalPrice: 910.0,
    comboPrice: 830.0,
    savings: 80.0,
    image: "http://zigbeesmart.com/cdn/shop/files/be4aeff2-3b23-464e-88a5-eefbe098d3b1.png?v=1790695067",
    badge: "SAVE GH₵ 80",
    items: [
      { id: "s1", productId: "prod-tuya-zigbee-hub", title: "Tuya Smart Zigbee 3.0 Hub", quantity: 1 },
      { id: "s2", productId: "prod-monitor-light-bar", title: "Minimalist Monitor Light Bar", quantity: 1 },
    ],
  },
];
