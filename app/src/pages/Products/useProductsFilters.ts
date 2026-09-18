import { useState } from 'react';
import { usePagination } from '../../components/ui/Pagination';
import type { Product } from './types';

const PRODUCTS_ITEMS_PER_PAGE = 25;

export function useProductsFilters(products: Product[]) {
    const [productSearchQuery, setProductSearchQuery] = useState('');
    const [productCategoryFilter, setProductCategoryFilter] = useState('');
    const [productSortBy, setProductSortBy] = useState('nombre'); // 'nombre', 'precio', 'stock'
    const [productSortOrder, setProductSortOrder] = useState('asc'); // 'asc', 'desc'

    const handleProductSort = (column: string) => {
        if (productSortBy === column) {
            setProductSortOrder(productSortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setProductSortBy(column);
            setProductSortOrder('asc');
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nombre.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
            (product.codigobarra && product.codigobarra.toLowerCase().includes(productSearchQuery.toLowerCase()));
        const matchesCategory = productCategoryFilter ? String(product.categoriaid) === productCategoryFilter || product.categorianombre === productCategoryFilter : true;

        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        let valA: string | number = a.nombre.toLowerCase();
        let valB: string | number = b.nombre.toLowerCase();

        if (productSortBy === 'precio') {
            valA = Number(a.precioventa);
            valB = Number(b.precioventa);
        } else if (productSortBy === 'stock') {
            valA = Number(a.stockactual);
            valB = Number(b.stockactual);
        } else if (productSortBy === 'categoria') {
            valA = (a.categorianombre || '').toLowerCase();
            valB = (b.categorianombre || '').toLowerCase();
        }

        if (valA < valB) return productSortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return productSortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const { page: productPage, setPage: setProductPage, totalPages: totalProductPages, paginatedItems: paginatedProducts } = usePagination({
        items: filteredProducts,
        itemsPerPage: PRODUCTS_ITEMS_PER_PAGE,
        resetKey: `${productSearchQuery}|${productCategoryFilter}|${productSortBy}|${productSortOrder}`,
    });

    return {
        productSearchQuery, setProductSearchQuery,
        productCategoryFilter, setProductCategoryFilter,
        productSortBy, productSortOrder, handleProductSort,
        filteredProducts, productPage, setProductPage, totalProductPages, paginatedProducts,
    };
}
