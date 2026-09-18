import { useEffect, useRef, useState } from 'react';

interface UsePaginationOptions<T> {
    items: T[];
    itemsPerPage: number;
    /** Cuando cambia, vuelve a la página 1 (solo en modo no controlado). */
    resetKey?: unknown;
    /** Si se pasa junto con onPageChange, el padre controla la página. */
    page?: number;
    onPageChange?: (page: number) => void;
}

interface UsePaginationResult<T> {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    paginatedItems: T[];
}

/**
 * Paginación en memoria con patrón "Control Props" dual: por defecto maneja
 * su propia página (modo no controlado); si el padre pasa {page, onPageChange}
 * en el PRIMER render, delega el control a él. El modo se congela con useRef
 * y nunca cambia durante la vida del componente.
 */
export function usePagination<T>(options: UsePaginationOptions<T>): UsePaginationResult<T> {
    const { items, itemsPerPage, resetKey, page: controlledPage, onPageChange } = options;

    const isControlled = useRef(controlledPage !== undefined && !!onPageChange).current;
    const [internalPage, setInternalPage] = useState(1);

    const page = isControlled ? (controlledPage as number) : internalPage;

    const setPage = (newPage: number) => {
        if (isControlled) {
            onPageChange!(newPage);
        } else {
            setInternalPage(newPage);
        }
    };

    useEffect(() => {
        if (!isControlled) setInternalPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetKey]);

    const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
    const paginatedItems = isControlled
        ? items
        : items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return { page, setPage, totalPages, paginatedItems };
}
