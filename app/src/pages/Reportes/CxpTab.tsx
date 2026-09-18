import { chipStyle } from './types';

interface CxpTabProps {
    cxpData: any[];
    proveedoresMap: Record<number, any>;
    cxpSummary: {
        cxpEnRango: any[];
        activeCxp: any[];
        sumatoriaComprasTotales: number;
        sumatoriaRestanteCxp: number;
        pagoAbonadoCxp: number;
    };
}

export const CxpTab = ({ cxpData, proveedoresMap, cxpSummary }: CxpTabProps) => {
    const {
        cxpEnRango,
        activeCxp,
        sumatoriaComprasTotales,
        sumatoriaRestanteCxp,
        pagoAbonadoCxp,
    } = cxpSummary;

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontWeight: 600, margin: 0, fontSize: '1.1rem' }}>Cuentas por Pagar (Proveedores)</h3>
                <div style={{ display: 'flex', gap: '1rem', backgroundColor: 'var(--bg-dark)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Compras al Crédito</div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }} className="tabular">C$ {sumatoriaComprasTotales.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div style={{ paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Abonado</div>
                        <div style={{ fontWeight: 700, color: 'var(--accent-success)' }} className="tabular">C$ {pagoAbonadoCxp.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div style={{ paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pendiente</div>
                        <div style={{ fontWeight: 700, color: 'var(--accent-danger)' }} className="tabular">C$ {sumatoriaRestanteCxp.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                    </div>
                </div>
            </div>

            {cxpEnRango.length === 0 && activeCxp.length > 0 && (
                <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: 'var(--accent-warning-bg-light)', border: '1px solid var(--accent-warning-border)', borderRadius: '8px', color: 'var(--accent-warning)', fontSize: '0.85rem' }}>
                    ⚠ No hay cuentas creadas en este rango. Mostrando todas las cuentas activas:
                </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                    <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Proveedor</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Total</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Restante</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Cuotas</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Vence</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {(cxpEnRango.length > 0 ? cxpEnRango : activeCxp)
                        .sort((a, b) => Number(b.montorestante) - Number(a.montorestante))
                        .map(c => {
                            const vencimiento = c.fechavencimiento ? new Date(c.fechavencimiento) : null;
                            const hoy = new Date();
                            const isVencida = vencimiento && vencimiento < hoy;
                            const estadoColor = c.estado === 'PAGADO' ? 'var(--accent-success)' : isVencida ? 'var(--accent-danger)' : 'var(--accent-warning)';
                            const proveedorid = c.proveedorid ?? c.compras?.proveedorid;
                            const proveedorLookup = proveedoresMap[proveedorid];
                            const nombreProveedor = c.proveedores?.nombre
                                || c.proveedores?.nombreempresa
                                || c.compras?.proveedores?.nombreempresa
                                || proveedorLookup?.nombreempresa
                                || proveedorLookup?.nombre
                                || (proveedorid ? `Proveedor #${proveedorid}` : 'Desconocido');

                            const numCuotas = c.cuotas || 1;
                            const valorCuota = c.montocuota || (Number(c.montototal) / numCuotas);
                            let cuotasPagadas = 0;
                            if (valorCuota > 0) {
                                cuotasPagadas = Math.floor(Number(c.montopagado) / valorCuota);
                            }
                            const cuotasTooltip = `Pagadas: ${cuotasPagadas} / Pendientes: ${numCuotas - cuotasPagadas}`;

                            return (
                                <tr key={c.cuentaid || c.cuentapagarid} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: isVencida ? 'rgba(239,68,68,0.04)' : 'transparent' }}>
                                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{nombreProveedor}</td>
                                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }} className="tabular">C$ {Number(c.montototal).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700, color: 'var(--accent-danger)' }} className="tabular">C$ {Number(c.montorestante).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }} title={cuotasTooltip}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{cuotasPagadas}/{numCuotas}</span>
                                    </td>
                                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                                        {vencimiento ? <span style={chipStyle(isVencida ? 'var(--accent-danger)' : 'var(--text-secondary)')}>{vencimiento.toLocaleDateString('es-NI')} {isVencida && '⚠️'}</span> : '—'}
                                    </td>
                                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                                        <span style={chipStyle(estadoColor)}>{c.estado || 'PENDIENTE'}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    {cxpData.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No hay cuentas por pagar</td></tr>}
                </tbody>
            </table>
        </div>
    );
};
