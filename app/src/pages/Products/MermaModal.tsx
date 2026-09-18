import type { Product } from './types';

interface MermaForm {
    productoid: string;
    cantidad: string;
    costounitario: string;
    motivo: string;
    esConversion: boolean;
    productodestinoid: string;
    cantidaddestino: string;
}

interface MermaModalProps {
    show: boolean;
    form: MermaForm;
    setForm: (fn: (prev: MermaForm) => MermaForm) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    products: Product[];
    productSearch: string;
    setProductSearch: (v: string) => void;
    showProductDropdown: boolean;
    setShowProductDropdown: (v: boolean) => void;
    destinoSearch: string;
    setDestinoSearch: (v: string) => void;
    showDestinoDropdown: boolean;
    setShowDestinoDropdown: (v: boolean) => void;
}

/** NOTA: no usa el Modal compartido — el original no cierra al hacer click en el backdrop. */
export const MermaModal = ({
    show, form, setForm, onSubmit, onClose, products,
    productSearch, setProductSearch, showProductDropdown, setShowProductDropdown,
    destinoSearch, setDestinoSearch, showDestinoDropdown, setShowDestinoDropdown,
}: MermaModalProps) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop" style={{ zIndex: 70 }}>
            <div className="modal-content" style={{ maxWidth: '440px' }}>
                <h2 style={{ marginBottom: '0.25rem', fontSize: '1.25rem' }}>Registrar Merma / Quiebre</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    Descuenta el stock del producto dañado. Si se recupera como otro producto (ej. cerámica rota), márcalo abajo.
                </p>
                <form onSubmit={onSubmit}>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label className="form-label">Producto afectado *</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Buscar producto por nombre..."
                            value={productSearch}
                            onChange={e => {
                                setProductSearch(e.target.value);
                                setShowProductDropdown(true);
                                if (!e.target.value) setForm(prev => ({ ...prev, productoid: '' }));
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
                                                setForm(prev => ({ ...prev, productoid: String(p.id), costounitario: prev.costounitario || String(p.preciocompra ?? '') }));
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                            <label className="form-label">Cantidad *</label>
                            <input type="number" min="0.0001" step="any" className="form-input" value={form.cantidad} onChange={e => setForm(prev => ({ ...prev, cantidad: e.target.value }))} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Costo Unitario *</label>
                            <input type="number" min="0" step="0.01" className="form-input" value={form.costounitario} onChange={e => setForm(prev => ({ ...prev, costounitario: e.target.value }))} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Motivo *</label>
                        <input type="text" className="form-input" list="merma-motivos" placeholder="Ej: Rotura en bodega, Rotura en transporte..." value={form.motivo} onChange={e => setForm(prev => ({ ...prev, motivo: e.target.value }))} required />
                        <datalist id="merma-motivos">
                            <option value="Rotura en bodega" />
                            <option value="Rotura en transporte" />
                            <option value="Rotura en exhibición" />
                            <option value="Rotura por manipulación del cliente" />
                            <option value="Producto vencido / dañado" />
                        </datalist>
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none', margin: '0.5rem 0 1rem', padding: '0.6rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                        <input
                            type="checkbox"
                            checked={form.esConversion}
                            onChange={e => setForm(prev => ({ ...prev, esConversion: e.target.checked, productodestinoid: '', cantidaddestino: '' }))}
                        />
                        <span>Se convierte en otro producto (ej. cerámica entera → cerámica rota)</span>
                    </label>

                    {form.esConversion && (
                        <>
                            <div className="form-group" style={{ position: 'relative' }}>
                                <label className="form-label">Producto resultante *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Buscar producto destino..."
                                    value={destinoSearch}
                                    onChange={e => {
                                        setDestinoSearch(e.target.value);
                                        setShowDestinoDropdown(true);
                                        if (!e.target.value) setForm(prev => ({ ...prev, productodestinoid: '' }));
                                    }}
                                    onFocus={() => setShowDestinoDropdown(true)}
                                />
                                {form.productodestinoid && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-success)', marginTop: '0.25rem' }}>
                                        ✓ {products.find(p => p.id === Number(form.productodestinoid))?.nombre} (Stock: {products.find(p => p.id === Number(form.productodestinoid))?.stockactual})
                                    </div>
                                )}
                                {showDestinoDropdown && destinoSearch.length >= 1 && (
                                    <div style={{
                                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                                        maxHeight: '200px', overflowY: 'auto',
                                        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                        borderRadius: '0 0 8px 8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }}>
                                        {products
                                            .filter(p => p.id !== Number(form.productoid) && p.nombre.toLowerCase().includes(destinoSearch.toLowerCase()))
                                            .slice(0, 15)
                                            .map(p => (
                                                <div key={p.id}
                                                    style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', fontSize: '0.85rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}
                                                    onMouseDown={() => {
                                                        setForm(prev => ({ ...prev, productodestinoid: String(p.id) }));
                                                        setDestinoSearch(p.nombre);
                                                        setShowDestinoDropdown(false);
                                                    }}
                                                >
                                                    <span>{p.nombre}</span>
                                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Stock: {p.stockactual}</span>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Cantidad resultante</label>
                                <input type="number" min="0.0001" step="any" className="form-input" placeholder={form.cantidad || 'Igual a la cantidad de origen'} value={form.cantidaddestino} onChange={e => setForm(prev => ({ ...prev, cantidaddestino: e.target.value }))} />
                            </div>
                        </>
                    )}

                    {form.cantidad && form.costounitario && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Costo de pérdida estimado: <strong style={{ color: 'var(--accent-danger)' }}>C$ {(Number(form.cantidad) * Number(form.costounitario)).toFixed(2)}</strong>
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">Registrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
