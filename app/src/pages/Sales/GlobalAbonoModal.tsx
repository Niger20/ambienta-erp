import { Modal } from '../../components/ui/Modal';

interface GlobalAbonoModalProps {
    show: boolean;
    globalAbonoClientInfo: { id: number; nombre: string; totalRestante: number } | null;
    globalAbonoForm: { monto: string; metodopago: string };
    setGlobalAbonoForm: React.Dispatch<React.SetStateAction<{ monto: string; metodopago: string }>>;
    savingGlobalAbono: boolean;
    handleRegistrarAbonoGlobal: (e: React.FormEvent) => Promise<void>;
    onClose: () => void;
}

export const GlobalAbonoModal = ({
    show, globalAbonoClientInfo, globalAbonoForm, setGlobalAbonoForm, savingGlobalAbono, handleRegistrarAbonoGlobal, onClose,
}: GlobalAbonoModalProps) => {
    if (!show || !globalAbonoClientInfo) return null;

    return (
        <Modal open={show} onClose={onClose} maxWidth={420}>
            <h3 style={{ marginBottom: '0.25rem', fontSize: '1.15rem' }}>Abono General (Cascada)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Cliente: <strong>{globalAbonoClientInfo.nombre}</strong><br />
                Deuda Total: <strong style={{ color: 'var(--accent-danger)' }}>C$ {globalAbonoClientInfo.totalRestante.toFixed(2)}</strong>
            </p>
            <form onSubmit={handleRegistrarAbonoGlobal}>
                <div className="form-group">
                    <label className="form-label">Monto a Abonar (C$) *</label>
                    <input type="number" step="any" min="0.0001" max={globalAbonoClientInfo.totalRestante} className="form-input" value={globalAbonoForm.monto} onChange={e => setGlobalAbonoForm(p => ({ ...p, monto: e.target.value }))} required autoFocus />
                </div>
                <div className="form-group">
                    <label className="form-label">Método de Pago</label>
                    <select className="form-input" value={globalAbonoForm.metodopago} onChange={e => setGlobalAbonoForm(p => ({ ...p, metodopago: e.target.value }))}>
                        <option value="efectivo">Efectivo</option>
                        <option value="bac">BAC</option>
                        <option value="lafise">Lafise</option>
                        <option value="banpro">Banpro</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn" onClick={onClose} disabled={savingGlobalAbono}>Cancelar</button>
                    <button type="submit" className="btn btn-primary" disabled={savingGlobalAbono}>{savingGlobalAbono ? 'Guardando...' : 'Aplicar Abono'}</button>
                </div>
            </form>
        </Modal>
    );
};
