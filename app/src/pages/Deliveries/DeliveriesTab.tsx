import { IconSearch, IconPlus, IconMapPin, IconCheck } from './icons';
import { StatusToggle } from './StatusToggle';
import type { Delivery } from './types';

interface DeliveriesTabProps {
    deliverySearchQuery: string;
    setDeliverySearchQuery: (v: string) => void;
    deliveryStatusFilter: string;
    setDeliveryStatusFilter: (fn: (prev: string) => string) => void;
    onCreateDelivery: () => void;
    filteredDeliveries: Delivery[];
    onFinalizeDelivery: (id: number) => void;
}

export const DeliveriesTab = ({
    deliverySearchQuery, setDeliverySearchQuery,
    deliveryStatusFilter, setDeliveryStatusFilter,
    onCreateDelivery, filteredDeliveries, onFinalizeDelivery,
}: DeliveriesTabProps) => {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '300px', padding: '0 12px', gap: '8px', height: '36px' }}>
                    <IconSearch />
                    <input type="text" placeholder="Buscar por envío o repartidor..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }} value={deliverySearchQuery} onChange={(e) => setDeliverySearchQuery(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <StatusToggle active={deliveryStatusFilter === 'active'} onToggle={() => setDeliveryStatusFilter(prev => prev === 'active' ? 'inactive' : 'active')} />
                    <button className="btn btn-primary" onClick={onCreateDelivery} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <IconPlus />
                        <span>Nueva Entrega</span>
                    </button>
                </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '1rem 0', fontWeight: 500 }}># Envío</th>
                            <th style={{ padding: '1rem 0', fontWeight: 500 }}>Repartidor</th>
                            <th style={{ padding: '1rem 0', fontWeight: 500 }}>Destino</th>
                            <th style={{ padding: '1rem 0', fontWeight: 500 }}>Costo</th>
                            <th style={{ padding: '1rem 0', fontWeight: 500 }}>Fecha</th>
                            <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDeliveries.map(d => (
                            <tr key={d.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }} className="tabular">#{d.id}</td>
                                <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--text-primary)' }}>{d.repartidornombre || `Rep #${d.repartidorid}`}</td>
                                <td style={{ padding: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <IconMapPin />
                                        <span>{d.direccionentrega}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 0', color: 'var(--accent-success)', fontWeight: 700 }} className="tabular">C$ {Number(d.costo).toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }} className="tabular">{d.fecha ? new Date(d.fecha).toLocaleDateString('es-NI') : '-'}</td>
                                <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                                    {deliveryStatusFilter === 'active' && d.estado !== false && (
                                        <button
                                            className="btn"
                                            onClick={() => onFinalizeDelivery(d.id)}
                                            style={{
                                                padding: '0.35rem 0.7rem',
                                                fontSize: '0.75rem',
                                                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                                                color: 'var(--accent-success)',
                                                border: '1px solid rgba(16, 185, 129, 0.15)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.35rem'
                                            }}
                                        >
                                            <IconCheck />
                                            <span>Finalizar</span>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredDeliveries.length === 0 && <tr><td colSpan={6} style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay entregas registradas.</td></tr>}
                    </tbody>
                </table>
            </div>
        </>
    );
};
