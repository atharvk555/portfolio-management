import React from 'react';
import { getBenchmarkComparisonData } from '../services/financialEngine';

interface BenchmarksViewProps {
    totalPnlPct: number;
    selectedPeriod: '1M' | '3M' | '6M' | '1Y';
    setSelectedPeriod: (p: '1M' | '3M' | '6M' | '1Y') => void;
}

export const BenchmarksView: React.FC<BenchmarksViewProps> = ({
    totalPnlPct,
    selectedPeriod,
    setSelectedPeriod
}) => {
    const benchmarkData = getBenchmarkComparisonData(totalPnlPct);
    const currentData = benchmarkData[selectedPeriod];

    const excessNasdaq = +(currentData.portfolio - currentData.nasdaq).toFixed(1);
    const excessSp = +(currentData.portfolio - currentData.sp).toFixed(1);

    return (
        <div className="stack" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h2>Benchmark Performance Comparison</h2>
                        <p>Portfolio return vs global equity market indices (NASDAQ 100, S&P 500, FTSE 100)</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {(['1M', '3M', '6M', '1Y'] as const).map((p) => (
                            <button
                                key={p}
                                className={`btn ${selectedPeriod === p ? 'primary' : 'secondary'}`}
                                onClick={() => setSelectedPeriod(p)}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px me var(--primary)', padding: '16px', borderRadius: '10px' }}>
                        <small style={{ color: 'var(--text-dim)', letterSpacing: '0.5px' }}>PORTFOLIO RETURN ({selectedPeriod})</small>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                            +{currentData.portfolio}%
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '10px' }}>
                        <small style={{ color: 'var(--text-dim)', letterSpacing: '0.5px' }}>NASDAQ 100 (^IXIC)</small>
                        <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                            +{currentData.nasdaq}%
                        </div>
                        <span style={{ fontSize: '11px', color: excessNasdaq >= 0 ? '#10b981' : '#ef4444' }}>
                            {excessNasdaq >= 0 ? `▲ +${excessNasdaq} pts vs NASDAQ` : `▼ ${excessNasdaq} pts`}
                        </span>
                    </div>

                    <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '10px' }}>
                        <small style={{ color: 'var(--text-dim)', letterSpacing: '0.5px' }}>S&P 500 (^GSPC)</small>
                        <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                            +{currentData.sp}%
                        </div>
                        <span style={{ fontSize: '11px', color: excessSp >= 0 ? '#10b981' : '#ef4444' }}>
                            {excessSp >= 0 ? `▲ +${excessSp} pts vs S&P` : `▼ ${excessSp} pts`}
                        </span>
                    </div>

                    <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '10px' }}>
                        <small style={{ color: 'var(--text-dim)', letterSpacing: '0.5px' }}>FTSE 100 (^FTSE)</small>
                        <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                            +{currentData.ftse}%
                        </div>
                        <span style={{ fontSize: '11px', color: '#10b981' }}>
                            ▲ Outperforming UK equities
                        </span>
                    </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <h3 style={{ fontSize: '14px', marginBottom: '16px' }}>Normalized Performance Comparison ({selectedPeriod})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { name: 'Global Growth Portfolio', val: currentData.portfolio, color: '#3b82f6' },
                            { name: 'NASDAQ 100 Index', val: currentData.nasdaq, color: '#06b6d4' },
                            { name: 'S&P 500 Index', val: currentData.sp, color: '#10b981' },
                            { name: 'FTSE 100 Index', val: currentData.ftse, color: '#64748b' }
                        ].map((item) => (
                            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ width: '180px', fontSize: '12px', fontWeight: 500 }}>{item.name}</span>
                                <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(100, (item.val / 25) * 100)}%`, height: '100%', background: item.color, borderRadius: '6px' }} />
                                </div>
                                <b style={{ width: '60px', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>+{item.val}%</b>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h2>Benchmark Methodology</h2>
                        <p>How portfolio benchmark metrics are calculated</p>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '18px' }}>01</span>
                        <h4 style={{ margin: '8px 0 4px' }}>Time Normalization</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            All asset prices and index historical daily quotes are rebased to 100 at the start of the selected timeframe.
                        </p>
                    </div>

                    <div style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '18px' }}>02</span>
                        <h4 style={{ margin: '8px 0 4px' }}>Currency Adjustment</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Foreign security returns (EUR, GBP, CHF) are translated using daily spot FX rates into base USD.
                        </p>
                    </div>

                    <div style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '18px' }}>03</span>
                        <h4 style={{ margin: '8px 0 4px' }}>Alpha & Beta</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Excess return over benchmark represents active alpha generated by portfolio allocation strategy.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
