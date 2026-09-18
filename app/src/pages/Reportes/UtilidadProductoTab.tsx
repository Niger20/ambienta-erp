import { IconSearch } from './icons';

interface UtilidadProductoTabProps {
    utilidadProductoSummary: { totalRev: number; totalCost: number; totalProfit: number; marginAvg: number };
    utilidadProductoSearch: string;
    setUtilidadProductoSearch: (v: string) => void;
    utilidadSortField: string;
    setUtilidadSortField: (v: any) => void;
    utilidadSortDirection: 'asc' | 'desc';
    setUtilidadSortDirection: (fn: (prev: 'asc' | 'desc') => 'asc' | 'desc') => void;
    filteredAndSortedUtilidadProducto: any[];
}

export const UtilidadProductoTab = ({
    utilidadProductoSummary, utilidadProductoSearch, setUtilidadProductoSearch,
    utilidadSortField, setUtilidadSortField, utilidadSortDirection, setUtilidadSortDirection,
    filteredAndSortedUtilidadProducto,
}: UtilidadProductoTabProps) => {
    const { totalRev, totalCost, totalProfit, marginAvg } = utilidadProductoSummary;

    return (
        <div className="card">
            {/* Summary boxes */}
            <div className="responsive-grid" style={{ marginBottom: '1.5rem' }}>
                <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Ventas Brutas</div>
                    <div className="tabular" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        C$ {totalRev.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Costo de Compras</div>
                    <div className="tabular" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-danger)' }}>
                        C$ {totalCost.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Utilidad Acumulada</div>
                    <div className="tabular" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-success)' }}>
                        C$ {totalProfit.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Margen de Utilidad Prom.</div>
                    <div className="tabular" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                        {marginAvg.toFixed(2)} %
                    </div>
                </div>
            </div>

            {/* Filter and sorting headers */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '300px', padding: '0 10px', gap: '8px', height: '36px', border: '2px solid var(--border-color)', borderRadius: '12px' }}>
                    <IconSearch />
                    <input type="text" placeholder="Buscar por producto..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }} value={utilidadProductoSearch} onChange={(e) => setUtilidadProductoSearch(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <span>Ordenar por:</span>
                    {[
                        { field: 'cantidadVendida', label: 'Cantidad' },
                        { field: 'totalGenerado', label: 'Ingresos' },
                        { field: 'utilidad', label: 'Utilidad' },
                        { field: 'margen', label: 'Margen %' }
                    ].map(col => (
                        <button
                            key={col.field}
                            className="btn"
                            onClick={() => {
                                setUtilidadSortField(col.field as any);
                                setUtilidadSortDirection(p => p === 'asc' ? 'desc' : 'asc');
                            }}
                            style={{
                                padding: '0.35rem 0.65rem',
                                fontSize: '0.78rem',
                                backgroundColor: utilidadSortField === col.field ? 'var(--accent-primary-bg)' : 'transparent',
                                color: utilidadSortField === col.field ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                border: `1px solid ${utilidadSortField === col.field ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                borderRadius: '6px',
                                fontWeight: utilidadSortField === col.field ? 600 : 400,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}
                        >
                            <span>{col.label}</span>
                            <span>{utilidadSortField === col.field ? (utilidadSortDirection === 'asc' ? '↑' : '↓') : ''}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                    <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Cod. Barra</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Producto</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Categoría</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Cant. Vendida</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Ingresos</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Costo Total</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Utilidad</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Margen</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAndSortedUtilidadProducto.map((p, i) => {
                        const isLoss = Number(p.utilidad) < 0;
                        const isGoodMargin = Number(p.margen) >= 30;
                        return (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }} className="tabular">{p.codigobarra || '—'}</td>
                                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{p.nombre}</td>
                                <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>{p.categoria || 'Sin Cat.'}</td>
                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', color: 'var(--accent-primary)', fontWeight: 600 }} className="tabular">{p.cantidadVendida}</td>
                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }} className="tabular">C$ {Number(p.totalGenerado).toFixed(2)}</td>
                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }} className="tabular">C$ {Number(p.totalCosto).toFixed(2)}</td>
                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700, color: isLoss ? 'var(--accent-danger)' : 'var(--accent-success)' }} className="tabular">
                                    C$ {Number(p.utilidad).toFixed(2)}
                                </td>
                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 600, color: isGoodMargin ? 'var(--accent-success)' : isLoss ? 'var(--accent-danger)' : 'var(--text-primary)' }} className="tabular">
                                    {Number(p.margen).toFixed(1)} %
                                </td>
                            </tr>
                        );
                    })}
                    {filteredAndSortedUtilidadProducto.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Sin registros en el rango.</td></tr>}
                </tbody>
            </table>
        </div>
    );
};
