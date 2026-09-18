import { IconEdit, IconLoader, IconPlus, IconSave, IconSearch, IconTrash } from './icons';
import type { Compra, CostoAdicionalItem, LineaCompra, Producto, Proveedor } from './types';

interface EditCompraModalProps {
    show: boolean;
    editingCompra: Compra | null;
    isLoadingEditDetails: boolean;
    editLineas: LineaCompra[];
    editInputValue: string;
    handleEditSearchChange: (val: string) => void;
    editShowSearchDropdown: boolean;
    setEditShowSearchDropdown: (v: boolean) => void;
    editSearchResults: Producto[];
    handleAddEditLinea: (prod: Producto) => void;
    handleUpdateEditLinea: (idx: number, field: 'cantidad' | 'preciounitario' | 'descuento', val: any) => void;
    handleRemoveEditLinea: (idx: number) => void;
    proveedores: Proveedor[];
    editSelectedProveedor: string;
    setEditSelectedProveedor: (v: string) => void;
    editTipoCompra: 'CONTADO' | 'CREDITO';
    setEditTipoCompra: (v: 'CONTADO' | 'CREDITO') => void;
    editMetodoPago: string;
    setEditMetodoPago: (v: string) => void;
    editCuotas: number;
    setEditCuotas: (v: number) => void;
    editFechaVencimiento: string;
    setEditFechaVencimiento: (v: string) => void;
    editFacturaProveedor: string;
    setEditFacturaProveedor: (v: string) => void;
    editCostosAdicionales: CostoAdicionalItem[];
    handleAddEditCostoAdicional: () => void;
    handleUpdateEditCostoAdicional: (id: string, field: 'concepto' | 'monto', val: string) => void;
    handleRemoveEditCostoAdicional: (id: string) => void;
    editSubtotalLineas: number;
    editDescuentosLineas: number;
    editTotalCostosAdicionales: number;
    editTotalFactura: number;
    isSavingEditCompra: boolean;
    handleSaveEditCompra: () => Promise<void>;
    onClose: () => void;
}

/** NOTA: no usa el Modal compartido — el original define un layout/tamaño muy propios (1280px, 95vw, 92vh, flex column) que no encajan en la API simple del Modal compartido. */
export const EditCompraModal = ({
    show, editingCompra, isLoadingEditDetails, editLineas,
    editInputValue, handleEditSearchChange, editShowSearchDropdown, setEditShowSearchDropdown, editSearchResults,
    handleAddEditLinea, handleUpdateEditLinea, handleRemoveEditLinea,
    proveedores, editSelectedProveedor, setEditSelectedProveedor,
    editTipoCompra, setEditTipoCompra, editMetodoPago, setEditMetodoPago,
    editCuotas, setEditCuotas, editFechaVencimiento, setEditFechaVencimiento,
    editFacturaProveedor, setEditFacturaProveedor,
    editCostosAdicionales, handleAddEditCostoAdicional, handleUpdateEditCostoAdicional, handleRemoveEditCostoAdicional,
    editSubtotalLineas, editDescuentosLineas, editTotalCostosAdicionales, editTotalFactura,
    isSavingEditCompra, handleSaveEditCompra, onClose,
}: EditCompraModalProps) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop" style={{ zIndex: 1100 }} onClick={() => !isSavingEditCompra && onClose()}>
            <div
                className="modal-content"
                style={{
                    maxWidth: '1280px',
                    width: '95vw',
                    maxHeight: '92vh',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1.5rem',
                    overflow: 'hidden',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <IconEdit /> Editar Compra #{editingCompra?.id ?? editingCompra?.compraid}
                        </h3>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Modifique productos, cantidades, precios unitarios, descuentos y proveedor. El inventario se ajustará automáticamente.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="btn"
                        onClick={onClose}
                        disabled={isSavingEditCompra}
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.9rem' }}
                    >
                        ✕
                    </button>
                </div>

                {isLoadingEditDetails ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <IconLoader /> Cargando detalles de la compra...
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '1.25rem', flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
                        {/* Left Side: Product Search & Lines */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Product Search / Scanner */}
                            <div className="card" style={{ padding: '0.85rem', position: 'relative' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <div className="pos-scanner-wrap" style={{ flex: 1, margin: 0, position: 'relative' }}>
                                        <div className="pos-scanner-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                            <IconSearch />
                                        </div>
                                        <input
                                            type="text"
                                            className="form-input pos-scanner-input"
                                            placeholder="Buscar por código, nombre o ID para agregar a la compra..."
                                            value={editInputValue}
                                            onChange={e => handleEditSearchChange(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (editSearchResults.length > 0) {
                                                        handleAddEditLinea(editSearchResults[0]);
                                                    }
                                                }
                                            }}
                                        />
                                        {/* Search Dropdown */}
                                        {editShowSearchDropdown && editSearchResults.length > 0 && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    right: 0,
                                                    marginTop: '0.4rem',
                                                    backgroundColor: 'var(--bg-dark)',
                                                    borderRadius: '10px',
                                                    border: '1px solid var(--border-color)',
                                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                                                    zIndex: 1200,
                                                    maxHeight: '260px',
                                                    overflowY: 'auto',
                                                }}
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>{editSearchResults.length} producto(s) encontrado(s)</span>
                                                    <button type="button" onClick={() => setEditShowSearchDropdown(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>✕</button>
                                                </div>
                                                {editSearchResults.map(p => (
                                                    <div
                                                        key={p.id}
                                                        style={{
                                                            padding: '0.6rem 0.85rem',
                                                            cursor: 'pointer',
                                                            borderBottom: '1px solid var(--border-color)',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                        }}
                                                        className="nav-link"
                                                        onClick={() => handleAddEditLinea(p)}
                                                    >
                                                        <div>
                                                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.nombre}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                                {p.codigobarra ? `Cód: ${p.codigobarra}` : `ID: ${p.id}`}
                                                                {p.stockactual != null && ` • Stock: ${p.stockactual}`}
                                                            </div>
                                                        </div>
                                                        <div style={{ fontWeight: 700, color: 'var(--accent-success)', fontSize: '0.85rem' }}>
                                                            C$ {Number(p.preciocompra || 0).toFixed(2)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Products Table */}
                            <div className="card" style={{ padding: '0.85rem', flex: 1, overflowX: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        Líneas de la Compra ({editLineas.length})
                                    </strong>
                                </div>
                                {editLineas.length === 0 ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No hay productos en la compra. Busque y agregue productos arriba.
                                    </div>
                                ) : (
                                    <table className="pos-table" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th style={{ width: '110px' }}>Cantidad</th>
                                                <th style={{ width: '110px' }}>Precio Unit.</th>
                                                <th style={{ width: '90px' }}>Desc.</th>
                                                <th style={{ width: '100px', textAlign: 'right' }}>Subtotal</th>
                                                <th style={{ width: '40px' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {editLineas.map((linea, idx) => {
                                                const cant = Number(linea.cantidad) || 0;
                                                const precio = Number(linea.preciounitario) || 0;
                                                const desc = Number(linea.descuento) || 0;
                                                const sub = Math.max(0, (cant * precio) - desc);
                                                return (
                                                    <tr key={`${linea.producto.id}-${idx}`}>
                                                        <td>
                                                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{linea.producto.nombre}</div>
                                                            {linea.producto.codigobarra && (
                                                                <span className="pos-barcode-badge" style={{ fontSize: '0.7rem' }}>
                                                                    {linea.producto.codigobarra}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="pos-qty-control" style={{ maxWidth: '105px' }}>
                                                                <button
                                                                    type="button"
                                                                    className="pos-qty-btn"
                                                                    onClick={() => linea.cantidad > 1 && handleUpdateEditLinea(idx, 'cantidad', Number((Number(linea.cantidad) - 1).toFixed(2)))}
                                                                    disabled={linea.cantidad <= 1}
                                                                >−</button>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    className="pos-qty-input"
                                                                    value={linea.cantidad === 0 ? '' : linea.cantidad}
                                                                    min={0.0001}
                                                                    onChange={e => {
                                                                        const val = e.target.value;
                                                                        handleUpdateEditLinea(idx, 'cantidad', val === '' ? 0 : parseFloat(val));
                                                                    }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="pos-qty-btn"
                                                                    onClick={() => handleUpdateEditLinea(idx, 'cantidad', Number((Number(linea.cantidad) + 1).toFixed(2)))}
                                                                >+</button>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                step="any"
                                                                min={0}
                                                                className="form-input"
                                                                style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                                                                value={linea.preciounitario === 0 ? '' : linea.preciounitario}
                                                                onChange={e => {
                                                                    const val = e.target.value;
                                                                    handleUpdateEditLinea(idx, 'preciounitario', val === '' ? 0 : parseFloat(val));
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                step="any"
                                                                min={0}
                                                                className="form-input"
                                                                style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                                                                value={linea.descuento === 0 ? '' : linea.descuento}
                                                                onChange={e => {
                                                                    const val = e.target.value;
                                                                    handleUpdateEditLinea(idx, 'descuento', val === '' ? 0 : parseFloat(val));
                                                                }}
                                                            />
                                                        </td>
                                                        <td style={{ textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: '0.85rem' }}>
                                                            C$ {sub.toFixed(2)}
                                                        </td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveEditLinea(idx)}
                                                                className="pos-remove-btn"
                                                                title="Eliminar producto de la compra"
                                                            >
                                                                <IconTrash />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Header details, Costs & Totals */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="card" style={{ padding: '1rem' }}>
                                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}>Datos de la Compra</h4>

                                {/* Proveedor */}
                                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Proveedor *</label>
                                    <select
                                        className="form-input"
                                        value={editSelectedProveedor}
                                        onChange={e => setEditSelectedProveedor(e.target.value)}
                                    >
                                        <option value="">-- Seleccionar Proveedor --</option>
                                        {proveedores.map(p => (
                                            <option key={p.id ?? p.proveedorid} value={p.id ?? p.proveedorid}>
                                                {p.nombreempresa}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tipo de compra */}
                                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Tipo de Compra</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                        <button
                                            type="button"
                                            className={`btn ${editTipoCompra === 'CONTADO' ? 'btn-primary' : ''}`}
                                            style={{ padding: '0.4rem', fontSize: '0.8rem', justifyContent: 'center' }}
                                            onClick={() => setEditTipoCompra('CONTADO')}
                                        >
                                            CONTADO
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn ${editTipoCompra === 'CREDITO' ? 'btn-primary' : ''}`}
                                            style={{ padding: '0.4rem', fontSize: '0.8rem', justifyContent: 'center' }}
                                            onClick={() => setEditTipoCompra('CREDITO')}
                                        >
                                            CRÉDITO
                                        </button>
                                    </div>
                                </div>

                                {/* Método de pago o Crédito */}
                                {editTipoCompra === 'CONTADO' ? (
                                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                                        <label className="form-label" style={{ fontSize: '0.8rem' }}>Método de Pago</label>
                                        <select
                                            className="form-input"
                                            value={editMetodoPago}
                                            onChange={e => setEditMetodoPago(e.target.value)}
                                        >
                                            <option value="efectivo">Efectivo (NIO/USD)</option>
                                            <option value="bac">Banco BAC</option>
                                            <option value="lafise">Banco Lafise</option>
                                            <option value="banpro">Banco Banpro</option>
                                            <option value="transferencia">Transferencia ACH</option>
                                        </select>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontSize: '0.8rem' }}>Cuotas</label>
                                            <input
                                                type="number"
                                                min={1}
                                                className="form-input"
                                                value={editCuotas}
                                                onChange={e => setEditCuotas(parseInt(e.target.value) || 1)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" style={{ fontSize: '0.8rem' }}>Vencimiento</label>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={editFechaVencimiento}
                                                onChange={e => setEditFechaVencimiento(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Factura Proveedor */}
                                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Factura del Proveedor (Opcional)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ej. FAC-001239"
                                        value={editFacturaProveedor}
                                        onChange={e => setEditFacturaProveedor(e.target.value)}
                                    />
                                </div>

                                {/* Costos Adicionales */}
                                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <label className="form-label" style={{ fontSize: '0.8rem', margin: 0 }}>Costos Adicionales (Flete / Acarreo)</label>
                                        <button
                                            type="button"
                                            className="btn"
                                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                            onClick={handleAddEditCostoAdicional}
                                        >
                                            <IconPlus /> Agregar
                                        </button>
                                    </div>
                                    {editCostosAdicionales.map((ca) => (
                                        <div key={ca.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr auto', gap: '0.4rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                                            <input
                                                type="text"
                                                placeholder="Concepto (ej. Flete)"
                                                className="form-input"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                                value={ca.concepto}
                                                onChange={e => handleUpdateEditCostoAdicional(ca.id, 'concepto', e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                step="any"
                                                placeholder="Monto"
                                                className="form-input"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                                value={ca.monto}
                                                onChange={e => handleUpdateEditCostoAdicional(ca.id, 'monto', e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveEditCostoAdicional(ca.id)}
                                                className="pos-remove-btn"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary Card */}
                            <div className="card" style={{ padding: '1rem', background: 'var(--bg-secondary)' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>Resumen de Totales</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                                    <span>Subtotal Productos:</span>
                                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>C$ {editSubtotalLineas.toFixed(2)}</span>
                                </div>
                                {editDescuentosLineas > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--accent-danger)' }}>
                                        <span>Descuentos:</span>
                                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>- C$ {editDescuentosLineas.toFixed(2)}</span>
                                    </div>
                                )}
                                {editTotalCostosAdicionales > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--accent-primary)' }}>
                                        <span>Costos Adicionales:</span>
                                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>+ C$ {editTotalCostosAdicionales.toFixed(2)}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 700, borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
                                    <span>Total Compra:</span>
                                    <span style={{ color: 'var(--accent-success)', fontVariantNumeric: 'tabular-nums' }}>
                                        C$ {editTotalFactura.toFixed(2)}
                                    </span>
                                </div>

                                {/* Modal Actions */}
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                                    <button
                                        type="button"
                                        className="btn"
                                        style={{ flex: 1 }}
                                        onClick={onClose}
                                        disabled={isSavingEditCompra}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        style={{ flex: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                        onClick={handleSaveEditCompra}
                                        disabled={isSavingEditCompra}
                                    >
                                        {isSavingEditCompra ? <IconLoader /> : <IconSave />}
                                        {isSavingEditCompra ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
