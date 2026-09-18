import { IconFile, IconPlus } from './icons';
import type { OrdenCompra, Proveedor } from './types';

interface OrdenesTabProps {
    ordenSearchQuery: string;
    setOrdenSearchQuery: (v: string) => void;
    ordenStatusFilter: 'all' | 'PENDIENTE' | 'RECIBIDA' | 'CANCELADA';
    setOrdenStatusFilter: (v: 'all' | 'PENDIENTE' | 'RECIBIDA' | 'CANCELADA') => void;
    onOpenCrearOrden: () => void;
    loadingOrdenes: boolean;
    filteredOrdenesCompra: OrdenCompra[];
    proveedores: Proveedor[];
    setSelectedOrdenModal: (o: OrdenCompra) => void;
    handleRecibirOrden: (orden: OrdenCompra) => void;
    exportOrdenCompraPDF: (orden: OrdenCompra) => void;
    handleCancelarOrden: (ordenId: number) => Promise<void>;
}

export const OrdenesTab = ({
    ordenSearchQuery, setOrdenSearchQuery, ordenStatusFilter, setOrdenStatusFilter, onOpenCrearOrden,
    loadingOrdenes, filteredOrdenesCompra, proveedores, setSelectedOrdenModal,
    handleRecibirOrden, exportOrdenCompraPDF, handleCancelarOrden,
}: OrdenesTabProps) => {
    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flex: '1 1 300px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '320px', padding: '0 10px', gap: '8px', height: '36px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input
                            type="text"
                            placeholder="Buscar orden por ID o proveedor..."
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }}
                            value={ordenSearchQuery}
                            onChange={(e) => setOrdenSearchQuery(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-dark)', padding: '0.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        {(['all', 'PENDIENTE', 'RECIBIDA', 'CANCELADA'] as const).map(st => (
                            <button
                                key={st}
                                type="button"
                                onClick={() => setOrdenStatusFilter(st)}
                                style={{
                                    border: 'none',
                                    borderRadius: 'calc(var(--radius-md) - 2px)',
                                    backgroundColor: ordenStatusFilter === st ? 'var(--bg-card)' : 'transparent',
                                    color: ordenStatusFilter === st ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    padding: '0.35rem 0.65rem',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease-out'
                                }}
                            >
                                {st === 'all' ? 'Todos' : st}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onOpenCrearOrden}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <IconPlus /> Nueva Orden de Compra
                </button>
            </div>

            {loadingOrdenes ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando órdenes de compra...</div>
            ) : filteredOrdenesCompra.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No se encontraron órdenes de compra registradas.
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>ID</th>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Proveedor</th>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Fecha Emisión</th>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Fecha Esperada</th>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Items</th>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }} className="text-right">Total Estimado</th>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: 500, textAlign: 'center' }}>Estado</th>
                                <th style={{ padding: '1rem 0.5rem', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrdenesCompra.map(orden => {
                                const ordenId = orden.id ?? orden.ordencompraid;
                                const provName = orden.proveedores?.nombreempresa || proveedores.find(p => Number(p.id ?? p.proveedorid) === Number(orden.proveedorid))?.nombreempresa || 'Proveedor N/A';
                                const items: any[] = (orden.productos && orden.productos.length > 0)
                                    ? orden.productos
                                    : (orden.ordenescompraproductos || []);
                                const totalEst = items.reduce((sum: number, it: any) => sum + (Number(it.cantidadordenada) || 0) * (Number(it.preciounitario) || 0), 0);
                                const isPendiente = orden.estado === 'PENDIENTE';
                                const isRecibida = orden.estado === 'RECIBIDA' || orden.estado === 'RECIBIDA_TOTAL' || orden.estado === 'RECIBIDA_PARCIAL' || orden.estado === 'FACTURADA';

                                return (
                                    <tr key={ordenId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>#{ordenId}</td>
                                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600 }}>{provName}</td>
                                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{new Date(orden.fechaorden).toLocaleDateString('es-NI')}</td>
                                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            {orden.fechaesperada ? new Date(orden.fechaesperada).toLocaleDateString('es-NI') : '—'}
                                        </td>
                                        <td style={{ padding: '0.85rem 0.5rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedOrdenModal(orden)}
                                                    style={{
                                                        backgroundColor: 'var(--bg-secondary)',
                                                        border: '1px solid var(--border-color)',
                                                        color: 'var(--accent-primary)',
                                                        padding: '0.25rem 0.55rem',
                                                        borderRadius: '4px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                        width: 'fit-content'
                                                    }}
                                                    title="Clic para ver detalle de productos de la orden"
                                                >
                                                    <span>{items.length} producto{items.length !== 1 ? 's' : ''}</span>
                                                    <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Ver</span>
                                                </button>
                                                {items.length > 0 && (
                                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {items.map((it: any) => `${it.productonombre || `Prod #${it.productoid}`} (x${it.cantidadordenada})`).join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
                                            C$ {totalEst.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '0.25rem 0.6rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                backgroundColor: isRecibida ? 'var(--accent-success-bg)' : isPendiente ? 'var(--accent-warning-bg)' : 'var(--accent-danger-bg)',
                                                color: isRecibida ? 'var(--accent-success)' : isPendiente ? 'var(--accent-warning)' : 'var(--accent-danger)',
                                                border: `1px solid ${isRecibida ? 'var(--accent-success)' : isPendiente ? 'var(--accent-warning)' : 'var(--accent-danger)'}`
                                            }}>
                                                {orden.estado.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                                {isPendiente && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                                                        onClick={() => handleRecibirOrden(orden)}
                                                        title="Recepcionar mercadería física y facturar compra"
                                                    >
                                                        Recibir y Facturar
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    className="btn"
                                                    style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                                                    onClick={() => exportOrdenCompraPDF(orden)}
                                                    title="Descargar/Imprimir Orden de Compra en PDF"
                                                >
                                                    <IconFile /> PDF
                                                </button>
                                                {isPendiente && (
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', color: 'var(--accent-danger)', backgroundColor: 'var(--accent-danger-bg)' }}
                                                        onClick={() => handleCancelarOrden(ordenId!)}
                                                        title="Cancelar Orden de Compra"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
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
