import { generateEAN13 } from './types';
import type { Category } from './types';

interface ProductForm {
    nombre: string;
    preciocompra: string;
    precioventa: string;
    codigobarra: string;
    categoriaid: string;
    unidadmedidaid: string;
    stockactual: string;
    stockminimo: string;
    descripcion: string;
    preciomayoreo: string;
    cantidadminimamayoreo: string;
    requierefechavencimiento: boolean;
    fechavencimiento: string;
    publicadoencatalogo: boolean;
}

interface ProductModalProps {
    show: boolean;
    isEditing: boolean;
    form: ProductForm;
    setForm: (fn: (prev: ProductForm) => ProductForm) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onBarcodeKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    categories: Category[];
    unidadesMedida: any[];
}

/** NOTA: no usa el Modal compartido — el original no cierra al hacer click en el backdrop. */
export const ProductModal = ({
    show, isEditing, form, setForm, onInputChange, onBarcodeKeyDown, onSubmit, onClose,
    categories, unidadesMedida,
}: ProductModalProps) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{isEditing ? 'Editar Producto' : 'Registrar Nuevo Producto'}</h2>
                <form onSubmit={onSubmit}>

                    {/* Barcode Scanner Focus & Auto-generate */}
                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Código de Barras *</span>
                            <button
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, codigobarra: generateEAN13() }))}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--accent-primary)',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}
                            >
                                ⚡ Auto Generar EAN-13
                            </button>
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                className="form-input"
                                name="codigobarra"
                                value={form.codigobarra}
                                onChange={onInputChange}
                                onKeyDown={onBarcodeKeyDown}
                                placeholder="Escanea el código o se generará uno automático..."
                                autoFocus
                                style={{ fontFamily: 'monospace', fontWeight: 600 }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Nombre del Producto *</label>
                            <input id="product-name-input" type="text" className="form-input" name="nombre" value={form.nombre} onChange={onInputChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Categoría *</label>
                            <select className="form-input" name="categoriaid" value={form.categoriaid} onChange={onInputChange} required>
                                <option value="">Seleccione una categoría...</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                                <option value="NEW" style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>+ Crear Nueva Categoría</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Unidad de Medida *</label>
                            <select className="form-input" name="unidadmedidaid" value={form.unidadmedidaid} onChange={onInputChange} required>
                                {unidadesMedida.length > 0 ? (
                                    unidadesMedida.map((u: any) => (
                                        <option key={u.id || u.unidadmedidaid} value={u.id || u.unidadmedidaid}>
                                            {u.nombre} ({u.abreviatura})
                                        </option>
                                    ))
                                ) : (
                                    <option value="1">Unidad (UND)</option>
                                )}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Precio Compra *</label>
                            <input type="number" step="any" className="form-input" name="preciocompra" value={form.preciocompra} onChange={onInputChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Precio Venta *</label>
                            <input type="number" step="any" className="form-input" name="precioventa" value={form.precioventa} onChange={onInputChange} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Precio Mayoreo (Opcional)</label>
                            <input type="number" step="any" className="form-input" name="preciomayoreo" value={form.preciomayoreo} onChange={onInputChange} placeholder="0.0000" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Cant. Mínima Mayoreo</label>
                            <input type="number" step="any" className="form-input" name="cantidadminimamayoreo" value={form.cantidadminimamayoreo} onChange={onInputChange} placeholder="Ej: 6 o 12" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Stock Mínimo *</label>
                        <input type="number" step="any" className="form-input" name="stockminimo" value={form.stockminimo} onChange={onInputChange} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Descripción</label>
                        <textarea className="form-input" name="descripcion" value={form.descripcion} onChange={onInputChange} rows={2}></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                            <input
                                type="checkbox"
                                name="requierefechavencimiento"
                                checked={form.requierefechavencimiento}
                                onChange={onInputChange}
                            />
                            <span>Requiere Vencimiento</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                            <input
                                type="checkbox"
                                name="publicadoencatalogo"
                                checked={form.publicadoencatalogo}
                                onChange={onInputChange}
                            />
                            <span>Publicar en Catálogo</span>
                        </label>
                    </div>

                    {form.requierefechavencimiento && (
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label">Fecha de Vencimiento</label>
                            <input
                                type="date"
                                className="form-input"
                                name="fechavencimiento"
                                value={form.fechavencimiento}
                                onChange={onInputChange}
                            />
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">{isEditing ? 'Actualizar Producto' : 'Guardar Producto'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
