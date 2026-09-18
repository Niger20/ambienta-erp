import { useState } from 'react';
import type { Category } from './types';

export function useCategoriesFilters(categories: Category[]) {
    const [categorySearchQuery, setCategorySearchQuery] = useState('');
    const [categorySortBy, setCategorySortBy] = useState('name');
    const [categorySortOrder, setCategorySortOrder] = useState('asc');

    const handleCategorySort = (column: string) => {
        if (categorySortBy === column) {
            setCategorySortOrder(categorySortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setCategorySortBy(column);
            setCategorySortOrder('asc');
        }
    };

    const filteredCategories = categories.filter(category => {
        return category.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
            (category.description && category.description.toLowerCase().includes(categorySearchQuery.toLowerCase()));
    }).sort((a, b) => {
        let valA = categorySortBy === 'description' ? (a.description || '').toLowerCase() : a.name.toLowerCase();
        let valB = categorySortBy === 'description' ? (b.description || '').toLowerCase() : b.name.toLowerCase();
        if (valA < valB) return categorySortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return categorySortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return { categorySearchQuery, setCategorySearchQuery, categorySortBy, categorySortOrder, handleCategorySort, filteredCategories };
}
