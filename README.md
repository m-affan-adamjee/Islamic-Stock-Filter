## Mollet Capital Islamic Stock Filter🌙 — AI-Powered Shariah Stock Screener & AAOIFI Compliance Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![AAOIFI Standard](https://img.shields.io/badge/AAOIFI-Standard--21-blue.svg)]()
[![Powered by Gemini](https://img.shields.io/badge/AI-Gemini--3.6--Flash-8A2BE2.svg)]()

**Mollet Capital Screener** is an enterprise-grade fintech platform designed to screen publicly listed equities for Shariah compliance according to the **AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions)** methodology, with pluggable support for MSCI Islamic, S&P Shariah, Dow Jones Islamic, and custom user thresholds.

---

## 🌟 Key Features

- 🔍 **Real-Time Stock Search & Auto-Enrichment**: Search any global ticker (NVDA, AAPL, MSFT, TSLA, JPM, etc.) with instant AAOIFI ratio computation.
- 📐 **AAOIFI Shariah Screening Engine**:
  - Primary Business Activity & Sector Filter
  - Debt Ratio Screening ($Debt / MarketCap < 30\%$)
  - Interest-Earning Cash & Deposits Screening ($Cash / MarketCap < 30\%$)
  - Impure Revenue Threshold ($Impure Rev / Total Rev \le 5\%$)
  - Tangible Asset Ratio ($Tangible Assets / Total Assets \ge 20\%$)
- 🧮 **Interactive Dividend Purification Calculator**: Calculate exact dollar amounts to donate to charity based on non-halal revenue percentages.
- 🤖 **AI Shariah Audit Memo (Gemini 3.6 Flash)**: Server-side AI generation of plain-language compliance summaries, debt audits, and scholar reasoning.
- 📊 **Commercial Fintech Dashboard & Visualizations**:
  - Donut breakdown of Halal vs. Impure Revenue
  - Tangible vs. Intangible Asset pie charts
  - Gauge charts for debt and liquidity thresholds
  - Historical quarterly compliance timeline and ratio trend lines
- ⚖️ **Multi-Standard Switcher**: Instantly compare screening outcomes across AAOIFI, MSCI Islamic, S&P Shariah, Dow Jones Islamic, or Custom user thresholds.
- 🔀 **Side-by-Side Stock Comparison Matrix**: Compare 2 to 4 stocks on a unified compliance table.
- 📄 **Full Export Suite**: Download PDF Investment Memos, CSV datasets, or raw JSON payloads.
- ⚡ **REST API & OpenAPI**: Integrated backend API endpoints for financial data, screening results, and AI analysis.

---

## 🏗️ Architecture & Technology Stack

```
                     +----------------------------------+
                     |       Mollet Capital Screener    |
                     |  React 19, TypeScript, Tailwind  |
                     |  Recharts, Lucide, Motion        |
                     +----------------------------------+
                                      |
                                      v  REST API
                     +----------------------------------+
                     |        Express + Node Server     |
                     |  - AAOIFI Math Screening Engine |
                     |  - Multi-Standard Calculations   |
                     |  - Caching & Fallback Synthesizer|
                     +----------------------------------+
                                      |
                                      v
                     +----------------------------------+
                     |    Server-Side Gemini AI Engine  |
                     |    @google/genai (gemini-3.6)    |
                     +----------------------------------+
```

---

## 🛠️ Quick Start & Installation

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x

### Standard Setup

```bash
# Clone the repository
git clone https://github.com/username/noorscreen.git
cd noorscreen

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run development full-stack server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🐳 Docker Deployment

```bash
# Build & start container with Docker Compose
docker-compose up --build -d
```

---

## 📐 AAOIFI Screening Criteria

| Ratio | Numerator | Denominator | Max Threshold |
|---|---|---|---|
| **Debt Ratio** | Interest-Bearing Debt | Market Capitalization | **< 30.0%** |
| **Cash & Liquidity Ratio** | Interest-Earning Cash & Securities | Market Capitalization | **< 30.0%** |
| **Impure Revenue Ratio** | Non-Halal / Interest Income | Total Revenue | **≤ 5.0%** |
| **Tangible Asset Ratio** | Tangible Physical Assets | Total Assets | **≥ 20.0%** (Min) |

---

## 🔌 API Endpoints

- `GET /api/health` — System status and AI capability state
- `GET /api/search?q={query}` — Search tickers and company names
- `GET /api/company/{ticker}` — Full fundamental profile & AAOIFI status
- `GET /api/screen/{ticker}?standard=AAOIFI` — Calculate screening result under specified standard
- `GET /api/history/{ticker}` — Quarterly historical compliance metrics
- `POST /api/ai/analyze` — Generate Gemini AI Shariah Audit Memo
- `POST /api/compare` — Compare multi-company compliance matrix

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
