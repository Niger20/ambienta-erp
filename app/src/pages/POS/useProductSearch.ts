import { useState, useRef, useCallback, useEffect } from 'react';
import api from '../../api/axios';
import type { Producto } from './types';

const mapProducto = (data: any): Producto => ({
    id: data.id ?? data.productoid,
    nombre: data.nombre,
    codigobarra: data.codigobarra,
    descripcion: data.descripcion,
    precioventa: Number(data.precioventa),
    preciocompra: Number(data.preciocompra),
    stockactual: data.stockactual != null ? Number(data.stockactual) : null,
    categorianombre: data.categorianombre ?? data.categoriasproductos?.nombre ?? null,
});

export function useProductSearch(
    agregarProductoAlCarrito: (producto: Producto) => void,
    showError: (msg: string) => void,
) {
    const [inputValue, setInputValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<Producto[]>([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [searchFocusedIndex, setSearchFocusedIndex] = useState<number>(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const buscarProducto = useCallback(async (codigo: string) => {
        const trimmed = codigo.trim();
        if (!trimmed) return;

        setIsSearching(true);
        setSearchResults([]);
        setShowSearchDropdown(false);
        setSearchFocusedIndex(-1);

        try {
            let res;
            const isNumeric = /^\d+$/.test(trimmed);

            if (isNumeric) {
                // Try barcode first, then ID
                res = await api.get(`/productos/barcode/${trimmed}`).catch(async () => {
                    return api.get(`/productos/${trimmed}`);
                });
            } else {
                // Non-numeric: try barcode first, if fails search by name
                try {
                    res = await api.get(`/productos/barcode/${trimmed}`);
                } catch {
                    // Search by name
                    const searchRes = await api.get(`/productos/search?q=${encodeURIComponent(trimmed)}`);
                    const results: any[] = searchRes.data || [];
                    if (results.length === 0) {
                        showError(`Producto no encontrado: "${trimmed}"`);
                        setIsSearching(false);
                        setInputValue('');
                        inputRef.current?.focus();
                        return;
                    }
                    if (results.length === 1) {
                        res = { data: results[0] };
                    } else {
                        setSearchResults(results.map(mapProducto));
                        setShowSearchDropdown(true);
                        setIsSearching(false);
                        return;
                    }
                }
            }

            agregarProductoAlCarrito(mapProducto(res.data));
        } catch {
            showError(`Producto no encontrado: "${trimmed}"`);
        } finally {
            setIsSearching(false);
            setInputValue('');
            inputRef.current?.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (showSearchDropdown && searchResults.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSearchFocusedIndex(prev => (prev + 1) % searchResults.length);
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSearchFocusedIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
                return;
            }
            if (e.key === 'Enter') {
                if (searchFocusedIndex >= 0 && searchFocusedIndex < searchResults.length) {
                    e.preventDefault();
                    agregarProductoAlCarrito(searchResults[searchFocusedIndex]);
                    return;
                }
            }
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            setShowSearchDropdown(false);
            setSearchResults([]);
            buscarProducto(inputValue);
        }
        if (e.key === 'Escape') {
            setShowSearchDropdown(false);
            setSearchResults([]);
            setSearchFocusedIndex(-1);
        }
    };

    // Debounced live search as user types (only for non-numeric input)
    useEffect(() => {
        setSearchFocusedIndex(-1);
        const trimmed = inputValue.trim();
        const isNumeric = /^\d+$/.test(trimmed);

        if (isNumeric || trimmed.length < 2) {
            setSearchResults([]);
            setShowSearchDropdown(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const res = await api.get(`/productos/search?q=${encodeURIComponent(trimmed)}`);
                const results: any[] = res.data || [];
                if (results.length > 0) {
                    setSearchResults(results.map(mapProducto));
                    setShowSearchDropdown(true);
                } else {
                    setSearchResults([]);
                    setShowSearchDropdown(false);
                }
            } catch {
                setSearchResults([]);
                setShowSearchDropdown(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [inputValue]);

    return {
        inputValue, setInputValue, isSearching, searchResults, setSearchResults,
        showSearchDropdown, setShowSearchDropdown, searchFocusedIndex, setSearchFocusedIndex,
        inputRef, buscarProducto, handleKeyDown,
    };
}
