import { ClientAccount, Holding, Trade, RealizedTradeLastDay } from '../types';

export const INITIAL_ACCOUNTS: ClientAccount[] = [
    {
        id: '9056-01',
        clientCode: '9056',
        boId: '1202310005959896',
        clientName: 'MD. BELAYET HOSSAIN',
        accountName: 'USD Global Growth Portfolio',
        type: 'Non Margin Account',
        currency: 'USD',
        availableBalance: 48250.00,
        immatureBalance: 0.00,
        totalDeposit: 250000.00,
        totalWithdraw: 50000.00,
        realizedGainLastDay: 15529.22
    },
    {
        id: '9056-02',
        clientCode: '9056',
        boId: '1202310005959897',
        clientName: 'MD. BELAYET HOSSAIN',
        accountName: 'EUR European Tech & Opportunities',
        type: 'Margin Account',
        currency: 'EUR',
        availableBalance: 12400.00,
        immatureBalance: 1500.00,
        totalDeposit: 180000.00,
        totalWithdraw: 20000.00,
        realizedGainLastDay: 4210.50
    },
    {
        id: '9056-03',
        clientCode: '9056',
        boId: '1202310005959898',
        clientName: 'MD. BELAYET HOSSAIN',
        accountName: 'GBP UK & Commonwealth Income',
        type: 'Non Margin Account',
        currency: 'GBP',
        availableBalance: 6900.00,
        immatureBalance: 0.00,
        totalDeposit: 95000.00,
        totalWithdraw: 15000.00,
        realizedGainLastDay: 1840.00
    },
    {
        id: '9056-04',
        clientCode: '9056',
        boId: '1202310005959899',
        clientName: 'MD. BELAYET HOSSAIN',
        accountName: 'CHF Swiss Private Wealth',
        type: 'Private Wealth',
        currency: 'CHF',
        availableBalance: 8200.00,
        immatureBalance: 0.00,
        totalDeposit: 120000.00,
        totalWithdraw: 10000.00,
        realizedGainLastDay: 3100.15
    },
    {
        id: '9056-05',
        clientCode: '9056',
        boId: '1202310005959900',
        clientName: 'MD. BELAYET HOSSAIN',
        accountName: 'INR India Emerging Equities',
        type: 'Non Margin Account',
        currency: 'INR',
        availableBalance: 250000.00,
        immatureBalance: 0.00,
        totalDeposit: 1500000.00,
        totalWithdraw: 250000.00,
        realizedGainLastDay: 45200.00
    }
];

export const ACCOUNT_HOLDINGS: Record<string, Holding[]> = {
    '9056-01': [
        { id: 1, accountId: '9056-01', symbol: 'AAPL', name: 'Apple Inc.', category: 'A', qty: 180, lockQty: 0, lienQty: 0, saleableQty: 180, buyPrice: 178.40, currentPrice: 228.70, currency: 'USD', receiveQty: 180, deliverQty: 0, beta: 1.20, delta: 0.99, sector: 'Technology', buyDate: '2025-10-18' },
        { id: 2, accountId: '9056-01', symbol: 'MSFT', name: 'Microsoft Corp.', category: 'A', qty: 95, lockQty: 0, lienQty: 0, saleableQty: 95, buyPrice: 366.20, currentPrice: 505.40, currency: 'USD', receiveQty: 95, deliverQty: 0, beta: 0.91, delta: 0.98, sector: 'Technology', buyDate: '2025-11-03' },
        { id: 3, accountId: '9056-01', symbol: 'NVDA', name: 'NVIDIA Corp.', category: 'A', qty: 120, lockQty: 0, lienQty: 0, saleableQty: 120, buyPrice: 112.60, currentPrice: 181.90, currency: 'USD', receiveQty: 120, deliverQty: 0, beta: 1.65, delta: 0.97, sector: 'Semiconductors', buyDate: '2026-01-11' },
        { id: 4, accountId: '9056-01', symbol: 'JPM', name: 'JPMorgan Chase & Co.', category: 'B', qty: 80, lockQty: 0, lienQty: 0, saleableQty: 80, buyPrice: 214.80, currentPrice: 304.10, currency: 'USD', receiveQty: 80, deliverQty: 0, beta: 1.08, delta: 1.00, sector: 'Financials', buyDate: '2025-09-22' },
        { id: 5, accountId: '9056-01', symbol: 'AMZN', name: 'Amazon.com Inc.', category: 'B', qty: 60, lockQty: 0, lienQty: 0, saleableQty: 60, buyPrice: 165.20, currentPrice: 186.50, currency: 'USD', receiveQty: 60, deliverQty: 0, beta: 1.18, delta: 0.95, sector: 'Consumer Discretionary', buyDate: '2025-12-01' }
    ],
    '9056-02': [
        { id: 10, accountId: '9056-02', symbol: 'SAP', name: 'SAP SE', category: 'A', qty: 70, lockQty: 0, lienQty: 0, saleableQty: 70, buyPrice: 176.20, currentPrice: 296.70, currency: 'EUR', receiveQty: 70, deliverQty: 0, beta: 1.01, delta: 0.93, sector: 'Technology', buyDate: '2025-08-14' },
        { id: 11, accountId: '9056-02', symbol: 'ASML', name: 'ASML Holding NV', category: 'A', qty: 35, lockQty: 0, lienQty: 0, saleableQty: 35, buyPrice: 620.40, currentPrice: 742.10, currency: 'EUR', receiveQty: 35, deliverQty: 0, beta: 1.42, delta: 0.96, sector: 'Semiconductors', buyDate: '2025-09-10' },
        { id: 12, accountId: '9056-02', symbol: 'OR', name: "L'Oréal SA", category: 'B', qty: 50, lockQty: 0, lienQty: 0, saleableQty: 50, buyPrice: 380.10, currentPrice: 425.80, currency: 'EUR', receiveQty: 50, deliverQty: 0, beta: 0.65, delta: 0.90, sector: 'Consumer Goods', buyDate: '2025-11-15' }
    ],
    '9056-03': [
        { id: 20, accountId: '9056-03', symbol: 'SHEL', name: 'Shell PLC', category: 'A', qty: 250, lockQty: 0, lienQty: 0, saleableQty: 250, buyPrice: 24.50, currentPrice: 28.90, currency: 'GBP', receiveQty: 250, deliverQty: 0, beta: 0.85, delta: 0.92, sector: 'Energy', buyDate: '2025-07-20' },
        { id: 21, accountId: '9056-03', symbol: 'AZN', name: 'AstraZeneca PLC', category: 'A', qty: 90, lockQty: 0, lienQty: 0, saleableQty: 90, buyPrice: 104.20, currentPrice: 124.60, currency: 'GBP', receiveQty: 90, deliverQty: 0, beta: 0.52, delta: 0.95, sector: 'Healthcare', buyDate: '2025-10-05' },
        { id: 22, accountId: '9056-03', symbol: 'HSBA', name: 'HSBC Holdings PLC', category: 'B', qty: 400, lockQty: 0, lienQty: 0, saleableQty: 400, buyPrice: 6.10, currentPrice: 7.45, currency: 'GBP', receiveQty: 400, deliverQty: 0, beta: 1.05, delta: 0.98, sector: 'Financials', buyDate: '2025-12-12' }
    ],
    '9056-04': [
        { id: 30, accountId: '9056-04', symbol: 'NESN', name: 'Nestlé SA', category: 'A', qty: 140, lockQty: 0, lienQty: 0, saleableQty: 140, buyPrice: 91.30, currentPrice: 108.50, currency: 'CHF', receiveQty: 140, deliverQty: 0, beta: 0.43, delta: 0.82, sector: 'Consumer', buyDate: '2025-12-08' },
        { id: 31, accountId: '9056-04', symbol: 'NOVN', name: 'Novartis AG', category: 'A', qty: 110, lockQty: 0, lienQty: 0, saleableQty: 110, buyPrice: 84.60, currentPrice: 98.20, currency: 'CHF', receiveQty: 110, deliverQty: 0, beta: 0.50, delta: 0.91, sector: 'Healthcare', buyDate: '2025-08-25' },
        { id: 32, accountId: '9056-04', symbol: 'ROG', name: 'Roche Holding AG', category: 'A', qty: 85, lockQty: 0, lienQty: 0, saleableQty: 85, buyPrice: 245.00, currentPrice: 278.40, currency: 'CHF', receiveQty: 85, deliverQty: 0, beta: 0.48, delta: 0.89, sector: 'Healthcare', buyDate: '2025-09-30' }
    ],
    '9056-05': [
        { id: 40, accountId: '9056-05', symbol: 'RELIANCE', name: 'Reliance Industries Ltd', category: 'A', qty: 300, lockQty: 0, lienQty: 0, saleableQty: 300, buyPrice: 2750.00, currentPrice: 3020.50, currency: 'INR', receiveQty: 300, deliverQty: 0, beta: 1.10, delta: 0.99, sector: 'Conglomerate', buyDate: '2025-08-01' },
        { id: 41, accountId: '9056-05', symbol: 'TCS', name: 'Tata Consultancy Services', category: 'A', qty: 200, lockQty: 0, lienQty: 0, saleableQty: 200, buyPrice: 3820.00, currentPrice: 4250.00, currency: 'INR', receiveQty: 200, deliverQty: 0, beta: 0.82, delta: 0.97, sector: 'Technology', buyDate: '2025-10-14' },
        { id: 42, accountId: '9056-05', symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', category: 'A', qty: 450, lockQty: 0, lienQty: 0, saleableQty: 450, buyPrice: 1540.00, currentPrice: 1720.80, currency: 'INR', receiveQty: 450, deliverQty: 0, beta: 1.02, delta: 0.98, sector: 'Financials', buyDate: '2025-11-20' }
    ]
};

export const REALIZED_TRADES_LAST_DAY: RealizedTradeLastDay[] = [
    {
        id: 901,
        accountId: '9056-01',
        companyName: 'GSP Finance Ltd',
        symbol: 'GSP',
        saleQty: 1625,
        saleRate: 26.70,
        commission: 216.94,
        buyRateDetails: '500(41.21),75(0.00),69(0.00),354(0.01),500(14.07),127(0.00)',
        gainLoss: 15529.22
    },
    {
        id: 902,
        accountId: '9056-02',
        companyName: 'SAP SE Option Realized',
        symbol: 'SAP-OPT',
        saleQty: 50,
        saleRate: 145.00,
        commission: 45.20,
        buyRateDetails: '50(60.00)',
        gainLoss: 4210.50
    }
];
