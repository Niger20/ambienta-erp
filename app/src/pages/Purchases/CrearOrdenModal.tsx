import { Modal } from '../../components/ui/Modal';
import { IconSearch } from './icons';
import api from '../../api/axios';
import type { Producto, Proveedor } from './types';

interface NuevaOrdenLinea { producto: Producto; cantidad: number; preciounitario: number }

interface CrearOrdenModalProps {
    show: boolean;
    proveedores: Proveedor[];
    productosCatalogo: Producto[];
    nuevaOrdenProveedorId: string;
    setNuevaOrdenProveedorId: (v: string) => void;
    nuevaOrdenFechaEsperada: string;
    setNuevaOrdenFechaEsperada: (v: string) => void;
    ordenInputSearch: string;
    setOrdenInputSearch: (v: string) => void;
    ordenSearchResults: Producto[];
    setOrdenSearchResults: (v: Producto[]) => void;
    showOrdenSearchDropdown: boolean;
    setShowOrdenSearchDropdown: (v: boolean) => void;
    nuevaOrdenLineas: NuevaOrdenLinea[];
    setNuevaOrdenLineas: React.Dispatch<React.SetStateAction<NuevaOrdenLinea[]>>;
    isSavingOrden: boolean;
    handleCrearOrdenCompra: (e: React.FormEvent) => Promise<void>;
    onClose: () => void;
}

export const CrearOrdenModal = ({
    show, proveedores, productosCatalogo,
    nuevaOrdenProveedorId, setNuevaOrdenProveedorId,
    nuevaOrdenFechaEsperada, setNuevaOrdenFechaEsperada,
    ordenInputSearch, setOrdenInputSearch,
    ordenSearchResults, setOrdenSearchResults,
    showOrdenSearchDropdown, setShowOrdenSearchDropdown,
    nuevaOrdenLineas, setNuevaOrdenLineas,
    isSavingOrden, handleCrearOrdenCompra, onClose,
}: CrearOrdenModalProps) => {
    return (
        <Modal open={show} onClose={onClose} maxWidth={650}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Nueva Orden de Compra</h3>
                <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <form onSubmit={handleCrearOrdenCompra}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Proveedor *</label>
                        <select
                            className="form-input"
                            required
                            value={nuevaOrdenProveedorId}
                            onChange={e => setNuevaOrdenProveedorId(e.target.value)}
                        >
                            <option value="">Seleccione proveedor...</option>
                            {proveedores.map(p => (
                                <option key={p.id ?? p.proveedorid} value={p.id ?? p.proveedorid}>
                                    {p.nombreempresa} ({p.asesorventas || 'Sin asesor'})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Fecha Esperada de Entrega</label>
                        <input
                            type="date"
                            className="form-input"
                            value={nuevaOrdenFechaEsperada}
                            onChange={e => setNuevaOrdenFechaEsperada(e.target.value)}
                        />
                    </div>
                </div>

                {/* Buscador de productos para la orden */}
                <div className="form-group" style={{ marginBottom: '1rem', position: 'relative' }}>
                    <label className="form-label">Buscar y Agregar Productos</label>
                    <div className="pos-scanner-wrap" style={{ margin: 0 }}>
                        <div className="pos-scanner-icon"><IconSearch /></div>
                        <input
                            type="text"
                            className="form-input pos-scanner-input"
                            placeholder="Escribe código o nombre del producto y presiona Enter..."
                            value={ordenInputSearch}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (ordenSearchResults.length > 0) {
                                        const prod = ordenSearchResults[0];
                                        setNuevaOrdenLineas(prev => {
                                            const idx = prev.findIndex(l => Number(l.producto.id ?? (l.producto as any).productoid) === Number(prod.id));
                                            if (idx >= 0) {
                                                const copy = [...prev];
                                                copy[idx].cantidad += 1;
                                                return copy;
                                            }
                                            return [...prev, { producto: prod, cantidad: 1, preciounitario: prod.preciocompra }];
                                        });
                                        setShowOrdenSearchDropdown(false);
                                        setOrdenInputSearch('');
                                    }
                                }
                            }}
                            onChange={async (e) => {
                                const val = e.target.value;
                                setOrdenInputSearch(val);
                                if (val.trim().length >= 1) {
                                    const q = val.trim().toLowerCase();
                                    const localMatches = productosCatalogo.filter((p: Producto) =>
                                        (p.nombre || '').toLowerCase().includes(q) ||
                                        (p.codigobarra || '').toLowerCase().includes(q) ||
                                        String(p.id).includes(q)
                                    ).map((d: Producto) => ({
                                        id: Number(d.id),
                                        nombre: d.nombre,
                                        codigobarra: d.codigobarra,
                                        preciocompra: Number(d.preciocompra || 0),
                                        precioventa: Number(d.precioventa || 0),
                                        stockactual: d.stockactual,
                                    }));

                                    if (localMatches.length > 0) {
                                        setOrdenSearchResults(localMatches.slice(0, 20));
                                        setShowOrdenSearchDropdown(true);
                                    }

                                    try {
                                        const res = await api.get(`/productos/search?q=${encodeURIComponent(val.trim())}`);
                                        const results = (res.data || []).map((d: any) => ({
                                            id: Number(d.id ?? d.productoid),
                                            nombre: d.nombre,
                                            codigobarra: d.codigobarra,
                                            preciocompra: Number(d.preciocompra || 0),
                                            precioventa: Number(d.precioventa || 0),
                                            stockactual: d.stockactual,
                                        }));
                                        if (results.length > 0) {
                                            setOrdenSearchResults(results);
                                            setShowOrdenSearchDropdown(true);
                                        } else if (localMatches.length === 0) {
                                            setOrdenSearchResults([]);
                                            setShowOrdenSearchDropdown(false);
                                        }
                                    } catch {
                                        if (localMatches.length === 0) {
                                            setOrdenSearchResults([]);
                                            setShowOrdenSearchDropdown(false);
                                        }
                                    }
                                } else {
                                    setOrdenSearchResults([]);
                                    setShowOrdenSearchDropdown(false);
                                }
                            }}
                        />
                    </div>
                    {showOrdenSearchDropdown && ordenSearchResults.length > 0 && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.2rem', backgroundColor: 'var(--bg-dark)', borderRadius: '10px', border: '1px solid var(--border-color)', boxShadow: '0 8px 16px rgba(0,0,0,0.5)', zIndex: 100, maxHeight: '200px', overflowY: 'auto' }}>
                            {ordenSearchResults.map(prod => (
                                <div
                                    key={prod.id}
                                    style={{ padding: '0.6rem 0.85rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                    className="nav-link"
                                    onClick={() => {
                                        setNuevaOrdenLineas(prev => {
                                            const idx = prev.findIndex(l => Number(l.producto.id ?? (l.producto as any).productoid) === Number(prod.id));
                                            if (idx >= 0) {
                                                const copy = [...prev];
                                                copy[idx].cantidad += 1;
                                                return copy;
                                            }
                                            return [...prev, { producto: prod, cantidad: 1, preciounitario: prod.preciocompra }];
                                        });
                                        setShowOrdenSearchDropdown(false);
                                        setOrdenInputSearch('');
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{prod.nombre}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cód: {prod.codigobarra || prod.id}</div>
                                    </div>
                                    <div style={{ fontWeight: 700, color: 'var(--accent-success)' }}>C$ {prod.preciocompra.toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div style={{ marginTop: '0.4rem' }}>
                        <select
                            className="form-input"
                            style={{ fontSize: '0.82rem', padding: '0.35rem 0.6rem' }}
                            value=""
                            onChange={(e) => {
                                if (!e.target.value) return;
                                const pId = Number(e.target.value);
                                const found = productosCatalogo.find((p: Producto) => Number(p.id) === pId);
                                if (found) {
                                    const prodObj = {
                                        id: pId,
                                        nombre: found.nombre,
                                        codigobarra: found.codigobarra,
                                        preciocompra: Number(found.preciocompra || 0),
                                        precioventa: Number(found.precioventa || 0),
                                        stockactual: found.stockactual,
                                    };
                                    setNuevaOrdenLineas(prev => {
                                        const idx = prev.findIndex(l => Number(l.producto.id ?? (l.producto as any).productoid) === pId);
                                        if (idx >= 0) {
                                            const copy = [...prev];
                                            copy[idx].cantidad += 1;
                                            return copy;
                                        }
                                        return [...prev, { producto: prodObj, cantidad: 1, preciounitario: prodObj.preciocompra }];
                                    });
                                }
                                e.target.value = '';
                            }}
                        >
                            <option value="">O selecciona un producto directamente del catálogo...</option>
                            {productosCatalogo.map((p: Producto) => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} {p.codigobarra ? `(${p.codigobarra})` : ''} - C$ {Number(p.preciocompra || 0).toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tabla de líneas de la orden */}
                <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    {nuevaOrdenLineas.length === 0 ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            No hay productos en la orden de compra. Usa el buscador superior para agregar.
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Producto</th>
                                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center', width: '90px' }}>Cant.</th>
                                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', width: '110px' }}>Costo Est.</th>
                                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', width: '110px' }}>Subtotal</th>
                                    <th style={{ padding: '0.5rem 0.75rem', width: '40px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {nuevaOrdenLineas.map((linea, idx) => (
                                    <tr key={linea.producto.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>{linea.producto.nombre}</td>
                                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                                            <input
                                                type="number"
                                                min={1}
                                                className="form-input"
                                                style={{ width: '70px', padding: '0.2rem 0.4rem', textAlign: 'center' }}
                                                value={linea.cantidad}
                                                onChange={e => {
                                                    const val = Math.max(1, parseInt(e.target.value) || 1);
                                                    setNuevaOrdenLineas(prev => {
                                                        const copy = [...prev];
                                                        copy[idx].cantidad = val;
                                                        return copy;
                                                    });
                                                }}
                                            />
                                        </td>
                                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                className="form-input"
                                                style={{ width: '85px', padding: '0.2rem 0.4rem', textAlign: 'right' }}
                                                value={linea.preciounitario}
                                                onChange={e => {
                                                    const val = parseFloat(e.target.value) || 0;
                                                    setNuevaOrdenLineas(prev => {
                                                        const copy = [...prev];
                                                        copy[idx].preciounitario = val;
                                                        return copy;
                                                    });
                                                }}
                                            />
                                        </td>
                                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                                            C$ {(linea.cantidad * linea.preciounitario).toFixed(2)}
                                        </td>
                                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                                            <button
                                                type="button"
                                                onClick={() => setNuevaOrdenLineas(prev => prev.filter((_, i) => i !== idx))}
                                                style={{ border: 'none', background: 'transparent', color: 'var(--accent-danger)', cursor: 'pointer' }}
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Estimado de la Orden:</span>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', fontVariantNumeric: 'tabular-nums' }}>
                        C$ {nuevaOrdenLineas.reduce((sum, l) => sum + (l.cantidad * l.preciounitario), 0).toFixed(2)}
                    </strong>
                </div>

                <div className="modal-actions">
                    <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSavingOrden || nuevaOrdenLineas.length === 0 || !nuevaOrdenProveedorId}
                    >
                        {isSavingOrden ? 'Creando Orden...' : 'Generar Orden de Compra'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
