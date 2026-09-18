import { chipStyle } from './types';

interface GastosTabProps {
    gastosData: any[];
    gastosSummary: {
        pagosByGasto: Record<number, any[]>;
        getTotalPagado: (gid: number) => number;
        grandTotal: number;
    };
}

export const GastosTab = ({ gastosData, gastosSummary }: GastosTabProps) => {
    const { pagosByGasto, getTotalPagado, grandTotal } = gastosSummary;

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Gastos Operativos</h3>
                <div style={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total Pagado: </span>
                    <strong style={{ color: 'var(--accent-success)' }} className="tabular">C$ {grandTotal.toFixed(2)}</strong>
                </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                    <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Nombre</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left' }}>Descripción</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Nº Pagos</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Total Pagado</th>
                        <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {gastosData.map(g => {
                        const gid = g.gastoid ?? g.id;
                        const pagos = pagosByGasto[gid] || [];
                        const total = getTotalPagado(gid);
                        return (
                            <tr key={gid} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{g.nombre}</td>
                                <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>{g.descripcion || '—'}</td>
                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', color: 'var(--accent-primary)', fontWeight: 600 }} className="tabular">{pagos.length}</td>
                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 600, color: total > 0 ? 'var(--accent-success)' : 'var(--text-secondary)' }} className="tabular">C$ {total.toFixed(2)}</td>
                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                                    <span style={chipStyle(pagos.length > 0 ? 'var(--accent-success)' : 'var(--text-secondary)')}>{pagos.length > 0 ? 'Con pagos' : 'Sin pagos'}</span>
                                </td>
                            </tr>
                        );
                    })}
                    {gastosData.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Sin gastos</td></tr>}
                    {gastosData.length > 0 && (
                        <tr style={{ borderTop: '2px solid var(--border-color)', backgroundColor: 'var(--bg-dark)' }}>
                            <td colSpan={3} style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>TOTAL GENERAL</td>
                            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700, color: 'var(--accent-success)', fontSize: '1.05rem' }} className="tabular">C$ {grandTotal.toFixed(2)}</td>
                            <td />
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
