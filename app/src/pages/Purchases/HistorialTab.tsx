import { IconEdit, IconFile } from './icons';
import type { Compra } from './types';

interface HistorialTabProps {
    isAdmin: boolean;
    isLoading: boolean;
    compraSearchQuery: string;
    setCompraSearchQuery: (v: string) => void;
    compraStatusFilter: string;
    setCompraStatusFilter: React.Dispatch<React.SetStateAction<string>>;
    paginatedCompras: Compra[];
    filteredCompras: Compra[];
    compraPage: number;
    setCompraPage: React.Dispatch<React.SetStateAction<number>>;
    totalCompraPages: number;
    exportCompraDetallePDF: (c: Compra) => Promise<void>;
    handleOpenEditModal: (c: Compra) => Promise<void>;
    handleVoidCompra: (id: number) => Promise<void>;
}

export const HistorialTab = ({
    isAdmin, isLoading, compraSearchQuery, setCompraSearchQuery, compraStatusFilter, setCompraStatusFilter,
    paginatedCompras, filteredCompras, compraPage, setCompraPage, totalCompraPages,
    exportCompraDetallePDF, handleOpenEditModal, handleVoidCompra,
}: HistorialTabProps) => {
    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '300px', padding: '0 10px', gap: '8px', height: '36px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Buscar por ID o proveedor..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }} value={compraSearchQuery} onChange={(e) => setCompraSearchQuery(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {compraStatusFilter === 'active' ? 'Mostrando Activos' : 'Mostrando Anuladas'}
                    </span>
                    <div onClick={() => setCompraStatusFilter(prev => prev === 'active' ? 'inactive' : 'active')} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', width: '40px', height: '24px', backgroundColor: compraStatusFilter === 'active' ? 'var(--accent-success)' : 'var(--accent-danger)', borderRadius: '12px', position: 'relative', transition: 'background-color 0.25s cubic-bezier(0.23, 1, 0.32, 1)' }} title="Clic para alternar filtro (Activos / Inactivos)">
                        <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: '3px', transform: compraStatusFilter === 'active' ? 'translateX(16px)' : 'translateX(0)', transition: 'transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                    </div>
                </div>
            </div>
            {isLoading ? <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando...</div> : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '1rem 0', fontWeight: 500 }}>ID</th>
                                <th style={{ padding: '1rem 0', fontWeight: 500 }}>Fecha</th>
                                <th style={{ padding: '1rem 0', fontWeight: 500 }}>Proveedor</th>
                                <th style={{ padding: '1rem 0', fontWeight: 500 }}>Tipo</th>
                                <th style={{ padding: '1rem 0', fontWeight: 500 }}>Método</th>
                                <th style={{ padding: '1rem 0', fontWeight: 500 }}>Total</th>
                                <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCompras.map(c => {
                                const isAnulada = (c as any)._anulada || (c as any).estado === false || (c as any).estado === 'ANULADA';
                                return (
                                    <tr key={`${c.id ?? c.compraid}-${isAnulada}`} style={{ borderBottom: '1px solid var(--border-color)', opacity: isAnulada ? 0.55 : 1 }}>
                                        <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>#{c.id ?? c.compraid}</td>
                                        <td style={{ padding: '0.75rem 0' }}>{new Date(c.fecha).toLocaleDateString()}</td>
                                        <td style={{ padding: '0.75rem 0' }}>{c.proveedores?.nombreempresa || 'Desconocido'}</td>
                                        <td style={{ padding: '0.75rem 0' }}>
                                            <span style={{ color: c.tipocompra === 'CREDITO' ? 'var(--accent-danger)' : 'var(--accent-primary)', backgroundColor: c.tipocompra === 'CREDITO' ? 'var(--accent-danger-bg)' : 'var(--accent-primary-bg)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{c.tipocompra}</span>
                                        </td>
                                        <td style={{ padding: '0.75rem 0', textTransform: 'capitalize' }}>{c.metodopago}</td>
                                        <td className="col-price" style={{ padding: '0.75rem 0', fontWeight: 500 }}>C$ {Number(c.total).toFixed(2)}</td>
                                        <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                <button
                                                    className="btn"
                                                    onClick={() => exportCompraDetallePDF(c)}
                                                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', backgroundColor: 'var(--accent-primary-bg)', color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                                                >
                                                    <IconFile /> Detalle
                                                </button>
                                                {isAdmin && !isAnulada && (
                                                    <button
                                                        className="btn"
                                                        onClick={() => handleOpenEditModal(c)}
                                                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                                                        title="Editar Compra (Solo Administrador)"
                                                    >
                                                        <IconEdit /> Editar
                                                    </button>
                                                )}
                                                {isAnulada ? (
                                                    <span style={{ color: 'var(--accent-danger)', background: 'var(--accent-danger-bg)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>ANULADA</span>
                                                ) : (
                                                    <button
                                                        className="btn"
                                                        onClick={() => handleVoidCompra(c.id ?? c.compraid!)}
                                                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', backgroundColor: 'var(--accent-danger-bg)', color: 'var(--accent-danger)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                                                    >
                                                        Anular
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredCompras.length === 0 && <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No se encontraron compras.</td></tr>}
                        </tbody>
                    </table>
                    {totalCompraPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', paddingBottom: '1rem' }}>
                            <button
                                type="button"
                                className="btn"
                                disabled={compraPage === 1}
                                onClick={() => setCompraPage(p => p - 1)}
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
                            >
                                Anterior
                            </button>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Página {compraPage} de {totalCompraPages}
                            </span>
                            <button
                                type="button"
                                className="btn"
                                disabled={compraPage === totalCompraPages}
                                onClick={() => setCompraPage(p => p + 1)}
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
