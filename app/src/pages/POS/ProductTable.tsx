import { IconCart } from './icons';
import type { LineaProducto } from './types';

interface ProductTableProps {
    lineas: LineaProducto[];
    totalItems: number;
    lastAdded: number | null;
    updateCantidad: (idx: number, cantidad: number | string) => void;
    updateDescuento: (idx: number, descuento: number | string) => void;
    removeLine: (idx: number) => void;
}

export const ProductTable = ({ lineas, totalItems, lastAdded, updateCantidad, updateDescuento, removeLine }: ProductTableProps) => {
    return (
        <div className="card pos-table-card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title">Productos <span style={{ fontWeight: 400, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>({totalItems} {totalItems === 1 ? 'item' : 'items'})</span></h3>
            </div>

            {lineas.length === 0 ? (
                <div className="pos-empty">
                    <div className="pos-empty-icon"><IconCart /></div>
                    <p>Escanee un producto para comenzar</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table className="pos-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Código</th>
                                <th>Precio unit.</th>
                                <th>Cantidad</th>
                                <th>Descuento</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {lineas.map((linea, idx) => {
                                const cant = Number(linea.cantidad) || 0;
                                const lineSubtotal = Math.max(0, (linea.producto.precioventa * cant) - (Number(linea.descuento) || 0));
                                return (
                                    <tr key={linea.producto.id} className={lastAdded === linea.producto.id ? 'pos-row-flash' : ''}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{linea.producto.nombre}</div>
                                            {linea.producto.categorianombre && (
                                                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{linea.producto.categorianombre}</div>
                                            )}
                                        </td>
                                        <td>
                                            <span className="pos-barcode-badge">
                                                {linea.producto.codigobarra || `#${linea.producto.id}`}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>C$ {linea.producto.precioventa.toFixed(2)}</td>
                                        <td>
                                            <div className="pos-qty-control">
                                                <button
                                                    className="pos-qty-btn"
                                                    onClick={() => updateCantidad(idx, Math.round(((Number(linea.cantidad) || 0) - 0.1) * 100) / 100)}
                                                    disabled={Number(linea.cantidad) <= 0.1}
                                                >−</button>
                                                <input
                                                    type="number"
                                                    className="pos-qty-input"
                                                    value={linea.cantidad}
                                                    min={0.0001}
                                                    max={100000}
                                                    step="any"
                                                    onChange={e => updateCantidad(idx, e.target.value)}
                                                />
                                                <button
                                                    className="pos-qty-btn"
                                                    onClick={() => updateCantidad(idx, Math.round(((Number(linea.cantidad) || 0) + 0.1) * 100) / 100)}
                                                >+</button>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ position: 'relative', width: '90px' }}>
                                                <span style={{ position: 'absolute', left: '0.4rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>C$</span>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    style={{ paddingLeft: '1.5rem', paddingRight: '0.25rem', height: '2rem', fontSize: '0.8rem', fontVariantNumeric: 'tabular-nums' }}
                                                    placeholder="0.00"
                                                    min={0}
                                                    step="any"
                                                    value={linea.descuento === 0 ? '' : linea.descuento}
                                                    onChange={e => updateDescuento(idx, e.target.value)}
                                                />
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 600, color: 'var(--accent-success)', fontVariantNumeric: 'tabular-nums' }}>
                                            C$ {lineSubtotal.toFixed(2)}
                                        </td>
                                        <td>
                                            <button className="pos-remove-btn" onClick={() => removeLine(idx)} title="Eliminar">✕</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
