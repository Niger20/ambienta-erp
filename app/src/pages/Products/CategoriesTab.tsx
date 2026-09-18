import { IconSearch, IconPlus, IconEdit, IconTrash } from './icons';
import type { Category } from './types';

interface CategoriesTabProps {
    categorySearchQuery: string;
    setCategorySearchQuery: (v: string) => void;
    onCreateCategory: () => void;
    isLoading: boolean;
    error: string;
    categorySortBy: string;
    categorySortOrder: string;
    handleCategorySort: (column: string) => void;
    filteredCategories: Category[];
    onEditCategory: (category: Category) => void;
    onDeleteCategory: (id: number) => void;
}

export const CategoriesTab = ({
    categorySearchQuery, setCategorySearchQuery, onCreateCategory,
    isLoading, error,
    categorySortBy, categorySortOrder, handleCategorySort,
    filteredCategories, onEditCategory, onDeleteCategory,
}: CategoriesTabProps) => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '300px', padding: '0 10px', gap: '8px', height: '36px', border: '2px solid var(--border-color)', borderRadius: '12px' }}>
                    <IconSearch />
                    <input
                        type="text"
                        placeholder="Buscar categoría..."
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }}
                        value={categorySearchQuery}
                        onChange={(e) => setCategorySearchQuery(e.target.value)}
                    />
                </div>
                <button
                    className="btn btn-primary"
                    onClick={onCreateCategory}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600
                    }}
                >
                    <IconPlus />
                    <span>Nueva Categoría</span>
                </button>
            </div>
            {isLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando categorías...</div>
            ) : error ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-danger)' }}>{error}</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '1rem 0', fontWeight: 500, cursor: 'pointer', userSelect: 'none' }} onClick={() => handleCategorySort('name')}>
                                Nombre de la Categoría {categorySortBy === 'name' && (categorySortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th style={{ padding: '1rem 0', fontWeight: 500, cursor: 'pointer', userSelect: 'none' }} onClick={() => handleCategorySort('description')}>
                                Descripción {categorySortBy === 'description' && (categorySortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map(category => (
                            <tr key={category.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem 0', fontWeight: 600 }}>{category.name}</td>
                                <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{category.description || '-'}</td>
                                <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button
                                            className="btn"
                                            onClick={() => onEditCategory(category)}
                                            style={{
                                                padding: '0.35rem 0.65rem',
                                                fontSize: '0.78rem',
                                                border: '1px solid var(--border-color)',
                                                backgroundColor: 'var(--bg-secondary)',
                                                color: 'var(--text-primary)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                borderRadius: 'var(--radius-md)',
                                                fontWeight: 500
                                            }}
                                        >
                                            <IconEdit />
                                            <span>Editar</span>
                                        </button>
                                        <button
                                            className="btn"
                                            onClick={() => onDeleteCategory(category.id)}
                                            style={{
                                                padding: '0.35rem 0.65rem',
                                                fontSize: '0.78rem',
                                                backgroundColor: 'var(--accent-danger-bg)',
                                                color: 'var(--accent-danger)',
                                                border: '1px solid var(--accent-danger)',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                borderRadius: 'var(--radius-md)',
                                                fontWeight: 600
                                            }}
                                        >
                                            <IconTrash />
                                            <span>Eliminar</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredCategories.length === 0 && (
                            <tr>
                                <td colSpan={3} style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No se encontraron categorías.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};
