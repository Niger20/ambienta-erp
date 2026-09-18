import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import type { Cliente, Venta } from './types';

export function useSalesData() {
    const [sales, setSales] = useState<Venta[]>([]);
    const [customers, setCustomers] = useState<Cliente[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [saleStatusFilter, setSaleStatusFilter] = useState('active');
    const [customerStatusFilter, setCustomerStatusFilter] = useState('active');
    const [ventasAnuladas, setVentasAnuladas] = useState<Venta[]>([]);

    const fetchData = async () => {
        setIsLoading(true);
        setError('');
        try {
            const customerEndpoint = customerStatusFilter === 'active' ? '/clientes?limit=0' : '/clientes/deactivated?limit=0';
            const [salesRes, customersRes] = await Promise.all([
                api.get('/ventas?limit=0'),
                api.get(customerEndpoint),
            ]);
            setSales(getArrayData(salesRes.data, 'ventas'));
            setCustomers(getArrayData(customersRes.data, 'clientes'));
        } catch (err: any) {
            setError('Error al cargar datos del servidor.');
            setSales([]);
            setCustomers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchVentasAnuladas = async () => {
        try {
            const res = await api.get('/ventas/deactivated?limit=0');
            setVentasAnuladas(getArrayData(res.data, 'ventas'));
        } catch { setVentasAnuladas([]); }
    };

    useEffect(() => { fetchData(); }, [customerStatusFilter]);
    useEffect(() => { if (saleStatusFilter === 'inactive') fetchVentasAnuladas(); }, [saleStatusFilter]);

    return {
        sales, customers, isLoading, error,
        saleStatusFilter, setSaleStatusFilter,
        customerStatusFilter, setCustomerStatusFilter,
        ventasAnuladas,
        fetchData,
    };
}
