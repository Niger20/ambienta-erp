import { IconSearch, IconPlus, IconPhone, IconEdit, IconTrash } from './icons';
import { StatusToggle } from './StatusToggle';
import type { Repartidor, Delivery } from './types';

interface RepartidoresTabProps {
    repartidorSearchQuery: string;
    setRepartidorSearchQuery: (v: string) => void;
    repartidorStatusFilter: string;
    setRepartidorStatusFilter: (fn: (prev: string) => string) => void;
    onCreateRepartidor: () => void;
    filteredRepartidores: Repartidor[];
    deliveriesHoy: Delivery[];
    onEditRepartidor: (r: Repartidor) => void;
    onDeleteRepartidor: (id: number) => void;
}

export const RepartidoresTab = ({
    repartidorSearchQuery, setRepartidorSearchQuery,
    repartidorStatusFilter, setRepartidorStatusFilter,
    onCreateRepartidor, filteredRepartidores, deliveriesHoy,
    onEditRepartidor, onDeleteRepartidor,
}: RepartidoresTabProps) => {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '300px', padding: '0 12px', gap: '8px', height: '36px' }}>
                    <IconSearch />
                    <input type="text" placeholder="Buscar por nombre o teléfono..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }} value={repartidorSearchQuery} onChange={(e) => setRepartidorSearchQuery(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <StatusToggle active={repartidorStatusFilter === 'active'} onToggle={() => setRepartidorStatusFilter(prev => prev === 'active' ? 'inactive' : 'active')} />
                    <button className="btn btn-primary" onClick={onCreateRepartidor} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <IconPlus />
                        <span>Nuevo Repartidor</span>
                    </button>
                </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '1rem 0', fontWeight: 500 }}>Nombre</th>
                            <th style={{ padding: '1rem 0', fontWeight: 500 }}>Teléfono</th>
                            <th style={{ padding: '1rem 0', fontWeight: 500 }}>Entregas Hoy</th>
                            <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRepartidores.map(r => {
                            const rid = r.id ?? r.repartidorid;
                            const entregasHoy = deliveriesHoy.filter(d => d.repartidorid === rid).length;
                            return (
                                <tr key={rid} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--text-primary)' }}>{r.nombre}</td>
                                    <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                            <IconPhone />
                                            <span className="tabular">{r.telefono || '—'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 0' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.65rem',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            border: entregasHoy > 0 ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid var(--border-color)',
                                            backgroundColor: entregasHoy > 0 ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-hover)',
                                            color: entregasHoy > 0 ? 'var(--accent-primary)' : 'var(--text-secondary)'
                                        }}>
                                            {entregasHoy} entrega{entregasHoy !== 1 ? 's' : ''}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button className="btn" onClick={() => onEditRepartidor(r)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }} title="Editar repartidor">
                                                <IconEdit />
                                                <span>Editar</span>
                                            </button>
                                            {repartidorStatusFilter === 'active' && (
                                                <button className="btn" onClick={() => onDeleteRepartidor(rid as number)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: 'var(--accent-danger)', border: '1px solid rgba(239, 68, 68, 0.15)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }} title="Eliminar repartidor">
                                                    <IconTrash />
                                                    <span>Eliminar</span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredRepartidores.length === 0 && <tr><td colSpan={4} style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay repartidores encontrados.</td></tr>}
                    </tbody>
                </table>
            </div>
        </>
    );
};
