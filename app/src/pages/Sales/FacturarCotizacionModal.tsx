import { getSaleClientName } from './types';

interface FacturarCotizacionModalProps {
    show: boolean;
    selectedCotizacion: any | null;
    isFacturando: boolean;
    onClose: () => void;
    loadingCotizacionDetalle: boolean;
    cotizacionProductos: any[];
    facturarTipoFactura: 'FISCAL' | 'NO_FISCAL' | null;
    setFacturarTipoFactura: (v: 'FISCAL' | 'NO_FISCAL' | null) => void;
    facturarMetodoPago: string;
    setFacturarMetodoPago: (v: string) => void;
    facturarNumeroTransferencia: string;
    setFacturarNumeroTransferencia: (v: string) => void;
    facturarFechaVencimientoCredito: string;
    setFacturarFechaVencimientoCredito: (v: string) => void;
    facturarMontoRecibido: string;
    setFacturarMontoRecibido: (v: string) => void;
    handleConfirmarFacturacion: () => Promise<void>;
}

/** NOTA: no usa el Modal compartido — el original define maxHeight/overflowY propios (90vh) distintos al default del Modal. */
export const FacturarCotizacionModal = ({
    show, selectedCotizacion, isFacturando, onClose,
    loadingCotizacionDetalle, cotizacionProductos,
    facturarTipoFactura, setFacturarTipoFactura,
    facturarMetodoPago, setFacturarMetodoPago,
    facturarNumeroTransferencia, setFacturarNumeroTransferencia,
    facturarFechaVencimientoCredito, setFacturarFechaVencimientoCredito,
    facturarMontoRecibido, setFacturarMontoRecibido,
    handleConfirmarFacturacion,
}: FacturarCotizacionModalProps) => {
    if (!show || !selectedCotizacion) return null;

    return (
        <div className="modal-backdrop" onClick={() => !isFacturando && onClose()}>
            <div className="modal-content" style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                            Facturar Cotización #{selectedCotizacion.id ?? selectedCotizacion.ventaid}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
                            Selecciona el método de pago para convertir esta cotización en una venta final.
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="modal-close-btn" disabled={isFacturando}>✕</button>
                </div>

                {/* Info Cliente */}
                <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Cliente</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{getSaleClientName(selectedCotizacion)}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Fecha Creación</div>
                        <div style={{ fontSize: '0.85rem' }}>{new Date(selectedCotizacion.fecha).toLocaleDateString('es-NI')}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Cotizado</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-success)' }}>C$ {Number(selectedCotizacion.total).toFixed(2)}</div>
                    </div>
                </div>

                {/* Productos List */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                        Productos en la Cotización
                    </div>
                    {loadingCotizacionDetalle ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando productos...</div>
                    ) : cotizacionProductos.length > 0 ? (
                        <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                                <thead style={{ backgroundColor: 'var(--bg-secondary)', position: 'sticky', top: 0 }}>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                                        <th style={{ padding: '0.4rem 0.6rem' }}>Producto</th>
                                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'center' }}>Cant.</th>
                                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'right' }}>Precio</th>
                                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'right' }}>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cotizacionProductos.map((p: any, idx: number) => {
                                        const pName = p.productonombre || p.productos?.nombre || p.nombre || `Producto #${p.productoid}`;
                                        const qty = Number(p.cantidad || 1);
                                        const unitPrice = Number(p.preciounitario || 0);
                                        const desc = Number(p.descuento || 0);
                                        const lineTotal = (qty * unitPrice) - desc;
                                        return (
                                            <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '0.4rem 0.6rem', fontWeight: 600 }}>{pName}</td>
                                                <td style={{ padding: '0.4rem 0.6rem', textAlign: 'center' }}>{qty}</td>
                                                <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right' }}>C$ {unitPrice.toFixed(2)}</td>
                                                <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', fontWeight: 700 }}>C$ {lineTotal.toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                            Detalle no disponible (se facturará el monto total de C$ {Number(selectedCotizacion.total).toFixed(2)})
                        </div>
                    )}
                </div>

                {/* Tipo de Factura / Consecutivo */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>
                            Tipo de Factura / Consecutivo *
                        </label>
                        {facturarTipoFactura === 'FISCAL' && <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 700, backgroundColor: 'var(--accent-primary-bg)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Serie F (Fiscal)</span>}
                        {facturarTipoFactura === 'NO_FISCAL' && <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700, backgroundColor: 'rgba(2, 132, 199, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Serie S (No Fiscal)</span>}
                        {facturarTipoFactura === null && <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, backgroundColor: 'var(--bg-secondary)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Sin Consecutivo</span>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                        {[
                            { value: 'FISCAL', label: 'Fiscal (F)', desc: 'Consecutivo Fiscal' },
                            { value: 'NO_FISCAL', label: 'No Fiscal (S)', desc: 'Consecutivo Comercial' },
                            { value: 'SIN_CONSECUTIVO', label: 'Sin Consecutivo', desc: 'Venta Simple' },
                        ].map(opt => {
                            const isSelected = (opt.value === 'SIN_CONSECUTIVO' && facturarTipoFactura === null) || facturarTipoFactura === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    className={`btn ${isSelected ? 'btn-primary' : ''}`}
                                    onClick={() => setFacturarTipoFactura(opt.value === 'SIN_CONSECUTIVO' ? null : (opt.value as any))}
                                    style={{
                                        padding: '0.6rem 0.4rem',
                                        fontSize: '0.82rem',
                                        fontWeight: 700,
                                        backgroundColor: isSelected
                                            ? (opt.value === 'NO_FISCAL' ? '#0284c7' : (opt.value === 'SIN_CONSECUTIVO' ? '#64748b' : ''))
                                            : 'var(--bg-secondary)',
                                        border: isSelected ? '2px solid transparent' : '1px solid var(--border-color)',
                                        color: isSelected ? '#ffffff' : 'var(--text-primary)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.15rem'
                                    }}
                                >
                                    <span>{opt.label}</span>
                                    <span style={{ fontSize: '0.68rem', fontWeight: 400, opacity: isSelected ? 0.9 : 0.6 }}>{opt.desc}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Payment Method Selector */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>
                        Seleccionar Método de Pago *
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                        {[
                            { value: 'efectivo', label: ' Efectivo' },
                            { value: 'credito', label: ' Crédito' },
                            { value: 'bac', label: ' BAC' },
                            { value: 'lafise', label: ' LAFISE' },
                        ].map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                className={`btn ${facturarMetodoPago === opt.value ? 'btn-primary' : ''}`}
                                onClick={() => {
                                    setFacturarMetodoPago(opt.value);
                                    if (!['bac', 'lafise'].includes(opt.value)) setFacturarNumeroTransferencia('');
                                }}
                                style={{
                                    padding: '0.6rem 0.5rem',
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    backgroundColor: facturarMetodoPago === opt.value ? '' : 'var(--bg-secondary)',
                                    border: facturarMetodoPago === opt.value ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                                    color: facturarMetodoPago === opt.value ? '#ffffff' : 'var(--text-primary)',
                                    borderRadius: 'var(--radius-md)'
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bank Transfer Field */}
                {['bac', 'lafise'].includes(facturarMetodoPago) && (
                    <div className="form-group" style={{ marginBottom: '1.25rem', padding: '0.75rem', backgroundColor: 'var(--accent-primary-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-primary-border)' }}>
                        <label className="form-label" style={{ color: 'var(--accent-primary)', fontSize: '0.82rem', fontWeight: 600 }}>
                            Número de Transferencia Bancaria ({facturarMetodoPago.toUpperCase()}) *
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Ej: 987654321"
                            value={facturarNumeroTransferencia}
                            onChange={e => setFacturarNumeroTransferencia(e.target.value)}
                            style={{ marginTop: '0.35rem' }}
                            maxLength={50}
                            required
                        />
                    </div>
                )}

                {/* Credit Field */}
                {facturarMetodoPago === 'credito' && (
                    <div className="form-group" style={{ marginBottom: '1.25rem', padding: '0.75rem', backgroundColor: 'var(--accent-danger-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-danger-border)' }}>
                        <label className="form-label" style={{ color: 'var(--accent-danger)', fontSize: '0.82rem', fontWeight: 600 }}>
                            Fecha de Vencimiento del Crédito *
                        </label>
                        <input
                            type="date"
                            className="form-input"
                            value={facturarFechaVencimientoCredito}
                            onChange={e => setFacturarFechaVencimientoCredito(e.target.value)}
                            style={{ marginTop: '0.35rem' }}
                            required
                        />
                        {!selectedCotizacion.clienteid && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--accent-danger)', marginTop: '0.4rem', margin: '0.4rem 0 0', fontWeight: 600 }}>
                                ⚠️ Esta cotización fue creada como "Público General". Debe asignar un cliente para vender al crédito.
                            </p>
                        )}
                    </div>
                )}

                {/* Cash Calculations */}
                {facturarMetodoPago === 'efectivo' && (
                    <div style={{ marginBottom: '1.25rem', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div>
                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Monto Recibido (C$)</label>
                                <input
                                    type="number"
                                    step="any"
                                    className="form-input"
                                    placeholder="0.00"
                                    value={facturarMontoRecibido}
                                    onChange={e => setFacturarMontoRecibido(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="form-label" style={{ fontSize: '0.78rem' }}>Cambio a Devolver</label>
                                <div style={{
                                    padding: '0.55rem 0.75rem',
                                    backgroundColor: 'var(--bg-card)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    color: (Number(facturarMontoRecibido) - Number(selectedCotizacion.total)) >= 0 ? 'var(--accent-success)' : 'var(--text-secondary)'
                                }}>
                                    C$ {Math.max(0, (Number(facturarMontoRecibido) || 0) - Number(selectedCotizacion.total)).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Actions */}
                <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <button
                        type="button"
                        className="btn"
                        onClick={onClose}
                        disabled={isFacturando}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleConfirmarFacturacion}
                        disabled={isFacturando}
                        style={{
                            backgroundColor: 'var(--accent-success)',
                            borderColor: 'var(--accent-success)',
                            color: '#ffffff',
                            fontWeight: 700,
                            padding: '0.6rem 1.5rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {isFacturando ? 'Facturando...' : `Confirmar Factura (C$ ${Number(selectedCotizacion.total).toFixed(2)})`}
                    </button>
                </div>
            </div>
        </div>
    );
};
