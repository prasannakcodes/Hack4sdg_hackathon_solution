# Tempowala: Shared Truck Pooling Prototype for Small Makers

> **Goal:** A working prototype demonstrating how small makers and artisans in an industrial cluster can pool truck space along a shared transit corridor to cut freight costs and tailpipe CO₂ emissions in half, with granular cost and carbon savings calculated per maker.

---

## 🌍 SDG Alignment
- **SDG 12: Responsible Consumption and Production** — Targets Target 12.2 & 12.5 by eliminating empty freight miles and optimizing resource usage.
- **SDG 13: Climate Action** — Directly reduces diesel fuel combustion by removing underutilized heavy vehicles from national highways.
- **SDG 9: Industry, Innovation, and Infrastructure** — Empowers micro, small, and medium enterprises (MSMEs) with cooperative logistics sharing.

---

## 🚛 Corridor & Seeded Makers
- **Corridor Route:** Moradabad Metalware Artisan Cluster (Peetal Nagri, UP) $\rightarrow$ Delhi NCR Export & Fulfillment Gateway (ICD Patparganj / Okhla Industrial Area) via **NH-9 / NH-24 (165 km)**.
- **Seeded 4 Makers on the Corridor:**
  1. **Moradabad Brass Artwares** (1,400 kg, 5.28 m³) $\rightarrow$ ICD Patparganj
  2. **Royal Peetal Handicrafts** (1,100 kg, 4.50 m³) $\rightarrow$ ICD Patparganj
  3. **Sunrise Copper & Metal Works** (1,600 kg, 5.76 m³) $\rightarrow$ Okhla Industrial Area Ph-III
  4. **Heritage Bell Metal Castings** (950 kg, 3.53 m³) $\rightarrow$ Okhla Industrial Area Ph-III

---

## 📊 Key Results: Before vs After Pooling

| Metric | Before Pooling (Dedicated Trucks) | After Pooling (Shared Trucks) | Net Impact |
| :--- | :--- | :--- | :--- |
| **Trucks on Highway** | **4 Dedicated Trucks** (mostly empty, ~35% full) | **2 Shared Trucks** (~75% packed) | **↓ 2 Trucks (50% reduction)** |
| **Total Freight Cost** | **₹56,000** (₹14,000 / trip × 4) | **₹28,000** (₹14,000 / trip × 2) | **₹28,000 Saved (50%)** |
| **Tailpipe CO₂ Emissions** | **429.0 kg CO₂** (107.25 kg × 4) | **214.5 kg CO₂** (107.25 kg × 2) | **214.5 kg CO₂ Avoided (50%)** |

### Per-Maker Savings Card Breakdown

| Maker | Payload | Assigned Truck | Before Cost | Pooled Cost Share | Net Saved | Saved / kg | CO₂ Avoided |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Sunrise Copper & Metal** | 1,600 kg / 5.76 m³ | Shared Truck Alpha-1 | ₹14,000 | ₹7,467 | **₹6,533 (46.7%)** | ₹4.08/kg | 50.05 kg CO₂ |
| **Moradabad Brass Artwares** | 1,400 kg / 5.28 m³ | Shared Truck Alpha-1 | ₹14,000 | ₹6,533 | **₹7,467 (53.3%)** | ₹5.33/kg | 57.20 kg CO₂ |
| **Royal Peetal Handicrafts** | 1,100 kg / 4.50 m³ | Shared Truck Alpha-2 | ₹14,000 | ₹7,512 | **₹6,488 (46.3%)** | ₹5.90/kg | 49.70 kg CO₂ |
| **Heritage Bell Metal Castings** | 950 kg / 3.53 m³ | Shared Truck Alpha-2 | ₹14,000 | ₹6,488 | **₹7,512 (53.7%)** | ₹7.91/kg | 57.55 kg CO₂ |

---

## 📐 Assumptions & Standards Used

1. **Truck Model:** Medium Commercial Vehicle (MCV 3.5T - 7.5T rigid diesel, e.g. Eicher Pro 2059 / Tata 709).
2. **Truck Capacity:** Payload limit: **3,500 kg**; Volumetric container capacity: **14.0 m³**.
3. **Dedicated Truck Rate:** **₹14,000 per trip** (spot freight rate benchmark on Moradabad–Delhi highway).
4. **Route Distance:** **165 km** along NH9.
5. **Emission Factor:** **0.65 kg CO₂ per vehicle-km**.
   - *Citation:* India GHG Program (WRI India, TERI, CII) and Central Pollution Control Board (CPCB) Road Transport Emission Standard for Medium Commercial Vehicles (3.5T–7.5T rigid diesel). Corroborated with GLEC Framework v3.0.
   - Per-trip emissions per truck = $165 \text{ km} \times 0.65 \text{ kg CO}_2/\text{km} = 107.25 \text{ kg CO}_2$.

---

## 🤖 Vernacular Chatbot with Bhashini

The prototype includes an AI vernacular logistics assistant located on the maker entry page:
- **Languages Supported:** Hindi (`hi`), Tamil (`ta`), Kannada (`kn`), Marathi (`mr`), Gujarati (`gu`), and English (`en`).
- **3 Scoped Prototype Intents:**
  1. **"Add a shipment"** — Guides maker to submit name, weight (kg), dimensions (cm), destination, and date (with embedded micro-form & conversational parsing).
  2. **"Show my savings"** — Renders the individual maker's savings card directly inside the chat conversation.
  3. **"What is pooling?"** — Delivers a clear, fixed explanation of shared truck pooling and SDG carbon reduction in the maker's chosen language.
- **Voice Capabilities:**
  - **Speech-to-Text (STT):** Click the microphone button to dictate in Hindi or English.
  - **Text-to-Speech (TTS):** Click the speaker button on any bot reply to listen aloud.
- **Fallback Guarantee:**
  - One-click **"Form Fallback"** button switches back to the standard input form at any time.
  - If Bhashini API keys are absent or network is disconnected, the bot smoothly switches to the pre-loaded vernacular dictionary with zero crashes.

### Bhashini API Key Configuration
Create a `.env.local` file in the `hack4sdg` directory (see `.env.local.example`):
```bash
BHASHINI_USER_ID=your_ulca_user_id
BHASHINI_API_KEY=your_ulca_api_key
BHASHINI_PIPELINE_ID=64392f96daac500b55c543d7
```

---

## 🚫 Features Marked as Planned (Do Not Build for Prototype)
As specified in the project scope, the following enterprise features are documented on the roadmap and intentionally excluded:
- Real-time Payments & Escrow Splits (UPI/Razorpay/Stripe)
- Invoice photo or PDF reading (OCR)
- Consignment liability and marine insurance integration
- Live transporter fleet telematics (FASTag / GPS IoT)
- Open-ended AI conversation
- WhatsApp or SMS channel bot

---

## 🚀 Running the Prototype

### 1. Web Application (Next.js + Tailwind CSS)
```bash
# Navigate to project folder
cd hack4sdg

# Install dependencies
npm install

# Run development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Standalone Python Solver
A standalone solver script is included in the project root:
```bash
# Run human-readable output
python3 solver.py

# Run JSON output
python3 solver.py --json
```
If `ortools` is installed (`pip install ortools`), it solves with Google OR-Tools integer programming; otherwise it runs the multi-capacity Best-Fit Decreasing bin-packing solver in pure Python.

---

## 🛠 Tech Stack
- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React
- **Optimization:** Multi-Constraint 2D Bin Packing Engine (TypeScript + Python)
- **Vernacular AI:** Bhashini ULCA Pipeline API (with Web Speech STT/TTS & Offline Dictionary)
- **Data:** In-memory reactive state with seeded corridor constants and JSON export
