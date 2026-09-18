import { Modal } from '../../components/ui/Modal';
import type { CuentaPorCobrar } from './types';

interface AbonoModalProps {
    show: boolean;
    selectedCuenta: CuentaPorCobrar | null;
    abonoForm: { monto: string; metodopago: string };
    setAbonoForm: React.Dispatch<React.SetStateAction<{ monto: string; metodopago: string }>>;
    savingAbono: boolean;
    handleRegistrarAbono: (e: React.FormEvent) => Promise<void>;
    onClose: () => void;
}

export const AbonoModal = ({ show, selectedCuenta, abonoForm, setAbonoForm, savingAbono, handleRegistrarAbono, onClose }: AbonoModalProps) => {
    if (!show || !selectedCuenta) return null;

    return (
        <Modal open={show} onClose={onClose} maxWidth={400}>
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Registrar Abono</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Cuenta de <strong>{selectedCuenta.clientes?.nombre || `Cliente #${selectedCuenta.clienteid}`}</strong> — Saldo: <strong style={{ color: 'var(--accent-danger)' }}>C$ {Number(selectedCuenta.montorestante).toFixed(2)}</strong>
            </p>
            <form onSubmit={handleRegistrarAbono}>
                <div className="form-group">
                    <label className="form-label">Monto del Abono (C$) *</label>
                    <input type="number" step="any" min="0.0001" className="form-input" value={abonoForm.monto} onChange={e => setAbonoForm(p => ({ ...p, monto: e.target.value }))} required autoFocus />
                </div>
                <div className="form-group">
                    <label className="form-label">Método de Pago</label>
                    <select className="form-input" value={abonoForm.metodopago} onChange={e => setAbonoForm(p => ({ ...p, metodopago: e.target.value }))}>
                        <option value="efectivo">Efectivo</option>
                        <option value="bac">BAC</option>
                        <option value="lafise">Lafise</option>
                        <option value="banpro">Banpro</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn" onClick={onClose} disabled={savingAbono}>Cancelar</button>
                    <button type="submit" className="btn btn-primary" disabled={savingAbono}>{savingAbono ? 'Guardando...' : 'Registrar Abono'}</button>
                </div>
            </form>
        </Modal>
    );
};
