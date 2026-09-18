import { IconEdit, IconPlus, IconTrash } from './icons';
import type { Proveedor } from './types';

interface SuppliersTabProps {
    proveedorSearchQuery: string;
    setProveedorSearchQuery: (v: string) => void;
    proveedorStatusFilter: string;
    setProveedorStatusFilter: React.Dispatch<React.SetStateAction<string>>;
    openCreateProveedor: () => void;
    filteredProveedores: Proveedor[];
    openEditProveedor: (p: Proveedor) => void;
    deleteProveedor: (id: number) => Promise<void>;
}

export const SuppliersTab = ({
    proveedorSearchQuery, setProveedorSearchQuery, proveedorStatusFilter, setProveedorStatusFilter,
    openCreateProveedor, filteredProveedores, openEditProveedor, deleteProveedor,
}: SuppliersTabProps) => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '300px', padding: '0 10px', gap: '8px', height: '36px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Buscar por empresa o asesor..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }} value={proveedorSearchQuery} onChange={(e) => setProveedorSearchQuery(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {proveedorStatusFilter === 'active' ? 'Mostrando Activos' : 'Mostrando Inactivos'}
                    </span>
                    <div onClick={() => setProveedorStatusFilter(prev => prev === 'active' ? 'inactive' : 'active')} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', width: '40px', height: '24px', backgroundColor: proveedorStatusFilter === 'active' ? 'var(--accent-success)' : 'var(--accent-danger)', borderRadius: '12px', position: 'relative', transition: 'background-color 0.25s cubic-bezier(0.23, 1, 0.32, 1)' }} title="Clic para alternar filtro (Activos / Inactivos)">
                        <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: '3px', transform: proveedorStatusFilter === 'active' ? 'translateX(16px)' : 'translateX(0)', transition: 'transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                    </div>
                    <button className="btn btn-primary" onClick={openCreateProveedor} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><IconPlus /> Agregar Proveedor</button>
                </div>
            </div>
            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '1rem 0', fontWeight: 500 }}>Empresa</th>
                            <th style={{ padding: '1rem 0', fontWeight: 500 }}>Asesor de Ventas</th>
                            <th style={{ padding: '1rem 0', fontWeight: 500 }}>Teléfono</th>
                            <th style={{ padding: '1rem 0', fontWeight: 500 }}>Dirección</th>
                            <th style={{ padding: '1rem 0', fontWeight: 500 }}>Clasificación</th>
                            <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProveedores.map(p => {
                            const isInactivo = (p as any).estado === false;
                            return (
                                <tr key={p.id ?? p.proveedorid} style={{ borderBottom: '1px solid var(--border-color)', opacity: isInactivo ? 0.55 : 1 }}>
                                    <td style={{ padding: '0.75rem 0', fontWeight: 500 }}>
                                        {p.nombreempresa}
                                        {isInactivo && <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', color: 'var(--accent-danger)', background: 'var(--accent-danger-bg)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>INACTIVO</span>}
                                    </td>
                                    <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>{p.asesorventas}</td>
                                    <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>{p.telefono || '-'}</td>
                                    <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>{p.direccion || '-'}</td>
                                    <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>{p.clasificacion || '-'}</td>
                                    <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                                        <button className="btn" onClick={() => openEditProveedor(p)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-primary)', marginRight: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><IconEdit /> Editar</button>
                                        <button className="btn" onClick={() => deleteProveedor(p.id ?? p.proveedorid!)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', backgroundColor: 'var(--accent-danger-bg)', color: 'var(--accent-danger)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><IconTrash /> Eliminar</button>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredProveedores.length === 0 && <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay proveedores registrados.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
