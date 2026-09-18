import { IconSearch, IconDownload } from './icons';
import { LABEL_PRESETS } from './useBarcodesTab';
import type { LabelSizeConfig } from './useBarcodesTab';
import type { Category, Product } from './types';

interface BarcodesTabProps {
    includeNameInPdf: boolean;
    setIncludeNameInPdf: (v: boolean) => void;
    includePriceInPdf: boolean;
    setIncludePriceInPdf: (v: boolean) => void;
    generateBulkPDF: () => void;
    selectedBarcodes: Record<number, number>;
    setSelectedBarcodes: (fn: (prev: Record<number, number>) => Record<number, number>) => void;
    barcodeSearch: string;
    setBarcodeSearch: (v: string) => void;
    barcodeCategoryFilter: string;
    setBarcodeCategoryFilter: (v: string) => void;
    categories: Category[];
    products: Product[];
    filteredBarcodeProducts: Product[];
    selectAllVisible: () => void;
    deselectAll: () => void;
    toggleSelectAll: (checked: boolean) => void;
    printSingleLabel: (p: Product) => void;
    labelPresetId: string;
    setLabelPresetId: (id: string) => void;
    customLabelConfig: LabelSizeConfig;
    updateCustomLabelConfig: (field: keyof LabelSizeConfig, value: number) => void;
    activeLabelConfig: LabelSizeConfig;
    labelGridLayout: { startX: number; startY: number; gapX: number; gapY: number } | null;
}

export const BarcodesTab = ({
    includeNameInPdf, setIncludeNameInPdf, includePriceInPdf, setIncludePriceInPdf,
    generateBulkPDF, selectedBarcodes, setSelectedBarcodes,
    barcodeSearch, setBarcodeSearch, barcodeCategoryFilter, setBarcodeCategoryFilter,
    categories, products, filteredBarcodeProducts,
    selectAllVisible, deselectAll, toggleSelectAll, printSingleLabel,
    labelPresetId, setLabelPresetId, customLabelConfig, updateCustomLabelConfig,
    activeLabelConfig, labelGridLayout,
}: BarcodesTabProps) => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Generación & Exportación de Códigos de Barra</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>
                        Selecciona los productos y la cantidad de etiquetas que deseas exportar en hoja Carta o imprimir individualmente.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer', userSelect: 'none' }}>
                        <input type="checkbox" checked={includeNameInPdf} onChange={e => setIncludeNameInPdf(e.target.checked)} />
                        <span>Incluir Nombre</span>
                    </label>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer', userSelect: 'none' }}>
                        <input type="checkbox" checked={includePriceInPdf} onChange={e => setIncludePriceInPdf(e.target.checked)} />
                        <span>Incluir Precio (C$)</span>
                    </label>
                    <button
                        className="btn btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem' }}
                        onClick={generateBulkPDF}
                    >
                        <IconDownload />
                        <span>Generar PDF Carta ({Object.values(selectedBarcodes).reduce((acc: number, it: any) => acc + (Number(it) || 0), 0)} etiquetas)</span>
                    </button>
                </div>
            </div>

            {/* Tamaño de Etiqueta */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.65rem' }}>Tamaño de Etiqueta (Hoja Carta)</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: labelPresetId === 'custom' ? '0.85rem' : 0 }}>
                    {LABEL_PRESETS.map(preset => (
                        <button
                            key={preset.id}
                            type="button"
                            className={`btn ${labelPresetId === preset.id ? 'btn-primary' : ''}`}
                            style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
                            onClick={() => setLabelPresetId(preset.id)}
                        >
                            {preset.nombre}
                        </button>
                    ))}
                </div>

                {labelPresetId === 'custom' && (
                    <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.72rem' }}>Columnas</label>
                            <input type="number" min={1} max={10} className="form-input" style={{ width: '90px' }} value={customLabelConfig.cols} onChange={e => updateCustomLabelConfig('cols', parseInt(e.target.value, 10) || 1)} />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.72rem' }}>Filas</label>
                            <input type="number" min={1} max={20} className="form-input" style={{ width: '90px' }} value={customLabelConfig.rows} onChange={e => updateCustomLabelConfig('rows', parseInt(e.target.value, 10) || 1)} />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.72rem' }}>Ancho Etiqueta (mm)</label>
                            <input type="number" min={20} max={200} step={1} className="form-input" style={{ width: '110px' }} value={customLabelConfig.labelWidth} onChange={e => updateCustomLabelConfig('labelWidth', parseFloat(e.target.value) || 5)} />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.72rem' }}>Alto Etiqueta (mm)</label>
                            <input type="number" min={10} max={280} step={1} className="form-input" style={{ width: '110px' }} value={customLabelConfig.labelHeight} onChange={e => updateCustomLabelConfig('labelHeight', parseFloat(e.target.value) || 5)} />
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: labelGridLayout ? 'var(--text-secondary)' : 'var(--accent-danger)' }}>
                    {labelGridLayout ? (
                        <span>
                            Grilla de {activeLabelConfig.cols} × {activeLabelConfig.rows} = <strong>{activeLabelConfig.cols * activeLabelConfig.rows} etiquetas por hoja</strong> · {activeLabelConfig.labelWidth} × {activeLabelConfig.labelHeight} mm cada una, centradas automáticamente.
                        </span>
                    ) : (
                        <span>⚠ Este tamaño y cantidad de columnas/filas no caben en una hoja carta. Reducí el tamaño de etiqueta o la grilla.</span>
                    )}
                </div>
            </div>

            {/* Search & Actions Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flex: '1 1 300px' }}>
                    <div className="form-input" style={{ display: 'flex', alignItems: 'center', maxWidth: '280px', padding: '0 10px', gap: '8px', height: '36px' }}>
                        <IconSearch />
                        <input
                            type="text"
                            placeholder="Buscar producto o código..."
                            value={barcodeSearch}
                            onChange={e => setBarcodeSearch(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                        />
                    </div>
                    <select
                        className="form-input"
                        value={barcodeCategoryFilter}
                        onChange={e => setBarcodeCategoryFilter(e.target.value)}
                        style={{
                            height: '36px',
                            minWidth: '200px',
                            fontSize: '0.85rem',
                            padding: '0 12px',
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        <option value="" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                            Todas las Categorías ({categories.length})
                        </option>
                        {categories.map(c => (
                            <option
                                key={c.id}
                                value={String(c.id)}
                                style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                            >
                                {c.name || (c as any).nombre || `Categoría #${c.id}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        className="btn"
                        style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
                        onClick={selectAllVisible}
                    >
                        Seleccionar Visibles (1 c/u)
                    </button>
                    <button
                        type="button"
                        className="btn"
                        style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
                        onClick={deselectAll}
                    >
                        Deseleccionar Todos
                    </button>
                </div>
            </div>

            {/* Barcode Products Table */}
            <div className="table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem 0.5rem', width: '40px' }}>
                                <input
                                    type="checkbox"
                                    checked={products.length > 0 && products.every(p => (selectedBarcodes[p.id] || 0) > 0)}
                                    onChange={e => toggleSelectAll(e.target.checked)}
                                />
                            </th>
                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Producto</th>
                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Código de Barras</th>
                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Precio</th>
                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, width: '170px' }}>Cantidad Etiquetas</th>
                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBarcodeProducts.map(p => {
                            const count = selectedBarcodes[p.id] || 0;
                            const isSelected = count > 0;
                            const displayCode = p.codigobarra || String(p.id).padStart(8, '0');
                            return (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: isSelected ? 'var(--accent-primary-bg)' : 'transparent' }}>
                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={e => {
                                                setSelectedBarcodes(prev => ({
                                                    ...prev,
                                                    [p.id]: e.target.checked ? (prev[p.id] || 1) : 0
                                                }));
                                            }}
                                        />
                                    </td>
                                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>
                                        {p.nombre}
                                        {p.categorianombre && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', fontWeight: 400 }}>{p.categorianombre}</span>}
                                    </td>
                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                        <span style={{ fontFamily: 'monospace', fontWeight: 700, backgroundColor: 'var(--bg-secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                            {displayCode}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: 'var(--accent-success)' }}>
                                        C$ {Number(p.precioventa).toFixed(2)}
                                    </td>
                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <button
                                                type="button"
                                                className="btn"
                                                style={{ width: '28px', height: '28px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700 }}
                                                onClick={() => {
                                                    setSelectedBarcodes(prev => ({
                                                        ...prev,
                                                        [p.id]: Math.max(0, (prev[p.id] || 0) - 1)
                                                    }));
                                                }}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="0"
                                                max="999"
                                                value={count}
                                                onChange={e => {
                                                    const val = parseInt(e.target.value, 10);
                                                    const cleanVal = isNaN(val) ? 0 : Math.max(0, val);
                                                    setSelectedBarcodes(prev => ({
                                                        ...prev,
                                                        [p.id]: cleanVal
                                                    }));
                                                }}
                                                className="form-input"
                                                style={{ width: '56px', height: '28px', textAlign: 'center', padding: '2px 4px', fontWeight: 600 }}
                                            />
                                            <button
                                                type="button"
                                                className="btn"
                                                style={{ width: '28px', height: '28px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700 }}
                                                onClick={() => {
                                                    setSelectedBarcodes(prev => ({
                                                        ...prev,
                                                        [p.id]: (prev[p.id] || 0) + 1
                                                    }));
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                                        <button
                                            type="button"
                                            className="btn"
                                            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                                            onClick={() => printSingleLabel(p)}
                                        >
                                            <IconDownload />
                                            <span>Imprimir 1 (Térmica)</span>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
