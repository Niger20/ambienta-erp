import { IconDirectPay, IconSearch, IconFilePdf, IconSend } from './icons';
import type { Abono, Cliente, CuentaPorCobrar } from './types';

interface CuentaDetailPanelProps {
    selectedCuenta: CuentaPorCobrar | null;
    setSelectedCuenta: (c: CuentaPorCobrar | null) => void;
    getClienteForCuenta: (cuenta: CuentaPorCobrar) => Cliente | undefined;
    estadoColor: (estado: string) => { color: string; bg: string };
    setShowAbonoModal: (v: boolean) => void;
    handleLiquidarcCuentaCompleta: (cuenta: CuentaPorCobrar) => Promise<void>;
    openVentaDetalleModal: (ventaId: number) => Promise<void>;
    exportCuentaIndividualPDF: (cuenta: CuentaPorCobrar) => Promise<void>;
    buildWsLink: (cuenta: CuentaPorCobrar) => string | null;
    loadingAbonos: boolean;
    abonos: Abono[];
}

/** NOTA: el original tiene maxHeight/overflowY propios que el Modal compartido no soporta — se mantiene manual. */
export const CuentaDetailPanel = ({
    selectedCuenta, setSelectedCuenta, getClienteForCuenta, estadoColor,
    setShowAbonoModal, handleLiquidarcCuentaCompleta, openVentaDetalleModal,
    exportCuentaIndividualPDF, buildWsLink, loadingAbonos, abonos,
}: CuentaDetailPanelProps) => {
    if (!selectedCuenta) return null;

    const cliente = getClienteForCuenta(selectedCuenta);
    const nombreCliente = selectedCuenta.clientes?.nombre || cliente?.nombre || `Cliente #${selectedCuenta.clienteid}`;

    return (
        <div className="modal-backdrop" onClick={() => setSelectedCuenta(null)}>
            <div className="modal-content" style={{ maxWidth: '480px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                        <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.2rem' }}>Cuenta #{selectedCuenta.id || selectedCuenta.cuentaid}</h3>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{nombreCliente}</div>
                    </div>
                    <button onClick={() => setSelectedCuenta(null)} className="modal-close-btn">✕</button>
                </div>

                {/* Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                    {[
                        { label: 'Total', value: `C$ ${Number(selectedCuenta.montototal).toFixed(2)}`, color: 'var(--text-primary)' },
                        { label: 'Pagado', value: `C$ ${Number(selectedCuenta.montopagado).toFixed(2)}`, color: 'var(--accent-success)' },
                        { label: 'Restante', value: `C$ ${Number(selectedCuenta.montorestante).toFixed(2)}`, color: 'var(--accent-danger)' },
                        { label: 'Estado', value: selectedCuenta.estado, color: estadoColor(selectedCuenta.estado).color },
                    ].map(item => (
                        <div key={item.label} style={{ padding: '0.6rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{item.label}</div>
                            <div style={{ fontWeight: 600, color: item.color, fontSize: '0.95rem' }}>{item.value}</div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {selectedCuenta.estado !== 'PAGADO' && (
                        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1, height: '42px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', borderRadius: 'var(--radius-md)', fontWeight: 600 }}
                                onClick={() => setShowAbonoModal(true)}
                            >
                                <span>+ Registrar Abono</span>
                            </button>
                            <button
                                className="btn"
                                style={{ flex: 1, height: '42px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', border: '1px solid var(--accent-success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.85rem', borderRadius: 'var(--radius-md)', fontWeight: 600 }}
                                onClick={() => handleLiquidarcCuentaCompleta(selectedCuenta)}
                            >
                                <IconDirectPay />
                                <span>Liquidar Cuenta</span>
                            </button>
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap' }}>
                        <button
                            className="btn"
                            onClick={() => openVentaDetalleModal(selectedCuenta.ventaid)}
                            style={{ flex: 1, minWidth: '120px', height: '42px', border: '1px solid var(--border-color)', backgroundColor: 'var(--accent-primary-bg)', color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.85rem', borderRadius: 'var(--radius-md)', fontWeight: 600 }}
                        >
                            <IconSearch />
                            <span>Ver Venta</span>
                        </button>
                        <button
                            className="btn"
                            onClick={() => exportCuentaIndividualPDF(selectedCuenta)}
                            style={{ flex: 1, minWidth: '120px', height: '42px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(99,102,241,0.08)', color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.85rem', borderRadius: 'var(--radius-md)', fontWeight: 600 }}
                        >
                            <IconFilePdf />
                            <span>Reporte PDF</span>
                        </button>
                        {selectedCuenta.estado !== 'PAGADO' && (() => {
                            const wsLink = buildWsLink(selectedCuenta);
                            return wsLink ? (
                                <a
                                    href={wsLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ flex: 1, minWidth: '120px', height: '42px', border: '1px solid var(--accent-success)', backgroundColor: 'var(--accent-success-bg)', color: 'var(--accent-success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.85rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600 }}
                                >
                                    <IconSend />
                                    <span>Notificar WA</span>
                                </a>
                            ) : null;
                        })()}
                    </div>
                </div>

                {/* Abonos list */}
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Historial de abonos
                </div>
                {loadingAbonos ? (
                    <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>Cargando...</div>
                ) : abonos.length === 0 ? (
                    <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem', fontSize: '0.85rem' }}>Sin abonos registrados</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {abonos.map((abono: Abono) => (
                            <div key={abono.abonoid} style={{ padding: '0.65rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--accent-success)' }}>C$ {Number(abono.monto).toFixed(2)}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{abono.metodopago} · {new Date(abono.fecha).toLocaleDateString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
