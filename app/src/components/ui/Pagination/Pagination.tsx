interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

/** 100% presentacional — no maneja estado propio. */
export const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button
                type="button"
                className="btn"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
            >
                Anterior
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Página {page} de {totalPages}
            </span>
            <button
                type="button"
                className="btn"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
            >
                Siguiente
            </button>
        </div>
    );
};
