import { IconDownload, IconLoader, IconPlus, IconSave, IconSearch, IconSupplier, IconTrash, IconUpload } from './icons';
import type { LineaCompra, Producto, Proveedor } from './types';

interface NuevaCompraTabProps {
    ordenCompraIdActiva: number | null;
    setOrdenCompraIdActiva: (v: number | null) => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
    isSearching: boolean;
    inputValue: string;
    setInputValue: (v: string) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    showSearchDropdown: boolean;
    searchResults: Producto[];
    searchFocusedIndex: number;
    setShowSearchDropdown: (v: boolean) => void;
    setSearchResults: (v: Producto[]) => void;
    agregarProductoALineas: (producto: Producto) => void;
    downloadTemplate: () => void;
    excelInputRef: React.RefObject<HTMLInputElement | null>;
    handleExcelUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    lineas: LineaCompra[];
    updateLinea: (idx: number, field: 'cantidad' | 'preciounitario' | 'descuento', value: number) => void;
    removeLine: (idx: number) => void;
    selectedProveedor: string;
    setSelectedProveedor: (v: string) => void;
    busquedaProveedor: string;
    setBusquedaProveedor: (v: string) => void;
    showProveedoresDropdown: boolean;
    setShowProveedoresDropdown: (v: boolean) => void;
    supplierFocusedIndex: number;
    setSupplierFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
    proveedoresFiltradosDropdown: Proveedor[];
    proveedores: Proveedor[];
    openCreateProveedor: () => void;
    tipoCompra: 'CONTADO' | 'CREDITO';
    setTipoCompra: (v: 'CONTADO' | 'CREDITO') => void;
    metodoPago: string;
    setMetodoPago: (v: string) => void;
    cuotas: number;
    setCuotas: (v: number) => void;
    fechaVencimiento: string;
    setFechaVencimiento: (v: string) => void;
    facturaProveedor: string;
    setFacturaProveedor: (v: string) => void;
    costosAdicionales: { id: string; concepto: string; monto: string }[];
    handleAddCostoAdicional: () => void;
    handleUpdateCostoAdicional: (id: string, field: 'concepto' | 'monto', val: string) => void;
    handleRemoveCostoAdicional: (id: string) => void;
    totalCostosAdicionales: number;
    totalDescuentosLineas: number;
    total: number;
    costoTotalAdquisicion: number;
    isSaving: boolean;
    handleGuardarCompra: () => Promise<void>;
    setLineas: React.Dispatch<React.SetStateAction<LineaCompra[]>>;
}

export const NuevaCompraTab = ({
    ordenCompraIdActiva, setOrdenCompraIdActiva,
    inputRef, isSearching, inputValue, setInputValue, handleKeyDown,
    showSearchDropdown, searchResults, searchFocusedIndex, setShowSearchDropdown, setSearchResults, agregarProductoALineas,
    downloadTemplate, excelInputRef, handleExcelUpload,
    lineas, updateLinea, removeLine,
    selectedProveedor, setSelectedProveedor, busquedaProveedor, setBusquedaProveedor,
    showProveedoresDropdown, setShowProveedoresDropdown, supplierFocusedIndex, setSupplierFocusedIndex,
    proveedoresFiltradosDropdown, proveedores, openCreateProveedor,
    tipoCompra, setTipoCompra, metodoPago, setMetodoPago, cuotas, setCuotas, fechaVencimiento, setFechaVencimiento,
    facturaProveedor, setFacturaProveedor,
    costosAdicionales, handleAddCostoAdicional, handleUpdateCostoAdicional, handleRemoveCostoAdicional, totalCostosAdicionales,
    totalDescuentosLineas, total, costoTotalAdquisicion,
    isSaving, handleGuardarCompra, setLineas,
}: NuevaCompraTabProps) => {
    return (
        <div className="pos-layout">
            {/* Left: scanner + lines */}
            <div>
                {ordenCompraIdActiva && (
                    <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.12)', border: '1px solid var(--accent-primary)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div>
                                <strong style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>Recepción de Mercadería: Orden de Compra #{ordenCompraIdActiva}</strong>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Valide las cantidades físicas recibidas y costos. Al confirmar, el inventario se actualizará y la orden se marcará como RECIBIDA.</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn"
                            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                            onClick={() => setOrdenCompraIdActiva(null)}
                        >
                            Desvincular orden
                        </button>
                    </div>
                )}
                {/* Scanner */}
                <div className="card" style={{ marginBottom: '1rem', padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div className="pos-scanner-wrap" style={{ flex: 1, margin: 0, position: 'relative' }}>
                            <div className="pos-scanner-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                {isSearching ? <IconLoader /> : <IconSearch />}
                            </div>
                            <label htmlFor="purchases-scanner-input" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>Escanear Producto</label>
                            <input
                                ref={inputRef}
                                id="purchases-scanner-input"
                                type="text"
                                className="form-input pos-scanner-input"
                                placeholder="Código de barras, ID o nombre del producto..."
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                disabled={isSearching}
                                maxLength={100}
                                role="combobox"
                                aria-expanded={showSearchDropdown && searchResults.length > 0}
                                aria-autocomplete="list"
                                aria-haspopup="listbox"
                                aria-controls="purchases-search-listbox"
                            />
                            {/* Search Results Dropdown */}
                            {showSearchDropdown && searchResults.length > 0 && (
                                <div
                                    id="purchases-search-listbox"
                                    role="listbox"
                                    aria-label="Resultados de búsqueda de productos"
                                    style={{
                                        position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem',
                                        backgroundColor: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--border-color)',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', zIndex: 100, maxHeight: '300px', overflowY: 'auto'
                                    }}
                                    onClick={e => e.stopPropagation()}
                                >
                                    <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{searchResults.length} resultado{searchResults.length > 1 ? 's' : ''} encontrado{searchResults.length > 1 ? 's' : ''}</span>
                                        <button type="button" onClick={() => { setShowSearchDropdown(false); setSearchResults([]); inputRef.current?.focus(); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}>✕ Cerrar</button>
                                    </div>
                                    {searchResults.map((p, idx) => (
                                        <div
                                            key={p.id}
                                            role="option"
                                            aria-selected={idx === searchFocusedIndex}
                                            style={{
                                                padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)',
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background-color 0.15s ease-out',
                                                backgroundColor: idx === searchFocusedIndex ? 'var(--bg-hover)' : 'transparent',
                                            }}
                                            className="nav-link"
                                            onClick={(e) => { e.stopPropagation(); agregarProductoALineas(p); }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{p.nombre}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    {p.codigobarra ? `Cód: ${p.codigobarra}` : `ID: ${p.id}`}
                                                    {p.categorianombre && ` • ${p.categorianombre}`}
                                                    {p.stockactual != null && ` • Stock: ${p.stockactual}`}
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 700, color: 'var(--accent-success)', whiteSpace: 'nowrap' }}>
                                                C$ {p.preciocompra.toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className="btn" style={{ whiteSpace: 'nowrap', height: '3.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} onClick={downloadTemplate} title="Descargar plantilla Excel">
                            <IconDownload /> Plantilla Excel
                        </button>
                        <button className="btn btn-primary" style={{ whiteSpace: 'nowrap', height: '3.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => excelInputRef.current?.click()}>
                            <IconUpload /> Importar Excel
                        </button>
                        <input ref={excelInputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={handleExcelUpload} />
                    </div>
                </div>

                {/* Lines table */}
                <div className="card">
                    {lineas.length === 0 ? (
                        <div className="pos-empty">
                            <div className="pos-empty-icon" style={{ opacity: 0.3, marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                    <line x1="12" y1="22.08" x2="12" y2="12" />
                                </svg>
                            </div>
                            <p>Escanee un producto o importe desde Excel</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="pos-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Código</th>
                                        <th>Cantidad</th>
                                        <th>Precio Unit.</th>
                                        <th>Descuento</th>
                                        <th>Subtotal</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lineas.map((linea, idx) => (
                                        <tr key={`${linea.producto.id}-${idx}`}>
                                            <td style={{ fontWeight: 500 }}>{linea.producto.nombre}</td>
                                            <td><span className="pos-barcode-badge">{linea.producto.codigobarra || `ID: ${linea.producto.id}`}</span></td>
                                            <td>
                                                <div className="pos-qty-control">
                                                    <button className="pos-qty-btn" onClick={() => linea.cantidad > 1 && updateLinea(idx, 'cantidad', Number((linea.cantidad - 1).toFixed(2)))} disabled={linea.cantidad <= 1}>−</button>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        className="pos-qty-input"
                                                        value={linea.cantidad === 0 ? '' : linea.cantidad}
                                                        min={0.001}
                                                        max={10000}
                                                        onChange={e => {
                                                            const val = e.target.value;
                                                            updateLinea(idx, 'cantidad', val === '' ? 0 : parseFloat(val));
                                                        }}
                                                    />
                                                    <button className="pos-qty-btn" onClick={() => updateLinea(idx, 'cantidad', Number((linea.cantidad + 1).toFixed(2)))}>+</button>
                                                </div>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    className="form-input"
                                                    value={linea.preciounitario === 0 ? '' : linea.preciounitario}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        updateLinea(idx, 'preciounitario', val === '' ? 0 : parseFloat(val));
                                                    }}
                                                    style={{ width: '90px', padding: '0.3rem 0.5rem' }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    min="0"
                                                    className="form-input"
                                                    value={linea.descuento === 0 ? '' : linea.descuento}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        updateLinea(idx, 'descuento', val === '' ? 0 : parseFloat(val));
                                                    }}
                                                    style={{ width: '80px', padding: '0.3rem 0.5rem' }}
                                                />
                                            </td>
                                            <td className="col-price" style={{ fontWeight: 600, color: 'var(--accent-success)' }}>
                                                C$ {(linea.preciounitario * linea.cantidad - linea.descuento).toFixed(2)}
                                            </td>
                                            <td>
                                                <button className="pos-remove-btn" onClick={() => removeLine(idx)}>
                                                    <IconTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: summary */}
            <div className="pos-summary">
                <div className="pos-summary-header"><h3>Detalles de Compra</h3></div>
                <div className="pos-summary-body">
                    <div className="form-group" style={{ marginBottom: '0.75rem', zIndex: 60, position: 'relative' }}>
                        <label className="form-label" htmlFor="purchases-supplier-input">Proveedor *</label>
                        <div style={{ position: 'relative' }}>
                            <div
                                className="form-input"
                                style={{ display: 'flex', alignItems: 'center', cursor: 'text', padding: '0', overflow: 'visible', border: '2px solid var(--border-color)', borderRadius: '12px', height: '3.2rem' }}
                                onClick={(e) => { e.stopPropagation(); setShowProveedoresDropdown(true); }}
                            >
                                <span style={{ paddingLeft: '1rem', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}><IconSupplier /></span>
                                <input
                                    id="purchases-supplier-input"
                                    type="text"
                                    placeholder={proveedores.find(p => (p.id || p.proveedorid)?.toString() === selectedProveedor)?.nombreempresa || "Buscar proveedor..."}
                                    value={busquedaProveedor}
                                    onChange={(e) => {
                                        setBusquedaProveedor(e.target.value);
                                        setShowProveedoresDropdown(true);
                                        setSupplierFocusedIndex(-1);
                                        if (selectedProveedor) setSelectedProveedor('');
                                    }}
                                    onKeyDown={(e) => {
                                        if (showProveedoresDropdown) {
                                            const optionsCount = 1 + proveedoresFiltradosDropdown.length;
                                            if (e.key === 'ArrowDown') {
                                                e.preventDefault();
                                                setSupplierFocusedIndex(prev => (prev + 1) % optionsCount);
                                                return;
                                            }
                                            if (e.key === 'ArrowUp') {
                                                e.preventDefault();
                                                setSupplierFocusedIndex(prev => (prev - 1 + optionsCount) % optionsCount);
                                                return;
                                            }
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (supplierFocusedIndex === 0) {
                                                    openCreateProveedor();
                                                    setShowProveedoresDropdown(false);
                                                } else if (supplierFocusedIndex >= 1 && supplierFocusedIndex < optionsCount) {
                                                    const prov = proveedoresFiltradosDropdown[supplierFocusedIndex - 1];
                                                    const id = prov.id ?? prov.proveedorid;
                                                    setSelectedProveedor(String(id));
                                                    setBusquedaProveedor('');
                                                    setShowProveedoresDropdown(false);
                                                }
                                                return;
                                            }
                                            if (e.key === 'Escape') {
                                                e.preventDefault();
                                                setShowProveedoresDropdown(false);
                                                setSupplierFocusedIndex(-1);
                                                return;
                                            }
                                        }
                                    }}
                                    className="form-input"
                                    style={{ border: 'none', height: '100%', outline: 'none', backgroundColor: 'transparent', boxShadow: 'none', flex: 1 }}
                                    maxLength={100}
                                    role="combobox"
                                    aria-expanded={showProveedoresDropdown}
                                    aria-autocomplete="list"
                                    aria-haspopup="listbox"
                                    aria-controls="purchases-supplier-listbox"
                                />
                                {selectedProveedor && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setSelectedProveedor(''); setBusquedaProveedor(''); }}
                                        style={{ padding: '0 0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                    >
                                        ✕
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn"
                                    style={{ padding: '0 0.75rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-color)', borderRight: 'none', borderTop: 'none', borderBottom: 'none', color: 'var(--text-primary)', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                    onClick={(e) => { e.stopPropagation(); openCreateProveedor(); }}
                                    title="Nuevo Proveedor"
                                >
                                    <IconPlus />
                                </button>
                            </div>

                            {/* Dropdown Options */}
                            {showProveedoresDropdown && (
                                <div
                                    id="purchases-supplier-listbox"
                                    role="listbox"
                                    aria-label="Opciones de proveedores"
                                    style={{
                                        position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.2rem',
                                        backgroundColor: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--border-color)',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', zIndex: 100, maxHeight: '250px', overflowY: 'auto'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div
                                        role="option"
                                        aria-selected={supplierFocusedIndex === 0}
                                        style={{ padding: '0.85rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: supplierFocusedIndex === 0 ? 'var(--bg-hover)' : 'transparent' }}
                                        onClick={() => { openCreateProveedor(); setShowProveedoresDropdown(false); }}
                                        className="nav-link"
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg> <strong style={{ color: 'var(--accent-success)' }}>Nuevo Proveedor</strong>
                                    </div>

                                    {proveedoresFiltradosDropdown.map((p, idx) => (
                                        <div
                                            key={p.id ?? p.proveedorid}
                                            role="option"
                                            aria-selected={(idx + 1) === supplierFocusedIndex}
                                            style={{ padding: '0.85rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', backgroundColor: (idx + 1) === supplierFocusedIndex ? 'var(--bg-hover)' : 'transparent' }}
                                            onClick={() => { setSelectedProveedor(String(p.id ?? p.proveedorid)); setBusquedaProveedor(''); setShowProveedoresDropdown(false); }}
                                            className="nav-link"
                                        >
                                            <div style={{ fontWeight: 500 }}>{p.nombreempresa}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Asesor: {p.asesorventas}</div>
                                        </div>
                                    ))}
                                    {proveedoresFiltradosDropdown.length === 0 && (
                                        <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            No se encontraron proveedores...
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label">Tipo de Compra</label>
                        <div style={{ display: 'flex', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.25rem' }}>
                            {(['CONTADO', 'CREDITO'] as const).map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    className="btn"
                                    style={{
                                        flex: 1,
                                        fontWeight: 600,
                                        border: 'none',
                                        borderRadius: 'calc(var(--radius-md) - 2px)',
                                        backgroundColor: tipoCompra === t ? 'var(--bg-card)' : 'transparent',
                                        color: tipoCompra === t ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                        padding: '0.5rem 0',
                                        fontSize: '0.85rem',
                                        boxShadow: tipoCompra === t ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
                                        transition: 'all 0.15s ease-out'
                                    }}
                                    onClick={() => setTipoCompra(t)}
                                >
                                    {t === 'CONTADO' ? 'Contado' : 'Crédito'}
                                </button>
                            ))}
                        </div>
                    </div>
                    {tipoCompra === 'CONTADO' && (
                        <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                            <label className="form-label">Método de Pago</label>
                            <select className="form-input" value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
                                <option value="efectivo">Efectivo (NIO/USD)</option>
                                <option value="bac">Banco BAC</option>
                                <option value="lafise">Banco Lafise</option>
                                <option value="banpro">Banco Banpro</option>
                                <option value="transferencia">Transferencia ACH</option>
                            </select>
                        </div>
                    )}
                    {tipoCompra === 'CREDITO' && (
                        <>
                            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                                <label className="form-label">Número de Cuotas</label>
                                <input type="number" min="1" className="form-input" value={cuotas} onChange={e => setCuotas(Number(e.target.value))} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                                <label className="form-label">Fecha de Vencimiento de Primera Cuota</label>
                                <input type="date" className="form-input" value={fechaVencimiento} onChange={e => setFechaVencimiento(e.target.value)} />
                            </div>
                        </>
                    )}
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label">Factura Proveedor</label>
                        <input type="text" className="form-input" placeholder="Nº de factura (opcional)" value={facturaProveedor} onChange={e => setFacturaProveedor(e.target.value)} maxLength={100} />
                    </div>

                    {/* Costos Adicionales de la Compra */}
                    <div style={{ margin: '0.75rem 0', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Costos Adicionales (Flete / Acarreo)</span>
                            <button
                                type="button"
                                onClick={handleAddCostoAdicional}
                                style={{ border: '1px solid var(--accent-primary)', background: 'var(--accent-primary-bg)', color: 'var(--accent-primary)', borderRadius: '4px', padding: '0.15rem 0.5rem', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                                + Costo
                            </button>
                        </div>
                        {costosAdicionales.length === 0 ? (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Sin costos adicionales registrados</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {costosAdicionales.map((ca) => (
                                    <div key={ca.id} style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Concepto (ej. Flete)"
                                            style={{ flex: 1.5, height: '2rem', fontSize: '0.75rem' }}
                                            value={ca.concepto}
                                            onChange={e => handleUpdateCostoAdicional(ca.id, 'concepto', e.target.value)}
                                        />
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <span style={{ position: 'absolute', left: '0.35rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>C$</span>
                                            <input
                                                type="number"
                                                className="form-input"
                                                placeholder="0.00"
                                                min={0}
                                                step="0.01"
                                                style={{ paddingLeft: '1.4rem', height: '2rem', fontSize: '0.8rem', fontVariantNumeric: 'tabular-nums' }}
                                                value={ca.monto}
                                                onChange={e => handleUpdateCostoAdicional(ca.id, 'monto', e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCostoAdicional(ca.id)}
                                            style={{ border: 'none', background: 'transparent', color: 'var(--accent-danger)', cursor: 'pointer', padding: '0.2rem' }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {totalCostosAdicionales > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem', paddingTop: '0.35rem', borderTop: '1px solid var(--border-color)', color: 'var(--accent-primary)' }}>
                                <span>Total Adicionales:</span>
                                <strong>+ C$ {totalCostosAdicionales.toFixed(2)}</strong>
                            </div>
                        )}
                    </div>

                    <div className="pos-summary-divider" />
                    <div className="pos-summary-row">
                        <span>Productos</span><span>{lineas.length} líneas</span>
                    </div>
                    {totalDescuentosLineas > 0 && (
                        <div className="pos-summary-row" style={{ color: 'var(--accent-success)' }}>
                            <span>Descuentos en líneas</span>
                            <span style={{ fontVariantNumeric: 'tabular-nums' }}>- C$ {totalDescuentosLineas.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="pos-summary-divider" />
                    <div className="pos-summary-row pos-summary-total">
                        <span>TOTAL FACTURA</span><span>C$ {total.toFixed(2)}</span>
                    </div>
                    {totalCostosAdicionales > 0 && (
                        <div className="pos-summary-row" style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', marginTop: '0.35rem', background: 'var(--accent-primary-bg)', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                            <span>Costo Total Adquisición:</span>
                            <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>C$ {costoTotalAdquisicion.toFixed(2)}</span>
                        </div>
                    )}
                </div>
                <div className="pos-summary-actions">
                    <button
                        className="btn btn-primary pos-btn-charge"
                        disabled={lineas.length === 0 || isSaving}
                        onClick={handleGuardarCompra}
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        {isSaving ? <IconLoader /> : <IconSave />}
                        <span>{isSaving ? 'Guardando...' : `Registrar Compra C$ ${total.toFixed(2)}`}</span>
                    </button>
                    <button
                        className="btn"
                        style={{ backgroundColor: 'var(--accent-danger-bg)', color: 'var(--accent-danger)', marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem' }}
                        onClick={() => setLineas([])}
                    >
                        <IconTrash /> Limpiar
                    </button>
                </div>
            </div>
        </div>
    );
};
