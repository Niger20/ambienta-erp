import { IconMonitor } from './icons';
import { DescuentoFacturaControl } from './DescuentoFacturaControl';
import { TipoFacturaSelector } from './TipoFacturaSelector';
import { MetodoPagoSelector } from './MetodoPagoSelector';
import { PagosMixtosPanel } from './PagosMixtosPanel';
import { DivisaPagoPanel } from './DivisaPagoPanel';
import type { PagoMixtoItem } from './types';

interface SummaryPanelProps {
    subtotal: number;
    descuentoLineas: number;
    tipoDescuentoFactura: 'FIXED' | 'PERCENT';
    setTipoDescuentoFactura: (v: 'FIXED' | 'PERCENT') => void;
    descuentoFactura: string;
    setDescuentoFactura: (v: string) => void;
    montoDescuentoFactura: number;
    lugarVenta: 'NORMAL' | 'DELIVERY';
    deliveryCost: number;
    setShowDeliveryModal: (v: boolean) => void;
    totalItems: number;
    trueTotal: number;
    totalEnUSD: number;
    tasaCambio: number;
    divisaPago: 'NIO' | 'USD';

    metodoPago: string;
    setMetodoPago: (v: string) => void;
    setNumeroTransferencia: (v: string) => void;
    hasProductoAgotado: boolean;
    tipoFactura: 'FISCAL' | 'NO_FISCAL' | null;
    setTipoFactura: (v: 'FISCAL' | 'NO_FISCAL' | null) => void;
    numeroTransferencia: string;

    pagosMixtos: PagoMixtoItem[];
    handleAddPagoMixto: () => void;
    handleRemovePagoMixto: (id: string) => void;
    handleUpdatePagoMixto: (id: string, field: keyof PagoMixtoItem, value: any) => void;
    totalAsignadoMixto: number;
    restanteMixto: number;
    cambioMixto: number;

    fechaVencimientoCredito: string;
    setFechaVencimientoCredito: (v: string) => void;
    clienteIdSeleccionado: number | null;

    setDivisaPago: (v: 'NIO' | 'USD') => void;
    montoRecibidoUSD: string;
    setMontoRecibidoUSD: (v: string) => void;
    showCambioInfo: boolean;
    setShowCambioInfo: (v: boolean) => void;
    montoRecibidoNIO: string;
    setMontoRecibidoNIO: (v: string) => void;
    montoRecibidoNIONum: number;
    cambioNIO: number;
    montoRecibidoUSDNum: number;
    equivalenteEnCordobas: number;
    cambioEnCordobas: number;

    isProcessing: boolean;
    lineas: unknown[];
    sesionActiva: number | null;
    handleCobrar: () => void;
    openCustomerDisplay: () => void;
}

export const SummaryPanel = (props: SummaryPanelProps) => {
    const {
        subtotal, descuentoLineas, tipoDescuentoFactura, setTipoDescuentoFactura,
        descuentoFactura, setDescuentoFactura, montoDescuentoFactura,
        lugarVenta, deliveryCost, setShowDeliveryModal, totalItems, trueTotal, totalEnUSD, tasaCambio, divisaPago,
        metodoPago, setMetodoPago, setNumeroTransferencia, hasProductoAgotado,
        tipoFactura, setTipoFactura, numeroTransferencia,
        pagosMixtos, handleAddPagoMixto, handleRemovePagoMixto, handleUpdatePagoMixto,
        totalAsignadoMixto, restanteMixto, cambioMixto,
        fechaVencimientoCredito, setFechaVencimientoCredito, clienteIdSeleccionado,
        setDivisaPago, montoRecibidoUSD, setMontoRecibidoUSD, showCambioInfo, setShowCambioInfo,
        montoRecibidoNIO, setMontoRecibidoNIO, montoRecibidoNIONum, cambioNIO,
        montoRecibidoUSDNum, equivalenteEnCordobas, cambioEnCordobas,
        isProcessing, lineas, sesionActiva, handleCobrar, openCustomerDisplay,
    } = props;

    return (
        <div className="pos-summary">
            <div className="pos-summary-header">
                <h3>Resumen</h3>
            </div>

            <div className="pos-summary-body">
                <div className="pos-summary-row">
                    <span>Subtotal bruto</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>C$ {subtotal.toFixed(2)}</span>
                </div>
                {descuentoLineas > 0 && (
                    <div className="pos-summary-row" style={{ color: 'var(--accent-warning)', fontSize: '0.85rem' }}>
                        <span>Desc. productos</span>
                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>− C$ {descuentoLineas.toFixed(2)}</span>
                    </div>
                )}

                <DescuentoFacturaControl
                    tipoDescuentoFactura={tipoDescuentoFactura}
                    setTipoDescuentoFactura={setTipoDescuentoFactura}
                    descuentoFactura={descuentoFactura}
                    setDescuentoFactura={setDescuentoFactura}
                    montoDescuentoFactura={montoDescuentoFactura}
                />

                {lugarVenta === 'DELIVERY' && (
                    <div className="pos-summary-row" style={{ cursor: 'pointer' }} onClick={() => setShowDeliveryModal(true)} title="Clic para editar costo y datos de delivery">
                        <span>Envío (Delivery) ✏️</span>
                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>C$ {deliveryCost.toFixed(2)}</span>
                    </div>
                )}
                <div className="pos-summary-row">
                    <span>Items</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>{totalItems}</span>
                </div>
                <div className="pos-summary-divider" />
                <div className="pos-summary-row pos-summary-total">
                    <span>Total</span>
                    <span>C$ {trueTotal.toFixed(2)}</span>
                </div>
                <div className="pos-summary-row" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    <span>USD equiv.</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>$ {totalEnUSD.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'right', marginTop: '0.1rem', opacity: 0.6 }}>
                    Tasa C$ {tasaCambio.toFixed(4)} / $1
                </div>
            </div>

            <div className="pos-summary-actions">

                {/* Tipo de Factura / Consecutivo */}
                {metodoPago !== 'cotizacion' && (
                    <TipoFacturaSelector tipoFactura={tipoFactura} setTipoFactura={setTipoFactura} />
                )}

                <MetodoPagoSelector
                    metodoPago={metodoPago}
                    setMetodoPago={setMetodoPago}
                    setNumeroTransferencia={setNumeroTransferencia}
                    hasProductoAgotado={hasProductoAgotado}
                />

                {/* Bank transfer number */}
                {['bac', 'lafise'].includes(metodoPago) && (
                    <div className="form-group" style={{ marginBottom: '1rem', padding: '0.75rem 1rem', backgroundColor: 'var(--accent-primary-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--accent-primary-border)' }}>
                        <label className="form-label" style={{ color: 'var(--accent-primary)', fontSize: '0.8rem' }}>Número de transferencia ({metodoPago.toUpperCase()})</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Ej: 123456789"
                            value={numeroTransferencia}
                            onChange={e => setNumeroTransferencia(e.target.value)}
                            style={{ marginTop: '0.35rem' }}
                            maxLength={50}
                        />
                    </div>
                )}

                {/* Mixed payment breakdown UI */}
                {metodoPago === 'mixto' && (
                    <PagosMixtosPanel
                        pagosMixtos={pagosMixtos}
                        handleAddPagoMixto={handleAddPagoMixto}
                        handleRemovePagoMixto={handleRemovePagoMixto}
                        handleUpdatePagoMixto={handleUpdatePagoMixto}
                        totalAsignadoMixto={totalAsignadoMixto}
                        restanteMixto={restanteMixto}
                        cambioMixto={cambioMixto}
                    />
                )}

                {/* Credit due date */}
                {metodoPago === 'credito' && (
                    <div className="form-group" style={{ marginBottom: '1rem', padding: '0.75rem 1rem', backgroundColor: 'var(--accent-danger-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--accent-danger-border)' }}>
                        <label className="form-label" style={{ color: 'var(--accent-danger)', fontSize: '0.8rem' }}>Fecha de vencimiento del crédito</label>
                        <input
                            type="date"
                            className="form-input"
                            value={fechaVencimientoCredito}
                            onChange={e => setFechaVencimientoCredito(e.target.value)}
                            style={{ marginTop: '0.35rem' }}
                        />
                        {!clienteIdSeleccionado && (
                            <p style={{ fontSize: '0.72rem', color: 'var(--accent-danger)', marginTop: '0.35rem', margin: '0.35rem 0 0' }}>Seleccione un cliente para vender al crédito</p>
                        )}
                    </div>
                )}

                {/* Cotización info */}
                {metodoPago === 'cotizacion' && (
                    <div className="form-group" style={{ marginBottom: '1rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(234, 179, 8, 0.08)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(234, 179, 8, 0.25)' }}>
                        <p style={{ fontSize: '0.8rem', color: 'rgb(234, 179, 8)', fontWeight: 600, margin: 0 }}>Se guardará como cotización/proforma</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0' }}>Podrás facturar esta cotización desde la sección de Ventas → Cotizaciones</p>
                    </div>
                )}

                {/* Dollar payment toggle — only for efectivo */}
                {metodoPago === 'efectivo' && (
                    <DivisaPagoPanel
                        divisaPago={divisaPago}
                        setDivisaPago={setDivisaPago}
                        setMontoRecibidoUSD={setMontoRecibidoUSD}
                        setShowCambioInfo={setShowCambioInfo}
                        showCambioInfo={showCambioInfo}
                        montoRecibidoNIO={montoRecibidoNIO}
                        setMontoRecibidoNIO={setMontoRecibidoNIO}
                        montoRecibidoNIONum={montoRecibidoNIONum}
                        cambioNIO={cambioNIO}
                        tasaCambio={tasaCambio}
                        totalEnUSD={totalEnUSD}
                        montoRecibidoUSD={montoRecibidoUSD}
                        montoRecibidoUSDNum={montoRecibidoUSDNum}
                        equivalenteEnCordobas={equivalenteEnCordobas}
                        cambioEnCordobas={cambioEnCordobas}
                    />
                )}

                {/* Charge button */}
                <button
                    className="btn btn-primary pos-btn-charge"
                    disabled={lineas.length === 0 || isProcessing || !sesionActiva}
                    onClick={handleCobrar}
                >
                    {isProcessing ? (
                        <span>Procesando...</span>
                    ) : (
                        <>
                            Cobrar C$ {trueTotal.toFixed(2)}
                            {divisaPago === 'USD' && ` ($ ${totalEnUSD.toFixed(2)})`}
                            <span className="pos-charge-hint">F2</span>
                        </>
                    )}
                </button>

                <button className="btn pos-btn-customer-sm" onClick={openCustomerDisplay} style={{ marginTop: '0.5rem' }}>
                    <IconMonitor /> &nbsp;Pantalla cliente
                </button>
            </div>
        </div>
    );
};
