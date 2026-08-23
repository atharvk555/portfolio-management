import React from 'react';
import { Holding, Currency, RiskMetrics } from '../types';

interface DashboardViewProps {
    totalPortfolioValue: number;
    totalMarketValue: number;
    totalCash: number;
    totalPnl: number;
    totalPnlPct: number;
    baseCurrency: Currency;
    holdings: Holding[];
    riskMetrics: RiskMetrics;
    selectedPeriod: '1M' | '3M' | '6M' | '1Y';
    setSelectedPeriod: (p: '1M' | '3M' | '6M' | '1Y') => void;
    onNavigate: (page: string) => void;
    convertToBase: (amount: number, curr: Currency) => number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
    totalPortfolioValue,
    totalMarketValue,
    totalCash,
    totalPnl,
    totalPnlPct,
    baseCurrency,
    holdings,
    riskMetrics,
    selectedPeriod,
    setSelectedPeriod,
    onNavigate,
    convertToBase
}) => {
    const getSymbol = (c: Currency) => ({ USD: '$', EUR: '€', GBP: '£', CHF: '₣', INR: '₹' })[c] || c;
    const sym = getSymbol(baseCurrency);

    const formatMoney = (n: number) =>
        new Intl.NumberFormat('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(n);

    // Derive Sector breakdown
    const sectorMap: Record<string, number> = {};
    holdings.forEach(h => {
        const valBase = convertToBase(h.currentValue || 0, h.currency);
        sectorMap[h.sector] = (sectorMap[h.sector] || 0) + valBase;
    });

    const sectorData = Object.entries(sectorMap).sort((a, b) => b[1] - a[1]);
    const maxSectorVal = sectorData[0]?.[1] || 1;

    // Top gainers
    const sortedByPnl = [...holdings].sort((a, b) => (b.pnl || 0) - (a.pnl || 0));

    return (
        <>
            <section className="hero-grid">
                <div className="hero-card">
                    <div className="card-label">TOTAL PORTFOLIO VALUE ({baseCurrency})</div>
                    <div className="hero-value">{sym}{formatMoney(totalPortfolioValue)}</div>
                    <div className={`hero-change ${totalPnl >= 0 ? 'positive' : 'negative'}`}>
                        {totalPnl >= 0 ? '▲ +' : '▼ '}{totalPnlPct.toFixed(2)}% ({sym}{formatMoney(Math.abs(totalPnl))})
                        <span>since inception</span>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="card-label">MARKET VALUE (SECURITIES)</div>
                    <div className="metric-value">{sym}{formatMoney(totalMarketValue)}</div>
                    <div className="muted">{holdings.length} Active Positions</div>
                </div>

                <div className="metric-card">
                    <div className="card-label">UNREALIZED MTM P&L</div>
                    <div className={`metric-value ${totalPnl >= 0 ? 'positive' : 'negative'}`}>
                        {totalPnl >= 0 ? '+' : '-'}{sym}{formatMoney(Math.abs(totalPnl))}
                    </div>
                    <div className={totalPnl >= 0 ? 'positive' : 'negative'}>
                        {totalPnl >= 0 ? '+' : ''}{totalPnlPct.toFixed(2)}% Return
                    </div>
                </div>

                <div className="metric-card">
                    <div className="card-label">CASH & LIQUIDITY</div>
                    <div className="metric-value">{sym}{formatMoney(totalCash)}</div>
                    <div className="muted">
                        {totalPortfolioValue > 0 ? ((totalCash / totalPortfolioValue) * 100).toFixed(1) : 0}% of portfolio
                    </div>
                </div>
            </section>

            <section className="grid-two">
                <div className="panel">
                    <div className="panel-header">
                        <div>
                            <h2>Performance Attribution</h2>
                            <p>Dynamic Portfolio NAV vs Market Benchmarks</p>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {(['1M', '3M', '6M', '1Y'] as const).map(p => (
                                <button
                                    key={p}
                                    className={`btn ${selectedPeriod === p ? 'primary' : 'secondary'}`}
                                    style={{ padding: '4px 10px', fontSize: '11px' }}
                                    onClick={() => setSelectedPeriod(p)}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="big-chart">
                        <svg viewBox="0 0 720 180" preserveAspectRatio="none" className="line-chart">
                            {/* Gridlines */}
                            <line x1="0" y1="40" x2="720" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                            <line x1="0" y1="90" x2="720" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                            <line x1="0" y1="140" x2="720" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />

                            {/* Dynamic NAV Curve */}
                            <polyline points="0,150 140,120 280,130 420,80 560,95 720,30" />
                            <polyline className="line-muted" points="0,155 140,135 280,140 420,110 560,118 720,65" />
                            <polyline className="line-muted2" points="0,160 140,148 280,150 420,130 560,135 720,100" />
                        </svg>
                        <div className="xlabels">
                            <span>Start</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>Current</span>
                        </div>
                    </div>

                    <div className="legend">
                        <span><i className="dot portfolio" /> Global Growth Portfolio <b>+{totalPnlPct.toFixed(1)}%</b></span>
                        <span><i className="dot nasdaq" /> NASDAQ 100 <b>+12.3%</b></span>
                        <span><i className="dot ftse" /> FTSE 100 <b>+8.6%</b></span>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <div>
                            <h2>Asset Allocation</h2>
                            <p>Current Market Value by Sector</p>
                        </div>
                    </div>

                    <div className="sector-list" style={{ marginTop: '12px' }}>
                        {sectorData.map(([sectorName, val], i) => {
                            const weight = totalMarketValue > 0 ? (val / totalMarketValue) * 100 : 0;
                            return (
                                <div key={sectorName} style={{ marginBottom: '12px' }}>
                                    <div className="sector-row">
                                        <span><span className={`sector-dot s${i % 4}`} /> {sectorName}</span>
                                        <b>{sym}{formatMoney(val)} ({weight.toFixed(1)}%)</b>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', height: '6px', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                width: `${(val / maxSectorVal) * 100}%`,
                                                height: '100%',
                                                background: i === 0 ? '#c6a15b' : i === 1 ? '#5b7cfa' : i === 2 ? '#3aa58f' : '#b36bdb',
                                                borderRadius: '3px'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="grid-three">
                <div className="panel">
                    <div className="panel-header">
                        <div>
                            <h2>Risk Snapshot</h2>
                            <p>Dynamic Greeks & Risk Measures</p>
                        </div>
                        <button className="btn secondary" style={{ fontSize: '11px', padding: '4px 8px' }} onClick={() => onNavigate('risk')}>
                            Details →
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                            <span>Portfolio Beta (β)</span>
                            <b>{riskMetrics.weightedBeta}</b>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                            <span>Weighted Delta (Δ)</span>
                            <b>{riskMetrics.weightedDelta}</b>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                            <span>Sharpe Ratio</span>
                            <b>{riskMetrics.sharpeRatio}</b>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <div>
                            <h2>Top Movers (Unrealized P&L)</h2>
                            <p>Highest performing positions</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {sortedByPnl.slice(0, 3).map(h => (
                            <div key={h.symbol} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid var(--border-color)' }}>
                                <div className="security">
                                    <div className="ticker">{h.symbol.slice(0, 2)}</div>
                                    <div>
                                        <b>{h.symbol}</b>
                                        <small>{h.qty} shares</small>
                                    </div>
                                </div>
                                <span className={(h.pnl || 0) >= 0 ? 'positive' : 'negative'} style={{ fontWeight: 600 }}>
                                    {(h.pnl || 0) >= 0 ? '+' : '-'}{getSymbol(h.currency)}{Math.abs(h.pnl || 0)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="panel" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid var(--border-bright)' }}>
                    <div className="card-label" style={{ color: '#60a5fa' }}>CLIENT REPORTING READY</div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', margin: '8px 0 4px', fontSize: '18px' }}>Official Client Statement</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                        Consolidated statement showing positions, MTM pricing, cash balances, and risk parameters.
                    </p>
                    <button className="btn primary full" onClick={() => onNavigate('statement')}>
                        Generate Client Statement
                    </button>
                </div>
            </section>
        </>
    );
};
