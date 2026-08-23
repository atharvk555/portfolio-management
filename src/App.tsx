import React, { useState, useEffect, useMemo } from 'react';
import { Currency, Trade, ClientAccount, Holding } from './types';
import { INITIAL_ACCOUNTS, ACCOUNT_HOLDINGS, REALIZED_TRADES_LAST_DAY } from './data/initialAccounts';
import { INITIAL_TRADES } from './data/initialData';
import { fetchLiveFX, fetchBulkQuotes } from './services/marketData';
import {
    deriveHoldingsFromTrades,
    calculatePortfolioMetrics,
    convertToBase
} from './services/financialEngine';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { HoldingsView } from './components/HoldingsView';
import { TradesView } from './components/TradesView';
import { CashView } from './components/CashView';
import { RiskView } from './components/RiskView';
import { BenchmarksView } from './components/BenchmarksView';
import { DataFlowView } from './components/DataFlowView';
import { ClientStatementView } from './components/ClientStatementView';
import { TradeModal } from './components/TradeModal';

export function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [accounts] = useState<ClientAccount[]>(INITIAL_ACCOUNTS);
    const [selectedAccountId, setSelectedAccountId] = useState<string>('ALL');

    const [trades, setTrades] = useState<Trade[]>(() => {
        const saved = localStorage.getItem('ubs_trades_ledger');
        return saved ? JSON.parse(saved) : INITIAL_TRADES;
    });

    const [baseCurrency, setBaseCurrency] = useState<Currency>('USD');
    const [selectedPeriod, setSelectedPeriod] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [toast, setToast] = useState('');
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const [fxRates, setFxRates] = useState<Record<Currency, number>>({
        USD: 1.0,
        EUR: 1.17,
        GBP: 1.35,
        CHF: 1.27,
        INR: 0.012
    });

    const [livePrices, setLivePrices] = useState<Record<string, number>>({});
    const [apiStatus, setApiStatus] = useState<'live' | 'fallback' | 'loading'>('live');

    // Save trades to localStorage
    useEffect(() => {
        localStorage.setItem('ubs_trades_ledger', JSON.stringify(trades));
    }, [trades]);

    // Initial live FX and Price fetch
    useEffect(() => {
        loadLiveFX();
        loadLiveStockPrices();
    }, []);

    const showNotification = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const loadLiveFX = async () => {
        setApiStatus('loading');
        const res = await fetchLiveFX();
        setFxRates(res.rates);
        setApiStatus(res.source);
        if (res.source === 'live') {
            showNotification('Live European FX exchange rates fetched');
        }
    };

    const loadLiveStockPrices = async () => {
        const allHoldings = Object.values(ACCOUNT_HOLDINGS).flat();
        const symbols = Array.from(new Set([...allHoldings.map(h => h.symbol), ...trades.map(t => t.symbol)]));
        const quotes = await fetchBulkQuotes(symbols);
        const priceMap: Record<string, number> = {};
        Object.entries(quotes).forEach(([sym, val]) => {
            if (val.price) priceMap[sym] = val.price;
        });
        setLivePrices(priceMap);
        setLastRefresh(new Date());
    };

    const handleRefreshPrices = async () => {
        showNotification('Refreshing live market prices & FX rates...');
        await Promise.all([loadLiveFX(), loadLiveStockPrices()]);
        showNotification('Market prices & FX rates updated successfully');
    };

    // Flatten holdings across accounts or filter by active selected account
    const rawBaseHoldings = useMemo(() => {
        const allHoldings = Object.values(ACCOUNT_HOLDINGS).flat();
        return selectedAccountId === 'ALL'
            ? allHoldings
            : allHoldings.filter(h => h.accountId === selectedAccountId);
    }, [selectedAccountId]);

    // Dynamic derivation of holdings based on trade ledger
    const derivedHoldingsRaw = useMemo(() => {
        const holdings = deriveHoldingsFromTrades(rawBaseHoldings, trades);
        return holdings.map(h => ({
            ...h,
            currentPrice: livePrices[h.symbol] || h.currentPrice
        }));
    }, [rawBaseHoldings, trades, livePrices]);

    // Account cash balances derivation
    const accountCashBalances = useMemo(() => {
        return accounts.map(acc => ({
            currency: acc.currency,
            balance: acc.availableBalance,
            fx: fxRates[acc.currency] || 1.0
        }));
    }, [accounts, fxRates]);

    // Dynamic calculation of portfolio metrics
    const portfolioMetrics = useMemo(() => {
        return calculatePortfolioMetrics(derivedHoldingsRaw, accountCashBalances, baseCurrency, fxRates);
    }, [derivedHoldingsRaw, accountCashBalances, baseCurrency, fxRates]);

    const handleAddTrade = (newTradeData: Omit<Trade, 'id'>) => {
        const id = Date.now();
        const activeAccId = selectedAccountId === 'ALL' ? '9056-01' : selectedAccountId;
        const newTrade: Trade = { id, accountId: activeAccId, ...newTradeData };
        setTrades(prev => [newTrade, ...prev]);
        setShowTradeModal(false);
        showNotification(`Posted trade to Account ${newTrade.accountId}: ${newTrade.side} ${newTrade.qty} ${newTrade.symbol} @ ${newTrade.price} ${newTrade.currency}`);
    };

    const handleDeleteTrade = (id: number | string) => {
        setTrades(prev => prev.filter(t => t.id !== id));
        showNotification(`Trade TRD-${id} deleted from ledger`);
    };

    const convertAmount = (amount: number, curr: Currency) => {
        return convertToBase(amount, curr, baseCurrency, fxRates);
    };

    const getPageTitle = (p: string) => {
        switch (p) {
            case 'dashboard': return 'Portfolio Overview';
            case 'holdings': return 'Security Holdings (MTM)';
            case 'trades': return 'Trade Blotter & Audit History';
            case 'cash': return 'Multi-Currency Cash & FX Matrix';
            case 'risk': return 'Risk Analytics & Greeks';
            case 'benchmarks': return 'Benchmark Comparison';
            case 'dataflow': return 'Data Integration Architecture';
            case 'statement': return 'Client Portfolio Statement';
            default: return 'Portfolio Reporting';
        }
    };

    return (
        <div className="app-shell">
            <Sidebar
                currentPage={currentPage}
                setPage={setCurrentPage}
                apiStatus={apiStatus}
            />

            <main className="main">
                <Header
                    pageTitle={getPageTitle(currentPage)}
                    lastRefresh={lastRefresh}
                    baseCurrency={baseCurrency}
                    setBaseCurrency={setBaseCurrency}
                    onRefreshPrices={handleRefreshPrices}
                    onSendStatement={() => setCurrentPage('statement')}
                    apiStatus={apiStatus}
                    accounts={accounts}
                    selectedAccountId={selectedAccountId}
                    setSelectedAccountId={setSelectedAccountId}
                />

                <div className="content">
                    {currentPage === 'dashboard' && (
                        <DashboardView
                            totalPortfolioValue={portfolioMetrics.totalPortfolioValue}
                            totalMarketValue={portfolioMetrics.totalMarketValue}
                            totalCash={portfolioMetrics.totalCash}
                            totalPnl={portfolioMetrics.totalPnl}
                            totalPnlPct={portfolioMetrics.totalPnlPct}
                            baseCurrency={baseCurrency}
                            holdings={portfolioMetrics.holdings}
                            riskMetrics={portfolioMetrics.riskMetrics}
                            selectedPeriod={selectedPeriod}
                            setSelectedPeriod={setSelectedPeriod}
                            onNavigate={setCurrentPage}
                            convertToBase={convertAmount}
                        />
                    )}

                    {currentPage === 'holdings' && (
                        <HoldingsView
                            holdings={portfolioMetrics.holdings}
                            baseCurrency={baseCurrency}
                            convertToBase={convertAmount}
                            onOpenTradeModal={() => setShowTradeModal(true)}
                        />
                    )}

                    {currentPage === 'trades' && (
                        <TradesView
                            trades={trades}
                            onOpenTradeModal={() => setShowTradeModal(true)}
                            onDeleteTrade={handleDeleteTrade}
                        />
                    )}

                    {currentPage === 'cash' && (
                        <CashView
                            cashBalances={accountCashBalances}
                            fxRates={fxRates}
                            apiStatus={apiStatus}
                            onFetchLiveFx={loadLiveFX}
                            baseCurrency={baseCurrency}
                            convertToBase={convertAmount}
                        />
                    )}

                    {currentPage === 'risk' && (
                        <RiskView
                            riskMetrics={portfolioMetrics.riskMetrics}
                            holdings={portfolioMetrics.holdings}
                            convertToBase={convertAmount}
                        />
                    )}

                    {currentPage === 'benchmarks' && (
                        <BenchmarksView
                            totalPnlPct={portfolioMetrics.totalPnlPct}
                            selectedPeriod={selectedPeriod}
                            setSelectedPeriod={setSelectedPeriod}
                        />
                    )}

                    {currentPage === 'dataflow' && (
                        <DataFlowView />
                    )}

                    {currentPage === 'statement' && (
                        <ClientStatementView
                            accounts={accounts}
                            selectedAccountId={selectedAccountId}
                            setSelectedAccountId={setSelectedAccountId}
                            holdings={Object.values(ACCOUNT_HOLDINGS).flat()}
                            baseCurrency={baseCurrency}
                            fxRates={fxRates}
                            convertToBase={convertAmount}
                            realizedTradesLastDay={REALIZED_TRADES_LAST_DAY}
                        />
                    )}
                </div>
            </main>

            {showTradeModal && (
                <TradeModal
                    onClose={() => setShowTradeModal(false)}
                    onSave={handleAddTrade}
                />
            )}

            {toast && (
                <div className="toast">
                    ✓ {toast}
                </div>
            )}
        </div>
    );
}
