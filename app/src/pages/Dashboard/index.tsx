import { IconTrendUp, IconBox, IconTag, IconDollar, IconList, IconAlert, IconBar, Sk } from './icons';
import { useDashboardData } from './useDashboardData';

const Dashboard = () => {
    const { stats, recentTransactions, lowStockItems, inventoryByCategory, isLoading } = useDashboardData();

    // Max cost value for bar chart scale
    const maxCatCost = inventoryByCategory.length > 0 ? inventoryByCategory[0].costValue : 1;

    const fmt = (n: number) => `C$ ${n.toFixed(2)}`;

    return (
        <div className="page-container">

            {/* ── Page header ── */}
            <div className="dash-header">
                <h2 className="dash-header__title">Tablero de control</h2>
                <p className="dash-header__sub">Vista general del sistema Ambienta POS</p>
            </div>

            {/* ── Stat cards ── */}
            <div className="dashboard-stat-grid">

                {/* Ventas Totales */}
                <div
                    className="stat-card dash-card-animate"
                    style={{
                        '--stat-accent': 'var(--accent-primary)',
                        '--stat-accent-bg': 'var(--accent-primary-bg)',
                        '--stat-accent-border': 'var(--accent-primary-border)',
                        '--card-index': 0,
                    } as React.CSSProperties}
                >
                    <div className="stat-card__top">
                        <span className="stat-card__label">Ventas totales</span>
                        <span className="stat-card__icon"><IconTrendUp /></span>
                    </div>
                    {isLoading ? (
                        <>
                            <Sk w="72%" h="1.85rem" />
                            <Sk w="45%" h="0.7rem" />
                        </>
                    ) : (
                        <>
                            <div className="stat-card__value">{fmt(stats.totalSales)}</div>
                            <div className="stat-card__sub">Métrica histórica acumulada</div>
                        </>
                    )}
                </div>

                {/* Valor de Inventario */}
                <div
                    className="stat-card dash-card-animate"
                    style={{
                        '--stat-accent': 'var(--accent-success)',
                        '--stat-accent-bg': 'var(--accent-success-bg)',
                        '--stat-accent-border': 'var(--accent-success-border)',
                        '--card-index': 1,
                    } as React.CSSProperties}
                >
                    <div className="stat-card__top">
                        <span className="stat-card__label">Valor de inventario</span>
                        <span className="stat-card__icon"><IconBox /></span>
                    </div>
                    {isLoading ? (
                        <>
                            <Sk w="66%" h="1.85rem" />
                            <Sk w="55%" h="0.7rem" />
                        </>
                    ) : (
                        <>
                            <div className="stat-card__value">{fmt(stats.totalInventoryCost)}</div>
                            <div className="stat-card__sub">
                                Venta est.:{' '}
                                <span className="stat-card__sub--accent">{fmt(stats.totalInventorySale)}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Productos Activos */}
                <div
                    className="stat-card dash-card-animate"
                    style={{
                        '--stat-accent': '#a78bfa',
                        '--stat-accent-bg': 'rgba(167,139,250,0.08)',
                        '--stat-accent-border': 'rgba(167,139,250,0.2)',
                        '--card-index': 2,
                    } as React.CSSProperties}
                >
                    <div className="stat-card__top">
                        <span className="stat-card__label">Productos activos</span>
                        <span className="stat-card__icon"><IconTag /></span>
                    </div>
                    {isLoading ? (
                        <>
                            <Sk w="40%" h="1.85rem" />
                            <Sk w="50%" h="0.7rem" />
                        </>
                    ) : (
                        <>
                            <div className="stat-card__value" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '-0.03em' }}>
                                {stats.activeProducts}
                            </div>
                            <div className="stat-card__sub">
                                {stats.lowStockProducts > 0 ? (
                                    <span style={{ color: 'var(--accent-warning)' }}>
                                        {stats.lowStockProducts} con stock bajo
                                    </span>
                                ) : (
                                    <span style={{ color: 'var(--accent-success)' }}>Stock en orden</span>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Pagos Totales */}
                <div
                    className="stat-card dash-card-animate"
                    style={{
                        '--stat-accent': 'var(--accent-danger)',
                        '--stat-accent-bg': 'var(--accent-danger-bg)',
                        '--stat-accent-border': 'var(--accent-danger-border)',
                        '--card-index': 3,
                    } as React.CSSProperties}
                >
                    <div className="stat-card__top">
                        <span className="stat-card__label">Pagos totales</span>
                        <span className="stat-card__icon"><IconDollar /></span>
                    </div>
                    {isLoading ? (
                        <>
                            <Sk w="68%" h="1.85rem" />
                            <Sk w="48%" h="0.7rem" />
                        </>
                    ) : (
                        <>
                            <div className="stat-card__value">{fmt(stats.totalExpenses)}</div>
                            <div className="stat-card__sub">
                                Pendiente:{' '}
                                <span style={{ color: stats.pendingExpenses > 0 ? 'var(--accent-danger)' : 'var(--text-secondary)' }}>
                                    {fmt(stats.pendingExpenses)}
                                </span>
                            </div>
                        </>
                    )}
                </div>

            </div>

            {/* ── Bottom panels ── */}
            <div className="dashboard-bottom-grid">

                {/* Transacciones Recientes */}
                <div className="dash-panel dash-card-animate" style={{ '--card-index': 4 } as React.CSSProperties}>
                    <div className="dash-panel__header">
                        <span className="dash-panel__title">
                            <IconList /> &nbsp;Transacciones recientes
                        </span>
                        <span className="dash-panel__badge">últimas 5</span>
                    </div>

                    {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {[0, 1, 2, 3, 4].map(i => (
                                <div key={i} className="dash-skeleton-row">
                                    <Sk w="40%" h="0.8rem" />
                                    <Sk w="20%" h="0.7rem" />
                                    <Sk w="22%" h="0.8rem" />
                                </div>
                            ))}
                        </div>
                    ) : recentTransactions.length === 0 ? (
                        <div className="dash-empty">
                            <svg className="dash-empty__icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                <line x1="8" y1="21" x2="16" y2="21" />
                                <line x1="12" y1="17" x2="12" y2="21" />
                            </svg>
                            <p className="dash-empty__text">Sin transacciones registradas</p>
                        </div>
                    ) : (
                        <div className="dash-tx-list">
                            {recentTransactions.map(tx => (
                                <div key={tx.id} className="dash-tx-row">
                                    <div>
                                        <div className="dash-tx-row__id">Venta #{tx.id}</div>
                                        <div className="dash-tx-row__type">{tx.tipoventa || '—'}</div>
                                    </div>
                                    <div className="dash-tx-row__date">
                                        {new Date(tx.fecha).toLocaleDateString('es-NI', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="dash-tx-row__amount">+{fmt(Number(tx.total))}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Alertas de bajo stock */}
                <div className="dash-panel dash-card-animate" style={{ '--card-index': 5 } as React.CSSProperties}>
                    <div className="dash-panel__header">
                        <span className="dash-panel__title">
                            <IconAlert /> &nbsp;Stock bajo
                        </span>
                        {!isLoading && lowStockItems.length > 0 && (
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '999px', background: 'var(--accent-warning-bg)', color: 'var(--accent-warning)', border: '1px solid var(--accent-warning-border)' }}>
                                {lowStockItems.length}
                            </span>
                        )}
                    </div>

                    {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[0, 1, 2, 3].map(i => (
                                <Sk key={i} w="100%" h="2rem" />
                            ))}
                        </div>
                    ) : lowStockItems.length === 0 ? (
                        <div className="dash-empty">
                            <svg className="dash-empty__icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <p className="dash-empty__text">Inventario en orden</p>
                        </div>
                    ) : (
                        <div className="dash-alert-list">
                            {lowStockItems.map(item => {
                                const isCritical = (item.stockactual || 0) === 0;
                                return (
                                    <div
                                        key={item.id}
                                        className={`dash-alert-chip${isCritical ? ' dash-alert-chip--critical' : ''}`}
                                    >
                                        <span className="dash-alert-chip__name">{item.nombre}</span>
                                        <span className="dash-alert-chip__stock">
                                            {item.stockactual || 0}/{item.stockminimo || 5}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Inventario por Categoría — bar chart */}
                <div className="dash-panel dash-card-animate" style={{ '--card-index': 6 } as React.CSSProperties}>
                    <div className="dash-panel__header">
                        <span className="dash-panel__title">
                            <IconBar /> &nbsp;Inventario por categoría
                        </span>
                        <span className="dash-panel__badge">costo</span>
                    </div>

                    {isLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Sk w="38%" h="0.75rem" />
                                        <Sk w="22%" h="0.75rem" />
                                    </div>
                                    <Sk w="100%" h="5px" />
                                </div>
                            ))}
                        </div>
                    ) : inventoryByCategory.length === 0 ? (
                        <div className="dash-empty">
                            <svg className="dash-empty__icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <line x1="3" y1="9" x2="21" y2="9" />
                                <line x1="9" y1="21" x2="9" y2="9" />
                            </svg>
                            <p className="dash-empty__text">Sin categorías para mostrar</p>
                        </div>
                    ) : (
                        <div className="inv-chart">
                            {inventoryByCategory.map((cat, idx) => {
                                const pct = Math.max(4, (cat.costValue / maxCatCost) * 100);
                                const fillClass =
                                    idx === 0 ? 'inv-chart__fill' :
                                    idx === 1 ? 'inv-chart__fill inv-chart__fill--success' :
                                    'inv-chart__fill inv-chart__fill--warning';
                                return (
                                    <div key={cat.name} className="inv-chart__row">
                                        <div className="inv-chart__labels">
                                            <span className="inv-chart__name">{cat.name}</span>
                                            <span className="inv-chart__amount">{fmt(cat.costValue)}</span>
                                        </div>
                                        <div className="inv-chart__track">
                                            <div className={fillClass} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
