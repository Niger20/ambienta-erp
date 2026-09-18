import { IconShield, IconLock } from './icons';
import type { Permiso, RolForm } from './types';

interface RoleModalProps {
    show: boolean;
    isEditing: boolean;
    isSystemRole: boolean;
    form: RolForm;
    permisos: Permiso[];
    onChange: (form: RolForm) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

export const RoleModal = ({ show, isEditing, isSystemRole, form, permisos, onChange, onSubmit, onClose }: RoleModalProps) => {
    if (!show) return null;

    const grupos = permisos.reduce<Record<string, Permiso[]>>((acc, p) => {
        (acc[p.modulo] ||= []).push(p);
        return acc;
    }, {});

    const togglePermiso = (id: number) => {
        const permisoIds = form.permisoIds.includes(id)
            ? form.permisoIds.filter((p) => p !== id)
            : [...form.permisoIds, id];
        onChange({ ...form, permisoIds });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '520px', maxHeight: '85vh', overflowY: 'auto' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconShield />
                    <span>{isEditing ? 'Editar Rol' : 'Nuevo Rol'}</span>
                </h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nombre del Rol *</label>
                        <input
                            type="text" className="form-input" value={form.nombre}
                            onChange={e => onChange({ ...form, nombre: e.target.value })}
                            disabled={isSystemRole}
                            required
                        />
                        {isSystemRole && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <IconLock /> Rol de sistema: el nombre no se puede cambiar, pero sí sus permisos.
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Descripción</label>
                        <input
                            type="text" className="form-input" value={form.descripcion}
                            onChange={e => onChange({ ...form, descripcion: e.target.value })}
                            disabled={isSystemRole}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Permisos</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '320px', overflowY: 'auto', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                            {Object.entries(grupos).map(([modulo, items]) => (
                                <div key={modulo}>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                        {modulo}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        {items.map((permiso) => (
                                            <label key={permiso.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={form.permisoIds.includes(permiso.id)}
                                                    onChange={() => togglePermiso(permiso.id)}
                                                />
                                                <span>{permiso.codigo}</span>
                                                {permiso.descripcion && (
                                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>— {permiso.descripcion}</span>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">{isEditing ? 'Actualizar' : 'Crear'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
