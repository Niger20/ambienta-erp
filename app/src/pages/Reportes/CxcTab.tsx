import { chipStyle } from './types';

interface CxcTabProps {
    cxcData: any[];
    clientesMap: Record<number, any>;
    cxcSummary: {
        cxcEnRango: any[];
        activeCxc: any[];
        sumatoriaIngresosEsperados: number;
        sumatoriaRestante: number;
        montoRecuperado: number;
        alertThreshold: Date;
        hoy: Date;
    };
}

export const CxcTab = ({ cxcData, clientesMap, cxcSummary }: CxcTabProps) => {
    const {
        cxcEnRango,
        activeCxc,
        sumatoriaIngresosEsperados,
        sumatoriaRestante,
        montoRecuperado,
        alertThreshold,
        hoy,
    } = cxcSummary;

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontWeight: 600, margin: 0, fontSize: '1.1rem' }}>Cuentas por Cobrar (Clientes)</h3>
                <div style={{ display: 'flex', gap: '1rem', backgroundColor: 'var(--bg-dark)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Crédito Otorgado</div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }} className="tabular">C$ {sumatoriaIngresosEsperados.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div style={{ paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Recuperado</div>
                        <div style={{ fontWeight: 700, color: 'var(--accent-success)' }} className="tabular">C$ {montoRecuperado.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div style={{ paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Por Cobrar</div>
                        <div style={{ fontWeight: 700, color: 'var(--accent-warning)' }} className="tabular">C$ {sumatoriaRestante.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                    </div>
                </div>
            </div>

            {cxcEnRango.length === 0 && activeCxc.length > 0 && (
                <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', backgroundColor: 'var(--accent-warning-bg-light)', border: '1px solid var(--accent-warning-border)', borderRadius: '8px', color: 'var(--accent-warning)', fontSize: '0.85rem' }}>
                    ⚠ No hay cuentas creadas en este rango. Se muestran todas las cuentas activas a continuación:
                </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                    <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Cliente</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Teléfono</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Total</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Restante</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Vencimiento</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Estado</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>WS</th>
                    </tr>
                </thead>
                <tbody>
                    {(cxcEnRango.length > 0 ? cxcEnRango : activeCxc)
                        .sort((a, b) => Number(b.montorestante) - Number(a.montorestante))
                        .map(c => {
                            const vencimiento = c.fechavencimiento ? new Date(c.fechavencimiento) : null;
                            const isVencida = vencimiento && vencimiento < hoy;
                            const isPorVencer = vencimiento && vencimiento >= hoy && vencimiento <= alertThreshold;

                            const clienteLookup = clientesMap[c.clienteid];
                            const nombreCliente = c.clientes?.nombre || clienteLookup?.nombre || `Cliente #${c.clienteid}`;
                            const telefonoRaw = c.clientes?.telefono || clienteLookup?.telefono || '';
                            const telefono = telefonoRaw.replace(/\D/g, '');
                            const telefonoFull = telefono ? (telefono.startsWith('505') ? telefono : `505${telefono}`) : '';
                            const wsLink = telefonoFull
                                ? `https://wa.me/${telefonoFull}?text=${encodeURIComponent(`Hola ${nombreCliente}, le recordamos que tiene un saldo pendiente de C$${Number(c.montorestante).toFixed(2)}. Por favor comuníquese con nosotros para coordinar su pago. ¡Gracias!`)}`
                                : null;

                            const estadoColor = c.estado === 'PAGADO'
                                ? 'var(--accent-success)'
                                : isVencida ? 'var(--accent-danger)'
                                    : 'var(--accent-warning)';

                            return (
                                <tr key={c.cuentaid ?? c.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: isVencida ? 'rgba(239, 68, 68, 0.04)' : isPorVencer ? 'rgba(245, 158, 11, 0.04)' : 'transparent' }}>
                                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{nombreCliente}</td>
                                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>{telefonoRaw || '—'}</td>
                                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }} className="tabular">C$ {Number(c.montototal).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700, color: 'var(--accent-warning)' }} className="tabular">C$ {Number(c.montorestante).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                                        {vencimiento ? (
                                            <span style={chipStyle(isVencida ? 'var(--accent-danger)' : isPorVencer ? 'var(--accent-warning)' : 'var(--text-secondary)')}>
                                                {vencimiento.toLocaleDateString('es-NI')} {isVencida && '⚠️'}
                                            </span>
                                        ) : '—'}
                                    </td>
                                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                                        <span style={chipStyle(estadoColor)}>{c.estado || 'PENDIENTE'}</span>
                                    </td>
                                    <td style={{ padding: '0.5rem 0.5rem', textAlign: 'right' }}>
                                        {wsLink ? (
                                            <a href={wsLink} target="_blank" rel="noreferrer" className="btn" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', backgroundColor: '#25D366', color: '#fff', border: 'none', textDecoration: 'none', borderRadius: '6px', fontWeight: 600 }}>
                                                💬 WA
                                            </a>
                                        ) : (
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>—</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    {cxcData.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No hay cuentas pendientes</td></tr>}
                </tbody>
            </table>
        </div>
    );
};
