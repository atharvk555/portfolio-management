export type Side = 'BUY' | 'SELL';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CHF' | 'INR';

export type AccountType = 'Non Margin Account' | 'Margin Account' | 'Private Wealth';

export interface ClientAccount {
    id: string; // e.g. '9056-01'
    clientCode: string; // e.g. '9056'
    boId: string; // e.g. '1202310005959896'
    clientName: string; // e.g. 'MD. BELAYET HOSSAIN' / 'John Smith'
    accountName: string; // e.g. 'USD Global Growth Portfolio'
    type: AccountType;
    currency: Currency;
    availableBalance: number;
    immatureBalance: number;
    totalDeposit: number;
    totalWithdraw: number;
    realizedGainLastDay: number;
}

export interface Holding {
    id: number | string;
    accountId?: string;
    symbol: string;
    name: string;
    category?: 'A' | 'B' | 'N' | 'Z'; // Category matching broker statement (A=Large Cap, B=Growth, N=New/IPO, Z=Distressed)
    qty: number; // Total Qty
    lockQty?: number; // Locked / encumbered shares
    lienQty?: number; // Pledged / Lien shares
    saleableQty?: number; // Saleable Qty = Total - Lock - Lien
    buyPrice: number; // Avg Rate / Cost Basis
    currentPrice: number; // Market Price
    currency: Currency;
    receiveQty?: number; // Pending purchase receive qty
    deliverQty?: number; // Pending sell deliver qty
    beta: number;
    delta: number;
    sector: string;
    buyDate: string; // ISO date string (YYYY-MM-DD)
    // Derived fields:
    buyValue?: number; // Cost Amount
    currentValue?: number; // Market Value
    pnl?: number; // Unrealized Gain/Loss
    pnlPct?: number; // % Gain/Loss
    holdingDays?: number;
    weight?: number;
}

export interface RealizedTradeLastDay {
    id: number | string;
    accountId: string;
    companyName: string;
    symbol: string;
    saleQty: number;
    saleRate: number;
    commission: number;
    buyRateDetails: string; // e.g. '500(41.21), 75(0.00)'
    gainLoss: number;
}

export interface Trade {
    id: number | string;
    accountId: string;
    date: string; // ISO date YYYY-MM-DD
    symbol: string;
    side: Side;
    qty: number;
    price: number;
    currency: Currency;
    name?: string;
    sector?: string;
    notes?: string;
}

export interface CashBalance {
    currency: Currency;
    balance: number;
    fx: number;
}

export type FXRates = Record<Currency, number>;

export interface RiskMetrics {
    weightedBeta: number;
    weightedDelta: number;
    sharpeRatio: number;
    volatility: number;
    maxDrawdown: number;
    riskScore: number;
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Aggressive';
}

export interface BenchmarkPeriodData {
    portfolio: number;
    nasdaq: number;
    ftse: number;
    sp: number;
    dates: string[];
    portfolioSeries: number[];
    nasdaqSeries: number[];
    spSeries: number[];
    ftseSeries: number[];
}

export type BenchmarkData = Record<'1M' | '3M' | '6M' | '1Y', BenchmarkPeriodData>;
