import React from 'react';
import { Currency, ClientAccount } from '../types';

interface HeaderProps {
    pageTitle: string;
    lastRefresh: Date;
    baseCurrency: Currency;
    setBaseCurrency: (c: Currency) => void;
    onRefreshPrices: () => void;
    onSendStatement: () => void;
    apiStatus: 'live' | 'fallback' | 'loading';
    accounts: ClientAccount[];
    selectedAccountId: string;
    setSelectedAccountId: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
    pageTitle,
    lastRefresh,
    baseCurrency,
    setBaseCurrency,
    onRefreshPrices,
    onSendStatement,
    apiStatus,
    accounts,
    selectedAccountId,
    setSelectedAccountId
}) => {
    return (
        <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h1 className="header-title">{pageTitle}</h1>

                {/* Account Selector Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-dark)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <small style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: 600 }}>ACCOUNT:</small>
                    <select
                        value={selectedAccountId}
                        onChange={(e) => setSelectedAccountId(e.target.value)}
                        style={{
                            background: 'transparent',
                            color: '#38bdf8',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        <option value="ALL" style={{ background: '#0f172a', color: '#fff' }}>🌐 ALL ACCOUNTS (CONSOLIDATED)</option>
                        {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id} style={{ background: '#0f172a', color: '#fff' }}>
                                Account #{acc.id} ({acc.currency}) - {acc.accountName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="status-pill" style={{ background: apiStatus === 'live' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: apiStatus === 'live' ? '#10b981' : '#f59e0b', border: apiStatus === 'live' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)' }}>
                    <span className="dot" style={{ background: apiStatus === 'live' ? '#10b981' : '#f59e0b' }} />
                    <span>{apiStatus === 'live' ? 'Live API Feeds' : 'Fallback Price Feed'}</span>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', textAlign: 'right' }}>
                    <div>Last Price Refresh:</div>
                    <b style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                        {lastRefresh.toLocaleTimeString()}
                    </b>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-dark)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <small style={{ color: 'var(--text-dim)', fontSize: '11px' }}>Base:</small>
                    <select
                        value={baseCurrency}
                        onChange={(e) => setBaseCurrency(e.target.value as Currency)}
                        style={{
                            background: 'transparent',
                            color: 'var(--text-main)',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        <option value="USD" style={{ background: '#0f172a' }}>USD ($)</option>
                        <option value="EUR" style={{ background: '#0f172a' }}>EUR (€)</option>
                        <option value="GBP" style={{ background: '#0f172a' }}>GBP (£)</option>
                        <option value="CHF" style={{ background: '#0f172a' }}>CHF (₣)</option>
                        <option value="INR" style={{ background: '#0f172a' }}>INR (₹)</option>
                    </select>
                </div>

                <button className="btn secondary" onClick={onRefreshPrices} title="Fetch live quotes and exchange rates">
                    ↻ Sync Feeds
                </button>

                <button className="btn primary" onClick={onSendStatement}>
                    📄 Client Statement
                </button>
            </div>
        </header>
    );
};
