import { IconSearch, IconCalendar, IconPhone } from './icons';
import type { Delivery } from './types';

interface ResumenRow {
    nombre: string;
    telefono: string;
    totalEntregas: number;
    montoTotal: number;
}

interface ResumenTabProps {
    resumenSearchQuery: string;
    setResumenSearchQuery: (v: string) => void;
    deliveriesHoy: Delivery[];
    resumenPorRepartidor: ResumenRow[];
    filteredResumen: ResumenRow[];
}

export const ResumenTab = ({
    resumenSearchQuery, setResumenSearchQuery,
    deliveriesHoy, resumenPorRepartidor, filteredResumen,
}: ResumenTabProps) => {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <IconCalendar />
                        <span>Resumen de Entregas — {new Date().toLocaleDateString('es-NI', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Monto acumulado de entregas del día actual por repartidor.</p>
                </div>
                <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '300px', padding: '0 12px', gap: '8px', height: '36px' }}>
                    <IconSearch />
                    <input type="text" placeholder="Buscar por nombre o teléfono..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }} value={resumenSearchQuery} onChange={(e) => setResumenSearchQuery(e.target.value)} />
                </div>
            </div>

            {/* Summary cards */}
            <div className="responsive-grid-sm" style={{ marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '0.4rem' }}>Total Entregas Hoy</div>
                    <div className="tabular" style={{ fontWeight: 700, fontSize: '1.6rem', color: 'var(--accent-primary)' }}>{deliveriesHoy.length}</div>
                </div>
                <div style={{ padding: '1rem 1.25rem', backgroundColor: 'rgba(16, 185, 129, 0.04)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '0.4rem' }}>Monto Total del Día</div>
                    <div className="tabular" style={{ fontWeight: 700, fontSize: '1.6rem', color: 'var(--accent-success)' }}>C$ {deliveriesHoy.reduce((s, d) => s + Number(d.costo || 0), 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</div>
                </div>
                <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '0.4rem' }}>Repartidores Activos</div>
                    <div className="tabular" style={{ fontWeight: 700, fontSize: '1.6rem', color: 'var(--text-primary)' }}>{resumenPorRepartidor.filter(r => r.totalEntregas > 0).length}</div>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '0.75rem 0', fontWeight: 500 }}>Repartidor</th>
                            <th style={{ padding: '0.75rem 0', fontWeight: 500 }}>Teléfono</th>
                            <th style={{ padding: '0.75rem 0', fontWeight: 500, textAlign: 'center' }}>Entregas</th>
                            <th style={{ padding: '0.75rem 0', fontWeight: 500, textAlign: 'right' }}>Monto Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResumen.map((r, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', opacity: r.totalEntregas === 0 ? 0.5 : 1 }}>
                                <td style={{ padding: '0.9rem 0', fontWeight: 600, color: 'var(--text-primary)' }}>{r.nombre}</td>
                                <td style={{ padding: '0.9rem 0', color: 'var(--text-secondary)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <IconPhone />
                                        <span className="tabular">{r.telefono || '—'}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '0.9rem 0', textAlign: 'center' }}>
                                    <span className="tabular" style={{
                                        display: 'inline-block',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        border: r.totalEntregas > 0 ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid var(--border-color)',
                                        backgroundColor: r.totalEntregas > 0 ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-hover)',
                                        color: r.totalEntregas > 0 ? 'var(--accent-primary)' : 'var(--text-secondary)'
                                    }}>
                                        {r.totalEntregas}
                                    </span>
                                </td>
                                <td className="tabular" style={{ padding: '0.9rem 0', textAlign: 'right', fontWeight: 700, color: r.montoTotal > 0 ? 'var(--accent-success)' : 'var(--text-secondary)' }}>
                                    C$ {r.montoTotal.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                        {filteredResumen.length === 0 && (
                            <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Sin resultados.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};
