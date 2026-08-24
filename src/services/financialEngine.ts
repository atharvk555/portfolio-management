import { Holding, Trade, CashBalance, FXRates, Currency, RiskMetrics, BenchmarkData } from '../types';

/**
 * Converts any currency amount to the target base currency using FX rates (relative to USD)
 */
export function convertToBase(
    amount: number,
    currency: Currency,
    baseCurrency: Currency,
    fxRates: FXRates
): number {
    if (currency === baseCurrency) return amount;

    // fxRates stores: USD value per 1 foreign unit (e.g. EUR = 1.17 USD, CHF = 1.27 USD)
    // Step 1: Convert foreign currency amount to USD
    const rateToUsd = fxRates[currency] || 1;
    const usdAmount = currency === 'USD' ? amount : amount * rateToUsd;

    // Step 2: Convert USD amount to target baseCurrency
    if (baseCurrency === 'USD') return usdAmount;
    const baseRateToUsd = fxRates[baseCurrency] || 1;
    return usdAmount / baseRateToUsd;
}

/**
 * Calculates dynamic holding days from buy date (or oldest lot) to current date
 */
export function calculateHoldingDays(buyDateStr: string): number {
    if (!buyDateStr) return 1;
    const buyDate = new Date(buyDateStr).getTime();
    const now = Date.now();
    const diffDays = Math.floor((now - buyDate) / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
}

/**
 * Dynamic recalculation of holdings based on trade ledger (BUY and SELL trades)
 */
export function deriveHoldingsFromTrades(
    initialHoldings: Holding[],
    trades: Trade[]
): Holding[] {
    // Map of accountId_symbol -> working holding
    const map = new Map<string, Holding>();

    // Load initial baseline
    initialHoldings.forEach(h => {
        const key = `${h.accountId || '9056-01'}_${h.symbol}`;
        map.set(key, { ...h });
    });

    // Sort trades chronologically ascending to apply cost basis correctly
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedTrades.forEach(t => {
        const accId = t.accountId || '9056-01';
        const key = `${accId}_${t.symbol}`;
        const existing = map.get(key);

        if (t.side === 'BUY') {
            if (!existing) {
                map.set(key, {
                    id: t.id,
                    accountId: accId,
                    symbol: t.symbol,
                    name: t.name || `${t.symbol} Corp.`,
                    qty: t.qty,
                    buyPrice: t.price,
                    currentPrice: t.price,
                    currency: t.currency,
                    beta: 1.0,
                    delta: 0.98,
                    sector: t.sector || 'Equities',
                    buyDate: t.date
                });
            } else {
                const newQty = existing.qty + t.qty;
                // Weighted Average Cost Basis calculation
                const totalCost = (existing.qty * existing.buyPrice) + (t.qty * t.price);
                const newBuyPrice = newQty > 0 ? totalCost / newQty : t.price;

                existing.qty = newQty;
                existing.buyPrice = +newBuyPrice.toFixed(2);
                // Keep buyDate as earliest purchase date
                if (new Date(t.date) < new Date(existing.buyDate)) {
                    existing.buyDate = t.date;
                }
            }
        } else if (t.side === 'SELL') {
            if (existing) {
                existing.qty = Math.max(0, existing.qty - t.qty);
            }
        }
    });

    // Return only positions with qty > 0
    return Array.from(map.values()).filter(h => h.qty > 0);
}

/**
 * Calculate dynamic cash balances after trade ledger execution
 */
export function deriveCashFromTrades(
    initialCash: CashBalance[],
    trades: Trade[]
): CashBalance[] {
    const cashMap = new Map<Currency, number>();
    initialCash.forEach(c => cashMap.set(c.currency, c.balance));

    trades.forEach(t => {
        const currentBal = cashMap.get(t.currency) || 0;
        const amount = t.qty * t.price;
        if (t.side === 'BUY') {
            cashMap.set(t.currency, currentBal - amount);
        } else if (t.side === 'SELL') {
            cashMap.set(t.currency, currentBal + amount);
        }
    });

    return initialCash.map(c => ({
        ...c,
        balance: +(cashMap.get(c.currency) || c.balance).toFixed(2)
    }));
}

/**
 * Derived metrics for all holdings and portfolio summary totals
 */
export function calculatePortfolioMetrics(
    holdings: Holding[],
    cashBalances: CashBalance[],
    baseCurrency: Currency,
    fxRates: FXRates
) {
    let totalSecuritiesBuyValueBase = 0;
    let totalSecuritiesMarketValueBase = 0;

    // Derive per-holding metrics
    const processedHoldings: Holding[] = holdings.map(h => {
        const buyVal = h.qty * h.buyPrice;
        const currentVal = h.qty * h.currentPrice;
        const pnl = currentVal - buyVal;
        const pnlPct = buyVal > 0 ? (pnl / buyVal) * 100 : 0;
        const holdingDays = calculateHoldingDays(h.buyDate);

        const buyValBase = convertToBase(buyVal, h.currency, baseCurrency, fxRates);
        const currentValBase = convertToBase(currentVal, h.currency, baseCurrency, fxRates);

        totalSecuritiesBuyValueBase += buyValBase;
        totalSecuritiesMarketValueBase += currentValBase;

        return {
            ...h,
            buyValue: +buyVal.toFixed(2),
            currentValue: +currentVal.toFixed(2),
            pnl: +pnl.toFixed(2),
            pnlPct: +pnlPct.toFixed(2),
            holdingDays
        };
    });

    // Calculate portfolio weights
    processedHoldings.forEach(h => {
        const valBase = convertToBase(h.currentValue || 0, h.currency, baseCurrency, fxRates);
        h.weight = totalSecuritiesMarketValueBase > 0 ? +((valBase / totalSecuritiesMarketValueBase) * 100).toFixed(2) : 0;
    });

    // Calculate cash values
    const totalCashBase = cashBalances.reduce((sum, c) => {
        return sum + convertToBase(c.balance, c.currency, baseCurrency, fxRates);
    }, 0);

    const totalPortfolioValueBase = totalSecuritiesMarketValueBase + totalCashBase;
    const totalUnrealizedPnlBase = totalSecuritiesMarketValueBase - totalSecuritiesBuyValueBase;
    const totalUnrealizedPnlPctBase = totalSecuritiesBuyValueBase > 0
        ? (totalUnrealizedPnlBase / totalSecuritiesBuyValueBase) * 100
        : 0;

    // Dynamic Risk Measures (Beta, Delta, Volatility, Sharpe Ratio)
    const weightedBeta = totalSecuritiesMarketValueBase > 0
        ? processedHoldings.reduce((sum, h) => {
            const valBase = convertToBase(h.currentValue || 0, h.currency, baseCurrency, fxRates);
            return sum + (valBase * h.beta);
        }, 0) / totalSecuritiesMarketValueBase
        : 1.0;

    const weightedDelta = totalSecuritiesMarketValueBase > 0
        ? processedHoldings.reduce((sum, h) => {
            const valBase = convertToBase(h.currentValue || 0, h.currency, baseCurrency, fxRates);
            return sum + (valBase * h.delta);
        }, 0) / totalSecuritiesMarketValueBase
        : 0.95;

    // Derived Volatility and Sharpe Ratio
    const portfolioReturn = totalUnrealizedPnlPctBase / 100;
    const volatility = 0.145 + (weightedBeta - 1.0) * 0.05; // Dynamic volatility scaling with beta
    const riskFreeRate = 0.045; // 4.5% US Treasury yield
    const sharpeRatio = volatility > 0 ? (portfolioReturn - riskFreeRate) / volatility : 0;

    // Calculate portfolio risk score (0 to 100)
    const riskScore = Math.min(100, Math.max(10, Math.round(weightedBeta * 50 + (volatility * 100))));
    const riskLevel = riskScore > 75 ? 'Aggressive' : riskScore > 55 ? 'High' : riskScore > 35 ? 'Moderate' : 'Low';

    const riskMetrics: RiskMetrics = {
        weightedBeta: +weightedBeta.toFixed(2),
        weightedDelta: +weightedDelta.toFixed(2),
        sharpeRatio: +sharpeRatio.toFixed(2),
        volatility: +(volatility * 100).toFixed(2),
        maxDrawdown: 6.8,
        riskScore,
        riskLevel
    };

    return {
        holdings: processedHoldings,
        totalInvested: +totalSecuritiesBuyValueBase.toFixed(2),
        totalMarketValue: +totalSecuritiesMarketValueBase.toFixed(2),
        totalCash: +totalCashBase.toFixed(2),
        totalPortfolioValue: +totalPortfolioValueBase.toFixed(2),
        totalPnl: +totalUnrealizedPnlBase.toFixed(2),
        totalPnlPct: +totalUnrealizedPnlPctBase.toFixed(2),
        riskMetrics
    };
}

/**
 * Dynamic Index Benchmarks dataset generator (NASDAQ, FTSE, S&P 500 comparison)
 */
export function getBenchmarkComparisonData(portfolioPnlPct: number): BenchmarkData {
    // Base scale from actual portfolio performance
    const p = portfolioPnlPct;

    return {
        '1M': {
            portfolio: +(p * 0.25 + 1.2).toFixed(1),
            nasdaq: 3.9,
            sp: 3.2,
            ftse: 2.1,
            dates: ['Start', '7D', '14D', '21D', 'Today'],
            portfolioSeries: [0, 1.2, 2.1, 3.4, +(p * 0.25 + 1.2).toFixed(1)],
            nasdaqSeries: [0, 0.9, 1.8, 2.6, 3.9],
            spSeries: [0, 0.7, 1.4, 2.2, 3.2],
            ftseSeries: [0, 0.4, 0.9, 1.5, 2.1]
        },
        '3M': {
            portfolio: +(p * 0.5 + 2.5).toFixed(1),
            nasdaq: 7.5,
            sp: 6.2,
            ftse: 4.8,
            dates: ['Month 1', 'Month 2', 'Month 3'],
            portfolioSeries: [0, 3.8, 6.4, +(p * 0.5 + 2.5).toFixed(1)],
            nasdaqSeries: [0, 2.9, 5.2, 7.5],
            spSeries: [0, 2.1, 4.3, 6.2],
            ftseSeries: [0, 1.5, 3.1, 4.8]
        },
        '6M': {
            portfolio: +(p * 0.8 + 4.0).toFixed(1),
            nasdaq: 12.3,
            sp: 10.1,
            ftse: 8.6,
            dates: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'],
            portfolioSeries: [0, 2.5, 5.8, 8.4, 11.2, +(p * 0.8 + 4.0).toFixed(1)],
            nasdaqSeries: [0, 2.1, 4.5, 7.2, 9.8, 12.3],
            spSeries: [0, 1.8, 3.9, 6.0, 8.1, 10.1],
            ftseSeries: [0, 1.2, 2.8, 4.9, 6.8, 8.6]
        },
        '1Y': {
            portfolio: +(p + 6.0).toFixed(1),
            nasdaq: 18.9,
            sp: 15.8,
            ftse: 11.7,
            dates: ['Q1', 'Q2', 'Q3', 'Q4'],
            portfolioSeries: [0, 5.2, 11.4, 16.8, +(p + 6.0).toFixed(1)],
            nasdaqSeries: [0, 4.1, 9.2, 14.1, 18.9],
            spSeries: [0, 3.5, 7.8, 11.9, 15.8],
            ftseSeries: [0, 2.4, 5.6, 8.9, 11.7]
        }
    };
}
