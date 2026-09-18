import { Pagination } from '../../components/ui/Pagination';
import { IconSearch, IconEdit, IconTrash } from './icons';
import type { Category, Product } from './types';

interface ProductsTabProps {
    productSearchQuery: string;
    setProductSearchQuery: (v: string) => void;
    productCategoryFilter: string;
    setProductCategoryFilter: (v: string) => void;
    categories: Category[];
    isLoading: boolean;
    error: string;
    productSortBy: string;
    productSortOrder: string;
    handleProductSort: (column: string) => void;
    paginatedProducts: Product[];
    filteredProducts: Product[];
    productPage: number;
    setProductPage: (p: number) => void;
    totalProductPages: number;
    onEditProduct: (product: Product) => void;
    onDeleteProduct: (id: number) => void;
}

export const ProductsTab = ({
    productSearchQuery, setProductSearchQuery,
    productCategoryFilter, setProductCategoryFilter, categories,
    isLoading, error,
    productSortBy, productSortOrder, handleProductSort,
    paginatedProducts, filteredProducts,
    productPage, setProductPage, totalProductPages,
    onEditProduct, onDeleteProduct,
}: ProductsTabProps) => {
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '300px', padding: '0 10px', gap: '8px', height: '36px', border: '2px solid var(--border-color)', borderRadius: '12px' }}>
                        <IconSearch />
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }}
                            value={productSearchQuery}
                            onChange={(e) => setProductSearchQuery(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'nowrap', alignItems: 'center' }}>
                        <select className="form-input" value={productCategoryFilter} onChange={(e) => setProductCategoryFilter(e.target.value)} style={{ minWidth: '180px', height: '36px', padding: '0 30px 0 12px', fontSize: '0.9rem', cursor: 'pointer' }}>
                            <option value="">Todas las Categorías</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name || (c as any).nombre || `Categoría #${c.id}`}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando productos...</div>
            ) : error ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-danger)' }}>{error}</div>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '1rem 0', fontWeight: 500, cursor: 'pointer', userSelect: 'none' }} onClick={() => handleProductSort('nombre')}>
                                Nombre {productSortBy === 'nombre' && (productSortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th style={{ padding: '1rem 0', fontWeight: 500, cursor: 'pointer', userSelect: 'none' }} onClick={() => handleProductSort('categoria')}>
                                Categoría {productSortBy === 'categoria' && (productSortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th style={{ padding: '1rem 0', fontWeight: 500, cursor: 'pointer', userSelect: 'none' }} onClick={() => handleProductSort('precio')}>
                                Precio {productSortBy === 'precio' && (productSortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th style={{ padding: '1rem 0', fontWeight: 500, cursor: 'pointer', userSelect: 'none' }} onClick={() => handleProductSort('stock')}>
                                Stock {productSortBy === 'stock' && (productSortOrder === 'asc' ? '↑' : '↓')}
                            </th>

                            <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProducts.map(product => (
                            <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>{product.nombre}</td>
                                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>
                                    {product.categorianombre || 'N/A'}
                                </td>
                                <td style={{ padding: '0.75rem 0' }} className="tabular">C$ {Number(product.precioventa).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                                <td style={{ padding: '0.75rem 0' }} className="tabular">{product.stockactual || 0}</td>

                                <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button
                                            className="btn"
                                            onClick={() => onEditProduct(product)}
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
                                            onClick={() => onDeleteProduct(product.id)}
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
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No se encontraron productos.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
            <Pagination page={productPage} totalPages={totalProductPages} onPageChange={setProductPage} />
        </div>
    );
};
