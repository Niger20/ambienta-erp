import { IconEdit } from './icons';

interface GastoForm {
    nombre: string;
    descripcion: string;
}

interface GastoModalProps {
    show: boolean;
    isEditing: boolean;
    form: GastoForm;
    onChange: (updater: (prev: GastoForm) => GastoForm) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

/** NOTA: no usa el Modal compartido — el original no cierra al hacer click en el backdrop. */
export const GastoModal = ({ show, isEditing, form, onChange, onSubmit, onClose }: GastoModalProps) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '480px' }}>
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconEdit />
                    <span>{isEditing ? 'Editar Gasto' : 'Nuevo Gasto'}</span>
                </h3>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nombre del Gasto *</label>
                        <input className="form-input" value={form.nombre} onChange={e => onChange(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej: Energía eléctrica" required autoFocus />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Descripción</label>
                        <textarea className="form-input" rows={3} value={form.descripcion} onChange={e => onChange(p => ({ ...p, descripcion: e.target.value }))} placeholder="Opcional..." style={{ resize: 'vertical' }} />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">{isEditing ? 'Actualizar' : 'Crear Gasto'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
