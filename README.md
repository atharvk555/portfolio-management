# Dynamic Portfolio Reporting System

A production-style, real-time React portfolio management and reporting platform built for the **UBS Tech Grads Program (Capstone — Project 2: Portfolio Reporting)**.

The system replaces static mock data with **100% free, keyless live financial market APIs** (Frankfurter European Central Bank FX rates and Yahoo Finance market price endpoints), an active financial calculation engine, **multi-account management** across global currencies (USD, EUR, GBP, CHF, INR), and an **institutional 14-column Client Wise Portfolio Statement** matching official broker statement specifications.

---

## 🚀 Quick Start

### 1. Installation
```bash
# Clone or navigate to project directory
cd "d:\ubs\Imarticus project\portfolio-management"

# Install dependencies (React 18, Lucide React, Vite, TypeScript)
npm install
```

### 2. Development Server
```bash
# Start local development server on http://localhost:3000
npm run dev
```

### 3. Production Build & Type Checking
```bash
# Verify production compilation
npm run build
```

---

## 🌐 100% Free Live API Integration (No Keys Required)

| Data Feed | Provider & Endpoint | Description |
| :--- | :--- | :--- |
| **Foreign Exchange (FX)** | **Frankfurter API (European Central Bank)**<br>`https://api.frankfurter.dev/v2/rates?base=USD` | Free, keyless REST API fetching live spot FX rates for **USD, EUR, GBP, CHF, INR**. Includes 1-click rate sync and fallback logic. |
| **Stock Market Quotes** | **Yahoo Finance Public CORS Feed**<br>`https://query1.finance.yahoo.com/v8/finance/chart/{symbol}` | Free public endpoints supplying live market closing prices, price changes, and historical return series for global equities (AAPL, MSFT, NVDA, SAP, ASML, SHEL, NESN, RELIANCE, etc.). |

---

## 📑 8 Core Business Requirements Fulfilled

1. **Client Portfolio Statement**: Institutional **Client Wise Portfolio Statement** ([ClientStatementView.tsx](file:///d:/ubs/Imarticus%20project/portfolio-management/src/components/ClientStatementView.tsx)) matching exact broker statement layouts (South Asia Securities / UBS Wealth Management style), including BO ID, Client Code, 14-column holdings grid, NAV/Equity breakdown, and last day transaction P&L.
2. **Holdings Information**: Dynamic table showing MTM Market Value, Cost Basis (Avg Rate), Unrealized P&L, Holding Period in days, Categories (A/B/N/Z), and Beta indicators.
3. **Manual Trade Entry**: Trade blotter and modal supporting **BUY** and **SELL** orders, back-dated trade execution dates, ticker auto-lookup, oversell validation, and cash balance impact checks.
4. **Multi-Currency Cash Management**: Multi-currency cash balances across USD, EUR, GBP, CHF, and INR, with spot conversion into the reporting base currency.
5. **Dynamic Mark-to-Market (MTM)**: Real-time price updates dynamically updating `Market Value = Quantity × Live Closing Price` across holdings and totals.
6. **Portfolio Risk Analytics**: Dynamic Risk Engine computing **Portfolio Beta ($\beta$)**, **Weighted Delta ($\Delta$)**, **Sharpe Ratio**, **Annualized Volatility**, and position concentration metrics.
7. **Market Benchmarking**: Normalized performance comparison against **NASDAQ 100 (^IXIC)**, **S&P 500 (^GSPC)**, and **FTSE 100 (^FTSE)** across 1M, 3M, 6M, and 1Y horizons.
8. **External Data Flowchart**: Interactive Bloomberg B-PIPE and Exchange feed integration diagram ([DataFlowView.tsx](file:///d:/ubs/Imarticus%20project/portfolio-management/src/components/DataFlowView.tsx)) illustrating data ingestion, symbol normalization, valuation calculation, and client statement generation.

---

## 💼 Multi-Account Support

Clients can manage multiple distinct sub-accounts, each with its own native currency, trade history, cash ledger, and lock/lien shares, or view a **Global Consolidated Statement**:

- **Account #9056-01**: `USD Global Growth Portfolio` (USD)
- **Account #9056-02**: `EUR European Tech & Opportunities` (EUR)
- **Account #9056-03**: `GBP UK & Commonwealth Income` (GBP)
- **Account #9056-04**: `CHF Swiss Private Wealth` (CHF)
- **Account #9056-05**: `INR India Emerging Equities` (INR)
- **🌐 Global Consolidated View**: Aggregates all accounts into a unified Client Statement, translating all foreign security and cash values into the selected base reporting currency.

---

## 🧮 Financial Calculation Formulas

- **Cost Amount (Cost Basis)**: $\text{Total Quantity} \times \text{Avg. Purchase Rate}$
- **Mark-to-Market (MTM) Value**: $\text{Total Quantity} \times \text{Live Closing Price}$
- **Unrealized Gain / Loss**: $\text{Market Value} - \text{Cost Amount}$
- **% Gain / Loss**: $\frac{\text{Unrealized Gain/Loss}}{\text{Cost Amount}} \times 100\%$
- **Saleable Quantity**: $\text{Total Quantity} - \text{Lock Quantity} - \text{Lien Quantity}$
- **Net Asset Value (NAV)**: $\text{Securities Market Value} + \text{Ledger Cash Balance}$
- **Portfolio Beta ($\beta$)**: $\frac{\sum (\text{Position Market Value}_i \times \beta_i)}{\text{Total Portfolio Securities Value}}$
- **Sharpe Ratio**: $\frac{\text{Portfolio Annual Return} - 4.5\%}{\text{Annualized Volatility}}$

---

## 🏗️ Project Architecture

```
portfolio-management/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Top bar with Account Switcher & Base Currency Selector
│   │   ├── Sidebar.tsx             # Main navigation sidebar
│   │   ├── DashboardView.tsx       # Portfolio overview dashboard & allocation charts
│   │   ├── HoldingsView.tsx        # Security holdings MTM valuation table
│   │   ├── TradesView.tsx          # Audit-ready trade blotter & history
│   │   ├── TradeModal.tsx          # Back-dated trade booking entry modal
│   │   ├── CashView.tsx            # Multi-currency cash & FX exchange matrix
│   │   ├── RiskView.tsx            # Risk score, Beta, Delta, Sharpe ratio & volatility
│   │   ├── BenchmarksView.tsx      # Performance comparison vs NASDAQ, S&P 500, FTSE 100
│   │   ├── DataFlowView.tsx        # Requirement 8 Bloomberg/Exchange Integration Flowchart
│   │   └── ClientStatementView.tsx # Requirement 1 14-Column Institutional Client Statement
│   ├── services/
│   │   ├── marketData.ts           # Live Frankfurter FX & Yahoo Finance REST API integration
│   │   └── financialEngine.ts      # MTM calculation, FIFO cost basis & Risk Greeks engine
│   ├── data/
│   │   ├── initialAccounts.ts      # Seed data for Multi-Account portfolio & statement trades
│   │   └── initialData.ts          # Baseline holdings, cash ledgers & initial trades
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces (ClientAccount, Holding, Trade, Risk)
│   ├── styles/
│   │   └── index.css               # Design system tokens, flex/grid layouts & print styles
│   ├── App.tsx                     # Main application routing & reactive state engine
│   └── main.tsx                    # Application entry point
├── package.json
└── vite.config.js
```

---

## 🎓 Project Context

- **Program**: UBS Tech Grads Program
- **Capstone**: Project 2 — Portfolio Reporting
- **Client Name**: MD. BELAYET HOSSAIN / John Smith
- **Client Code**: 9056
- **BO ID**: 1202310005959896
