import { Modal } from '../../components/ui/Modal';

interface NuevoRepartidorForm {
    nombre: string;
    telefono: string;
}

interface RepartidorModalProps {
    show: boolean;
    onClose: () => void;
    nuevoRepartidor: NuevoRepartidorForm;
    setNuevoRepartidor: (fn: (prev: NuevoRepartidorForm) => NuevoRepartidorForm) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const RepartidorModal = ({ show, onClose, nuevoRepartidor, setNuevoRepartidor, onSubmit }: RepartidorModalProps) => {
    return (
        <Modal open={show} onClose={onClose} zIndex={1060}>
            <div className="card-header">
                <h3 className="card-title">Registrar nuevo repartidor</h3>
            </div>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label className="form-label">Nombre *</label>
                    <input type="text" className="form-input" required value={nuevoRepartidor.nombre} onChange={e => setNuevoRepartidor(prev => ({ ...prev, nombre: e.target.value }))} />
                </div>
                <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input type="text" className="form-input" value={nuevoRepartidor.telefono} onChange={e => setNuevoRepartidor(prev => ({ ...prev, telefono: e.target.value }))} placeholder="+505 ..." />
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="btn btn-primary" disabled={!nuevoRepartidor.nombre}>Guardar repartidor</button>
                </div>
            </form>
        </Modal>
    );
};
