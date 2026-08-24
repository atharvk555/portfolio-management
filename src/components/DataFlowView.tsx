import React, { useState } from 'react';

export const DataFlowView: React.FC = () => {
    const [selectedNode, setSelectedNode] = useState<number | null>(0);

    const nodes = [
        {
            id: 0,
            title: "1. External Data Sources (Bloomberg B-PIPE / Exchange Feeds)",
            sub: "Real-time REST & WebSocket market data feeds",
            details: "Delivers live tick quotes, closing prices, corporate action adjustments, FX spot rates (European Central Bank / Frankfurter), and index benchmark feeds (NASDAQ, S&P 500, FTSE)."
        },
        {
            id: 1,
            title: "2. Market Data Integration Adapter",
            sub: "Normalization, symbol mapping & validation layer",
            details: "Maps external Bloomberg FIGI / ISIN tickers to internal Security Master symbols. Applies stale price detection, duplicate checking, and fallback cached price feeds."
        },
        {
            id: 2,
            title: "3. Internal Static & Transaction Data",
            sub: "Client portfolio, trade blotter & multi-currency cash ledgers",
            details: "Maintains permanent client position records, historical trade entry ledger (including back-dated purchases/sales), currency balances (USD, EUR, GBP, CHF, INR), and FIFO cost basis."
        },
        {
            id: 3,
            title: "4. Dynamic Financial Valuation Engine",
            sub: "MTM calculator, P&L engine & Risk Greeks processor",
            details: "Performs real-time Mark-to-Market (MTM = Quantity × Live Closing Price), FIFO unrealized and realized P&L, holding period derivation, portfolio Beta, Delta, Sharpe ratio, and FX conversions."
        },
        {
            id: 4,
            title: "5. Client Reporting & Statement Generator",
            sub: "Dashboard UI, Risk Analytics & Daily Client Statement",
            details: "Renders interactive portfolio dashboards, risk concentration maps, index performance benchmark comparisons, and official printable Client Portfolio Statements."
        }
    ];

    return (
        <div className="stack" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h2>Requirement 8: External Data Source Integration Flowchart</h2>
                        <p>Interactive architecture showing how external Bloomberg / Exchange price feeds integrate with internal static data</p>
                    </div>
                </div>

                <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '12px' }}>
                    💡 <b>Interactive Flowchart:</b> Click any step in the flowchart below to inspect details of data transformations, symbol mapping, validation rules, and financial calculation flow.
                </div>

                <div className="flow">
                    {nodes.map((n, idx) => (
                        <React.Fragment key={n.id}>
                            <div
                                className={`flow-node ${selectedNode === n.id ? 'active' : ''}`}
                                onClick={() => setSelectedNode(n.id)}
                                style={{
                                    background: selectedNode === n.id ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-dark)',
                                    border: selectedNode === n.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                                    padding: '16px',
                                    borderRadius: '10px',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <b style={{ fontSize: '15px', color: selectedNode === n.id ? '#60a5fa' : 'var(--text-main)' }}>
                                            {n.title}
                                        </b>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            {n.sub}
                                        </p>
                                    </div>
                                    <span style={{ fontSize: '18px', color: 'var(--text-dim)' }}>
                                        {selectedNode === n.id ? '▼' : '▶'}
                                    </span>
                                </div>

                                {selectedNode === n.id && (
                                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.6 }}>
                                        {n.details}
                                    </div>
                                )}
                            </div>

                            {idx < nodes.length - 1 && (
                                <div className="flow-arrow" style={{ padding: '4px 0', color: '#3b82f6', fontWeight: 700 }}>
                                    ↓ Data Pipeline Feed
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </section>

            <section className="grid-two">
                <div className="panel">
                    <div className="panel-header">
                        <div>
                            <h2>Data Controls & Quality Checks</h2>
                            <p>Validation rules enforced before valuation calculation</p>
                        </div>
                    </div>

                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                        <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span> Instrument Ticker & FIGI mapping validation
                        </li>
                        <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span> Real-time FX rate spot translation check
                        </li>
                        <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span> Stale price warning & fallback price feed trigger
                        </li>
                        <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span> Duplicate trade detection & oversell prevention
                        </li>
                        <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span> Audit logging for manual back-dated trade entries
                        </li>
                    </ul>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <div>
                            <h2>System Architecture Overview</h2>
                            <p>Client-side calculation state with live API feeds</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                        <div style={{ padding: '10px', background: 'var(--bg-dark)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                            <b>React Presentation UI</b> → Consumes derived portfolio state
                        </div>
                        <div style={{ padding: '10px', background: 'var(--bg-dark)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                            <b>Zustand / React State Ledger</b> → Manages trade posting & cash
                        </div>
                        <div style={{ padding: '10px', background: 'var(--bg-dark)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                            <b>Financial Calculation Engine</b> → MTM, FIFO cost basis & risk greeks
                        </div>
                        <div style={{ padding: '10px', background: 'var(--bg-dark)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                            <b>Free External APIs</b> → Yahoo Finance stock quotes & Frankfurter FX
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
