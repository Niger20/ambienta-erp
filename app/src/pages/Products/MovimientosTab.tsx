import { IconSearch, IconPlus, IconFilePdf } from './icons';
import type { Movimiento } from './types';

interface MovimientosTabProps {
    movSearch: string;
    setMovSearch: (v: string) => void;
    onOpenAjusteModal: () => void;
    movLoading: boolean;
    filteredGroups: [string, { nombre: string; totalMovs: number; movs: Movimiento[] }][];
    totalMovGroupsPages: number;
    paginatedGroups: [string, { nombre: string; totalMovs: number; movs: Movimiento[] }][];
    movPage: number;
    setMovPage: (fn: (p: number) => number) => void;
    expandedProductId: number | null;
    setExpandedProductId: (id: number | null) => void;
    exportMovimientosPDF: (nombre: string, movs: Movimiento[]) => void;
    movimientosPages: Record<number, number>;
    setMovimientosPages: (fn: (prev: Record<number, number>) => Record<number, number>) => void;
}

export const MovimientosTab = ({
    movSearch, setMovSearch, onOpenAjusteModal, movLoading,
    filteredGroups, totalMovGroupsPages, paginatedGroups, movPage, setMovPage,
    expandedProductId, setExpandedProductId, exportMovimientosPDF,
    movimientosPages, setMovimientosPages,
}: MovimientosTabProps) => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '300px', padding: '0 10px', gap: '8px', height: '36px', border: '2px solid var(--border-color)', borderRadius: '12px' }}>
                    <IconSearch />
                    <input type="text" placeholder="Buscar por producto o motivo..." value={movSearch} onChange={e => setMovSearch(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }} />
                </div>
                <button
                    className="btn btn-primary"
                    onClick={onOpenAjusteModal}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600
                    }}
                >
                    <IconPlus />
                    <span>Ajuste Manual</span>
                </button>
            </div>

            {movLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando movimientos...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {filteredGroups.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay movimientos registrados.</div>
                    ) : (
                        <>
                            {paginatedGroups.map(([pidStr, data]) => {
                                const pid = Number(pidStr);
                                const isExpanded = expandedProductId === pid;
                                return (
                                    <div key={pid} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--bg-card)', marginBottom: '0.75rem' }}>
                                        <div
                                            style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: isExpanded ? 'var(--accent-primary-bg)' : 'transparent' }}
                                            onClick={() => setExpandedProductId(isExpanded ? null : pid)}
                                        >
                                            <div style={{ fontWeight: 600 }}>{data.nombre}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                <span>Stock: <strong style={{ color: 'var(--text-primary)' }}>{data.movs.reduce((s, m) => m.tipomovimiento === 'INGRESO' ? s + m.cantidad : s - m.cantidad, 0)}</strong></span>
                                                <span>{data.totalMovs} movimiento(s)</span>
                                                <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)' }}>▼</span>
                                            </div>
                                        </div>
                                        {isExpanded && (
                                            <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.75rem', marginBottom: '0.5rem' }}>
                                                    <button
                                                        className="btn"
                                                        onClick={e => { e.stopPropagation(); exportMovimientosPDF(data.nombre, data.movs); }}
                                                        style={{
                                                            fontSize: '0.78rem',
                                                            padding: '0.35rem 0.65rem',
                                                            border: '1px solid var(--border-color)',
                                                            backgroundColor: 'var(--bg-secondary)',
                                                            color: 'var(--text-primary)',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem',
                                                            borderRadius: 'var(--radius-md)',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        <IconFilePdf />
                                                        <span>Exportar PDF</span>
                                                    </button>
                                                </div>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                                    <thead>
                                                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                                            <th style={{ padding: '0.5rem 0', fontWeight: 500, textAlign: 'left' }}>Fecha</th>
                                                            <th style={{ padding: '0.5rem 0', fontWeight: 500, textAlign: 'left' }}>Tipo</th>
                                                            <th style={{ padding: '0.5rem 0', fontWeight: 500, textAlign: 'right' }}>Cant.</th>
                                                            <th style={{ padding: '0.5rem 0', fontWeight: 500, textAlign: 'right' }}>Stock Ant.</th>
                                                            <th style={{ padding: '0.5rem 0', fontWeight: 500, textAlign: 'right' }}>Stock Rest.</th>
                                                            <th style={{ padding: '0.5rem 0', fontWeight: 500, textAlign: 'left', paddingLeft: '1rem' }}>Motivo / Concepto</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(() => {
                                                            const pageItems = 10;
                                                            const mPage = movimientosPages[pid] || 1;
                                                            const totalMovPages = Math.ceil(data.movs.length / pageItems);
                                                            const paginated = data.movs.slice((mPage - 1) * pageItems, mPage * pageItems);

                                                            return (
                                                                <>
                                                                    {paginated.map((m) => (
                                                                        <tr key={m.movimientoid} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                                            <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>{new Date(m.fecha).toLocaleString()}</td>
                                                                            <td style={{ padding: '0.5rem 0' }}>
                                                                                <span style={{
                                                                                    color: m.tipomovimiento === 'INGRESO' ? 'var(--accent-success)' : 'var(--accent-danger)',
                                                                                    backgroundColor: m.tipomovimiento === 'INGRESO' ? 'var(--accent-success-bg)' : 'var(--accent-danger-bg)',
                                                                                    padding: '0.15rem 0.4rem',
                                                                                    borderRadius: '4px',
                                                                                    fontSize: '0.72rem',
                                                                                    fontWeight: 600
                                                                                }}>
                                                                                    {m.tipomovimiento === 'INGRESO' ? 'INGRESO' : 'EGRESO'}
                                                                                </span>
                                                                            </td>
                                                                            <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 600 }}>{m.cantidad}</td>
                                                                            <td style={{ padding: '0.5rem 0', textAlign: 'right', color: 'var(--text-secondary)' }}>{m.stockanterior}</td>
                                                                            <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 500 }}>{m.stockresultante ?? (m.tipomovimiento === 'INGRESO' ? m.stockanterior + m.cantidad : m.stockanterior - m.cantidad)}</td>
                                                                            <td style={{ padding: '0.5rem 0', paddingLeft: '1rem', color: 'var(--text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={m.motivo || ''}>
                                                                                {m.motivo || 'Ajuste manual'}
                                                                                {m.ventaid && ` (Venta #${m.ventaid})`}
                                                                                {m.compraid && ` (Compra #${m.compraid})`}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                    {totalMovPages > 1 && (
                                                                        <tr>
                                                                            <td colSpan={6} style={{ padding: '0.5rem 0' }}>
                                                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn"
                                                                                        disabled={mPage === 1}
                                                                                        onClick={(e) => { e.stopPropagation(); setMovimientosPages(prev => ({ ...prev, [pid]: mPage - 1 })); }}
                                                                                        style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                                                                                    >
                                                                                        Anterior
                                                                                    </button>
                                                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                                                        Pág. {mPage} de {totalMovPages}
                                                                                    </span>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn"
                                                                                        disabled={mPage === totalMovPages}
                                                                                        onClick={(e) => { e.stopPropagation(); setMovimientosPages(prev => ({ ...prev, [pid]: mPage + 1 })); }}
                                                                                        style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                                                                                    >
                                                                                        Siguiente
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </>
                                                            );
                                                        })()}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {totalMovGroupsPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', paddingBottom: '1rem' }}>
                                    <button
                                        type="button"
                                        className="btn"
                                        disabled={movPage === 1}
                                        onClick={() => setMovPage(p => p - 1)}
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
                                    >
                                        Anterior
                                    </button>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        Página {movPage} de {totalMovGroupsPages}
                                    </span>
                                    <button
                                        type="button"
                                        className="btn"
                                        disabled={movPage === totalMovGroupsPages}
                                        onClick={() => setMovPage(p => p + 1)}
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
