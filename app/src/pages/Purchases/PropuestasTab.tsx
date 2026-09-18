import { IconFile, IconGlobal, IconPhone, IconUser } from './icons';
import type { Proveedor } from './types';

interface PropuestasTabProps {
    handleGenerarPropuestaGlobal: () => Promise<void>;
    proveedores: Proveedor[];
    handleGenerarPropuesta: (proveedorId: number) => Promise<void>;
}

export const PropuestasTab = ({ handleGenerarPropuestaGlobal, proveedores, handleGenerarPropuesta }: PropuestasTabProps) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Tarjeta destacada de Pedido Global */}
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(99, 102, 241, 0.04) 100%)', border: '1px solid var(--accent-primary)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-primary-bg)', color: 'var(--accent-primary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                            <IconGlobal /> PEDIDO GLOBAL RECOMENDADO
                        </div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                            Generar Pedido Global de Reabastecimiento
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            Obtén en un solo documento PDF <strong>todos los productos del inventario que necesitan reabastecer</strong> (stock igual o menor al mínimo o agotados), calculando automáticamente las unidades a pedir según las ventas de las últimas 3 semanas.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleGenerarPropuestaGlobal}
                        style={{ padding: '0.85rem 1.75rem', fontWeight: 700, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)', whiteSpace: 'nowrap' }}
                    >
                        <IconGlobal /> Generar Pedido Global (PDF)
                    </button>
                </div>
            </div>

            <div className="card">
                <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>Propuestas Automáticas por Proveedor</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Seleccione un proveedor para generar una propuesta de compra individual en formato PDF. El algoritmo calcula la demanda ponderada dando 50% de peso a la última semana, 30% a la penúltima y 20% a la antepenúltima.
                </p>
                {proveedores.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay proveedores registrados.</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {proveedores.map(p => (
                            <div
                                key={p.id ?? p.proveedorid}
                                className="proposal-card"
                                onClick={() => handleGenerarPropuesta(p.id ?? p.proveedorid!)}
                            >
                                <div>
                                    <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{p.nombreempresa}</h4>
                                    <div className="proposal-card-info-item">
                                        <IconUser />
                                        <span>{p.asesorventas || 'Sin asesor'}</span>
                                    </div>
                                    {p.telefono && (
                                        <div className="proposal-card-info-item" style={{ marginTop: '0.35rem' }}>
                                            <IconPhone />
                                            <span>{p.telefono}</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.5rem' }}
                                >
                                    <IconFile /> Generar Propuesta
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
