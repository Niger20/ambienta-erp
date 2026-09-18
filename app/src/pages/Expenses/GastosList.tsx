import { IconSearch, IconEdit, IconTrash } from './icons';
import type { Gasto } from './types';

interface GastosListProps {
    search: string;
    setSearch: (v: string) => void;
    isLoading: boolean;
    filtered: Gasto[];
    selectedGasto: Gasto | null;
    onSelectGasto: (g: Gasto) => void;
    onEditGasto: (g: Gasto) => void;
    onDeleteGasto: (g: Gasto) => void;
}

export const GastosList = ({
    search, setSearch, isLoading, filtered, selectedGasto,
    onSelectGasto, onEditGasto, onDeleteGasto,
}: GastosListProps) => {
    return (
        <div className="card" style={{ padding: '1.5rem' }}>
            {/* Search */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 12px', gap: '8px', height: '38px' }}>
                    <IconSearch />
                    <input type="text" placeholder="Buscar gasto..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }} />
                </div>
            </div>

            {isLoading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'inline-block', width: '2rem', height: '2rem', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'cdPulse 1.5s infinite', marginBottom: '0.5rem' }} />
                    <div>Cargando gastos...</div>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    {search ? 'No se encontraron gastos con esa búsqueda.' : 'No hay gastos registrados. Crea uno nuevo.'}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {filtered.map(g => (
                        <div
                            key={g.gastoid}
                            onClick={() => onSelectGasto(g)}
                            style={{
                                padding: '1rem 1.25rem',
                                borderRadius: 'var(--radius-md)',
                                border: `1px solid ${selectedGasto?.gastoid === g.gastoid ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                backgroundColor: selectedGasto?.gastoid === g.gastoid ? 'rgba(99,102,241,0.05)' : 'var(--bg-dark)',
                                cursor: 'pointer',
                                transition: 'background-color 0.15s ease-out, border-color 0.15s ease-out',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>{g.nombre}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {g.descripcion || 'Sin descripción'}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                                <button
                                    className="btn"
                                    style={{
                                        padding: '0.35rem 0.65rem',
                                        fontSize: '0.78rem',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: 'var(--bg-secondary)',
                                        color: 'var(--text-primary)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        borderRadius: 'var(--radius-md)',
                                        fontWeight: 500
                                    }}
                                    onClick={e => { e.stopPropagation(); onEditGasto(g); }}
                                    title="Editar gasto"
                                >
                                    <IconEdit />
                                    <span>Editar</span>
                                </button>
                                <button
                                    className="btn"
                                    style={{
                                        padding: '0.35rem 0.65rem',
                                        fontSize: '0.78rem',
                                        backgroundColor: 'var(--accent-danger-bg)',
                                        color: 'var(--accent-danger)',
                                        border: '1px solid var(--accent-danger)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        borderRadius: 'var(--radius-md)',
                                        fontWeight: 600
                                    }}
                                    onClick={e => { e.stopPropagation(); onDeleteGasto(g); }}
                                    title="Eliminar gasto"
                                >
                                    <IconTrash />
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
