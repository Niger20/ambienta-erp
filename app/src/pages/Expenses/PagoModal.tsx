import { IconCreditCard } from './icons';
import { METODOS_PAGO } from './types';
import type { Gasto } from './types';

interface PagoForm {
    monto: string;
    metodopago: string;
    fecha: string;
}

interface PagoModalProps {
    show: boolean;
    isEditing: boolean;
    form: PagoForm;
    onChange: (updater: (prev: PagoForm) => PagoForm) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    selectedGasto: Gasto | null;
}

/** NOTA: no usa el Modal compartido — el original no cierra al hacer click en el backdrop. */
export const PagoModal = ({ show, isEditing, form, onChange, onSubmit, onClose, selectedGasto }: PagoModalProps) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '420px' }}>
                <h3 style={{ marginBottom: '0.25rem', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconCreditCard />
                    <span>{isEditing ? 'Editar Pago' : 'Registrar Pago'}</span>
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Gasto: <strong>{selectedGasto?.nombre}</strong>
                </p>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label">Monto (C$) *</label>
                        <input type="number" min="0.0001" step="any" className="form-input tabular" value={form.monto}
                            onChange={e => onChange(p => ({ ...p, monto: e.target.value }))} placeholder="0.00" required autoFocus />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Método de Pago</label>
                        <select className="form-input" value={form.metodopago} onChange={e => onChange(p => ({ ...p, metodopago: e.target.value }))}>
                            {METODOS_PAGO.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Fecha</label>
                        <input type="date" className="form-input tabular" value={form.fecha} onChange={e => onChange(p => ({ ...p, fecha: e.target.value }))} />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">{isEditing ? 'Actualizar Pago' : 'Registrar Pago'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
