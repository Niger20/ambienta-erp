import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import type { Repartidor, Delivery, ActiveTab } from './types';

export function useDeliveriesData(activeTab: ActiveTab) {
    const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [deliveryStatusFilter, setDeliveryStatusFilter] = useState('active');
    const [repartidorStatusFilter, setRepartidorStatusFilter] = useState('active');
    const [deactivatedDeliveries, setDeactivatedDeliveries] = useState<Delivery[]>([]);
    const [deactivatedRepartidores, setDeactivatedRepartidores] = useState<Repartidor[]>([]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [repRes, delRes] = await Promise.all([
                api.get('/repartidores?limit=0'),
                api.get('/deliveries?limit=0'),
            ]);
            setRepartidores(getArrayData(repRes.data, 'repartidores'));
            setDeliveries(getArrayData(delRes.data, 'deliveries'));
        } catch (error) {
            console.error(error);
            setRepartidores([]);
            setDeliveries([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    useEffect(() => {
        if (deliveryStatusFilter === 'inactive') {
            api.get('/deliveries/deactivated?limit=0').then(res => setDeactivatedDeliveries(getArrayData(res.data, 'deliveries'))).catch(() => setDeactivatedDeliveries([]));
        }
    }, [deliveryStatusFilter]);

    useEffect(() => {
        if (repartidorStatusFilter === 'inactive') {
            api.get('/repartidores/deactivated?limit=0').then(res => setDeactivatedRepartidores(getArrayData(res.data, 'repartidores'))).catch(() => setDeactivatedRepartidores([]));
        }
    }, [repartidorStatusFilter]);

    return {
        repartidores,
        deliveries,
        isLoading,
        fetchData,
        deliveryStatusFilter,
        setDeliveryStatusFilter,
        repartidorStatusFilter,
        setRepartidorStatusFilter,
        deactivatedDeliveries,
        deactivatedRepartidores,
    };
}
