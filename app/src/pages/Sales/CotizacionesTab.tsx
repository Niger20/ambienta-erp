import type { Venta } from './types';
import { getSaleClientName } from './types';

interface CotizacionesTabProps {
    cotizacionSearch: string;
    setCotizacionSearch: (v: string) => void;
    cotizacionesList: Venta[];
    openFacturarModal: (c: Venta) => Promise<void>;
    openVentaDetalleModal: (ventaId: number) => Promise<void>;
    handleAnularCotizacion: (c: Venta) => Promise<void>;
}

export const CotizacionesTab = ({
    cotizacionSearch, setCotizacionSearch, cotizacionesList,
    openFacturarModal, openVentaDetalleModal, handleAnularCotizacion,
}: CotizacionesTabProps) => {
    return (
        <div className="tab-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <div>
                    <h3 className="card-title" style={{ margin: 0 }}>Cotizaciones & Proformas</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                        Cotizaciones generadas desde el Punto de Venta. Puedes facturarlas directamente o anularlas/archivarlas.
                    </p>
                </div>
                <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '300px', padding: '0 10px', gap: '8px', height: '36px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input
                        type="text"
                        placeholder="Buscar cotización o cliente..."
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }}
                        value={cotizacionSearch}
                        onChange={(e) => setCotizacionSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Cotizaciones Pendientes</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'rgb(234, 179, 8)', marginTop: '0.25rem' }}>{cotizacionesList.length}</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Monto Total Cotizado</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '0.25rem' }}>
                        C$ {cotizacionesList.reduce((sum, c) => sum + Number(c.total || 0), 0).toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Cotizaciones Table */}
            <div className="table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}># Proforma</th>
                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Fecha</th>
                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Cliente</th>
                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Lugar</th>
                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Total Cotizado</th>
                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cotizacionesList.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                                    <div style={{ fontWeight: 600 }}>No hay cotizaciones pendientes</div>
                                    <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Las ventas guardadas con método "Cotización" en el Punto de Venta aparecerán aquí.</div>
                                </td>
                            </tr>
                        ) : (
                            cotizacionesList.map(c => {
                                const vid = c.id ?? c.ventaid;
                                const clienteNombre = getSaleClientName(c);
                                return (
                                    <tr key={vid} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>
                                            <span style={{ backgroundColor: 'rgba(234, 179, 8, 0.12)', color: 'rgb(234, 179, 8)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                                                #{vid}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>
                                            {new Date(c.fecha).toLocaleString('es-NI')}
                                        </td>
                                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>
                                            {clienteNombre}
                                        </td>
                                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                            {c.lugarventa || 'NORMAL'}
                                        </td>
                                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.95rem' }}>
                                            C$ {Number(c.total).toFixed(2)}
                                        </td>
                                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => openFacturarModal(c)}
                                                    style={{
                                                        padding: '0.35rem 0.75rem',
                                                        fontSize: '0.8rem',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                        backgroundColor: 'var(--accent-success)',
                                                        borderColor: 'var(--accent-success)',
                                                        color: '#ffffff'
                                                    }}
                                                    title="Facturar esta cotización"
                                                >
                                                    <span>Facturar</span>
                                                </button>
                                                <button
                                                    className="btn"
                                                    onClick={() => openVentaDetalleModal(vid!)}
                                                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                                                    title="Ver detalle de productos"
                                                >
                                                    Ver Detalle
                                                </button>
                                                <button
                                                    className="btn"
                                                    onClick={() => handleAnularCotizacion(c)}
                                                    style={{
                                                        padding: '0.35rem 0.65rem',
                                                        fontSize: '0.8rem',
                                                        color: 'var(--accent-danger)',
                                                        border: '1px solid var(--accent-danger-border)',
                                                        backgroundColor: 'var(--accent-danger-bg)'
                                                    }}
                                                    title="Archivar / Anular Cotización"
                                                >
                                                    Archivar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
