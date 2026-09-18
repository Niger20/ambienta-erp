import { IconScan } from './icons';
import type { Producto } from './types';

interface ScannerInputProps {
    inputRef: React.RefObject<HTMLInputElement | null>;
    inputValue: string;
    setInputValue: (v: string) => void;
    isSearching: boolean;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    showSearchDropdown: boolean;
    searchResults: Producto[];
    searchFocusedIndex: number;
    setShowSearchDropdown: (v: boolean) => void;
    setSearchResults: (v: Producto[]) => void;
    agregarProductoAlCarrito: (producto: Producto) => void;
}

export const ScannerInput = ({
    inputRef, inputValue, setInputValue, isSearching, handleKeyDown,
    showSearchDropdown, searchResults, searchFocusedIndex,
    setShowSearchDropdown, setSearchResults, agregarProductoAlCarrito,
}: ScannerInputProps) => {
    return (
        <div className="pos-scanner-wrap">
            <div className="pos-scanner-icon" style={{ color: isSearching ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                <IconScan spinning={isSearching} />
            </div>
            <label htmlFor="pos-scanner-input" className="sr-only">Escanear Producto</label>
            <input
                ref={inputRef}
                id="pos-scanner-input"
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
                aria-controls="pos-search-listbox"
            />
            {/* Search Results Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
                <div
                    id="pos-search-listbox"
                    role="listbox"
                    aria-label="Resultados de búsqueda de productos"
                    style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem',
                        backgroundColor: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--border-color)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', zIndex: 60, maxHeight: '300px', overflowY: 'auto'
                    }}
                >
                    <div style={{ padding: '0.5rem 1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{searchResults.length} resultado{searchResults.length > 1 ? 's' : ''}</span>
                        <button onClick={() => { setShowSearchDropdown(false); setSearchResults([]); inputRef.current?.focus(); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}>✕</button>
                    </div>
                    {searchResults.map((p, idx) => (
                        <div
                            key={p.id}
                            role="option"
                            aria-selected={idx === searchFocusedIndex}
                            style={{
                                padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                transition: 'background-color 0.15s ease-out',
                                backgroundColor: idx === searchFocusedIndex ? 'var(--bg-hover)' : 'transparent',
                            }}
                            className="nav-link"
                            onClick={() => agregarProductoAlCarrito(p)}
                        >
                            <div>
                                <div style={{ fontWeight: 600 }}>{p.nombre}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    {p.codigobarra ? `Cód: ${p.codigobarra}` : `ID: ${p.id}`}
                                    {p.categorianombre && ` · ${p.categorianombre}`}
                                    {p.stockactual != null && ` · Stock: ${p.stockactual}`}
                                </div>
                            </div>
                            <div style={{ fontWeight: 700, color: 'var(--accent-success)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                                C$ {p.precioventa.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
