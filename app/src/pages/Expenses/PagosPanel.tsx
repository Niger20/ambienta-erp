import { useRef } from 'react';
import { IconBriefcase, IconPlus, IconFilePdf, IconEdit, IconTrash, IconCalendar } from './icons';
import type { Gasto, PagoGasto } from './types';
import { getPago } from './types';

const getMetodoPagoColor = (metodo: string) => {
    const map: Record<string, string> = {
        efectivo: '#16a34a',
        bac: '#2563eb',
        lafise: '#7c3aed',
        banpro: '#0891b2',
        transferencia: '#ea580c',
    };
    return map[metodo?.toLowerCase()] || '#6b7280';
};

interface PagosPanelProps {
    selectedGasto: Gasto;
    onClose: () => void;
    totalPagadoGasto: () => number;
    pagos: PagoGasto[];
    loadingPagos: boolean;
    onOpenPagoModal: () => void;
    onExportPDF: () => void;
    onEditPago: (pg: PagoGasto) => void;
    onDeletePago: (pg: PagoGasto) => void;
}

export const PagosPanel = ({
    selectedGasto, onClose, totalPagadoGasto, pagos, loadingPagos,
    onOpenPagoModal, onExportPDF, onEditPago, onDeletePago,
}: PagosPanelProps) => {
    const pdfRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={pdfRef} className="card" style={{ height: 'fit-content', position: 'sticky', top: '1rem', padding: '1.5rem' }}>
            {/* Panel header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <IconBriefcase />
                        <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{selectedGasto.nombre}</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>{selectedGasto.descripcion || 'Sin descripción'}</p>
                </div>
                <button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginLeft: '0.5rem', flexShrink: 0 }} onClick={onClose}>✕</button>
            </div>

            {/* Total box */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Total Pagado</div>
                    <div className="tabular" style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--accent-success)' }}>C$ {totalPagadoGasto().toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Nº de Pagos</div>
                    <div className="tabular" style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{pagos.length}</div>
                </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={onOpenPagoModal}>
                    <IconPlus />
                    <span>Registrar Pago</span>
                </button>
                {pagos.length > 0 && (
                    <button className="btn" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', border: '1px solid var(--border-color)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }} onClick={onExportPDF} title="Exportar a PDF">
                        <IconFilePdf />
                        <span>PDF</span>
                    </button>
                )}
            </div>

            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Historial de Pagos
            </div>

            {loadingPagos ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1.5rem' }}>Cargando...</div>
            ) : pagos.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1.5rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)', fontSize: '0.85rem' }}>
                    Aún no hay pagos para este gasto.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '380px', overflowY: 'auto' }}>
                    {pagos.map((pg, i) => {
                        const p = getPago(pg);
                        const color = getMetodoPagoColor(p.metodopago || '');
                        return (
                            <div key={i} style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                    <span className="tabular" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--accent-success)' }}>C$ {Number(p.monto || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</span>
                                    <span className="tabular" style={{ display: 'inline-block', padding: '0.15rem 0.55rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, backgroundColor: `${color}18`, color }}>
                                        {p.metodopago?.toUpperCase() || '—'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <div style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <IconCalendar />
                                        <span className="tabular">{p.fecha ? new Date(p.fecha).toLocaleDateString('es-NI', { dateStyle: 'medium' }) : '—'}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                                        <button
                                            onClick={() => onEditPago(pg)}
                                            className="btn"
                                            style={{
                                                padding: '0.2rem 0.4rem',
                                                fontSize: '0.75rem',
                                                border: '1px solid var(--border-color)',
                                                backgroundColor: 'var(--bg-secondary)',
                                                color: 'var(--text-primary)',
                                                borderRadius: 'var(--radius-sm)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}
                                            title="Editar Pago"
                                        >
                                            <IconEdit />
                                        </button>
                                        <button
                                            onClick={() => onDeletePago(pg)}
                                            className="btn"
                                            style={{
                                                padding: '0.2rem 0.4rem',
                                                fontSize: '0.75rem',
                                                backgroundColor: 'var(--accent-danger-bg)',
                                                color: 'var(--accent-danger)',
                                                border: '1px solid var(--accent-danger)',
                                                borderRadius: 'var(--radius-sm)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}
                                            title="Eliminar Pago"
                                        >
                                            <IconTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
