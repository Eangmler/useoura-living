# useoura living

> **"Weniger, aber besser." — Less, but better.**  
> A Dieter Rams / Braun-inspired minimalist e-commerce store engineered in Next.js (App Router), Tailwind CSS, and Lucide Icons. Hosted on Vercel with direct **WhatsApp Meta AI Order Routing**, tailored specifically for the Ghanaian market (Greater Accra Payment on Delivery & Regional pre-paid parcel dispatch).

---

## 1. Store Architecture & WhatsApp Meta AI Checkout (GoPixelr Model)

Instead of relying on third-party cart gateways or Shopify checkout:
1. **Curated Webstore:** Shoppers explore Dieter Rams museum-style hardware cards, filter categories, and add items to their shopping bag.
2. **Delivery & Region Selection (Step 2 in Bag):**
   * **Greater Accra Region:** Customers are eligible for **Payment on Delivery (Cash or Mobile Money upon courier arrival)**. Free delivery on orders over `GH₵ 400.00`, otherwise `GH₵ 25.00`.
   * **Outside Accra / Other Regions (Kumasi, Takoradi, Tamale, etc.):** Requires **Pre-Payment confirmation via Mobile Money before parcel dispatch**. Delivery fee: `GH₵ 45.00`.
3. **Optional Address Entry (Zero-Friction Checkout):**
   * Customers can enter their digital address, full name, phone number, and landmarks.
   * **Crucially:** Address entry is strictly optional. If left blank, the customer is never blocked from ordering; instead, the order message flags `[NOT ENTERED ON WEB — ASSISTANT TO REQUEST]` so your WhatsApp Meta AI assistant automatically greets them and asks for their location.
4. **Structured Meta AI Directive:**
   The generated WhatsApp message contains a machine-readable `🤖 *META AI ASSISTANT DIRECTIVE:*` block designed for your WhatsApp AI / bot to instantly parse the status, region, items, and next steps.

---

## 2. Meta AI WhatsApp Message Schema

```text
📦 *NEW ORDER — USEOURA LIVING*
*Order Ref:* #OL-84920
*Date:* 15 Nov 2026, 03:58 GMT

🛒 *ORDERED ITEMS:*
• 1x Baseus 65W Triple Port Car Charger (GH₵ 180.00 each = GH₵ 180.00)
• 1x Apple 35W Dual Port Power Adapter (GH₵ 180.00 each = GH₵ 180.00)

💰 *PAYMENT SUMMARY:*
• Subtotal: GH₵ 360.00
• Delivery: GH₵ 25.00 (Greater Accra Fleet)
• *TOTAL AMOUNT DUE: GH₵ 385.00*

📍 *DELIVERY INFORMATION:*
• Customer Name: Kwame Mensah
• Phone: 024 123 4567
• Region: Greater Accra (Accra, Tema, Kasoa corridor)
• Address: 14 Senchi St, Airport Residential Area, Accra
• Delivery Notes / Landmark: Near Shell Filling Station

💳 *PAYMENT POLICY:*
• Policy: Payment on Delivery Available (Cash or MoMo on arrival)

🤖 *META AI ASSISTANT DIRECTIVE:*
[ACTION REQUIRED: Customer is in Greater Accra and eligible for Payment on Delivery. Address has been provided. Please confirm their order and notify them of the dispatch delivery time window.]
```

---

## 3. Configuration & WhatsApp Number

### Setting Your WhatsApp Business Number
1. In your Vercel Project Settings, add an Environment Variable:
   ```env
   NEXT_PUBLIC_WHATSAPP_NUMBER=233XXXXXXXXX
   ```
   *(Enter your Ghanaian phone number in international format without `+` or spaces, e.g. `233241234567`)*.
2. In the web application, click the **Settings icon (⚙)** in the Shopping Bag drawer to update or test any WhatsApp phone number on the fly. The number is saved to your browser session.

---

## 4. Hardware Catalog & Ghana Cedis (`GH₵`) Pricing

| Ref | Product Title | Category | Price | Key Specs |
|---|---|---|---|---|
| AUTO // 01 | **Baseus 65W Triple Port Car Charger** | Automotive Upgrades | GH₵ 180.00 | 65W GaN, Real-time LED voltage, Dual USB-C + USB-A |
| DESK // 02 | **Apple 35W Dual Port Power Adapter** | Mobile & Desk Tech | GH₵ 180.00 | Dual USB-C dynamic power sharing, folding pins |
| DESK // 03 | **Anker 100W Braided USB-C Cable** | Mobile & Desk Tech | GH₵ 150.00 | 100W E-marker, double-braided nylon, 25k bends |
| HOME // 04 | **Tuya Smart Zigbee 3.0 Hub** | Smart Home Automation | GH₵ 300.00 | Zigbee 3.0 + Wi-Fi mesh, up to 128 local sub-devices |
| DESK // 05 | **Minimalist Monitor Light Bar** | Mobile & Desk Tech | GH₵ 550.00 | Asymmetric optics (zero glare), 2.4G wireless dial |
| DESK // 06 | **XXL Solid Color Desk Mat** | Mobile & Desk Tech | GH₵ 190.00 | 900x400mm waterproof textured vegan leather |
| AUTO // 07 | **Magnetic Dashboard Phone Mount** | Automotive Upgrades | GH₵ 150.00 | 16x N52 Neodymium MagSafe array, 360° ball joint |
| AUDIO // 08 | **DJI Mic Mini** | Minimalist Lifestyle | GH₵ 700.00 | 10g featherweight, 48kHz studio audio, 400m range |

---

## 5. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open locally
http://localhost:3000
```

---

## 6. Vercel Production Deployment

Push to GitHub and connect to Vercel:
1. Repository: `https://github.com/Eangmler/useoura-living.git`
2. Set Environment Variable in Vercel:
   `NEXT_PUBLIC_WHATSAPP_NUMBER=233XXXXXXXXX`
3. Hit **Deploy**. The site will instantly publish to your custom domain or vercel.app URL.
