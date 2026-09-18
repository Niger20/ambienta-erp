import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';

export function useDashboardData() {
    const [stats, setStats] = useState({
        totalSales: 0,
        activeProducts: 0,
        lowStockProducts: 0,
        totalExpenses: 0,
        pendingExpenses: 0,
        totalInventoryCost: 0,
        totalInventorySale: 0,
    });

    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [lowStockItems, setLowStockItems] = useState<any[]>([]);
    const [inventoryByCategory, setInventoryByCategory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [salesRes, productsRes, expensesRes] = await Promise.all([
                api.get('/ventas?limit=0'),
                api.get('/productos?limit=0'),
                api.get('/pagos?limit=0'),
            ]);

            const sales = getArrayData(salesRes.data, 'ventas');
            const products = getArrayData(productsRes.data, 'productos');
            const expenses = getArrayData(expensesRes.data, 'pagos');

            const totalSales = sales.reduce((sum: number, sale: any) => sum + Number(sale.total), 0);
            const activeProducts = products.filter((p: any) => p.estado === true).length;
            const lowStockItemsData = products.filter((p: any) => p.stockactual <= (p.stockminimo || 5));
            const lowStockProducts = lowStockItemsData.length;

            let totalInventoryCost = 0;
            let totalInventorySale = 0;
            const categoryMap: Record<string, { name: string; stock: number; costValue: number; saleValue: number }> = {};

            products.forEach((p: any) => {
                const stock = Number(p.stockactual || 0);
                const cost = Number(p.preciocompra || 0);
                const sale = Number(p.precioventa || 0);
                totalInventoryCost += cost * stock;
                totalInventorySale += sale * stock;
                const catName = p.categorianombre || 'Sin Categoría';
                if (!categoryMap[catName]) {
                    categoryMap[catName] = { name: catName, stock: 0, costValue: 0, saleValue: 0 };
                }
                categoryMap[catName].stock += stock;
                categoryMap[catName].costValue += cost * stock;
                categoryMap[catName].saleValue += sale * stock;
            });

            const categoryValuations = Object.values(categoryMap).sort((a, b) => b.costValue - a.costValue);
            const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + Number(exp.monto), 0);
            const pendingExpenses = expenses
                .filter((exp: any) => !exp.estado)
                .reduce((sum: number, exp: any) => sum + Number(exp.monto), 0);

            const sortedSales = [...sales].sort(
                (a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            );

            setStats({ totalSales, activeProducts, lowStockProducts, totalExpenses, pendingExpenses, totalInventoryCost, totalInventorySale });
            setInventoryByCategory(categoryValuations);
            setRecentTransactions(sortedSales.slice(0, 5));
            setLowStockItems(lowStockItemsData.slice(0, 6));
        } catch (error) {
            console.error('Dashboard fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return { stats, recentTransactions, lowStockItems, inventoryByCategory, isLoading };
}
