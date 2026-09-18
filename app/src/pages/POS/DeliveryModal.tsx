import { Modal } from '../../components/ui/Modal';
import type { DeliveryData } from './types';

interface DeliveryModalProps {
    show: boolean;
    onClose: () => void;
    onCancel: () => void;
    deliveryData: DeliveryData;
    setDeliveryData: (fn: (prev: DeliveryData) => DeliveryData) => void;
    repartidores: any[];
    onRequestNewRepartidor: () => void;
    total: number;
}

/** NOTA: cerrar con click en backdrop/Escape (o el botón "Aceptar") mantiene
 * lugarVenta en DELIVERY. Solo el botón "Cancelar" explícito lo resetea a
 * NORMAL, tal como en el original (prop `onCancel`). */
export const DeliveryModal = ({ show, onClose, onCancel, deliveryData, setDeliveryData, repartidores, onRequestNewRepartidor, total }: DeliveryModalProps) => {
    const costoEnvio = parseFloat(deliveryData.costoEnvio) || 0;
    const totalConEnvio = total + costoEnvio;
    const pagaCon = Number(deliveryData.montoPagaCliente);
    const vueltoOFaltante = pagaCon - totalConEnvio;

    return (
        <Modal open={show} onClose={onClose}>
            <div className="card-header">
                <h3 className="card-title">Detalles del delivery</h3>
            </div>
            <div className="form-group">
                <label className="form-label">Repartidor *</label>
                <select
                    className="form-input"
                    value={deliveryData.repartidorId}
                    onChange={e => {
                        if (e.target.value === 'NEW') {
                            onRequestNewRepartidor();
                        } else {
                            setDeliveryData(prev => ({ ...prev, repartidorId: e.target.value }));
                        }
                    }}
                >
                    <option value="">— Seleccione repartidor —</option>
                    <option value="NEW" style={{ fontWeight: 600, color: 'var(--accent-success)' }}>+ Nuevo repartidor</option>
                    {repartidores.map(r => (
                        <option key={r.id || r.repartidorid} value={r.id || r.repartidorid}>{r.nombre}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">Dirección de entrega *</label>
                <textarea className="form-input" rows={2} value={deliveryData.direccionEntrega} onChange={e => setDeliveryData(prev => ({ ...prev, direccionEntrega: e.target.value }))} placeholder="Ej: Frente al parque central..." />
            </div>

            <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Costo de envío (Delivery C$) *</label>
                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 'bold', color: 'var(--text-secondary)' }}>C$</span>
                    <input
                        type="number"
                        min="0"
                        step="any"
                        className="form-input"
                        style={{ paddingLeft: '2.5rem', fontSize: '1.05rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}
                        value={deliveryData.costoEnvio}
                        onChange={e => setDeliveryData(prev => ({ ...prev, costoEnvio: e.target.value }))}
                        placeholder="0.00 (Ej: 100, 200, 300)"
                    />
                </div>
            </div>

            <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal productos:</span>
                <strong style={{ fontVariantNumeric: 'tabular-nums' }}>C$ {total.toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Costo de envío:</span>
                <strong style={{ fontVariantNumeric: 'tabular-nums' }}>C$ {costoEnvio.toFixed(2)}</strong>
            </div>
            <div style={{ backgroundColor: 'var(--accent-primary-bg)', border: '1px solid var(--accent-primary-border)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>Total a cobrar:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)', fontVariantNumeric: 'tabular-nums' }}>C$ {totalConEnvio.toFixed(2)}</span>
            </div>

            <div className="form-group">
                <label className="form-label" style={{ color: 'var(--accent-success)' }}>¿Con cuánto paga el cliente?</label>
                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 'bold', color: 'var(--text-secondary)' }}>C$</span>
                    <input type="number" min="0" step="any" className="form-input" style={{ paddingLeft: '2.5rem', fontSize: '1.1rem', fontWeight: 'bold', fontVariantNumeric: 'tabular-nums' }} value={deliveryData.montoPagaCliente} onChange={e => setDeliveryData(prev => ({ ...prev, montoPagaCliente: e.target.value }))} placeholder="0.00" />
                </div>
            </div>

            {pagaCon > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: vueltoOFaltante >= 0 ? 'var(--accent-success-bg)' : 'var(--accent-danger-bg)', border: `1px solid ${vueltoOFaltante >= 0 ? 'var(--accent-success-border)' : 'var(--accent-danger-border)'}` }}>
                    <span style={{ fontWeight: 600 }}>{vueltoOFaltante >= 0 ? 'Vuelto a mandar:' : 'Faltante:'}</span>
                    <span style={{ fontWeight: 700, fontSize: '1.25rem', fontVariantNumeric: 'tabular-nums', color: vueltoOFaltante >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                        C$ {Math.abs(vueltoOFaltante).toFixed(2)}
                    </span>
                </div>
            )}

            <div className="modal-actions">
                <button type="button" className="btn" onClick={onCancel}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={onClose}>Aceptar</button>
            </div>
        </Modal>
    );
};
