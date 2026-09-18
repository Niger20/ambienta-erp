import type { Venta } from './types';

interface RetirosTabProps {
    loadingRetiros: boolean;
    retiros: any[];
    sales: Venta[];
    setShowRetiroModal: (v: boolean) => void;
}

export const RetirosTab = ({ loadingRetiros, retiros, sales, setShowRetiroModal }: RetirosTabProps) => {
    return (
        <div className="tab-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <div>
                    <h3 className="card-title" style={{ margin: 0 }}>Historial de Retiros</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                        Retiros de efectivo de caja activa en esta sesión. Se registrarán como deuda de crédito del cliente correspondiente.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowRetiroModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', height: '36px' }}>
                    <span>+ Registrar Retiro</span>
                </button>
            </div>

            {loadingRetiros ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando retiros...</div>
            ) : retiros.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No se han registrado retiros de efectivo.</div>
            ) : (
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ minWidth: '850px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '1rem 0', fontWeight: 500 }}>ID Pago</th>
                                <th style={{ padding: '1rem 0', fontWeight: 500 }}>Fecha</th>
                                <th style={{ padding: '1rem 0', fontWeight: 500 }}>Beneficiario (Deudor)</th>
                                <th style={{ padding: '1rem 0', fontWeight: 500 }}>Método</th>
                                <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {retiros.map((r: any) => {
                                const p = r.pago || r;
                                const pDate = p.fecha;
                                const pMonto = Number(p.monto || 0);

                                const pTime = new Date(pDate).getTime();
                                const matchingSale = sales.find(s =>
                                    s.tipoventa === 'CREDITO' &&
                                    Math.abs(Number(s.total) - pMonto) < 0.01 &&
                                    Math.abs(new Date(s.fecha).getTime() - pTime) < 60000
                                );
                                const clientName = matchingSale
                                    ? (matchingSale.clientenombre || matchingSale.clientes?.nombre || 'Cliente')
                                    : 'Desconocido';

                                return (
                                    <tr key={p.pagoid || p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }} className="tabular">#{p.pagoid || p.id}</td>
                                        <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }} className="tabular">{new Date(pDate).toLocaleString()}</td>
                                        <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--text-primary)' }}>{clientName}</td>
                                        <td style={{ padding: '1rem 0' }}>
                                            <span className="pos-session-badge pos-session-badge--closed" style={{ textTransform: 'uppercase' }}>
                                                {p.metodopago}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 700, color: 'var(--accent-danger)' }} className="tabular">
                                            C$ {pMonto.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
