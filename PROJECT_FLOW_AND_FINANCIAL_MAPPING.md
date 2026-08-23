# Project Flow & Financial Concept Mapping Guide

This document maps out the complete execution flow of the **UBS Portfolio Reporting System** and explains in detail where and how each financial topic, formula, and accounting principle is integrated across the system architecture.

---

## 🏗️ System Flow & Architecture Overview

The system follows a clean 5-layer reactive architecture:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. External Market & FX Data Layer (services/marketData.ts)                  │
│    • Live Frankfurter API (ECB FX Rates) & Yahoo Finance Stock Feeds         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Multi-Account Base Ledger & Trades Store (data/initialAccounts.ts & App.tsx)│
│    • Client Accounts (USD, EUR, GBP, CHF, INR) & Persisted Trade Ledger    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. Central Financial Calculation Engine (services/financialEngine.ts)        │
│    • FIFO Rebuilder • MTM Valuer • FX Translator • Risk Engine • Benchmarks │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. Presentation & Analytics Views (components/*.tsx)                       │
│    • Dashboard • Holdings • Blotter • Cash & FX • Risk Analytics • Flowchart│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. Institutional Client Statement Generator (ClientStatementView.tsx)        │
│    • 14-Column Grid • NAV & Equity • Capital Gains • Transaction Day Details │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧭 Step-by-Step Flow & Financial Topic Mapping

---

### Step 1: External Live Data Ingestion Layer
* **Source Files**: `src/services/marketData.ts`
* **Trigger**: Executed automatically on application mount and on-demand via the **"↻ Sync Feeds"** button.

#### Financial Topics Applied:
1. **Foreign Exchange (FX) Spot Rates**:
   - Queries the European Central Bank (Frankfurter API) for spot exchange rates (`USD`, `EUR`, `GBP`, `CHF`, `INR`).
   - Ensures foreign assets and multi-currency cash ledgers are accurately valued against the reporting currency.
2. **Live Closing Market Quotes**:
   - Fetches live closing prices, daily percentage changes, and volume for global securities (`AAPL`, `MSFT`, `NVDA`, `SAP`, `ASML`, `SHEL`, `NESN`, `RELIANCE`, etc.).
   - Includes automatic stale-price detection and fallback handling to maintain uninterrupted system valuation.

---

### Step 2: Multi-Account & Ledger Base State Initialization
* **Source Files**: `src/types/index.ts`, `src/data/initialAccounts.ts`, `src/App.tsx`
* **Trigger**: System startup and account dropdown selection.

#### Financial Topics Applied:
1. **Multi-Account Allocation**:
   - Manages 5 separate client sub-accounts:
     * `9056-01`: USD Global Growth Portfolio
     * `9056-02`: EUR European Tech & Opportunities
     * `9056-03`: GBP UK & Commonwealth Income
     * `9056-04`: CHF Swiss Private Wealth
     * `9056-05`: INR India Emerging Equities
   - Supports switching between individual accounts or selecting the **Global Consolidated View (`ALL`)**.
2. **Share Encumbrance & Classification**:
   - Tracks share quantities by regulatory and loan status:
     * `Total Qty`: Total shares owned.
     * `Lock Qty`: Restricted shares under IPO/regulatory lock-in.
     * `Lien Qty`: Shares pledged as margin collateral.
     * `Saleable Qty`: Unencumbered shares available for immediate trading ($\text{Total} - \text{Lock} - \text{Lien}$).
     * `Category`: Classification tag (`A` = Blue Chip, `B` = Growth, `N` = New IPO, `Z` = Distressed).

---

### Step 3: Interactive Trade Booking & Audit Blotter
* **Source Files**: `src/components/TradeModal.tsx`, `src/components/TradesView.tsx`
* **Trigger**: User inputs a new trade (`BUY`/`SELL`) or deletes an existing trade.

#### Financial Topics Applied:
1. **Dynamic Cash Flow Movements**:
   - Booking a `BUY` order calculates cash outflow: $\text{Cash}_{\text{New}} = \text{Cash}_{\text{Old}} - (\text{Qty} \times \text{Price} + \text{Fee})$.
   - Booking a `SELL` order calculates cash inflow: $\text{Cash}_{\text{New}} = \text{Cash}_{\text{Old}} + (\text{Qty} \times \text{Price} - \text{Fee})$.
2. **Back-Dated Execution & Trade Date Validation**:
   - Trades can be executed on historical dates. The engine reconstructs position lots in strict chronological order ($T_0, T_1, \dots$).
3. **Settlement & Clearing Status**:
   - Tracks `Receive Qty` (purchased shares pending settlement delivery) and `Deliver Qty` (sold shares pending clearing).
4. **Oversell & Insolvency Validation**:
   - Validates that `SELL` orders do not exceed `Saleable Qty` and `BUY` orders do not exceed available cash/margin limits.

---

### Step 4: Central Dynamic Financial Calculation Engine
* **Source Files**: `src/services/financialEngine.ts`
* **Trigger**: Every time trades change, live prices update, FX rates refresh, or base currency switches.

#### Financial Topics Applied:

#### A. FIFO Cost Basis Lot Rebuilder (`deriveHoldingsFromTrades`)
* Chronologically iterates through trade events to establish open tax lots.
* Calculates **Weighted Average Buy Rate**:
  $$\text{Avg Rate} = \frac{\sum (\text{Qty}_i \times \text{Price}_i)}{\text{Total Qty}}$$
* Calculates total **Cost Amount** ($\text{Total Qty} \times \text{Avg Rate}$).

#### B. Mark-to-Market (MTM) Valuation Engine (`calculatePortfolioMetrics`)
* Applies live closing market prices to calculate current liquidation value:
  $$\text{MTM Value}_i = \text{Quantity}_i \times \text{Live Closing Price}_i$$
* Derives **Unrealized MTM Gain/Loss**:
  $$\text{Unrealized P\&L} = \text{MTM Value} - \text{Cost Amount}$$

#### C. Multi-Currency FX Spot Translator (`convertToBase`)
* Converts foreign holdings and cash balances into the selected reporting currency:
  $$\text{Value}_{\text{Base}} = \text{Value}_{\text{Local}} \times \left( \frac{\text{FX Rate (Local to USD)}}{\text{FX Rate (Base to USD)}} \right)$$

#### D. Risk Greeks Processor (`calculateRiskMetrics`)
* **Weighted Beta ($\beta_p$)**: Measures systematic market sensitivity relative to benchmark indices:
  $$\beta_p = \sum \left( w_i \times \beta_i \right) \quad \text{where } w_i = \frac{\text{MTM Value}_i}{\text{Total Securities Value}}$$
* **Weighted Delta ($\Delta_p$)**: Directional price sensitivity.
* **Sharpe Ratio**: Evaluates risk-adjusted excess return over risk-free rate ($R_f = 4.5\%$):
  $$\text{Sharpe Ratio} = \frac{R_p - R_f}{\sigma_p}$$
* **Annualized Volatility ($\sigma_{\text{annual}}$)**: Standard deviation of returns annualized over 252 trading days ($\sigma_{\text{daily}} \times \sqrt{252}$).

#### E. Benchmark Performance Engine (`getBenchmarkComparisonData`)
* Rebases Portfolio and Market Indices (NASDAQ 100, S&P 500, FTSE 100) to 100 at time $t_0$.
* Calculates **Active Alpha ($\alpha$)**: Excess return generated relative to market benchmark ($\alpha = R_{\text{portfolio}} - R_{\text{benchmark}}$).

---

### Step 5: Presentation UI & Dashboard Layer
* **Source Files**: `src/components/DashboardView.tsx`, `HoldingsView.tsx`, `CashView.tsx`, `RiskView.tsx`, `BenchmarksView.tsx`
* **Trigger**: User navigation across tabs.

#### Financial Topics Applied:
1. **Asset & Sector Allocation**: Visualizes portfolio weight concentration across sectors (Technology, Semiconductors, Financials, Healthcare, Consumer).
2. **Risk Concentration Score (0-100)**: Maps beta, volatility, and single-stock concentration into a composite risk rating (Low, Moderate, High, Aggressive).
3. **FX Spot Rate Matrix**: Displays live exchange rate quotes across currency pairs.

---

### Step 6: Institutional Client Wise Portfolio Statement Reporting
* **Source Files**: `src/components/ClientStatementView.tsx`
* **Trigger**: User views or prints the Client Statement.

#### Financial Topics Applied:
1. **14-Column Securities Holdings Grid**: Displays complete asset attributes (`Company Name`, `Category`, `Total Qty`, `Lock Qty`, `Lien Qty`, `Saleable Qty`, `Avg Rate`, `Cost Amount`, `Market Price`, `Market Value`, `Receive Qty`, `Deliver Qty`, `Unrealized P&L`, `% Gain/Loss`).
2. **Account Status & Balance Breakdown**:
   - `Available Balance`: Unencumbered cash.
   - `Immature Balance`: Cash awaiting settlement clearance.
   - `Ledger Balance`: $\text{Available Cash} + \text{Immature Balance}$.
3. **Deposit & Withdrawal Accounting**:
   - `Total Deposit`, `Total Withdraw`, `Net Deposit Total` ($\text{Deposits} - \text{Withdrawals}$).
4. **Valuation & Capital Metrics**:
   - `Market Value of Securities`: Total MTM value of holdings.
   - `Net Asset Value (NAV) & Equity`: $\text{Securities Market Value} + \text{Ledger Cash Balance}$.
   - `Purchasing Power`: Maximum trading leverage/capital available.
   - `Capital Gains Summary`: Realized Gain/Loss, Unrealized Capital Gain/Loss, Net Gain/Loss, and Last Transaction Day Gains.

---

## 📌 Summary Mapping Table

| Application Step | Primary Component / Module | Financial Topics Integrated |
| :--- | :--- | :--- |
| **1. Data Ingestion** | `services/marketData.ts` | Spot FX Rates, Exchange Closing Quotes, Stale Price Fallback |
| **2. Account State** | `data/initialAccounts.ts` | Multi-Account Currency Base, Share Encumbrance (Lock/Lien/Saleable) |
| **3. Trade Booking** | `components/TradeModal.tsx` | Cash Movement, Back-Dated FIFO Lots, Oversell & Settlement Checks |
| **4. Calculation Engine**| `services/financialEngine.ts` | MTM Valuation, Weighted Avg Rate, FX Translation, Beta, Sharpe, Benchmarks |
| **5. Analytics UI** | `components/DashboardView.tsx` | Asset Allocation, Sector Concentration, Risk Score (0-100), Active Alpha |
| **6. Client Statement** | `components/ClientStatementView.tsx`| 14-Column Statement Grid, NAV, Equity, Ledger Balance, Capital Gain Summary |
