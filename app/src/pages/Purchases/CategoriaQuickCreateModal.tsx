import { Modal } from '../../components/ui/Modal';

interface CategoriaQuickCreateModalProps {
    show: boolean;
    categoriaForm: { nombre: string; descripcion: string };
    setCategoriaForm: React.Dispatch<React.SetStateAction<{ nombre: string; descripcion: string }>>;
    handleSaveCategoria: (e: React.FormEvent) => Promise<void>;
    onClose: () => void;
}

export const CategoriaQuickCreateModal = ({ show, categoriaForm, setCategoriaForm, handleSaveCategoria, onClose }: CategoriaQuickCreateModalProps) => {
    return (
        <Modal open={show} onClose={onClose} maxWidth={380} zIndex={1100}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Nueva Categoría</h3>
            <form onSubmit={handleSaveCategoria}>
                <div className="form-group">
                    <label className="form-label">Nombre *</label>
                    <input type="text" className="form-input" required autoFocus value={categoriaForm.nombre} onChange={e => setCategoriaForm(p => ({ ...p, nombre: e.target.value }))} maxLength={100} />
                </div>
                <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <input type="text" className="form-input" value={categoriaForm.descripcion} onChange={e => setCategoriaForm(p => ({ ...p, descripcion: e.target.value }))} />
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Crear Categoría</button>
                </div>
            </form>
        </Modal>
    );
};
