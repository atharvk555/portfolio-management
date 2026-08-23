import React, { useState } from 'react';
import { Holding, Currency } from '../types';

interface HoldingsViewProps {
    holdings: Holding[];
    baseCurrency: Currency;
    convertToBase: (amount: number, currency: Currency) => number;
    onOpenTradeModal: () => void;
}

export const HoldingsView: React.FC<HoldingsViewProps> = ({
    holdings,
    baseCurrency,
    convertToBase,
    onOpenTradeModal
}) => {
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<keyof Holding>('currentValue');

    const getSymbol = (c: Currency) => ({ USD: '$', EUR: '€', GBP: '£', CHF: '₣', INR: '₹' })[c] || c;
    const baseSym = getSymbol(baseCurrency);

    const formatMoney = (n: number, decimals = 2) =>
        new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(n);

    const filtered = holdings.filter(h =>
        `${h.symbol} ${h.name} ${h.sector}`.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
        const valA = a[sortField] || 0;
        const valB = b[sortField] || 0;
        return valA > valB ? -1 : 1;
    });

    return (
        <section className="panel table-panel">
            <div className="panel-header">
                <div>
                    <h2>Security Holdings (MTM Valuation)</h2>
                    <p>Real-time valuation based on exchange feeds, FIFO cost basis, and holding periods</p>
                </div>
                <button className="btn primary" onClick={onOpenTradeModal}>
                    ＋ Record Trade Entry
                </button>
            </div>

            <div className="toolbar">
                <div className="search">
                    ⌕ <input
                        type="text"
                        placeholder="Filter by ticker, company, sector..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Base Reporting Currency: <b style={{ color: 'var(--text-main)' }}>{baseCurrency}</b>
                </div>
            </div>

            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => setSortField('symbol')} style={{ cursor: 'pointer' }}>Security</th>
                            <th onClick={() => setSortField('qty')} style={{ cursor: 'pointer' }}>Quantity</th>
                            <th onClick={() => setSortField('buyPrice')} style={{ cursor: 'pointer' }}>Cost Basis</th>
                            <th>Live MTM Price</th>
                            <th onClick={() => setSortField('currentValue')} style={{ cursor: 'pointer' }}>Current MTM Value ({baseCurrency})</th>
                            <th onClick={() => setSortField('pnl')} style={{ cursor: 'pointer' }}>Unrealized MTM P&L</th>
                            <th onClick={() => setSortField('pnlPct')} style={{ cursor: 'pointer' }}>Return %</th>
                            <th onClick={() => setSortField('holdingDays')} style={{ cursor: 'pointer' }}>Holding Period</th>
                            <th>Weight</th>
                            <th>Beta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((h) => {
                            const sym = getSymbol(h.currency);
                            const valBase = convertToBase(h.currentValue || 0, h.currency);
                            const pnlVal = h.pnl || 0;
                            const isPositive = pnlVal >= 0;

                            return (
                                <tr key={h.id}>
                                    <td>
                                        <div className="security">
                                            <div className="ticker">{h.symbol.slice(0, 2)}</div>
                                            <div>
                                                <b>{h.symbol}</b>
                                                <small>{h.name} • {h.sector}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td><b>{formatMoney(h.qty, 0)}</b></td>
                                    <td>{sym}{formatMoney(h.buyPrice)} <small style={{ color: 'var(--text-dim)' }}>{h.currency}</small></td>
                                    <td>
                                        <b>{sym}{formatMoney(h.currentPrice)}</b>
                                    </td>
                                    <td>
                                        <b>{baseSym}{formatMoney(valBase)}</b>
                                    </td>
                                    <td className={isPositive ? 'positive' : 'negative'} style={{ fontWeight: 600 }}>
                                        {isPositive ? '+' : '-'}{sym}{formatMoney(Math.abs(pnlVal))}
                                    </td>
                                    <td className={isPositive ? 'positive' : 'negative'} style={{ fontWeight: 600 }}>
                                        {isPositive ? '+' : ''}{(h.pnlPct || 0).toFixed(2)}%
                                    </td>
                                    <td>{h.holdingDays} days <small style={{ color: 'var(--text-dim)' }}>({h.buyDate})</small></td>
                                    <td><b>{(h.weight || 0).toFixed(1)}%</b></td>
                                    <td>
                                        <span className="risk-badge">{h.beta.toFixed(2)} β</span>
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
