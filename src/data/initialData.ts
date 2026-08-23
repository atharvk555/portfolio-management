import { Holding, Trade, CashBalance } from '../types';

export const INITIAL_HOLDINGS: Holding[] = [
    { id: 1, symbol: "AAPL", name: "Apple Inc.", qty: 180, buyPrice: 178.40, currentPrice: 228.70, currency: "USD", beta: 1.20, delta: 0.99, sector: "Technology", buyDate: "2025-10-18" },
    { id: 2, symbol: "MSFT", name: "Microsoft Corp.", qty: 95, buyPrice: 366.20, currentPrice: 505.40, currency: "USD", beta: 0.91, delta: 0.98, sector: "Technology", buyDate: "2025-11-03" },
    { id: 3, symbol: "NVDA", name: "NVIDIA Corp.", qty: 120, buyPrice: 112.60, currentPrice: 181.90, currency: "USD", beta: 1.65, delta: 0.97, sector: "Semiconductors", buyDate: "2026-01-11" },
    { id: 4, symbol: "JPM", name: "JPMorgan Chase & Co.", qty: 80, buyPrice: 214.80, currentPrice: 304.10, currency: "USD", beta: 1.08, delta: 1.00, sector: "Financials", buyDate: "2025-09-22" },
    { id: 5, symbol: "NESN", name: "Nestlé SA", qty: 140, buyPrice: 91.30, currentPrice: 108.50, currency: "CHF", beta: 0.43, delta: 0.82, sector: "Consumer", buyDate: "2025-12-08" },
    { id: 6, symbol: "SAP", name: "SAP SE", qty: 70, buyPrice: 176.20, currentPrice: 296.70, currency: "EUR", beta: 1.01, delta: 0.93, sector: "Technology", buyDate: "2025-08-14" }
];

export const INITIAL_TRADES: Trade[] = [
    { id: 101, date: "2026-08-17", symbol: "AAPL", side: "BUY", qty: 20, price: 225.10, currency: "USD", name: "Apple Inc.", sector: "Technology" },
    { id: 102, date: "2026-08-12", symbol: "NVDA", side: "BUY", qty: 15, price: 174.80, currency: "USD", name: "NVIDIA Corp.", sector: "Semiconductors" },
    { id: 103, date: "2026-07-28", symbol: "JPM", side: "SELL", qty: 10, price: 292.40, currency: "USD", name: "JPMorgan Chase & Co.", sector: "Financials" },
    { id: 104, date: "2026-07-16", symbol: "SAP", side: "BUY", qty: 12, price: 281.20, currency: "EUR", name: "SAP SE", sector: "Technology" }
];

export const INITIAL_CASH: CashBalance[] = [
    { currency: "USD", balance: 48250, fx: 1.0 },
    { currency: "EUR", balance: 12400, fx: 1.17 },
    { currency: "GBP", balance: 6900, fx: 1.35 },
    { currency: "CHF", balance: 8200, fx: 1.27 },
    { currency: "INR", balance: 250000, fx: 0.012 }
];
