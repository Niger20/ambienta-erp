import type { PagoMixtoItem } from './types';

interface PagosMixtosPanelProps {
    pagosMixtos: PagoMixtoItem[];
    handleAddPagoMixto: () => void;
    handleRemovePagoMixto: (id: string) => void;
    handleUpdatePagoMixto: (id: string, field: keyof PagoMixtoItem, value: any) => void;
    totalAsignadoMixto: number;
    restanteMixto: number;
    cambioMixto: number;
}

export const PagosMixtosPanel = ({
    pagosMixtos, handleAddPagoMixto, handleRemovePagoMixto, handleUpdatePagoMixto,
    totalAsignadoMixto, restanteMixto, cambioMixto,
}: PagosMixtosPanelProps) => {
    return (
        <div style={{ marginBottom: '1rem', padding: '0.85rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>División de Pago</span>
                <button
                    type="button"
                    onClick={handleAddPagoMixto}
                    style={{
                        border: '1px solid var(--accent-primary)',
                        backgroundColor: 'var(--accent-primary-bg)',
                        color: 'var(--accent-primary)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        borderRadius: '4px',
                        padding: '0.2rem 0.5rem',
                        cursor: 'pointer'
                    }}
                >
                    + Método
                </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {pagosMixtos.map((p) => (
                    <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', padding: '0.55rem', backgroundColor: 'var(--bg-dark)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            <select
                                className="form-input"
                                style={{ flex: 1.2, height: '2.1rem', fontSize: '0.78rem', padding: '0 0.4rem' }}
                                value={p.metodo}
                                onChange={e => handleUpdatePagoMixto(p.id, 'metodo', e.target.value)}
                            >
                                <option value="EFECTIVO">Efectivo</option>
                                <option value="BAC">BAC</option>
                                <option value="LAFISE">LAFISE</option>
                                <option value="TARJETA">Tarjeta POS</option>
                            </select>
                            <div style={{ position: 'relative', flex: 1.2 }}>
                                <span style={{ position: 'absolute', left: '0.4rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>C$</span>
                                <input
                                    type="number"
                                    className="form-input"
                                    style={{ paddingLeft: '1.6rem', height: '2.1rem', fontSize: '0.85rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}
                                    placeholder="0.00"
                                    min={0}
                                    step="any"
                                    value={p.monto}
                                    onChange={e => handleUpdatePagoMixto(p.id, 'monto', e.target.value)}
                                />
                            </div>
                            {pagosMixtos.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemovePagoMixto(p.id)}
                                    style={{ border: 'none', background: 'transparent', color: 'var(--accent-danger)', cursor: 'pointer', padding: '0.2rem', fontSize: '1rem', lineHeight: 1 }}
                                    title="Quitar método"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        {['BAC', 'LAFISE'].includes(p.metodo) && (
                            <input
                                type="text"
                                className="form-input"
                                style={{ height: '1.9rem', fontSize: '0.75rem' }}
                                placeholder="No. Referencia / Transferencia *"
                                value={p.referencia}
                                onChange={e => handleUpdatePagoMixto(p.id, 'referencia', e.target.value)}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span>Cubierto: <strong>C$ {totalAsignadoMixto.toFixed(2)}</strong></span>
                {restanteMixto > 0 ? (
                    <span style={{ color: 'var(--accent-danger)', fontWeight: 700 }}>Falta: C$ {restanteMixto.toFixed(2)}</span>
                ) : (
                    <span style={{ color: 'var(--accent-success)', fontWeight: 700 }}>
                        Completado {cambioMixto > 0 ? `(Cambio: C$ ${cambioMixto.toFixed(2)})` : ''}
                    </span>
                )}
            </div>
        </div>
    );
};
