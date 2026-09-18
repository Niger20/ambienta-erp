import { Modal } from '../../components/ui/Modal';
import type { Cliente } from './types';

interface RetiroModalProps {
    show: boolean;
    customers: Cliente[];
    retiroForm: { clienteid: string; monto: string; motivo: string };
    setRetiroForm: React.Dispatch<React.SetStateAction<{ clienteid: string; monto: string; motivo: string }>>;
    savingRetiro: boolean;
    handleRegistrarRetiro: (e: React.FormEvent) => Promise<void>;
    onClose: () => void;
}

export const RetiroModal = ({ show, customers, retiroForm, setRetiroForm, savingRetiro, handleRegistrarRetiro, onClose }: RetiroModalProps) => {
    if (!show) return null;

    return (
        <Modal open={show} onClose={onClose} maxWidth={420}>
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.15rem' }}>Registrar Retiro de Efectivo</h3>
            <form onSubmit={handleRegistrarRetiro}>
                <div className="form-group">
                    <label className="form-label">Cliente (Deudor) *</label>
                    <select className="form-input" required value={retiroForm.clienteid} onChange={e => setRetiroForm(p => ({ ...p, clienteid: e.target.value }))}>
                        <option value="">Seleccione un cliente...</option>
                        {customers.filter(c => c.estado !== false).map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Monto del Retiro (C$) *</label>
                    <input type="number" step="any" min="0.0001" className="form-input" value={retiroForm.monto} onChange={e => setRetiroForm(p => ({ ...p, monto: e.target.value }))} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Motivo / Concepto</label>
                    <input type="text" className="form-input" value={retiroForm.motivo} onChange={e => setRetiroForm(p => ({ ...p, motivo: e.target.value }))} />
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn" onClick={onClose} disabled={savingRetiro}>Cancelar</button>
                    <button type="submit" className="btn btn-primary" disabled={savingRetiro}>{savingRetiro ? 'Procesando...' : 'Registrar Retiro'}</button>
                </div>
            </form>
        </Modal>
    );
};
