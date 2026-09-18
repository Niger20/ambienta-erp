import { IconFilePdf } from './icons';
import type { Venta } from './types';
import { getSaleClientName } from './types';

interface SalesTabProps {
    isLoading: boolean;
    error: string;
    saleSearchQuery: string;
    setSaleSearchQuery: (v: string) => void;
    saleStatusFilter: string;
    setSaleStatusFilter: React.Dispatch<React.SetStateAction<string>>;
    paginatedSales: Venta[];
    filteredSales: Venta[];
    salesPage: number;
    setSalesPage: (page: number) => void;
    totalSalesPages: number;
    exportVentaDetallePDF: (sale: Venta) => Promise<void>;
    handleVoidSale: (id: number) => Promise<void>;
}

export const SalesTab = ({
    isLoading, error, saleSearchQuery, setSaleSearchQuery, saleStatusFilter, setSaleStatusFilter,
    paginatedSales, filteredSales, salesPage, setSalesPage, totalSalesPages,
    exportVentaDetallePDF, handleVoidSale,
}: SalesTabProps) => {
    return (
        <div className="tab-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '300px', padding: '0 10px', gap: '8px', height: '36px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Buscar por ID o cliente..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }} value={saleSearchQuery} onChange={(e) => setSaleSearchQuery(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                        onClick={() => setSaleStatusFilter((prev: string) => prev === 'active' ? 'inactive' : 'active')}
                        className={`status-switch-toggle ${saleStatusFilter === 'active' ? 'status-switch-toggle--active' : 'status-switch-toggle--inactive'}`}
                        title="Clic para alternar filtro (Activos / Inactivos)"
                    >
                        <div className={`status-switch-handle ${saleStatusFilter === 'active' ? 'status-switch-handle--active' : 'status-switch-handle--inactive'}`} />
                    </div>
                </div>
            </div>

            {isLoading ? <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando ventas...</div>
                : error ? <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-danger)' }}>{error}</div>
                    : (
                        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                            <table style={{ minWidth: '950px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                        <th style={{ padding: '1rem 0', fontWeight: 500 }}>ID</th>
                                        <th style={{ padding: '1rem 0', fontWeight: 500 }}>Consecutivo</th>
                                        <th style={{ padding: '1rem 0', fontWeight: 500 }}>Fecha</th>
                                        <th style={{ padding: '1rem 0', fontWeight: 500 }}>Cliente</th>
                                        <th style={{ padding: '1rem 0', fontWeight: 500 }}>Tipo</th>
                                        <th style={{ padding: '1rem 0', fontWeight: 500 }}>Método</th>
                                        <th style={{ padding: '1rem 0', fontWeight: 500 }}>Total</th>
                                        <th style={{ padding: '1rem 0', fontWeight: 500 }}>Estado</th>
                                        <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedSales.map((sale: Venta) => {
                                        const isAnulada = sale.estado === false || sale.estado === 'ANULADA' || !!(sale as any)._anulada;
                                        return (
                                            <tr key={`${sale.id}-${isAnulada}`} style={{ borderBottom: '1px solid var(--border-color)', opacity: isAnulada ? 0.6 : 1 }}>
                                                <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>#{sale.id}</td>
                                                <td style={{ padding: '1rem 0' }}>
                                                    {sale.consecutivofiscal ? (
                                                        <span style={{ color: 'var(--accent-primary)', backgroundColor: 'var(--accent-primary-bg)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700 }}>
                                                            {sale.consecutivofiscal}
                                                        </span>
                                                    ) : sale.consecutivonofiscal ? (
                                                        <span style={{ color: '#0284c7', backgroundColor: 'rgba(2, 132, 199, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700 }}>
                                                            {sale.consecutivonofiscal}
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', opacity: 0.7 }}>
                                                            Sin consecutivo
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '1rem 0' }}>{new Date(sale.fecha).toLocaleDateString()}</td>
                                                <td style={{ padding: '1rem 0' }}>{getSaleClientName(sale)}</td>
                                                <td style={{ padding: '1rem 0' }}>
                                                    <span style={{ color: sale.tipoventa === 'CREDITO' ? '#dc2626' : 'var(--accent-primary)', backgroundColor: sale.tipoventa === 'CREDITO' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                                                        {sale.tipoventa}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem 0', textTransform: 'capitalize' }}>{sale.metodopago}</td>
                                                <td style={{ padding: '1rem 0', fontWeight: 500 }}>C$ {Number(sale.total).toFixed(2)}</td>
                                                <td style={{ padding: '1rem 0' }}>
                                                    {isAnulada ? (
                                                        <span style={{ color: 'var(--accent-danger)', backgroundColor: 'rgba(239,68,68,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>ANULADA</span>
                                                    ) : (
                                                        <span style={{ color: 'var(--accent-success)', backgroundColor: 'rgba(16,185,129,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>ACTIVA</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                        <button className="btn" onClick={() => exportVentaDetallePDF(sale)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                                            <IconFilePdf />
                                                            <span>Detalle</span>
                                                        </button>
                                                        {!isAnulada && (
                                                            <button className="btn" onClick={() => handleVoidSale(sale.id)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)' }}>
                                                                Anular
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredSales.length === 0 && <tr><td colSpan={9} style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No se encontraron registros de ventas.</td></tr>}
                                </tbody>
                            </table>
                            {totalSalesPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button
                                        type="button"
                                        className="btn"
                                        disabled={salesPage === 1}
                                        onClick={() => setSalesPage(salesPage - 1)}
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
                                    >
                                        Anterior
                                    </button>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        Página {salesPage} de {totalSalesPages}
                                    </span>
                                    <button
                                        type="button"
                                        className="btn"
                                        disabled={salesPage === totalSalesPages}
                                        onClick={() => setSalesPage(salesPage + 1)}
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
        </div>
    );
};
