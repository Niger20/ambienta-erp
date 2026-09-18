import type { Category } from './types';

interface CatAssignModalProps {
    show: boolean;
    pendingProducts: any[];
    catAssignMap: Record<number, string>;
    setCatAssignMap: (fn: (prev: Record<number, string>) => Record<number, string>) => void;
    categories: Category[];
    onCancel: () => void;
    onConfirm: () => void;
}

export const CatAssignModal = ({
    show, pendingProducts, catAssignMap, setCatAssignMap, categories, onCancel, onConfirm,
}: CatAssignModalProps) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '640px' }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Asignar Categorías</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Los siguientes productos tienen una categoría inválida o vacía. Selecciona una para cada uno (o déjala en blanco) antes de importar.
                </p>
                <div style={{ maxHeight: '360px', overflowY: 'auto', marginBottom: '1.25rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                <th style={{ padding: '0.5rem 0', fontWeight: 500, textAlign: 'left' }}>Producto</th>
                                <th style={{ padding: '0.5rem 0', fontWeight: 500, textAlign: 'left', width: '40%' }}>Categoría</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingProducts.map((p: any, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '0.6rem 0' }}>
                                        <div style={{ fontWeight: 500 }}>{p.nombre}</div>
                                        {p._needsCat && p._rawCat && (
                                            <div style={{ fontSize: '0.72rem', color: 'var(--accent-danger)', marginTop: '0.1rem' }}>
                                                ⚠ "{p._rawCat}" no encontrada
                                            </div>
                                        )}
                                        {!p._needsCat && (
                                            <div style={{ fontSize: '0.72rem', color: 'var(--accent-success)', marginTop: '0.1rem' }}>✓ Categoría OK</div>
                                        )}
                                    </td>
                                    <td style={{ padding: '0.6rem 0 0.6rem 1rem' }}>
                                        {p._needsCat ? (
                                            <select
                                                className="form-input"
                                                style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                                                value={catAssignMap[i] ?? ''}
                                                onChange={e => setCatAssignMap(prev => ({ ...prev, [i]: e.target.value }))}
                                            >
                                                <option value="">Sin categoría</option>
                                                {categories.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span style={{ fontSize: '0.85rem', color: 'var(--accent-success)' }}>
                                                {categories.find(c => c.id === (p as any).categoriaid)?.name || '—'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="modal-actions">
                    <button className="btn" onClick={onCancel}>Cancelar</button>
                    <button className="btn btn-primary" onClick={onConfirm}>Confirmar e Importar</button>
                </div>
            </div>
        </div>
    );
};
