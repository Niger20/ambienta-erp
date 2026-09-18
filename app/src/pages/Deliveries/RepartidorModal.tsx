import { IconUser } from './icons';
import type { Repartidor } from './types';

interface RepartidorModalProps {
    show: boolean;
    isEditing: boolean;
    form: Partial<Repartidor>;
    onChange: (form: Partial<Repartidor>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

/** NOTA: no usa el Modal compartido — el original no cierra al hacer click en el backdrop. */
export const RepartidorModal = ({ show, isEditing, form, onChange, onSubmit, onClose }: RepartidorModalProps) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                    <IconUser />
                    <span>{isEditing ? 'Editar Repartidor' : 'Nuevo Repartidor'}</span>
                </h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nombre Completo *</label>
                        <input type="text" className="form-input" value={form.nombre || ''} onChange={(e) => onChange({ ...form, nombre: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Teléfono *</label>
                        <input type="text" className="form-input" value={form.telefono || ''} onChange={(e) => onChange({ ...form, telefono: e.target.value })} required />
                    </div>
                    <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
