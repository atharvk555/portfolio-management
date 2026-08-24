# Institutional Portfolio Management & Financial Analytics System
## Comprehensive Presentation Walkthrough & Evaluation Guide

---

## 📋 1. Executive Summary & System Overview

The **UBS Portfolio Reporting & Risk Analytics System** is an institutional-grade wealth management platform designed to provide multi-currency client account oversight, real-time Mark-to-Market (MTM) valuations, dynamic trade ledger processing, portfolio risk analytics (Greeks), and official exchange-compliant **Client Portfolio Statements** (matching DSE/CSE & UBS Wealth Management specifications).

### Core System Capabilities
* **Multi-Currency Architecture**: Supports sub-accounts with native currencies (`USD`, `EUR`, `GBP`, `CHF`, `INR`) and consolidates reporting in any chosen base currency via live spot FX rates.
* **Real-Time Mark-to-Market (MTM)**: Re-values security positions continuously based on live exchange quotes from market feeds.
* **Dynamic Trade Ledger & FIFO Engine**: Reconstructs open tax lots, updates weighted average cost bases, tracks cash flows on buy/sell trades, and calculates realized and unrealized gains.
* **Portfolio Risk Analytics**: Computes systematic risk measures including Weighted Beta ($\beta_p$), Directional Delta ($\Delta_p$), Sharpe Ratio, Annualized Volatility, and Maximum Drawdown.
* **Institutional Client Broker Statement**: Generates a 14-column holdings grid detailing share encumbrance (`Lock`, `Lien`, `Saleable`), settlement balances (`Receive`, `Deliver`), Net Asset Value (NAV), Equity, and Capital Gains.

---

## 🏗️ 2. System Architecture & Reactive Data Flow

The platform is structured into a 5-layer reactive architecture:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. External Market & FX Data Layer (services/marketData.ts)                  │
│    • Live Frankfurter API (ECB FX Spot Rates) & Yahoo Finance Stock Quotes   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Multi-Account Base Ledger & Trades Store (data/initialAccounts.ts & App.tsx)│
│    • 5 Client Sub-Accounts (USD, EUR, GBP, CHF, INR) & Persisted Trade Ledger │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. Central Financial Calculation Engine (services/financialEngine.ts)        │
│    • FIFO Rebuilder • MTM Valuer • FX Spot Translator • Risk Engine • Benchmarks│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. Presentation & Analytics Views (components/*.tsx)                       │
│    • Portfolio Overview • MTM Holdings • Cash Matrix • Risk Analytics • Benchmarks│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. Institutional Client Statement Generator (ClientStatementView.tsx)        │
│    • 14-Column Grid • NAV & Equity • Capital Gains • Transaction Day Details │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Layer Execution Breakdown
1. **Data Ingestion Layer**: Queries the European Central Bank (Frankfurter API) for spot exchange rates and Yahoo Finance feeds for closing stock quotes. Includes stale-price handling.
2. **Ledger & Account Layer**: Stores baseline sub-account ledgers and maintains local trade execution history in `localStorage`.
3. **Financial Engine Layer**: Executes core business logic—rebuilding position quantities, re-calculating cash balances, translating currencies, and processing risk metrics whenever trades, prices, or rates change.
4. **Presentation Layer**: Renders specialized dashboards for portfolio holdings, cash matrices, benchmark comparisons, and risk metrics.
5. **Statement Generator Layer**: Synthesizes open holdings, cash ledgers, encumbrance metrics, and transaction logs into an institutional print-ready broker statement.

---

## 💡 3. Financial Domain Concepts & Mathematical Formulations

### A. Mark-to-Market (MTM) Valuation Accounting
* **Concept**: Assets are re-valued in real time based on fair market values rather than historical acquisition costs.
* **Formulas**:
  $$\text{MTM Market Value}_i = \text{Quantity}_i \times \text{Current Live Closing Price}_i$$
  $$\text{Total Securities Market Value} = \sum_{i=1}^{N} \text{MTM Market Value}_i$$

### B. Cost Basis Accounting (Weighted Average & FIFO)
* **Concept**: Calculates acquisition costs across multiple trade lots.
* **Formulas**:
  $$\text{Weighted Avg. Rate} = \frac{\sum_{j=1}^{M} (\text{Quantity}_j \times \text{Purchase Price}_j)}{\sum_{j=1}^{M} \text{Quantity}_j}$$
  $$\text{Cost Amount (Total Cost Basis)} = \text{Total Quantity} \times \text{Weighted Avg. Rate}$$
  $$\text{Realized P\&L (FIFO)} = \left( \text{Sale Price} - \text{Cost Price}_k \right) \times \text{Lot Quantity}_k - \text{Commission}$$

### C. Multi-Currency Cash Ledgers & Spot FX Translation
* **Concept**: Translates multi-currency balances into a chosen reporting currency.
* **Formulas**:
  $$\text{Value}_{\text{Base}} = \text{Value}_{\text{Local}} \times \left( \frac{\text{FX Rate (Local to USD)}}{\text{FX Rate (Base to USD)}} \right)$$
  $$\text{Cash Balance}_{\text{New}} = \text{Cash Balance}_{\text{Old}} - \left( \text{Side} \times (\text{Quantity} \times \text{Price}) \right)$$
  * Where $\text{Side} = +1$ for `BUY` (cash outflow) and $-1$ for `SELL` (cash inflow).

### D. Portfolio Risk Analytics & Greeks
1. **Weighted Portfolio Beta ($\beta_p$)**:
   $$\beta_p = \sum_{i=1}^{N} \left( w_i \times \beta_i \right) \quad \text{where } w_i = \frac{\text{MTM Market Value}_i}{\text{Total Securities Value}}$$
2. **Sharpe Ratio**:
   $$\text{Sharpe Ratio} = \frac{R_p - R_f}{\sigma_p}$$
   * Excess return over US Treasury risk-free rate ($R_f = 4.5\%$) per unit of volatility.
3. **Annualized Volatility ($\sigma_{\text{annual}}$)**:
   $$\sigma_{\text{annual}} = \sigma_{\text{daily}} \times \sqrt{252}$$

### E. Benchmark Normalization & Active Alpha ($\alpha$)
* **Rebased Series**: Re-bases index quotes to 100 at starting date $T_0$.
* **Active Alpha ($\alpha$)**:
  $$\alpha = R_{\text{portfolio}} - R_{\text{benchmark}}$$

---

## 📊 4. Comprehensive Client Sheet Terms: Derivation & Financial Inference Dictionary

This section breaks down **every term** on the official **Client Wise Portfolio Statement**, detailing its definition, mathematical derivation, and what wealth managers and auditors infer from it.

---

### Part A: Client Header & Account Metadata

#### 1. Client Code
* **Definition**: Unique master identifier assigned to the client profile (e.g., `9056`).
* **Derivation**: Assigned upon client onboarding; links all sub-accounts under one primary entity.
* **Financial Inference**: Identifies the primary legal owner and master relationship for consolidated risk exposure.

#### 2. BO ID (Beneficiary Owner ID)
* **Definition**: 16-digit central depository account number (e.g., `1202310005959896`).
* **Derivation**: Issued by the Central Depository (CDBL / DTCC).
* **Financial Inference**: Proves legal custody of electronic securities registered directly under the client's name.

#### 3. Account Name & Currency
* **Definition**: Sub-account title and native base currency (e.g., `USD Global Growth Portfolio`, `EUR European Tech`).
* **Derivation**: Selected during sub-account setup.
* **Financial Inference**: Indicates the investment strategy mandate and primary foreign exchange risk exposure.

#### 4. Type (Account Classification)
* **Definition**: Operational account model: `Non Margin Account`, `Margin Account`, or `Private Wealth`.
* **Derivation**: Set in client agreements based on credit checks and risk appetite.
* **Financial Inference**: Determines whether leverage/borrowing is permitted and defines liquidation risk profiles.

---

### Part B: 14-Column Securities Holdings Grid

#### 5. Company Name & Symbol
* **Definition**: Full corporate title and ticker (e.g., `Apple Inc. (AAPL)`).
* **Derivation**: Security master lookup table.
* **Financial Inference**: Identifies the underlying asset and corporate issuer risk.

#### 6. Category
* **Definition**: Asset credit/market cap rating tag:
  * `A`: Blue Chip / Large Cap / High Liquidity.
  * `B`: Growth / Mid Cap.
  * `N`: Newly Listed / IPO.
  * `Z`: Distressed / Non-dividend / High Risk.
* **Derivation**: Exchange regulatory listing classification.
* **Financial Inference**: Guides margin eligibility. Category `A` securities enjoy maximum collateral leverage, whereas Category `Z` securities require 100% margin hair-cuts.

#### 7. Total Qty.
* **Definition**: Aggregate share quantity held in the BO account across all tax lots.
* **Derivation**:
  $$\text{Total Qty} = \text{Initial Quantity} + \sum \text{BUY Qty} - \sum \text{SELL Qty}$$
* **Financial Inference**: Represents total volume ownership in the enterprise.

#### 8. Lock Qty. (Locked Shares)
* **Definition**: Shares subject to mandatory lock-in restrictions (IPO sponsor lock-ins or regulatory holds).
* **Derivation**: Input from depository transfer logs.
* **Financial Inference**: Non-liquid holding segment. Cannot be sold to meet immediate margin calls or liquidity demands.

#### 9. Lien Qty. (Pledged Shares)
* **Definition**: Shares encumbered as collateral pledged against margin loans or credit lines.
* **Derivation**: Tracked via broker credit agreement records.
* **Financial Inference**: Pledged asset base. The broker retains liquidation rights over these shares if credit limits are breached.

#### 10. Saleable Qty.
* **Definition**: Unencumbered share volume available for immediate market execution.
* **Derivation**:
  $$\text{Saleable Qty} = \text{Total Qty} - \text{Lock Qty} - \text{Lien Qty}$$
* **Financial Inference**: True order capacity. Prevents short-selling and illegal execution of locked or pledged assets.

#### 11. Avg. Rate (Weighted Average Purchase Price)
* **Definition**: Average historical cost per share.
* **Derivation**:
  $$\text{Avg. Rate} = \frac{\sum (\text{Lot Qty}_i \times \text{Lot Purchase Price}_i)}{\sum \text{Lot Qty}_i}$$
* **Financial Inference**: Baseline break-even price. Selling above Avg. Rate yields capital profit; selling below yields capital loss.

#### 12. Cost Amount (Total Cost Basis)
* **Definition**: Total book capital invested in the security.
* **Derivation**:
  $$\text{Cost Amount} = \text{Total Qty} \times \text{Avg. Rate}$$
* **Financial Inference**: Total cumulative capital committed to this position.

#### 13. Market Price
* **Definition**: Current live closing quote from exchange feeds.
* **Derivation**: Fetched real-time via market API.
* **Financial Inference**: Current market clearing valuation standard.

#### 14. Market Value (MTM Market Value)
* **Definition**: Total current fair liquidation value of the position.
* **Derivation**:
  $$\text{Market Value} = \text{Total Qty} \times \text{Market Price}$$
* **Financial Inference**: Current cash value if the entire position were liquidated at current market quotes.

#### 15. Receive Qty.
* **Definition**: Purchased shares pending clearing house delivery (T+1 / T+2 settlement).
* **Derivation**: Sum of un-settled `BUY` trades.
* **Financial Inference**: Asset pipeline. Indicates incoming asset inflows awaiting depository credit.

#### 16. Deliver Qty.
* **Definition**: Sold shares pending clearing house debit.
* **Derivation**: Sum of un-settled `SELL` trades.
* **Financial Inference**: Asset outflow pipeline awaiting final exchange delivery.

#### 17. Unrealize Gain/Loss
* **Definition**: Paper profit or loss on current holdings.
* **Derivation**:
  $$\text{Unrealize Gain/Loss} = \text{Market Value} - \text{Cost Amount}$$
* **Financial Inference**: Un-crystallized profit. Indicates position performance without triggering tax events.

#### 18. % Gain / Loss
* **Definition**: Percentage return on invested capital.
* **Derivation**:
  $$\% \text{ Gain / Loss} = \left( \frac{\text{Unrealize Gain/Loss}}{\text{Cost Amount}} \right) \times 100\%$$
* **Financial Inference**: Normalized return efficiency independent of position size.

---

### Part C: Account Status & Cash Ledgers (Bottom Left Section)

#### 19. Available Balance
* **Definition**: Liquid, unencumbered cash balance ready for immediate trading or withdrawal.
* **Derivation**:
  $$\text{Available Bal}_{\text{New}} = \text{Available Bal}_{\text{Old}} - \sum \text{BUY Trade Values} + \sum \text{SELL Trade Values}$$
* **Financial Inference**: Immediate purchasing power without relying on margin facilities.

#### 20. Immature Balance
* **Definition**: Pending cash funds from recent sales awaiting clearing settlement (T+1/T+2).
* **Derivation**: Sum of sale considerations for unsettled trades.
* **Financial Inference**: Temporary restricted cash. Cannot be withdrawn until clearing settlement completes.

#### 21. Ledger Balance
* **Definition**: Total gross cash equity owned by the account.
* **Derivation**:
  $$\text{Ledger Balance} = \text{Available Balance} + \text{Immature Balance}$$
* **Financial Inference**: True cash accounting balance combining settled and pending funds.

#### 22. Total Deposit & Total Withdraw
* **Definition**: Cumulative cash injections and cash withdrawals since account inception.
* **Derivation**: Sum of bank deposit and withdrawal ledger entries.
* **Financial Inference**: Tracks net external capital additions and capital redemptions.

#### 23. Current Deposit Total (Net Deposit)
* **Definition**: Net cumulative capital injected by the client.
* **Derivation**:
  $$\text{Net Deposit} = \text{Total Deposit} - \text{Total Withdraw}$$
* **Financial Inference**: Cumulative net principal invested by the client. Used as the denominator for total inception return.

---

### Part D: Valuation & Portfolio Metrics (Bottom Right Section)

#### 24. Market Value of Securities
* **Definition**: Aggregate MTM fair market value of all open security positions.
* **Derivation**:
  $$\text{Market Value of Securities} = \sum \text{Market Value}_i$$
* **Financial Inference**: Total asset weight allocated to equities and market-exposed instruments.

#### 25. Net Asset Value (NAV) & Equity
* **Definition**: Total net liquidation equity of the client portfolio.
* **Derivation**:
  $$\text{NAV} = \text{Market Value of Securities} + \text{Ledger Balance}$$
* **Financial Inference**: Total net worth of the portfolio. If all securities were liquidated and all cash collected, this is the total cash balance returned to the client.

#### 26. Purchase Power
* **Definition**: Maximum buying capacity available for placing new orders.
* **Derivation**:
  $$\text{Purchase Power} = \text{Available Balance} + \text{Approved Margin Facility}$$
* **Financial Inference**: Trade execution ceiling. Prevents order rejection due to insufficient funds.

---

### Part E: Capital Gains Summary

#### 27. Realized Gain/Loss
* **Definition**: Closed profit or loss locked in from sold security lots.
* **Derivation**: Sum of FIFO profit/loss on all closed sell transactions.
* **Financial Inference**: Crystallized income subject to capital gains tax.

#### 28. Unrealized Capital Gain/Loss
* **Definition**: Total paper profit or loss across all currently open holdings.
* **Derivation**: Sum of all holding `Unrealize Gain/Loss` values.
* **Financial Inference**: MTM paper performance standard.

#### 29. Net Gain/Loss
* **Definition**: Total cumulative portfolio performance since inception.
* **Derivation**:
  $$\text{Net Gain/Loss} = \text{Realized Gain/Loss} + \text{Unrealized Capital Gain/Loss}$$
* **Financial Inference**: Comprehensive profitability score combining locked gains and paper gains.

#### 30. Gain/Loss From Last Day
* **Definition**: Net realized profit generated specifically on the previous transaction day.
* **Derivation**: Sum of realized gain entries filtered for the previous transaction date.
* **Financial Inference**: Daily trading desk performance snapshot.

---

### Part F: Details Gain/Loss from Last Transaction Day Table

#### 31. Sale Qty, Sale Rate & Commission
* **Definition**: Quantity sold, execution price per share, and brokerage fee charged.
* **Derivation**: Recorded directly from trade execution slips.
* **Financial Inference**: Net consideration proceeds: $\text{Gross Proceeds} = (\text{Sale Qty} \times \text{Sale Rate}) - \text{Commission}$.

#### 32. Details Buy Rate
* **Definition**: Tax lot cost basis breakdown used for FIFO matching (e.g., `500(41.21), 75(0.00)`).
* **Derivation**: Reconstructed by matching sold shares against chronological purchase lots.
* **Financial Inference**: Provides audit trail proof for tax authorities showing exact cost basis matching per lot.

---

## 🎯 5. Evaluator Q&A Cheat Sheet (Key Presentation Questions)

| Evaluator Question | Recommended Institutional Answer |
| :--- | :--- |
| **"How does entering a trade affect the cash and client statement?"** | *"Trade execution triggers a synchronous update through the financial engine. A `BUY` trade reduces available cash in the account's native currency, adjusts weighted average cost basis, recalculates MTM market value, updates NAV, and updates the 14-column client statement holdings grid."* |
| **"How do you handle foreign currency holdings?"** | *"All local currency assets (`EUR`, `GBP`, `CHF`, `INR`) are dynamically translated into the reporting currency (`USD`) via spot FX exchange rates fetched from the European Central Bank API."* |
| **"What is the difference between Ledger Balance and Available Balance?"** | *"Available Balance is liquid unencumbered cash ready for trading. Ledger Balance includes Immature Balance (cash locked in pending T+1/T+2 clearing settlement)."* |
| **"Why distinguish Realized vs. Unrealized P&L?"** | *"Unrealized P&L represents paper MTM fluctuations on open positions. Realized P&L represents locked-in taxable cash gains/losses finalized upon position closure."* |
| **"How are share encumbrances handled?"** | *"Share quantities are broken into `Lock Qty` (IPO restrictions) and `Lien Qty` (margin loan collateral). The system calculates `Saleable Qty = Total - Lock - Lien` to prevent illegal selling of pledged or restricted shares."* |
