import { FXRates, Currency } from '../types';

// Fallback static data if network is offline or CORS blocked
const MOCK_PRICES: Record<string, { price: number; changePct: number; name: string; currency: Currency; beta: number; sector: string }> = {
    AAPL: { price: 228.70, changePct: 1.45, name: 'Apple Inc.', currency: 'USD', beta: 1.20, sector: 'Technology' },
    MSFT: { price: 505.40, changePct: 0.82, name: 'Microsoft Corp.', currency: 'USD', beta: 0.91, sector: 'Technology' },
    NVDA: { price: 181.90, changePct: 3.12, name: 'NVIDIA Corp.', currency: 'USD', beta: 1.65, sector: 'Semiconductors' },
    JPM: { price: 304.10, changePct: -0.45, name: 'JPMorgan Chase & Co.', currency: 'USD', beta: 1.08, sector: 'Financials' },
    NESN: { price: 108.50, changePct: 0.15, name: 'Nestlé SA', currency: 'CHF', beta: 0.43, sector: 'Consumer' },
    SAP: { price: 296.70, changePct: 2.10, name: 'SAP SE', currency: 'EUR', beta: 1.01, sector: 'Technology' },
    TSLA: { price: 242.80, changePct: 4.20, name: 'Tesla Inc.', currency: 'USD', beta: 2.05, sector: 'Automotive' },
    AMZN: { price: 186.50, changePct: 1.10, name: 'Amazon.com Inc.', currency: 'USD', beta: 1.18, sector: 'Consumer Discretionary' },
    GOOGL: { price: 175.30, changePct: 0.75, name: 'Alphabet Inc.', currency: 'USD', beta: 1.05, sector: 'Communication Services' }
};

const DEFAULT_FX: FXRates = {
    USD: 1.0,
    EUR: 1.17,
    GBP: 1.35,
    CHF: 1.27,
    INR: 0.012
};

/**
 * Fetch live FX rates from Frankfurter API (Free, no API key required)
 */
export async function fetchLiveFX(): Promise<{ rates: FXRates; source: 'live' | 'fallback' }> {
    try {
        const res = await fetch('https://api.frankfurter.dev/v2/rates?base=USD&quotes=EUR,GBP,CHF,INR');
        if (!res.ok) throw new Error(`FX HTTP error ${res.status}`);
        const data = await res.json();

        // Frankfurter returns rates relative to base USD: e.g. { quote: "EUR", rate: 0.85 }
        // We normalize to "USD per 1 foreign currency unit" (or direct multipliers):
        const rates: FXRates = { USD: 1.0, EUR: 1.17, GBP: 1.35, CHF: 1.27, INR: 0.012 };

        if (Array.isArray(data)) {
            data.forEach((item: { quote: string; rate: number }) => {
                if (item.quote && item.rate > 0) {
                    // If rate is e.g. EUR 0.92 per USD, USD per EUR = 1 / 0.92 = 1.087
                    rates[item.quote as Currency] = +(1 / item.rate).toFixed(4);
                }
            });
        }

        return { rates, source: 'live' };
    } catch (err) {
        console.warn('Live FX fetch failed, using fallback FX rates:', err);
        return { rates: DEFAULT_FX, source: 'fallback' };
    }
}

/**
 * Fetch live price for a given ticker symbol using free Yahoo Finance CORS-friendly chart API or Finnhub free endpoint
 */
export async function fetchLiveQuote(symbol: string): Promise<{ price: number; changePct: number; source: 'live' | 'fallback' }> {
    const cleanSymbol = symbol.trim().toUpperCase();

    try {
        // Try CORS proxy Yahoo Finance API endpoint
        const url = `https://corsproxy.io/?https://query1.finance.yahoo.com/v8/finance/chart/${cleanSymbol}?interval=1d&range=1d`;
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            const meta = data?.chart?.result?.[0]?.meta;
            if (meta && meta.regularMarketPrice) {
                const price = meta.regularMarketPrice;
                const prevClose = meta.chartPreviousClose || meta.previousClose || price;
                const changePct = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;
                return { price: +price.toFixed(2), changePct: +changePct.toFixed(2), source: 'live' };
            }
        }
    } catch {
        // Ignore and fallback below
    }

    // Fallback to MOCK_PRICES or small random movement simulation
    const mock = MOCK_PRICES[cleanSymbol];
    if (mock) {
        const randomShift = (Math.random() - 0.48) * 0.015;
        const price = +(mock.price * (1 + randomShift)).toFixed(2);
        return { price, changePct: +(mock.changePct + randomShift * 100).toFixed(2), source: 'fallback' };
    }

    // Generic fallback if ticker unknown
    return { price: 150.00, changePct: 0.5, source: 'fallback' };
}

/**
 * Fetch bulk live quotes for an array of holdings
 */
export async function fetchBulkQuotes(symbols: string[]): Promise<Record<string, { price: number; changePct: number; source: 'live' | 'fallback' }>> {
    const results: Record<string, { price: number; changePct: number; source: 'live' | 'fallback' }> = {};

    await Promise.all(
        symbols.map(async (sym) => {
            results[sym] = await fetchLiveQuote(sym);
        })
    );

    return results;
}

/**
 * Search global security ticker database or return info for new trade
 */
export function searchSecurityMaster(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return Object.entries(MOCK_PRICES)
        .filter(([sym, data]) => sym.toLowerCase().includes(q) || data.name.toLowerCase().includes(q))
        .map(([sym, data]) => ({ symbol: sym, ...data }));
}
