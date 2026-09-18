import { IconFile, IconPlus } from './icons';
import type { Abono, CuentaPorPagar } from './types';

interface CuentasPorPagarTabProps {
    cuentaPagarSearchQuery: string;
    setCuentaPagarSearchQuery: (v: string) => void;
    isLoading: boolean;
    filteredCuentasPorPagar: CuentaPorPagar[];
    selectedCuentaPagar: CuentaPorPagar | null;
    setSelectedCuentaPagar: (c: CuentaPorPagar | null) => void;
    openCuentaDetail: (c: CuentaPorPagar) => void;
    estadoColor: (estado: string) => { color: string; bg: string };
    setShowPagoModal: (v: boolean) => void;
    exportFacturaPDF: (cuenta: CuentaPorPagar, abonosList: Abono[]) => void;
    loadingAbonos: boolean;
    abonos: Abono[];
}

export const CuentasPorPagarTab = ({
    cuentaPagarSearchQuery, setCuentaPagarSearchQuery, isLoading, filteredCuentasPorPagar,
    selectedCuentaPagar, setSelectedCuentaPagar, openCuentaDetail, estadoColor,
    setShowPagoModal, exportFacturaPDF, loadingAbonos, abonos,
}: CuentasPorPagarTabProps) => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
                <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '300px', padding: '0 10px', gap: '8px', height: '36px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Buscar por proveedor o ID compra..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }} value={cuentaPagarSearchQuery} onChange={(e) => setCuentaPagarSearchQuery(e.target.value)} />
                </div>
            </div>
            <div className={`split-layout-sidebar-400 ${!selectedCuentaPagar ? 'collapsed' : ''}`}>
                <div>
                    {isLoading ? <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando...</div> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Compra #</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Proveedor</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Total</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Pagado</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Restante</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Cuotas</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Vence</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Estado</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCuentasPorPagar.map(c => {
                                    const { color, bg } = estadoColor(c.estado);
                                    const isSelected = (c.id || c.cuentapagarid) === (selectedCuentaPagar?.id || selectedCuentaPagar?.cuentapagarid);

                                    // Calculate cuotas info
                                    const numCuotas = c.cuotas || 1;
                                    const valorCuota = c.montocuota || (Number(c.montototal) / numCuotas);
                                    let cuotasPagadas = 0;
                                    if (valorCuota > 0) {
                                        cuotasPagadas = Math.floor(Number(c.montopagado) / valorCuota);
                                    }
                                    const cuotasTooltip = `Pagadas: ${cuotasPagadas} / Pendientes: ${numCuotas - cuotasPagadas}`;

                                    return (
                                        <tr key={c.cuentapagarid ?? c.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: isSelected ? 'rgba(99,102,241,0.05)' : '' }}>
                                            <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>#{c.compraid}</td>
                                            <td style={{ padding: '0.75rem 0' }}>{c.compras?.proveedores?.nombreempresa || '-'}</td>
                                            <td className="col-price" style={{ padding: '0.75rem 0' }}>C$ {Number(c.montototal).toFixed(2)}</td>
                                            <td className="col-price" style={{ padding: '0.75rem 0', color: 'var(--accent-success)' }}>C$ {Number(c.montopagado).toFixed(2)}</td>
                                            <td className="col-price" style={{ padding: '0.75rem 0', fontWeight: 600, color: Number(c.montorestante) > 0 ? 'var(--accent-danger)' : 'var(--accent-success)' }}>C$ {Number(c.montorestante).toFixed(2)}</td>
                                            <td className="col-number" style={{ padding: '0.75rem 0' }} title={cuotasTooltip}>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{cuotasPagadas}/{numCuotas}</span>
                                            </td>
                                            <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{new Date(c.fechavencimiento).toLocaleDateString()}</td>
                                            <td style={{ padding: '0.75rem 0' }}>
                                                <span style={{ color, backgroundColor: bg, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>{c.estado}</span>
                                            </td>
                                            <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                                                <button className="btn" onClick={() => openCuentaDetail(c)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <IconFile /> Ver abonos
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredCuentasPorPagar.length === 0 && <tr><td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay cuentas por pagar.</td></tr>}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Right: Detail panel */}
                {selectedCuentaPagar && (
                    <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{selectedCuentaPagar.compras?.proveedores?.nombreempresa || `Proveedor Desconocido`}</h3>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <span>Compra</span><span>#{selectedCuentaPagar.compraid}</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedCuentaPagar(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>✕</button>
                        </div>

                        {/* Summary */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                            {[
                                { label: 'Total', value: `C$ ${Number(selectedCuentaPagar.montototal).toFixed(2)}`, color: 'var(--text-primary)' },
                                { label: 'Pagado', value: `C$ ${Number(selectedCuentaPagar.montopagado).toFixed(2)}`, color: 'var(--accent-success)' },
                                { label: 'Restante', value: `C$ ${Number(selectedCuentaPagar.montorestante).toFixed(2)}`, color: 'var(--accent-danger)' },
                                { label: 'Estado', value: selectedCuentaPagar.estado, color: estadoColor(selectedCuentaPagar.estado).color },
                            ].map(item => (
                                <div key={item.label} style={{ padding: '0.6rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{item.label}</div>
                                    <div style={{ fontWeight: 600, color: item.color, fontSize: '0.95rem' }}>{item.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            {selectedCuentaPagar.estado !== 'PAGADO' && (
                                <button className="btn btn-primary" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }} onClick={() => setShowPagoModal(true)}>
                                    <IconPlus /> Registrar Abono
                                </button>
                            )}
                            <button className="btn" style={{ flex: 1, border: '1px solid var(--border-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }} onClick={() => exportFacturaPDF(selectedCuentaPagar, abonos)}>
                                <IconFile /> Exportar PDF
                            </button>
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
                                {abonos.map((abono) => (
                                    <div key={abono.id || abono.pagoid || abono.abonoid} style={{ padding: '0.65rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--accent-success)' }}>C$ {Number(abono.monto).toFixed(2)}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{abono.metodopago} · {new Date(abono.fecha).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
