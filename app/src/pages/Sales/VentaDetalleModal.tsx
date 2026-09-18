interface VentaDetalleModalProps {
    show: boolean;
    onClose: () => void;
    loadingVentaDetalle: boolean;
    ventaDetalleData: { venta: any | null; productos: any[]; delivery?: any | null };
}

/** NOTA: no usa el Modal compartido — el original define maxHeight/overflowY propios (80vh) distintos al default del Modal. */
export const VentaDetalleModal = ({ show, onClose, loadingVentaDetalle, ventaDetalleData }: VentaDetalleModalProps) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.2rem' }}>
                        {ventaDetalleData.venta ? `Detalle de Venta #${ventaDetalleData.venta.id ?? ventaDetalleData.venta.ventaid}` : 'Detalle de Venta'}
                    </h3>
                    <button onClick={onClose} className="modal-close-btn">x</button>
                </div>

                {loadingVentaDetalle ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando detalle...</div>
                ) : ventaDetalleData.venta ? (
                    <div>
                        {/* Info de la venta */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                            {[
                                { label: 'Fecha', value: new Date(ventaDetalleData.venta.fecha).toLocaleDateString('es-NI'), color: 'var(--text-primary)' },
                                { label: 'Cliente', value: ventaDetalleData.venta.clientenombre || ventaDetalleData.venta.clientes?.nombre || 'Público General', color: 'var(--text-primary)' },
                                { label: 'Tipo', value: ventaDetalleData.venta.tipoventa, color: ventaDetalleData.venta.tipoventa === 'CREDITO' ? '#dc2626' : 'var(--accent-primary)' },
                                { label: 'Método Pago', value: ventaDetalleData.venta.metodopago, color: 'var(--text-primary)' },
                                { label: 'Lugar', value: ventaDetalleData.venta.lugarventa || 'NORMAL', color: 'var(--text-primary)' },
                                { label: 'Comprobante', value: ventaDetalleData.venta.consecutivofiscal ? `Fiscal (${ventaDetalleData.venta.consecutivofiscal})` : ventaDetalleData.venta.consecutivonofiscal ? `Comercial (${ventaDetalleData.venta.consecutivonofiscal})` : 'Comercial (Sin Consecutivo)', color: ventaDetalleData.venta.consecutivofiscal ? 'var(--accent-primary)' : ventaDetalleData.venta.consecutivonofiscal ? '#0284c7' : 'var(--text-secondary)' },
                                { label: 'Total', value: `C$ ${Number(ventaDetalleData.venta.total).toFixed(2)}`, color: 'var(--accent-success)' },
                            ].map(item => (
                                <div key={item.label} style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.15rem' }}>{item.label}</div>
                                    <div style={{ fontWeight: 600, color: item.color, fontSize: '0.9rem', textTransform: item.label === 'Comprobante' ? 'none' : 'capitalize' }}>{item.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Productos */}
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Productos
                        </div>
                        {ventaDetalleData.productos.length > 0 ? (
                            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                                <table style={{ minWidth: '600px', width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                            <th style={{ padding: '0.5rem 0', fontWeight: 500, textAlign: 'left' }}>#</th>
                                            <th style={{ padding: '0.5rem 0', fontWeight: 500, textAlign: 'left' }}>Producto</th>
                                            <th style={{ padding: '0.5rem 0', fontWeight: 500, textAlign: 'center' }}>Cant.</th>
                                            <th style={{ padding: '0.5rem 0', fontWeight: 500, textAlign: 'right' }}>Precio</th>
                                            <th style={{ padding: '0.5rem 0', fontWeight: 500, textAlign: 'right' }}>Desc.</th>
                                            <th style={{ padding: '0.5rem 0', fontWeight: 500, textAlign: 'right' }}>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ventaDetalleData.productos.map((d: any, i: number) => {
                                            const nombre = d.productonombre || d.productos?.nombre || d.nombre || `Producto #${d.productoid}`;
                                            const cant = Number(d.cantidad);
                                            const precio = Number(d.preciounitario);
                                            const desc = Number(d.descuento || 0);
                                            const sub = cant * precio - desc;
                                            return (
                                                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                    <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>{i + 1}</td>
                                                    <td style={{ padding: '0.5rem 0' }}>{nombre}</td>
                                                    <td style={{ padding: '0.5rem 0', textAlign: 'center' }}>{cant}</td>
                                                    <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>C$ {precio.toFixed(2)}</td>
                                                    <td style={{ padding: '0.5rem 0', textAlign: 'right', color: 'var(--accent-danger)' }}>C$ {desc.toFixed(2)}</td>
                                                    <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 600 }}>C$ {sub.toFixed(2)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem', fontSize: '0.85rem' }}>Sin productos</div>
                        )}

                        {/* Total */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem', padding: '0.75rem 0', borderTop: '2px solid var(--accent-primary)' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Total: C$ {Number(ventaDetalleData.venta.total).toFixed(2)}</span>
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No se pudo cargar el detalle de la venta.</div>
                )}
            </div>
        </div>
    );
};
