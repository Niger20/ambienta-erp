import type { Product } from './types';

interface AjusteForm {
    productoid: string;
    tipo: string;
    cantidad: string;
    motivo: string;
}

interface AjusteModalProps {
    show: boolean;
    form: AjusteForm;
    setForm: (form: AjusteForm) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    products: Product[];
    productSearch: string;
    setProductSearch: (v: string) => void;
    showProductDropdown: boolean;
    setShowProductDropdown: (v: boolean) => void;
}

/** NOTA: no usa el Modal compartido — el original no cierra al hacer click en el backdrop. */
export const AjusteModal = ({
    show, form, setForm, onSubmit, onClose, products,
    productSearch, setProductSearch, showProductDropdown, setShowProductDropdown,
}: AjusteModalProps) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop" style={{ zIndex: 70 }}>
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Nuevo Ajuste Manual</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label className="form-label">Producto *</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Buscar producto por nombre..."
                            value={productSearch}
                            onChange={e => {
                                setProductSearch(e.target.value);
                                setShowProductDropdown(true);
                                if (!e.target.value) setForm({ ...form, productoid: '' });
                            }}
                            onFocus={() => setShowProductDropdown(true)}
                            autoFocus
                        />
                        {form.productoid && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--accent-success)', marginTop: '0.25rem' }}>
                                ✓ {products.find(p => p.id === Number(form.productoid))?.nombre} (Stock: {products.find(p => p.id === Number(form.productoid))?.stockactual})
                            </div>
                        )}
                        {showProductDropdown && productSearch.length >= 1 && (
                            <div style={{
                                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                                maxHeight: '200px', overflowY: 'auto',
                                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                borderRadius: '0 0 8px 8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}>
                                {products
                                    .filter(p => p.nombre.toLowerCase().includes(productSearch.toLowerCase()))
                                    .slice(0, 15)
                                    .map(p => (
                                        <div key={p.id}
                                            style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', fontSize: '0.85rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}
                                            onMouseDown={() => {
                                                setForm({ ...form, productoid: String(p.id) });
                                                setProductSearch(p.nombre);
                                                setShowProductDropdown(false);
                                            }}
                                        >
                                            <span>{p.nombre}</span>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Stock: {p.stockactual}</span>
                                        </div>
                                    ))}
                                {products.filter(p => p.nombre.toLowerCase().includes(productSearch.toLowerCase())).length === 0 && (
                                    <div style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No se encontraron productos</div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Tipo de Movimiento *</label>
                        <select className="form-input" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} required>
                            <option value="INGRESO">INGRESO (Suma stock)</option>
                            <option value="EGRESO">EGRESO (Resta stock)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Cantidad *</label>
                        <input type="number" min="1" className="form-input" value={form.cantidad} onChange={e => setForm({ ...form, cantidad: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Motivo</label>
                        <input type="text" className="form-input" placeholder="Ej: Mercancía dañada, Conteo físico..." value={form.motivo} onChange={e => setForm({ ...form, motivo: e.target.value })} />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">Registrar Ajuste</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
