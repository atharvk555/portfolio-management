import React from 'react';
import { ClientAccount, Holding, Currency, RealizedTradeLastDay } from '../types';

interface ClientStatementViewProps {
    accounts: ClientAccount[];
    selectedAccountId: string;
    setSelectedAccountId: (id: string) => void;
    holdings: Holding[];
    baseCurrency: Currency;
    fxRates: Record<Currency, number>;
    convertToBase: (amount: number, currency: Currency) => number;
    realizedTradesLastDay: RealizedTradeLastDay[];
}

export const ClientStatementView: React.FC<ClientStatementViewProps> = ({
    accounts,
    selectedAccountId,
    setSelectedAccountId,
    holdings,
    baseCurrency,
    convertToBase,
    realizedTradesLastDay
}) => {
    const selectedAccount = accounts.find(a => a.id === selectedAccountId) || accounts[0];
    const isConsolidated = selectedAccountId === 'ALL';

    const getSymbol = (c: Currency) => ({ USD: '$', EUR: '€', GBP: '£', CHF: '₣', INR: '₹' })[c] || c;
    const currentSym = isConsolidated ? getSymbol(baseCurrency) : getSymbol(selectedAccount.currency);
    const activeCurrency = isConsolidated ? baseCurrency : selectedAccount.currency;

    const formatNum = (n: number, decimals = 2) =>
        new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);

    const todayStr = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    }).replace(/\//g, '-');

    // Filter holdings for active statement view
    const activeHoldings = isConsolidated
        ? holdings
        : holdings.filter(h => h.accountId === selectedAccountId);

    // Totals calculations
    let totalCostAmount = 0;
    let totalMarketValue = 0;
    let totalUnrealizedGain = 0;

    activeHoldings.forEach(h => {
        const cost = (h.qty * h.buyPrice);
        const mkt = (h.qty * h.currentPrice);
        const costConverted = isConsolidated ? convertToBase(cost, h.currency) : cost;
        const mktConverted = isConsolidated ? convertToBase(mkt, h.currency) : mkt;

        totalCostAmount += costConverted;
        totalMarketValue += mktConverted;
        totalUnrealizedGain += (mktConverted - costConverted);
    });

    const totalPnlPct = totalCostAmount > 0 ? (totalUnrealizedGain / totalCostAmount) * 100 : 0;

    // Account cash & equity calculations
    const availableBal = isConsolidated
        ? accounts.reduce((acc, a) => acc + convertToBase(a.availableBalance, a.currency), 0)
        : selectedAccount.availableBalance;

    const immatureBal = isConsolidated
        ? accounts.reduce((acc, a) => acc + convertToBase(a.immatureBalance, a.currency), 0)
        : selectedAccount.immatureBalance;

    const ledgerBal = availableBal + immatureBal;

    const totalDeposit = isConsolidated
        ? accounts.reduce((acc, a) => acc + convertToBase(a.totalDeposit, a.currency), 0)
        : selectedAccount.totalDeposit;

    const totalWithdraw = isConsolidated
        ? accounts.reduce((acc, a) => acc + convertToBase(a.totalWithdraw, a.currency), 0)
        : selectedAccount.totalWithdraw;

    const netDeposit = totalDeposit - totalWithdraw;

    const netAssetValue = totalMarketValue + ledgerBal;
    const equity = netAssetValue;
    const purchasingPower = availableBal;

    const realizedGainLastDay = isConsolidated
        ? accounts.reduce((acc, a) => acc + convertToBase(a.realizedGainLastDay, a.currency), 0)
        : selectedAccount.realizedGainLastDay;

    const netGainLoss = realizedGainLastDay + totalUnrealizedGain;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
            {/* Top Account Control Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'var(--bg-panel)', padding: '14px 20px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <b style={{ fontSize: '13px', color: 'var(--text-muted)' }}>SELECT ACCOUNT STATEMENT:</b>
                    <select
                        value={selectedAccountId}
                        onChange={(e) => setSelectedAccountId(e.target.value)}
                        style={{ background: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border-bright)', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                    >
                        <option value="ALL">🌐 CONSOLIDATED STATEMENT (ALL ACCOUNTS)</option>
                        {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                                Account #{acc.id} - {acc.accountName} ({acc.currency})
                            </option>
                        ))}
                    </select>
                </div>

                <button className="btn primary" onClick={handlePrint}>
                    🖨️ Print / Save Statement
                </button>
            </div>

            {/* Official Institutional Statement Box */}
            <div
                className="panel"
                style={{
                    background: '#ffffff',
                    color: '#000000',
                    borderRadius: '0px',
                    padding: '28px 36px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '11px',
                    lineHeight: '1.3'
                }}
            >
                {/* Header Block matching Image */}
                <div style={{ textAlign: 'center', marginBottom: '16px', borderBottom: '1px solid #000', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <div style={{ background: '#006633', color: '#fff', fontWeight: 'bold', fontSize: '18px', padding: '2px 8px', borderRadius: '2px', letterSpacing: '1px' }}>
                            SASL / UBS
                        </div>
                        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            SOUTH ASIA SECURITIES LTD.
                        </h1>
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#333' }}>
                        Dual TREC Holder (DSE-258 & CSE-004) / UBS Wealth Management Alliance
                    </div>
                    <div style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>
                        Nascent Tower (2nd Floor), 806/A, Agrabad C/A, Chittagong-4100
                    </div>
                    <div style={{ fontSize: '10px', color: '#555' }}>
                        Phone: 02333313309, 02333313160 | Mobile & Whatsapp: 01711-429074 | Email: sasl04bd@gmail.com
                    </div>
                </div>

                {/* Title & Metadata Grid matching Image */}
                <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', margin: '12px 0 16px 0', textDecoration: 'underline', letterSpacing: '0.5px' }}>
                    CLIENT WISE PORTFOLIO STATEMENT
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '11px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                    <div>
                        <div style={{ marginBottom: '3px' }}><b>Client Code</b> : {isConsolidated ? '9056 (ALL)' : selectedAccount.clientCode}</div>
                        <div><b>Name</b> : {selectedAccount.clientName}</div>
                        {!isConsolidated && <div style={{ marginTop: '3px' }}><b>Account Name</b> : {selectedAccount.accountName}</div>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ marginBottom: '3px' }}><b>BO ID</b> : {selectedAccount.boId}</div>
                        <div style={{ marginBottom: '3px' }}><b>As On</b> : {todayStr}</div>
                        <div><b>Type</b> : {isConsolidated ? 'Multi-Account Consolidated' : selectedAccount.type} ({activeCurrency})</div>
                    </div>
                </div>

                {/* Main 14-Column Holdings Table matching Image */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', marginBottom: '14px', border: '1px solid #000' }}>
                    <thead>
                        <tr style={{ background: '#f2f2f2', borderBottom: '1px solid #000', textAlign: 'center', fontWeight: 'bold' }}>
                            <th style={{ border: '1px solid #000', padding: '5px 4px', textAlign: 'left' }}>Company Name</th>
                            <th style={{ border: '1px solid #000', padding: '5px 2px' }}>Category</th>
                            <th style={{ border: '1px solid #000', padding: '5px 4px' }}>Total Qty.</th>
                            <th style={{ border: '1px solid #000', padding: '5px 4px' }}>Lock Qty.</th>
                            <th style={{ border: '1px solid #000', padding: '5px 4px' }}>Lien Qty.</th>
                            <th style={{ border: '1px solid #000', padding: '5px 4px' }}>Saleable Qty.</th>
                            <th style={{ border: '1px solid #000', padding: '5px 4px' }}>Avg. Rate</th>
                            <th style={{ border: '1px solid #000', padding: '5px 4px' }}>Cost Amount</th>
                            <th style={{ border: '1px solid #000', padding: '5px 4px' }}>Market Price</th>
                            <th style={{ border: '1px solid #000', padding: '5px 4px' }}>Market Value</th>
                            <th style={{ border: '1px solid #000', padding: '5px 4px' }}>Receive Qty.</th>
                            <th style={{ border: '1px solid #000', padding: '5px 4px' }}>Deliver Qty.</th>
                            <th style={{ border: '1px solid #000', padding: '5px 4px' }}>Unrealize Gain/Loss</th>
                            <th style={{ border: '1px solid #000', padding: '5px 4px' }}>% Gain /Loss</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeHoldings.map((h) => {
                            const cost = h.qty * h.buyPrice;
                            const mkt = h.qty * h.currentPrice;
                            const costDisp = isConsolidated ? convertToBase(cost, h.currency) : cost;
                            const mktDisp = isConsolidated ? convertToBase(mkt, h.currency) : mkt;
                            const pnl = mktDisp - costDisp;
                            const pnlPct = costDisp > 0 ? (pnl / costDisp) * 100 : 0;
                            const lock = h.lockQty || 0;
                            const lien = h.lienQty || 0;
                            const saleable = h.saleableQty || (h.qty - lock - lien);

                            return (
                                <tr key={h.id} style={{ borderBottom: '1px solid #ccc' }}>
                                    <td style={{ border: '1px solid #ddd', padding: '4px 6px', textAlign: 'left', fontWeight: 'bold' }}>
                                        {h.name} <span style={{ color: '#555', fontWeight: 'normal' }}>({h.symbol})</span>
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'center' }}>{h.category || 'A'}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'right' }}>{formatNum(h.qty, 0)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'right' }}>{lock > 0 ? lock : ''}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'right' }}>{lien > 0 ? lien : ''}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'right' }}>{formatNum(saleable, 0)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'right' }}>{formatNum(h.buyPrice)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'right' }}>{formatNum(costDisp)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'right' }}>{formatNum(h.currentPrice)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>{formatNum(mktDisp)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'right' }}>{h.receiveQty || h.qty}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'right' }}>{h.deliverQty || 0}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'right', color: pnl >= 0 ? '#006600' : '#cc0000', fontWeight: 'bold' }}>
                                        {formatNum(pnl)}
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'right', color: pnlPct >= 0 ? '#006600' : '#cc0000' }}>
                                        {formatNum(pnlPct)}
                                    </td>
                                </tr>
                            );
                        })}
                        {/* Table Totals Row */}
                        <tr style={{ background: '#f9f9f9', fontWeight: 'bold', borderTop: '2px solid #000' }}>
                            <td colSpan={7} style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>Total ({activeCurrency}):</td>
                            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{formatNum(totalCostAmount)}</td>
                            <td style={{ border: '1px solid #000', padding: '6px' }}></td>
                            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{formatNum(totalMarketValue)}</td>
                            <td colSpan={2} style={{ border: '1px solid #000', padding: '6px' }}></td>
                            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', color: totalUnrealizedGain >= 0 ? '#006600' : '#cc0000' }}>
                                {formatNum(totalUnrealizedGain)}
                            </td>
                            <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', color: totalPnlPct >= 0 ? '#006600' : '#cc0000' }}>
                                {formatNum(totalPnlPct)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Account Status & Valuation Grid matching Bottom of Image */}
                <div style={{ marginTop: '16px', borderTop: '1px solid #000', paddingTop: '12px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '8px' }}>Account Status Till Today</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', fontSize: '10px' }}>
                        {/* Left Box: Balances & Cash Status */}
                        <div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '3px 0' }}>Available Balance</td>
                                        <td style={{ textAlign: 'right', padding: '3px 0', fontWeight: 'bold' }}>: {currentSym}{formatNum(availableBal)}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '3px 0' }}>Immature Balance</td>
                                        <td style={{ textAlign: 'right', padding: '3px 0' }}>: {currentSym}{formatNum(immatureBal)}</td>
                                    </tr>
                                    <tr style={{ borderTop: '1px dashed #ccc' }}>
                                        <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Ledger Balance</td>
                                        <td style={{ textAlign: 'right', padding: '4px 0', fontWeight: 'bold' }}>: {currentSym}{formatNum(ledgerBal)}</td>
                                    </tr>
                                    <tr><td colSpan={2} style={{ padding: '4px 0', fontWeight: 'bold', textDecoration: 'underline' }}>Deposit Withdraw Status</td></tr>
                                    <tr>
                                        <td style={{ padding: '3px 0' }}>Total Deposit</td>
                                        <td style={{ textAlign: 'right', padding: '3px 0' }}>: {currentSym}{formatNum(totalDeposit)}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '3px 0' }}>Total Withdraw</td>
                                        <td style={{ textAlign: 'right', padding: '3px 0' }}>: {currentSym}{formatNum(totalWithdraw)}</td>
                                    </tr>
                                    <tr style={{ borderTop: '1px dashed #ccc' }}>
                                        <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Current Deposit Total</td>
                                        <td style={{ textAlign: 'right', padding: '4px 0', fontWeight: 'bold' }}>: {currentSym}{formatNum(netDeposit)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Right Box: Market Values & Capital Gain */}
                        <div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '3px 0' }}>Market Value of Securities</td>
                                        <td style={{ textAlign: 'right', padding: '3px 0', fontWeight: 'bold' }}>: {currentSym}{formatNum(totalMarketValue)}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '3px 0' }}>Net Asset Value (NAV)</td>
                                        <td style={{ textAlign: 'right', padding: '3px 0' }}>: {currentSym}{formatNum(netAssetValue)}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '3px 0' }}>Equity</td>
                                        <td style={{ textAlign: 'right', padding: '3px 0', fontWeight: 'bold' }}>: {currentSym}{formatNum(equity)}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '3px 0' }}>Purchase Power</td>
                                        <td style={{ textAlign: 'right', padding: '3px 0' }}>: {currentSym}{formatNum(purchasingPower)}</td>
                                    </tr>
                                    <tr><td colSpan={2} style={{ padding: '4px 0', fontWeight: 'bold', textDecoration: 'underline' }}>Capital Gain</td></tr>
                                    <tr>
                                        <td style={{ padding: '3px 0' }}>Realized Gain/Loss</td>
                                        <td style={{ textAlign: 'right', padding: '3px 0' }}>: {currentSym}{formatNum(realizedGainLastDay)}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '3px 0' }}>Unrealized Capital Gain/Loss</td>
                                        <td style={{ textAlign: 'right', padding: '3px 0' }}>: {currentSym}{formatNum(totalUnrealizedGain)}</td>
                                    </tr>
                                    <tr style={{ borderTop: '1px dashed #ccc' }}>
                                        <td style={{ padding: '4px 0', fontWeight: 'bold' }}>Net Gain/Loss</td>
                                        <td style={{ textAlign: 'right', padding: '4px 0', fontWeight: 'bold', color: netGainLoss >= 0 ? '#006600' : '#cc0000' }}>
                                            : {currentSym}{formatNum(netGainLoss)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '3px 0' }}>Gain/Loss From last day</td>
                                        <td style={{ textAlign: 'right', padding: '3px 0', fontWeight: 'bold' }}>: {currentSym}{formatNum(realizedGainLastDay)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Details Gain/Loss from Last Transaction Day Table matching Image */}
                <div style={{ marginTop: '18px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '6px' }}>
                        Details gain/loss from last transaction day ( 19-12-21 ) :
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', border: '1px solid #000' }}>
                        <thead>
                            <tr style={{ background: '#f2f2f2', borderBottom: '1px solid #000' }}>
                                <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>Company Name</th>
                                <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>Sale Qty</th>
                                <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>Sale Rate</th>
                                <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>Commission</th>
                                <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>Details Buy Rate</th>
                                <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>Gain/Loss</th>
                            </tr>
                        </thead>
                        <tbody>
                            {realizedTradesLastDay.map((t) => (
                                <tr key={t.id}>
                                    <td style={{ border: '1px solid #ddd', padding: '4px' }}>{t.companyName}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'right' }}>{formatNum(t.saleQty, 0)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'right' }}>{formatNum(t.saleRate)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'right' }}>{formatNum(t.commission)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px' }}>{t.buyRateDetails}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '4px', textAlign: 'right', fontWeight: 'bold', color: t.gainLoss >= 0 ? '#006600' : '#cc0000' }}>
                                        {formatNum(t.gainLoss)}
                                    </td>
                                </tr>
                            ))}
                            <tr style={{ fontWeight: 'bold', background: '#f9f9f9' }}>
                                <td colSpan={5} style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>Total:</td>
                                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right', color: '#006600' }}>
                                    {formatNum(realizedGainLastDay)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div style={{ marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #ddd', textAlign: 'center', fontSize: '9px', color: '#777' }}>
                    Software Solution by : UBS & E-Vision Systems • System Generated Report • Page Size: A4 Landscape
                </div>
            </div>
        </div>
    );
};
