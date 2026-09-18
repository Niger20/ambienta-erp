import { Modal } from '../../components/ui/Modal';
import type { CuentaPorPagar } from './types';

interface PagoModalProps {
    show: boolean;
    selectedCuentaPagar: CuentaPorPagar | null;
    pagoForm: { monto: string; metodopago: string };
    setPagoForm: React.Dispatch<React.SetStateAction<{ monto: string; metodopago: string }>>;
    handlePagarCuenta: (e: React.FormEvent) => Promise<void>;
    onClose: () => void;
}

export const PagoModal = ({ show, selectedCuentaPagar, pagoForm, setPagoForm, handlePagarCuenta, onClose }: PagoModalProps) => {
    if (!selectedCuentaPagar) return null;

    return (
        <Modal open={show} onClose={onClose} maxWidth={380}>
            <h3 style={{ marginBottom: '1rem' }}>Registrar Pago</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>Compra #{selectedCuentaPagar.compraid} — Restante: <strong style={{ color: 'var(--accent-danger)' }}>C$ {Number(selectedCuentaPagar.montorestante).toFixed(2)}</strong></p>
            <form onSubmit={handlePagarCuenta}>
                <div className="form-group"><label className="form-label">Monto *</label><input type="number" step="0.01" min="0.01" className="form-input" required autoFocus value={pagoForm.monto} onChange={e => setPagoForm(p => ({ ...p, monto: e.target.value }))} /></div>
                <div className="form-group">
                    <label className="form-label">Método de Pago</label>
                    <select className="form-input" value={pagoForm.metodopago} onChange={e => setPagoForm(p => ({ ...p, metodopago: e.target.value }))}>
                        <option value="efectivo">Efectivo (NIO/USD)</option>
                        <option value="bac">Banco BAC</option>
                        <option value="lafise">Banco Lafise</option>
                        <option value="banpro">Banco Banpro</option>
                        <option value="transferencia">Transferencia ACH</option>
                    </select>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Registrar Pago</button>
                </div>
            </form>
        </Modal>
    );
};
