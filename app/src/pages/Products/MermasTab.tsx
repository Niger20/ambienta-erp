import { Pagination } from '../../components/ui/Pagination';
import { IconSearch, IconPlus, IconTrash } from './icons';
import type { Merma } from './types';

interface MermasTabProps {
    mermaSearch: string;
    setMermaSearch: (v: string) => void;
    onOpenMermaModal: () => void;
    mermasLoading: boolean;
    filteredMermas: Merma[];
    paginatedMermas: Merma[];
    mermaPage: number;
    setMermaPage: (p: number) => void;
    totalMermaPages: number;
    onDeleteMerma: (merma: Merma) => void;
}

export const MermasTab = ({
    mermaSearch, setMermaSearch, onOpenMermaModal, mermasLoading,
    filteredMermas, paginatedMermas, mermaPage, setMermaPage, totalMermaPages,
    onDeleteMerma,
}: MermasTabProps) => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '300px', padding: '0 10px', gap: '8px', height: '36px', border: '2px solid var(--border-color)', borderRadius: '12px' }}>
                    <IconSearch />
                    <input type="text" placeholder="Buscar por producto o motivo..." value={mermaSearch} onChange={e => setMermaSearch(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }} />
                </div>
                <button
                    className="btn btn-primary"
                    onClick={onOpenMermaModal}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600
                    }}
                >
                    <IconPlus />
                    <span>Registrar Merma / Quiebre</span>
                </button>
            </div>

            {mermasLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando mermas...</div>
            ) : filteredMermas.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay mermas registradas.</div>
            ) : (
                <div>
                    <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {filteredMermas.length} merma(s) — Pérdida total: <strong style={{ color: 'var(--accent-danger)' }}>C$ {filteredMermas.reduce((s, m) => s + Number(m.costoperdida || 0), 0).toFixed(2)}</strong>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '0.5rem', fontWeight: 500, textAlign: 'left' }}>Fecha</th>
                                    <th style={{ padding: '0.5rem', fontWeight: 500, textAlign: 'left' }}>Producto</th>
                                    <th style={{ padding: '0.5rem', fontWeight: 500, textAlign: 'right' }}>Cant.</th>
                                    <th style={{ padding: '0.5rem', fontWeight: 500, textAlign: 'right' }}>Costo Unit.</th>
                                    <th style={{ padding: '0.5rem', fontWeight: 500, textAlign: 'right' }}>Pérdida</th>
                                    <th style={{ padding: '0.5rem', fontWeight: 500, textAlign: 'left' }}>Convertido a</th>
                                    <th style={{ padding: '0.5rem', fontWeight: 500, textAlign: 'left' }}>Motivo</th>
                                    <th style={{ padding: '0.5rem', fontWeight: 500, textAlign: 'left' }}>Usuario</th>
                                    <th style={{ padding: '0.5rem', fontWeight: 500, textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedMermas.map(m => (
                                    <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.5rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{new Date(m.fecha).toLocaleString()}</td>
                                        <td style={{ padding: '0.5rem', fontWeight: 500 }}>{m.productonombre || `Producto #${m.productoid}`}</td>
                                        <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600 }}>{m.cantidad}</td>
                                        <td style={{ padding: '0.5rem', textAlign: 'right' }}>C$ {Number(m.costounitario).toFixed(2)}</td>
                                        <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600, color: 'var(--accent-danger)' }}>C$ {Number(m.costoperdida).toFixed(2)}</td>
                                        <td style={{ padding: '0.5rem' }}>
                                            {m.productodestinonombre ? (
                                                <span style={{ color: 'var(--accent-success)', fontSize: '0.78rem', fontWeight: 600, backgroundColor: 'var(--accent-success-bg)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                                                    {m.productodestinonombre} ({m.cantidaddestino})
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Pérdida total</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '0.5rem', color: 'var(--text-secondary)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={m.motivo}>{m.motivo}</td>
                                        <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>{m.usuarionombre || '—'}</td>
                                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={() => onDeleteMerma(m)}
                                                title="Anular merma"
                                                style={{ padding: '0.3rem 0.5rem', color: 'var(--accent-danger)', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                                            >
                                                <IconTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination page={mermaPage} totalPages={totalMermaPages} onPageChange={setMermaPage} />
                </div>
            )}
        </div>
    );
};
