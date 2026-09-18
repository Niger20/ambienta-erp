import { IconBox } from './icons';
import type { Repartidor } from './types';

interface DeliveryForm {
    repartidorid: string;
    direccionentrega: string;
    costo: string;
}

interface DeliveryModalProps {
    show: boolean;
    form: DeliveryForm;
    onChange: (form: DeliveryForm) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    repartidores: Repartidor[];
}

/** NOTA: no usa el Modal compartido — el original no cierra al hacer click en el backdrop. */
export const DeliveryModal = ({ show, form, onChange, onSubmit, onClose, repartidores }: DeliveryModalProps) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                    <IconBox />
                    <span>Registrar Nueva Entrega</span>
                </h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label">Repartidor Asignado *</label>
                        <select className="form-input" value={form.repartidorid} onChange={(e) => onChange({ ...form, repartidorid: e.target.value })} required>
                            <option value="">Seleccione repartidor...</option>
                            {repartidores.map(r => (
                                <option key={r.id || r.repartidorid} value={r.id || r.repartidorid}>{r.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Dirección / Destino *</label>
                        <input type="text" className="form-input" value={form.direccionentrega} onChange={(e) => onChange({ ...form, direccionentrega: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Costo de Envío (C$) *</label>
                        <input type="number" step="any" min="0" className="form-input tabular" value={form.costo} onChange={(e) => onChange({ ...form, costo: e.target.value })} required />
                    </div>
                    <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">Crear Entrega</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
