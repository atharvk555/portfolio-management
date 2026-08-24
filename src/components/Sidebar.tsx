import React from 'react';

interface SidebarProps {
    currentPage: string;
    setPage: (page: string) => void;
    apiStatus: 'live' | 'fallback' | 'loading';
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, apiStatus }) => {
    const navItems = [
        { id: 'dashboard', label: 'Overview', icon: '▦' },
        { id: 'holdings', label: 'Holdings (MTM)', icon: '◫' },
        { id: 'trades', label: 'Trade Blotter', icon: '↔' },
        { id: 'cash', label: 'Cash & FX Matrix', icon: '¤' },
        { id: 'risk', label: 'Risk Analytics', icon: '◒' },
        { id: 'benchmarks', label: 'Benchmarks', icon: '⌁' },
        { id: 'dataflow', label: 'Data Integration Flow', icon: '◇' },
        { id: 'statement', label: 'Client Statement', icon: '📄' }
    ];

    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-mark">PMS</div>
                <div>
                    <div className="brand-title">Portfolio</div>
                    <div className="brand-sub">Reporting System</div>
                </div>
            </div>

            <div className="client-card">
                <div className="avatar">JS</div>
                <div>
                    <div className="client-name">John Smith</div>
                    <div className="client-id">Global Growth • PF-10001</div>
                </div>
                <span className="live-dot" title="System Active" />
            </div>

            <nav>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                        onClick={() => setPage(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <div className="feed-status">
                    <span className="status-pulse" />
                    Price Feed: <b style={{ color: apiStatus === 'live' ? '#10b981' : '#f59e0b', marginLeft: '4px' }}>
                        {apiStatus === 'live' ? 'LIVE API' : 'SIMULATED'}
                    </b>
                </div>
                <div className="sidebar-note">
                    Portfolio Management<br />
                    Reporting System
                </div>
            </div>
        </aside>
    );
};
