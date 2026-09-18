import { useState } from 'react';
import { usePagination } from '../../components/ui/Pagination';
import { getSaleClientName } from './types';
import type { Cliente, Venta } from './types';

const SALES_ITEMS_PER_PAGE = 25;

export function useSalesFilters(
    sales: Venta[],
    ventasAnuladas: Venta[],
    saleStatusFilter: string,
    customers: Cliente[],
    customerStatusFilter: string,
) {
    const [saleSearchQuery, setSaleSearchQuery] = useState('');
    const [customerSearchQuery, setCustomerSearchQuery] = useState('');

    const baseFilteredSales: Venta[] = saleStatusFilter === 'inactive' ? ventasAnuladas : sales;
    const filteredSales = baseFilteredSales.filter((sale: Venta) => {
        if (sale.tipoventa === 'COTIZACION') return false; // Cotizaciones are displayed in their own tab
        const normalizedQuery = saleSearchQuery.trim().replace(/^#/, '').toLowerCase();
        const saleIdStr = String(sale.id);
        return saleIdStr.includes(normalizedQuery) ||
            getSaleClientName(sale).toLowerCase().includes(normalizedQuery);
    });

    const { page: salesPage, setPage: setSalesPage, totalPages: totalSalesPages, paginatedItems: paginatedSales } = usePagination({
        items: filteredSales,
        itemsPerPage: SALES_ITEMS_PER_PAGE,
        resetKey: `${saleSearchQuery}|${saleStatusFilter}`,
    });

    const filteredCustomers = customers.filter((c: Cliente) => {
        // En caso de que el backend no filtre bien, hacemos doble check
        const matchesStatus = customerStatusFilter === 'active' ? c.estado !== false : c.estado === false;
        const matchesSearch = c.nombre.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
            (c.cedula && c.cedula.toLowerCase().includes(customerSearchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    return {
        saleSearchQuery, setSaleSearchQuery,
        filteredSales, salesPage, setSalesPage, totalSalesPages, paginatedSales,
        customerSearchQuery, setCustomerSearchQuery,
        filteredCustomers,
    };
}
