# Comprehensive Financial & Mathematical Guide to the Portfolio Reporting System

This document provides a detailed breakdown of every financial concept, accounting principle, valuation technique, risk Greek, and mathematical calculation implemented in the **UBS Portfolio Reporting System**.

---

## 1. Mark-to-Market (MTM) Valuation

### Financial Concept
**Mark-to-Market (MTM)** is an accounting standard where asset values are recalculated in real time based on current fair market prices rather than historical acquisition costs. In wealth management, MTM ensures that portfolio valuations accurately reflect what the securities could be liquidated for in the open market today.

### Mathematical Formulas

$$\text{MTM Market Value}_i = \text{Quantity}_i \times \text{Current Live Closing Price}_i$$

$$\text{Total Securities Market Value} = \sum_{i=1}^{N} \text{MTM Market Value}_i$$

* **Example**: If a client holds 180 shares of Apple Inc. (`AAPL`) bought at $178.40 and the live exchange price rises to $228.70:
  $$\text{MTM Market Value} = 180 \times \$228.70 = \$41,166.00$$

---

## 2. Cost Basis Accounting (Weighted Average & FIFO)

### Financial Concept
**Cost Basis** represents the original value of an asset for tax and performance accounting. When investors buy shares of the same stock at different times and prices (tax lots), two primary methods calculate the baseline cost:

1. **Weighted Average Cost Basis**: Aggregates all purchase lots into a single average price per share.
2. **First-In, First-Out (FIFO)**: Assumes that the oldest purchased shares are sold first when executing a `SELL` trade.

### Mathematical Formulas

#### Weighted Average Purchase Price ($\text{Avg. Rate}$)

$$\text{Avg. Rate} = \frac{\sum_{j=1}^{M} (\text{Quantity}_j \times \text{Purchase Price}_j)}{\sum_{j=1}^{M} \text{Quantity}_j}$$

$$\text{Cost Amount (Total Cost Basis)} = \text{Total Quantity} \times \text{Avg. Rate}$$

#### FIFO Realized P&L on Sale of Lot $k$

$$\text{Realized P\&L}_k = \left( \text{Sale Price} - \text{Cost Price}_k \right) \times \text{Lot Quantity}_k - \text{Commission}$$

* **Example**:
  * Lot 1: Bought 100 shares at $150
  * Lot 2: Bought 50 shares at $200
  * **Total Quantity** = 150 shares
  * **Cost Amount** = $(100 \times 150) + (50 \times 200) = \$15,000 + \$10,000 = \$25,000$
  * **Weighted Avg. Rate** = $\frac{\$25,000}{150} = \$166.67\text{ per share}$
  * Selling 120 shares at $220 under **FIFO**:
    * Sells 100 shares from Lot 1 (Cost = $150): $(220 - 150) \times 100 = \$7,000$
    * Sells 20 shares from Lot 2 (Cost = $200): $(220 - 200) \times 20 = \$400$
    * **Total Realized Gain** = $\$7,400 - \text{Commission}$

---

## 3. Profit and Loss (P&L) Analytics

### Financial Concept
P&L is separated into two distinct accounting categories:
* **Unrealized (MTM) P&L**: Paper gains or losses on currently held assets that have not been sold.
* **Realized P&L**: Finalized cash profit or loss locked in when an asset is sold.

### Mathematical Formulas

#### Unrealized MTM Gain / Loss

$$\text{Unrealized P\&L}_i = \text{MTM Market Value}_i - \text{Cost Amount}_i$$

$$\% \text{ Gain / Loss}_i = \left( \frac{\text{Unrealized P\&L}_i}{\text{Cost Amount}_i} \right) \times 100\%$$

#### Total Portfolio Net P&L

$$\text{Net P\&L} = \text{Total Realized P\&L} + \text{Total Unrealized P\&L}$$

* **Example**:
  * Cost Amount = $188,382.40
  * Current MTM Market Value = $277,159.00
  * **Unrealized P&L** = $\$277,159.00 - \$188,382.40 = +\$88,776.60$
  * **% Gain** = $\left( \frac{88,776.60}{188,382.40} \right) \times 100\% = +47.13\%$

---

## 4. Multi-Currency Cash Management & FX Spot Translation

### Financial Concept
Global portfolios hold cash and securities denominated in multiple currencies (`USD`, `EUR`, `GBP`, `CHF`, `INR`). To present a unified statement, all local values must be translated into the chosen **Base Reporting Currency** using live Foreign Exchange (FX) spot rates.

### Mathematical Formulas

#### FX Spot Translation to Base Currency

$$\text{Value}_{\text{Base}} = \text{Value}_{\text{Local}} \times \left( \frac{\text{FX Rate (Local to USD)}}{\text{FX Rate (Base to USD)}} \right)$$

Where FX Rates are defined relative to USD ($1.00$):
* `EUR/USD` = 1.17
* `GBP/USD` = 1.35
* `CHF/USD` = 1.27
* `INR/USD` = 0.012

* **Example**: Translating $\text{EUR } 10,000$ to base currency **USD** (where Base = USD):
  $$\text{Value}_{\text{USD}} = 10,000 \times 1.17 = \$11,700.00$$

#### Dynamic Cash Movement on Trade Execution

$$\text{Cash Balance}_{\text{New}} = \text{Cash Balance}_{\text{Old}} - \left( \text{Side} \times \left( \text{Quantity} \times \text{Price} \right) \right) - \text{Commission}$$

Where $\text{Side} = +1$ for `BUY` (cash outflow) and $-1$ for `SELL` (cash inflow).

---

## 5. Net Asset Value (NAV) & Portfolio Equity

### Financial Concept
**Net Asset Value (NAV)** and **Total Portfolio Equity** summarize the liquidation value of the entire portfolio, combining the mark-to-market value of all open security positions and total cash ledgers.

### Mathematical Formulas

$$\text{Ledger Cash Balance} = \text{Available Cash Balance} + \text{Immature (Pending Settlement) Balance}$$

$$\text{Net Asset Value (NAV)} = \text{Securities Market Value} + \text{Ledger Cash Balance}$$

$$\text{Net Deposit Total} = \text{Total Deposits} - \text{Total Withdrawals}$$

$$\text{Purchasing Power} = \text{Available Cash Balance} + \text{Margin Facility}$$

---

## 6. Portfolio Risk Metrics & Greeks

### Financial Concept
Risk metrics quantify how vulnerable a portfolio is to market fluctuations, benchmark moves, and concentration risks.

### Mathematical Formulas & Explanations

### A. Portfolio Beta ($\beta$)
**Beta** measures systematic risk—how sensitive a security or portfolio is to movements in the overall market (e.g., S&P 500 / NASDAQ 100).

$$\beta_i = \frac{\text{Covariance}(R_i, R_m)}{\text{Variance}(R_m)}$$

$$\text{Weighted Portfolio Beta } (\beta_p) = \sum_{i=1}^{N} \left( w_i \times \beta_i \right)$$

Where position weight $w_i = \frac{\text{MTM Value}_i}{\text{Total Securities Value}}$.

* **Interpretation**:
  * $\beta_p = 1.0$: Portfolio moves in tandem with the market index.
  * $\beta_p = 1.25$: Portfolio is 25% more volatile than the market (aggressive).
  * $\beta_p = 0.45$: Portfolio is defensive (e.g., healthcare or utility stocks).

---

### B. Weighted Delta ($\Delta$)
**Delta** measures directional sensitivity—the change in portfolio value for a $1.00 change in the underlying asset price.

$$\Delta_p = \sum_{i=1}^{N} \left( w_i \times \Delta_i \right)$$

* **Interpretation**: For equity-only portfolios, $\Delta_i \approx 1.0$.

---

### C. Annualized Volatility ($\sigma_{\text{annual}}$)
**Volatility** measures the dispersion of daily returns over time, annualized assuming 252 trading days per year.

$$\sigma_{\text{daily}} = \sqrt{\frac{\sum_{t=1}^{T} (R_t - \bar{R})^2}{T - 1}}$$

$$\sigma_{\text{annual}} = \sigma_{\text{daily}} \times \sqrt{252}$$

---

### D. Sharpe Ratio
The **Sharpe Ratio** measures risk-adjusted excess return per unit of volatility relative to the risk-free rate ($R_f = 4.5\%$).

$$\text{Sharpe Ratio} = \frac{R_p - R_f}{\sigma_p}$$

* **Interpretation**:
  * $< 1.0$: Sub-optimal risk-adjusted return.
  * $1.0 - 2.0$: Strong performance.
  * $> 2.0$: Exceptional risk-adjusted return.

---

### E. Maximum Drawdown (MDD)
**Maximum Drawdown** quantifies the largest peak-to-trough drop in portfolio value before a new peak is achieved.

$$\text{MDD} = \frac{\text{Trough Value} - \text{Peak Value}}{\text{Peak Value}} \times 100\%$$

---

## 7. Benchmark Performance Normalization & Active Alpha

### Financial Concept
To compare portfolio performance fairly against global indices (NASDAQ 100, S&P 500, FTSE 100), all series are **rebased to 100** at the starting date $t_0$.

### Mathematical Formulas

#### Rebased Index Series

$$V_t = 100 \times \left( 1 + \frac{P_t - P_0}{P_0} \right)$$

#### Active Alpha ($\alpha$)

$$\alpha = R_{\text{portfolio}} - R_{\text{benchmark}}$$

* **Example**:
  * Portfolio Return over 3 Months = $+18.4\%$
  * S&P 500 Return over 3 Months = $+12.2\%$
  * **Active Alpha Generated** = $+6.2\text{ percentage points}$

---

## 8. Institutional Broker Statement Field Breakdown (14-Column Grid)

The institutional **Client Wise Portfolio Statement** matching official broker specifications includes the following 14 columns:

| Column Name | Definition & Formula |
| :--- | :--- |
| **Company Name** | Security name and ticker symbol. |
| **Category** | Asset classification: `A` (Large Cap / High Liquidity), `B` (Growth), `N` (New IPO), `Z` (Distressed). |
| **Total Qty.** | Total shares owned across all tax lots. |
| **Lock Qty.** | Shares locked under regulatory lock-in periods or IPO agreements. |
| **Lien Qty.** | Shares pledged as collateral against margin facilities. |
| **Saleable Qty.** | Unencumbered shares available to sell: $\text{Total Qty} - \text{Lock Qty} - \text{Lien Qty}$. |
| **Avg. Rate** | Weighted average purchase cost per share. |
| **Cost Amount** | Total book investment: $\text{Total Qty} \times \text{Avg. Rate}$. |
| **Market Price** | Current live closing exchange quote. |
| **Market Value** | Current liquidation value: $\text{Total Qty} \times \text{Market Price}$. |
| **Receive Qty.** | Pending buy order shares awaiting clearing settlement (T+1 / T+2). |
| **Deliver Qty.** | Pending sell order shares awaiting clearing delivery. |
| **Unrealize Gain/Loss** | Paper profit/loss: $\text{Market Value} - \text{Cost Amount}$. |
| **% Gain / Loss** | Percentage return: $\left(\frac{\text{Unrealize Gain/Loss}}{\text{Cost Amount}}\right) \times 100\%$. |

---

## Summary Matrix of Calculations

| Topic | Primary Formula | Purpose |
| :--- | :--- | :--- |
| **Mark-to-Market** | $\text{Qty} \times \text{Market Price}$ | Real-time fair market valuation. |
| **Cost Basis** | $\frac{\sum (\text{Qty}_i \times \text{Price}_i)}{\sum \text{Qty}_i}$ | Establishes book value baseline. |
| **Unrealized P&L** | $\text{Market Value} - \text{Cost Amount}$ | Paper profit or loss tracking. |
| **Realized P&L** | $(\text{Sale Price} - \text{Buy Price}) \times \text{Qty}_{\text{sold}} - \text{Fee}$ | Closed trade profit/loss accounting. |
| **FX Conversion** | $\text{Amount}_{\text{Local}} \times \frac{\text{FX}_{\text{Local}}}{\text{FX}_{\text{Base}}}$ | Multi-currency normalization. |
| **Net Asset Value** | $\text{Securities Market Value} + \text{Cash Ledger}$ | Total portfolio equity valuation. |
| **Portfolio Beta** | $\sum (w_i \times \beta_i)$ | Systematic market risk exposure. |
| **Sharpe Ratio** | $\frac{R_p - R_f}{\sigma_p}$ | Risk-adjusted return calculation. |
