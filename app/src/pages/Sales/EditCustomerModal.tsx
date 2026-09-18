import type { Cliente } from './types';

interface EditCustomerModalProps {
    show: boolean;
    customerForm: Partial<Cliente>;
    setCustomerForm: React.Dispatch<React.SetStateAction<Partial<Cliente>>>;
    savingCustomer: boolean;
    handleSaveCustomer: (e: React.FormEvent) => Promise<void>;
    onClose: () => void;
}

/** NOTA: no usa el Modal compartido — el original no cierra al hacer click en el backdrop. */
export const EditCustomerModal = ({ show, customerForm, setCustomerForm, savingCustomer, handleSaveCustomer, onClose }: EditCustomerModalProps) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{customerForm.id ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</h2>
                <form onSubmit={handleSaveCustomer}>
                    <div className="form-group"><label className="form-label">Nombre *</label><input type="text" className="form-input" value={customerForm.nombre || ''} onChange={(e) => setCustomerForm({ ...customerForm, nombre: e.target.value })} required /></div>
                    <div className="form-group"><label className="form-label">Cédula</label><input type="text" className="form-input" value={customerForm.cedula || ''} onChange={(e) => setCustomerForm({ ...customerForm, cedula: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Teléfono</label><input type="text" className="form-input" value={customerForm.telefono || ''} onChange={(e) => setCustomerForm({ ...customerForm, telefono: e.target.value })} /></div>
                    <div className="form-group"><label className="form-label">Límite de Crédito (C$)</label><input type="number" step="any" className="form-input" value={customerForm.limitecredito || 0} onChange={(e) => setCustomerForm({ ...customerForm, limitecredito: Number(e.target.value) })} /></div>
                    <div className="form-group"><label className="form-label">Dirección</label><textarea className="form-input" value={customerForm.direccion || ''} onChange={(e) => setCustomerForm({ ...customerForm, direccion: e.target.value })} rows={2}></textarea></div>
                    <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary" disabled={savingCustomer}>{savingCustomer ? 'Guardando...' : customerForm.id ? 'Guardar Cambios' : 'Registrar Cliente'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
