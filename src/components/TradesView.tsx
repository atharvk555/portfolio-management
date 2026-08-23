import React from 'react';
import { Trade, Currency } from '../types';

interface TradesViewProps {
    trades: Trade[];
    onOpenTradeModal: () => void;
    onDeleteTrade: (id: number | string) => void;
}

export const TradesView: React.FC<TradesViewProps> = ({
    trades,
    onOpenTradeModal,
    onDeleteTrade
}) => {
    const getSymbol = (c: Currency) => ({ USD: '$', EUR: '€', GBP: '£', CHF: '₣', INR: '₹' })[c] || c;

    const formatMoney = (n: number, decimals = 2) =>
        new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(n);

    return (
        <section className="panel table-panel">
            <div className="panel-header">
                <div>
                    <h2>Trade Blotter & Audit History</h2>
                    <p>Chronological record of purchase and sale transactions including back-dated entries</p>
                </div>
                <button className="btn primary" onClick={onOpenTradeModal}>
                    ＋ Record New Trade
                </button>
            </div>

            <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px' }}>
                ⓘ <b>Dynamic Ledger System:</b> Posting or deleting a trade automatically adjusts position quantities, weighted average cost basis, MTM P&L, multi-currency cash balances, and risk measures in real-time.
            </div>

            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Trade ID</th>
                            <th>Trade Date</th>
                            <th>Security</th>
                            <th>Side</th>
                            <th>Quantity</th>
                            <th>Execution Price</th>
                            <th>Gross Consideration</th>
                            <th>Currency</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trades.map((t) => {
                            const sym = getSymbol(t.currency);
                            const totalAmount = t.qty * t.price;

                            return (
                                <tr key={t.id}>
                                    <td><code style={{ fontSize: '11px', color: 'var(--text-dim)' }}>TRD-{t.id}</code></td>
                                    <td><b>{t.date}</b></td>
                                    <td>
                                        <div className="security">
                                            <div className="ticker">{t.symbol.slice(0, 2)}</div>
                                            <b>{t.symbol}</b>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`side ${t.side.toLowerCase()}`}>{t.side}</span>
                                    </td>
                                    <td><b>{formatMoney(t.qty, 0)}</b></td>
                                    <td>{sym}{formatMoney(t.price)}</td>
                                    <td><b>{sym}{formatMoney(totalAmount)}</b></td>
                                    <td><span className="risk-badge">{t.currency}</span></td>
                                    <td>
                                        <button
                                            className="btn secondary"
                                            style={{ padding: '2px 8px', fontSize: '11px', color: '#ef4444' }}
                                            onClick={() => onDeleteTrade(t.id)}
                                            title="Delete trade"
                                        >
                                            ✕ Remove
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
