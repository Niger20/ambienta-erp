interface CategoryForm {
    nombre: string;
    descripcion: string;
}

interface CategoryModalProps {
    show: boolean;
    isEditing: boolean;
    form: CategoryForm;
    onChange: (form: CategoryForm) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

/** NOTA: no usa el Modal compartido — el original no cierra al hacer click en el backdrop. */
export const CategoryModal = ({ show, isEditing, form, onChange, onSubmit, onCancel }: CategoryModalProps) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop" style={{ zIndex: 60 }}> {/* Higher z-index to sit on top of product modal */}
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{isEditing ? 'Editar Categoría' : 'Crear Nueva Categoría'}</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nombre de Categoría *</label>
                        <input type="text" className="form-input" value={form.nombre} onChange={e => onChange({ ...form, nombre: e.target.value })} required autoFocus />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Descripción</label>
                        <textarea className="form-input" value={form.descripcion} onChange={e => onChange({ ...form, descripcion: e.target.value })} rows={3}></textarea>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn" onClick={onCancel}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">{isEditing ? 'Actualizar Categoría' : 'Crear Categoría'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
