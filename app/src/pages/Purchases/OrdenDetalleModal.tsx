import { IconFile } from './icons';
import type { OrdenCompra, Proveedor } from './types';

interface OrdenDetalleModalProps {
    selectedOrdenModal: OrdenCompra | null;
    setSelectedOrdenModal: (o: OrdenCompra | null) => void;
    proveedores: Proveedor[];
    exportOrdenCompraPDF: (orden: OrdenCompra) => void;
    handleRecibirOrden: (orden: OrdenCompra) => void;
}

/**
 * NOTA: el original usa las clases "modal-overlay"/"modal-header"/"modal-title"/"modal-close",
 * que no tienen reglas CSS propias (a diferencia de "modal-backdrop"/"modal-content"), por lo
 * que este modal en particular no tiene fondo oscurecido ni centrado como el resto — es un
 * comportamiento preexistente del original, se preserva tal cual.
 */
export const OrdenDetalleModal = ({ selectedOrdenModal, setSelectedOrdenModal, proveedores, exportOrdenCompraPDF, handleRecibirOrden }: OrdenDetalleModalProps) => {
    if (!selectedOrdenModal) return null;

    const items: any[] = (selectedOrdenModal.productos && selectedOrdenModal.productos.length > 0)
        ? selectedOrdenModal.productos
        : (selectedOrdenModal.ordenescompraproductos || []);

    return (
        <div className="modal-overlay" onClick={() => setSelectedOrdenModal(null)}>
            <div className="modal-content" style={{ maxWidth: '680px', width: '90%' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">
                        Detalle de Orden de Compra #{selectedOrdenModal.id ?? selectedOrdenModal.ordencompraid}
                    </h3>
                    <button type="button" className="modal-close" onClick={() => setSelectedOrdenModal(null)}>✕</button>
                </div>
                <div style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Proveedor: </span>
                            <strong>{selectedOrdenModal.proveedores?.nombreempresa || proveedores.find(p => Number(p.id ?? p.proveedorid) === Number(selectedOrdenModal.proveedorid))?.nombreempresa || 'N/A'}</strong>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Estado: </span>
                            <strong style={{ color: (selectedOrdenModal.estado === 'RECIBIDA' || selectedOrdenModal.estado === 'RECIBIDA_TOTAL') ? 'var(--accent-success)' : selectedOrdenModal.estado === 'PENDIENTE' ? 'var(--accent-warning)' : 'var(--accent-danger)' }}>{selectedOrdenModal.estado.replace('_', ' ')}</strong>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Fecha Emisión: </span>
                            <strong>{new Date(selectedOrdenModal.fechaorden).toLocaleDateString('es-NI')}</strong>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Fecha Esperada: </span>
                            <strong>{selectedOrdenModal.fechaesperada ? new Date(selectedOrdenModal.fechaesperada).toLocaleDateString('es-NI') : 'Inmediata'}</strong>
                        </div>
                    </div>

                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Productos Solicitados</h4>
                    <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>#</th>
                                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Producto</th>
                                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>Cant.</th>
                                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>Costo Est.</th>
                                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((it: any, idx: number) => {
                                    const prodName = it.productonombre || it.productos?.nombre || (it as any)?.nombre || `Producto #${it.productoid}`;
                                    const prodCode = it.productocodigo || it.productos?.codigobarra || '';
                                    const cant = Number(it.cantidadordenada) || 0;
                                    const cost = Number(it.preciounitario) || 0;
                                    return (
                                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>{idx + 1}</td>
                                            <td style={{ padding: '0.5rem 0.75rem' }}>
                                                <div style={{ fontWeight: 600 }}>{prodName}</div>
                                                {prodCode && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cód: {prodCode}</div>}
                                            </td>
                                            <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', fontWeight: 700 }}>{cant}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>C$ {cost.toFixed(2)}</td>
                                            <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--accent-primary)' }}>
                                                C$ {(cant * cost).toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Estimado de la Orden:</span>
                        <strong style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', fontVariantNumeric: 'tabular-nums' }}>
                            C$ {items.reduce((sum: number, it: any) => sum + (Number(it.cantidadordenada) || 0) * (Number(it.preciounitario) || 0), 0).toFixed(2)}
                        </strong>
                    </div>

                    <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
                        <button type="button" className="btn" onClick={() => setSelectedOrdenModal(null)}>Cerrar</button>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                type="button"
                                className="btn"
                                onClick={() => exportOrdenCompraPDF(selectedOrdenModal)}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                            >
                                <IconFile /> Exportar PDF
                            </button>
                            {selectedOrdenModal.estado === 'PENDIENTE' && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        const ordenToReceive = selectedOrdenModal;
                                        setSelectedOrdenModal(null);
                                        handleRecibirOrden(ordenToReceive);
                                    }}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                                >
                                    Recibir y Facturar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
