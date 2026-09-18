import { Modal } from '../../components/ui/Modal';

interface NuevoClienteForm {
    nombre: string;
    telefono: string;
    direccion: string;
    cedula: string;
    autorizarCredito: boolean;
    limitecredito: string;
}

interface ClienteModalProps {
    show: boolean;
    onClose: () => void;
    onCancel: () => void;
    nuevoCliente: NuevoClienteForm;
    setNuevoCliente: (fn: (prev: NuevoClienteForm) => NuevoClienteForm) => void;
    onSubmit: (e: React.FormEvent) => void;
}

/** NOTA: cerrar con click en backdrop/Escape NO resetea el formulario, tal como en
 * el original — solo el botón "Cancelar" explícito lo resetea (prop `onCancel`). */
export const ClienteModal = ({ show, onClose, onCancel, nuevoCliente, setNuevoCliente, onSubmit }: ClienteModalProps) => {
    return (
        <Modal open={show} onClose={onClose}>
            <div className="card-header">
                <h3 className="card-title">Registrar nuevo cliente</h3>
            </div>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label className="form-label">Nombre completo *</label>
                    <input type="text" className="form-input" required value={nuevoCliente.nombre} onChange={e => setNuevoCliente(prev => ({ ...prev, nombre: e.target.value }))} />
                </div>
                <div className="form-group">
                    <label className="form-label">Cédula</label>
                    <input type="text" className="form-input" value={nuevoCliente.cedula} onChange={e => setNuevoCliente(prev => ({ ...prev, cedula: e.target.value }))} />
                </div>
                <div className="form-group">
                    <label className="form-label">Teléfono (WhatsApp)</label>
                    <input type="text" className="form-input" value={nuevoCliente.telefono} onChange={e => setNuevoCliente(prev => ({ ...prev, telefono: e.target.value }))} placeholder="+505 ..." />
                </div>
                <div className="form-group">
                    <label className="form-label">Dirección</label>
                    <textarea className="form-input" rows={2} value={nuevoCliente.direccion} onChange={e => setNuevoCliente(prev => ({ ...prev, direccion: e.target.value }))} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0 0.5rem' }}>
                    <input type="checkbox" id="autorizarCredito" checked={nuevoCliente.autorizarCredito} onChange={e => setNuevoCliente(prev => ({ ...prev, autorizarCredito: e.target.checked }))} />
                    <label htmlFor="autorizarCredito" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Autorizar crédito</label>
                </div>
                {nuevoCliente.autorizarCredito && (
                    <div className="form-group" style={{ marginTop: '0.5rem' }}>
                        <label className="form-label">Límite de crédito (C$)</label>
                        <input type="number" step="any" className="form-input" placeholder="0.00" value={nuevoCliente.limitecredito} onChange={e => setNuevoCliente(prev => ({ ...prev, limitecredito: e.target.value }))} />
                    </div>
                )}
                <div className="modal-actions">
                    <button type="button" className="btn" onClick={onCancel}>Cancelar</button>
                    <button type="submit" className="btn btn-primary" disabled={!nuevoCliente.nombre}>Guardar cliente</button>
                </div>
            </form>
        </Modal>
    );
};
