import React, { useState, useEffect } from 'react';
import { Side, Currency, Trade } from '../types';
import { fetchLiveQuote, searchSecurityMaster } from '../services/marketData';

interface TradeModalProps {
    onClose: () => void;
    onSave: (trade: Omit<Trade, 'id'>) => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({ onClose, onSave }) => {
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [symbol, setSymbol] = useState('AAPL');
    const [side, setSide] = useState<Side>('BUY');
    const [qty, setQty] = useState(10);
    const [price, setPrice] = useState(228.70);
    const [currency, setCurrency] = useState<Currency>('USD');
    const [sector, setSector] = useState('Technology');
    const [name, setName] = useState('Apple Inc.');
    const [loadingQuote, setLoadingQuote] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Auto-fetch price when ticker changes
    useEffect(() => {
        let active = true;
        const updatePrice = async () => {
            if (!symbol.trim()) return;
            setLoadingQuote(true);
            const res = await fetchLiveQuote(symbol);
            if (active) {
                if (res.price) setPrice(res.price);
                setLoadingQuote(false);
            }
        };

        const searchMatch = searchSecurityMaster(symbol)[0];
        if (searchMatch) {
            setName(searchMatch.name);
            setCurrency(searchMatch.currency as Currency);
            setSector(searchMatch.sector);
        }

        const timer = setTimeout(updatePrice, 400);
        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [symbol]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (qty <= 0) {
            setErrorMsg('Quantity must be greater than zero');
            return;
        }
        if (price <= 0) {
            setErrorMsg('Price must be greater than zero');
            return;
        }

        onSave({
            date,
            symbol: symbol.toUpperCase().trim(),
            side,
            qty: Number(qty),
            price: Number(price),
            currency,
            name,
            sector
        });
    };

    const grossAmount = qty * price;
    const getSymbol = (c: Currency) => ({ USD: '$', EUR: '€', GBP: '£', CHF: '₣', INR: '₹' })[c] || c;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <div className="modal-head">
                    <div>
                        <div className="card-label">MANUAL TRADE ENTRY</div>
                        <h2>Record Purchase / Sale</h2>
                    </div>
                    <button className="close" onClick={onClose}>×</button>
                </div>

                {errorMsg && (
                    <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: '6px', marginBottom: '12px', fontSize: '12px' }}>
                        ⚠️ {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <label>
                            Trade Date (Supports Back-Dating)
                            <input
                                type="date"
                                value={date}
                                max={new Date().toISOString().slice(0, 10)}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Ticker Symbol
                            <input
                                type="text"
                                value={symbol}
                                placeholder="e.g. AAPL, NVDA, TSLA"
                                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                                required
                            />
                        </label>

                        <label>
                            Transaction Side
                            <select value={side} onChange={(e) => setSide(e.target.value as Side)}>
                                <option value="BUY">BUY (+ Long Position)</option>
                                <option value="SELL">SELL (- Reduce Position)</option>
                            </select>
                        </label>

                        <label>
                            Quantity (Shares / Units)
                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={qty}
                                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 0))}
                                required
                            />
                        </label>

                        <label>
                            Execution Price {loadingQuote && <span style={{ color: '#3b82f6', fontSize: '10px' }}>(Fetching API...)</span>}
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={price}
                                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                                required
                            />
                        </label>

                        <label>
                            Trade Currency
                            <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="CHF">CHF (₣)</option>
                                <option value="INR">INR (₹)</option>
                            </select>
                        </label>
                    </div>

                    <div className="trade-preview">
                        <span>Gross Consideration:</span>
                        <b style={{ fontSize: '16px', color: side === 'BUY' ? '#ef4444' : '#10b981' }}>
                            {side === 'BUY' ? '-' : '+'}{getSymbol(currency)}{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(grossAmount)} {currency}
                        </b>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn primary">
                            Post Trade to Ledger
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
