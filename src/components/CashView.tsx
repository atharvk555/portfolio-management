import React from 'react';
import { CashBalance, FXRates, Currency } from '../types';

interface CashViewProps {
    cashBalances: CashBalance[];
    fxRates: FXRates;
    apiStatus: 'live' | 'fallback' | 'loading';
    onFetchLiveFx: () => void;
    baseCurrency: Currency;
    convertToBase: (amount: number, currency: Currency) => number;
}

export const CashView: React.FC<CashViewProps> = ({
    cashBalances,
    fxRates,
    apiStatus,
    onFetchLiveFx,
    baseCurrency,
    convertToBase
}) => {
    const getSymbol = (c: Currency) => ({ USD: '$', EUR: '€', GBP: '£', CHF: '₣', INR: '₹' })[c] || c;
    const baseSym = getSymbol(baseCurrency);

    const formatMoney = (n: number, decimals = 2) =>
        new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(n);

    const totalCashBase = cashBalances.reduce((sum, c) => sum + convertToBase(c.balance, c.currency), 0);

    return (
        <div className="stack" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h2>Multi-Currency Cash Balances</h2>
                        <p>Cash balances across global currencies translated to {baseCurrency}</p>
                    </div>
                    <button className="btn secondary" onClick={onFetchLiveFx} disabled={apiStatus === 'loading'}>
                        {apiStatus === 'loading' ? 'Fetching Live FX...' : '↻ Fetch Live FX Rates'}
                    </button>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>
                        <b>FX Provider Feed:</b> {apiStatus === 'live' ? 'Live European Central Bank Feed (Frankfurter API)' : 'Standard FX Rates'}
                    </span>
                    <span className="risk-badge" style={{ background: apiStatus === 'live' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: apiStatus === 'live' ? '#10b981' : '#f59e0b' }}>
                        {apiStatus === 'live' ? '✓ LIVE API ACTIVE' : 'DEMO MODE'}
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                    {cashBalances.map((c) => {
                        const sym = getSymbol(c.currency);
                        const valBase = convertToBase(c.balance, c.currency);

                        return (
                            <div
                                key={c.currency}
                                style={{
                                    background: 'var(--bg-dark)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px'
                                }}
                            >
                                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontWeight: 700, fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {sym}
                                </div>
                                <div>
                                    <small style={{ color: 'var(--text-dim)', letterSpacing: '0.5px' }}>{c.currency} CASH BALANCE</small>
                                    <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', margin: '2px 0' }}>
                                        {sym}{formatMoney(c.balance)}
                                    </h3>
                                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                        ≈ {baseSym}{formatMoney(valBase)} {baseCurrency}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-bright)' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Total Portfolio Cash Holdings ({baseCurrency}):</span>
                    <b style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', color: '#10b981' }}>
                        {baseSym}{formatMoney(totalCashBase)}
                    </b>
                </div>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h2>Exchange Rate Matrix (USD Base)</h2>
                        <p>Live spot exchange rates used by the dynamic valuation engine</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    {Object.entries(fxRates).map(([curr, rate]) => (
                        <div key={curr} style={{ padding: '12px', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <b>USD / {curr}</b>
                                <small style={{ display: 'block', color: 'var(--text-dim)', fontSize: '10px' }}>
                                    {curr === 'USD' ? 'Base Currency' : 'Spot Rate'}
                                </small>
                            </div>
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>
                                {rate.toFixed(4)}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
