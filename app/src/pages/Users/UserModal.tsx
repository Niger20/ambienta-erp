import { IconUser } from './icons';
import { ROLES } from './types';

interface UserForm {
    id: number | undefined;
    nombreusuario: string;
    contrasena: string;
    rol: string;
}

interface UserModalProps {
    show: boolean;
    isEditing: boolean;
    form: UserForm;
    onChange: (form: UserForm) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    isEditingOwnUser: boolean;
}

/**
 * NOTA: no usa el Modal compartido a propósito — a diferencia del comportamiento
 * "estándar", este modal original NO se cierra al hacer click en el backdrop,
 * solo con el botón "Cancelar". Se preserva ese comportamiento tal cual.
 */
export const UserModal = ({ show, isEditing, form, onChange, onSubmit, onClose, isEditingOwnUser }: UserModalProps) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconUser />
                    <span>{isEditing ? (isEditingOwnUser ? 'Editar Mi Usuario' : 'Editar Usuario') : 'Nuevo Usuario'}</span>
                </h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nombre de Usuario *</label>
                        <input type="text" className="form-input" value={form.nombreusuario} onChange={e => onChange({ ...form, nombreusuario: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">{isEditing ? 'Nueva Contraseña (Dejar en blanco para mantener)' : 'Contraseña *'}</label>
                        <input type="password" className="form-input" value={form.contrasena} onChange={e => onChange({ ...form, contrasena: e.target.value })} required={!isEditing} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Rol del Sistema *</label>
                        <select className="form-input" value={form.rol} onChange={e => onChange({ ...form, rol: e.target.value })} required>
                            {ROLES.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">{isEditing ? 'Actualizar' : 'Registrar'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
