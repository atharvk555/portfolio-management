import React from 'react';
import { Holding, RiskMetrics, Currency } from '../types';

interface RiskViewProps {
    riskMetrics: RiskMetrics;
    holdings: Holding[];
    convertToBase: (amount: number, currency: Currency) => number;
}

export const RiskView: React.FC<RiskViewProps> = ({
    riskMetrics,
    holdings,
    convertToBase
}) => {
    const sortedHoldings = [...holdings].sort((a, b) => (b.currentValue || 0) - (a.currentValue || 0));

    return (
        <div className="stack" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <section className="panel" style={{ background: 'linear-gradient(135deg, #131b2e, #0d1322)', border: '1px solid var(--border-bright)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div className="card-label">PORTFOLIO RISK SCORE</div>
                        <div style={{ fontSize: '42px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#38bdf8', margin: '4px 0' }}>
                            {riskMetrics.riskScore} <span style={{ fontSize: '18px', color: 'var(--text-dim)' }}>/ 100</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Risk Rating: <b style={{ color: '#10b981' }}>{riskMetrics.riskLevel}</b> • Diversified across {holdings.length} holdings
                        </p>
                    </div>

                    <div style={{ width: '240px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: 'var(--text-muted)' }}>
                            <span>Low</span>
                            <span>Moderate</span>
                            <span>High</span>
                            <span>Aggressive</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${riskMetrics.riskScore}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #f59e0b, #ef4444)', borderRadius: '4px' }} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid-three">
                <div className="panel">
                    <div className="card-label">PORTFOLIO BETA (β)</div>
                    <div className="metric-value">{riskMetrics.weightedBeta}</div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Calculated covariance relative to NASDAQ/S&P 500 benchmark indices.
                    </p>
                    <div className="risk-badge" style={{ marginTop: '12px', display: 'inline-block' }}>
                        {riskMetrics.weightedBeta > 1.15 ? 'Elevated Market Sensitivity' : 'Moderate Sensitivity'}
                    </div>
                </div>

                <div className="panel">
                    <div className="card-label">WEIGHTED DELTA (Δ)</div>
                    <div className="metric-value">{riskMetrics.weightedDelta}</div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Equity and option directional exposure sensitivity.
                    </p>
                    <div className="risk-badge" style={{ marginTop: '12px', display: 'inline-block', background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                        Optimal Directional Alignment
                    </div>
                </div>

                <div className="panel">
                    <div className="card-label">SHARPE RATIO</div>
                    <div className="metric-value" style={{ color: '#10b981' }}>{riskMetrics.sharpeRatio}</div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Risk-adjusted excess return per unit of volatility (Rf = 4.5%).
                    </p>
                    <div className="risk-badge" style={{ marginTop: '12px', display: 'inline-block', background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                        Strong Risk-Adjusted Performance
                    </div>
                </div>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h2>Position Risk & Concentration</h2>
                        <p>Risk contribution by individual security position</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sortedHoldings.map((h) => (
                        <div
                            key={h.symbol}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px',
                                background: 'var(--bg-dark)',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)'
                            }}
                        >
                            <div className="security" style={{ width: '200px' }}>
                                <div className="ticker">{h.symbol.slice(0, 2)}</div>
                                <div>
                                    <b>{h.symbol}</b>
                                    <small>{h.sector}</small>
                                </div>
                            </div>

                            <div style={{ flex: 1, margin: '0 24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                                    <span>Portfolio Weight</span>
                                    <b>{(h.weight || 0).toFixed(1)}%</b>
                                </div>
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(100, (h.weight || 0) * 3)}%`, height: '100%', background: '#3b82f6', borderRadius: '3px' }} />
                                </div>
                            </div>

                            <div style={{ width: '80px', textAlign: 'right' }}>
                                <b>{h.beta.toFixed(2)} β</b>
                            </div>
                        </div>
                    ))}
                </div>
            </section >
        </div >
    );
};
