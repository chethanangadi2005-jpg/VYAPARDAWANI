# VYAPARDHWANI
### AI Financial Operating System for India's Small Businesses

Tagline: *"Capture. Reconcile. Protect. Forecast. Decide."*

> Existing tools record transactions. **VyaparDhwani understands them.**

---

## 🌟 Overview & Product Vision

**VyaparDhwani** ("Sound of Business") is a production-grade, full-stack fintech command center tailored for micro and small enterprises (MSMEs) in India—including Kirana stores, hardware shops, electrical dealers, small manufacturers, and traders.

Indian small merchants manage fragmented data streams across paper bills, GST invoices, UPI transactions, cash ledgers, WhatsApp orders, and supplier bills. VyaparDhwani turns this fragmented chaos into an intelligent financial command center.

---

## 🚀 Production Features

1. **Deterministic Calculation Engine (0% LLM Math Hallucinations)**:
   - **GSTR-2B Fuzzy Matching**: Compares purchase ledgers against portal records with normalization (stripping punctuation/dashes, casing insensitive), rounding discrepancy tolerance handling (±₹1), and confidence scoring (0–100%).
   - **Cash Flow Forecaster & Anomaly Guardian**: Computes 7-day, 30-day, and 90-day daily projected liquid balances and detects spending spikes exceeding **>300% above 30-day moving average**.
2. **SQLite WAL Mode & Performance Indexing**: High-concurrency Write-Ahead Logging (`PRAGMA journal_mode = WAL;`), `PRAGMA synchronous = NORMAL;`, 64MB RAM page cache, batch transaction hooks, and composite database indexing on GSTIN, date, and aging buckets.
3. **Camera-First Capture (`@capacitor/camera`)**: Single-tap mobile invoice camera capture via `QuickCaptureFAB` with an interactive crop preview modal, laser-scan effect, and web fallbacks.
4. **Offline-First Synchronization Engine**: Persistent IndexedDB storage queue (`offlineSyncEngine.ts`) that captures failed invoice scans during network drops and syncs seamlessly when back online.
5. **Dark/Light Theme Architecture**: Typed `ThemeContext.tsx` and WCAG-compliant animated `ThemeToggle.tsx` with dynamic `prefers-color-scheme` detection and `localStorage` persistence.
6. **Interactive Dual-Interface Toggle System**: 1-click switcher between **Mobile App UI Preview** (obsidian dark theme device frame) and **Web Command Center Dashboard UI** (3-column layout).
7. **Receivables & Multi-lingual WhatsApp Deep Linking**: Customer aging buckets (0-7, 8-30, 31-60, 60+ days) with direct `whatsapp://send?phone=...&text=...` deep links in English, Hindi, and Kannada.
8. **Vyapar Health Score (0-100)**: Transparent weighted financial health indicator with an interactive What-If Scenario Simulator.
9. **Voice Copilot**: Interactive animated voice orb with speech recognition & structured NLP query parser.

---

## 📐 System Architecture

```
                                    +-----------------------------------------+
                                    |     VyaparDhwani Frontend App           |
                                    | React 18 + Vite + TailwindCSS + Lucide |
                                    | Capacitor 7 + IndexedDB + ThemeContext  |
                                    +--------------------+--------------------+
                                                         |
                                             REST APIs / JSON payloads
                                                         v
                                    +--------------------+--------------------+
                                    |     VyaparDhwani Node/Express Server    |
                                    |          TypeScript + Express           |
                                    +---------+----------+----------+---------+
                                              |          |          |
                      +-----------------------+          |          +-----------------------+
                      v                                  v                                  v
         +--------------------------+  +-------------------+------+  +--------------------------+
         |  Deterministic Engines   |  |  Edge OCR AI      |  |   NLP & Intent Parser    |
         | - GSTR-2B Fuzzy Match    |  | - Field Extractor |  | - Multilingual Voice API |
         | - Cash Flow 7/30/90 Forecast| - Confidence Scoring |  | - Voice Response Gen     |
         | - Anomaly (>300% MA)     |  | - Batch Transactions |  | - Query Handlers         |
         +------------+-------------+  +--------------------------+  +--------------------------+
                      |
                      v
         +------------+-------------+
         | SQLite Database (WAL Mode)|
         | vyapardhwani.db          |
         | Composite Indexing       |
         +--------------------------+
```

---

## 🛠️ Quick Start & Setup

### Prerequisites
- Node.js v18+ or v20+ or v24+
- npm v9+

### 1. Installation
```bash
# Clone repository
git clone https://github.com/shreehari-delta/VyaparDhwani.git
cd VyaparDhwani

# Install root dependencies (Capacitor, idb, React 18, TailwindCSS)
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Seed Database & Start Full-Stack App
```bash
# Seed database with realistic Indian MSME dataset & WAL mode
npm run server:seed

# Start both Express backend (Port 5000) and React frontend (Port 3000) concurrently
npm start
```

Open browser at `http://localhost:3000` to interact with VyaparDhwani.

---

## 🔑 Demo Credentials

- **Email**: `merchant@vyapardhwani.demo`
- **Password**: `Demo@123`
- **Business**: Shree Hardware Stores (GSTIN: `29ABCDE1234F1Z5`)

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Merchant login & JWT issuance |
| `GET` | `/api/invoices` | List invoices with status & search filters |
| `POST` | `/api/invoices/upload` | Process Edge AI OCR scan simulation |
| `GET` | `/api/gst/summary` | Fetch ITC claimable vs pending summary |
| `POST` | `/api/reconciliation/run` | Execute GSTR-2B deterministic fuzzy matching engine |
| `GET` | `/api/receivables` | Customer aging buckets (0-7, 8-30, 31-60, 60+ days) |
| `POST` | `/api/reminders/generate` | Generate multilingual WhatsApp payment reminder & deep links |
| `GET` | `/api/cashflow` | Fetch 7/30/90-day cash flow projections & anomaly warnings |
| `POST` | `/api/finance/simulate` | Calculate loan EMI cash flow impact |
| `GET` | `/api/risk` | Retrieve risk guardian anomaly alerts (>300% moving average) |
| `POST` | `/api/voice/query` | Parse natural language voice business query |
| `POST` | `/api/demo/reset` | Reset environment to perfect demo state |

---

## 🔒 Security & Privacy

- Deterministic financial calculation engines ensure **0% mathematical hallucinations**.
- Edge Mode capability ensures private invoice processing on-device.
- SQLite WAL mode ensures database integrity and concurrent multi-invoice read/write safety.
- Complete compliance with WCAG high-contrast accessibility rules.
