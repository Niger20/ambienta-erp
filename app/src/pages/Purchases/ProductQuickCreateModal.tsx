import type { Categoria } from './types';

interface ProductForm {
    nombre: string;
    preciocompra: string;
    precioventa: string;
    codigobarra: string;
    categoriaid: string;
    stockactual: string;
    stockminimo: string;
    descripcion: string;
}

interface ProductQuickCreateModalProps {
    show: boolean;
    pendingBarcode: string;
    productQueue: string[];
    productForm: ProductForm;
    setProductForm: React.Dispatch<React.SetStateAction<ProductForm>>;
    categorias: Categoria[];
    setShowCategoriaModal: (v: boolean) => void;
    handleSaveProduct: (e: React.FormEvent) => Promise<void>;
    onClose: () => void;
}

/** NOTA: no usa el Modal compartido — el original no cierra al hacer click en el backdrop. */
export const ProductQuickCreateModal = ({
    show, pendingBarcode, productQueue, productForm, setProductForm, categorias, setShowCategoriaModal, handleSaveProduct, onClose,
}: ProductQuickCreateModalProps) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Registrar Nuevo Producto</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-warning)" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    <span>Hay {productQueue.length + 1} código(s) nuevos por registrar. Este es el código: <strong>{pendingBarcode}</strong></span>
                </p>
                <form onSubmit={handleSaveProduct}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Código de Barras</label>
                            <input type="text" className="form-input" value={productForm.codigobarra} onChange={e => setProductForm(p => ({ ...p, codigobarra: e.target.value }))} maxLength={100} />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Nombre del Producto *</label>
                            <input type="text" className="form-input" required autoFocus value={productForm.nombre} onChange={e => setProductForm(p => ({ ...p, nombre: e.target.value }))} maxLength={100} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Precio Compra *</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-input"
                                required
                                value={productForm.preciocompra}
                                onChange={e => {
                                    const pcVal = e.target.value;
                                    const pcNum = parseFloat(pcVal);
                                    const pvVal = isNaN(pcNum) ? '' : (pcNum / 0.8).toFixed(2);
                                    setProductForm(p => ({ ...p, preciocompra: pcVal, precioventa: pvVal }));
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const pcNum = parseFloat(productForm.preciocompra);
                                    if (!isNaN(pcNum) && pcNum > 0) {
                                        const conIVA = (pcNum * 1.15).toFixed(2);
                                        setProductForm(p => ({ ...p, preciocompra: conIVA, precioventa: (parseFloat(conIVA) / 0.8).toFixed(2) }));
                                    }
                                }}
                                style={{ marginTop: '0.35rem', padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--accent-primary-bg)', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}
                            >+IVA (15%)</button>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Precio Venta *</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-input"
                                required
                                value={productForm.precioventa}
                                onChange={e => setProductForm(p => ({ ...p, precioventa: e.target.value }))}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Stock Actual</label>
                            <input type="number" className="form-input" value={productForm.stockactual} onChange={e => setProductForm(p => ({ ...p, stockactual: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Categoría</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select className="form-input" style={{ flex: 1 }} value={productForm.categoriaid} onChange={e => {
                                    if (e.target.value === '__NEW__') {
                                        setShowCategoriaModal(true);
                                    } else {
                                        setProductForm(p => ({ ...p, categoriaid: e.target.value }));
                                    }
                                }}>
                                    <option value="">Sin categoría</option>
                                    {categorias.map(c => <option key={c.id} value={c.id}>{c.name || c.nombre}</option>)}
                                    <option value="__NEW__">+ Nueva Categoría</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="modal-actions" style={{ marginTop: '1rem' }}>
                        <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">Guardar Producto</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
