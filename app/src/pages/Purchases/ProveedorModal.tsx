import { Modal } from '../../components/ui/Modal';

interface ProveedorForm {
    nombreempresa: string;
    asesorventas: string;
    telefono: string;
    direccion: string;
    clasificacion: string;
}

interface ProveedorModalProps {
    show: boolean;
    isEditing: boolean;
    proveedorForm: ProveedorForm;
    setProveedorForm: React.Dispatch<React.SetStateAction<ProveedorForm>>;
    handleSaveProveedor: (e: React.FormEvent) => Promise<void>;
    onClose: () => void;
}

export const ProveedorModal = ({ show, isEditing, proveedorForm, setProveedorForm, handleSaveProveedor, onClose }: ProveedorModalProps) => {
    return (
        <Modal open={show} onClose={onClose} maxWidth={440}>
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>{isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h3>
            <form onSubmit={handleSaveProveedor}>
                <div className="form-group"><label className="form-label">Empresa *</label><input type="text" className="form-input" required value={proveedorForm.nombreempresa} onChange={e => setProveedorForm(p => ({ ...p, nombreempresa: e.target.value }))} maxLength={100} /></div>
                <div className="form-group"><label className="form-label">Asesor de Ventas *</label><input type="text" className="form-input" required value={proveedorForm.asesorventas} onChange={e => setProveedorForm(p => ({ ...p, asesorventas: e.target.value }))} maxLength={100} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group"><label className="form-label">Teléfono</label><input type="text" className="form-input" value={proveedorForm.telefono} onChange={e => setProveedorForm(p => ({ ...p, telefono: e.target.value }))} /></div>
                    <div className="form-group"><label className="form-label">Clasificación</label><input type="text" className="form-input" value={proveedorForm.clasificacion} onChange={e => setProveedorForm(p => ({ ...p, clasificacion: e.target.value }))} /></div>
                </div>
                <div className="form-group"><label className="form-label">Dirección</label><input type="text" className="form-input" value={proveedorForm.direccion} onChange={e => setProveedorForm(p => ({ ...p, direccion: e.target.value }))} /></div>
                <div className="modal-actions">
                    <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">{isEditing ? 'Actualizar' : 'Crear'} Proveedor</button>
                </div>
            </form>
        </Modal>
    );
};
