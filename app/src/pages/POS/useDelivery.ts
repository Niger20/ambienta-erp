import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import type { Cliente, DeliveryData } from './types';

export function useDelivery(
    initialLugarVenta: 'NORMAL' | 'DELIVERY',
    initialDeliveryData: Partial<DeliveryData> | undefined,
    clientes: Cliente[],
    clienteIdSeleccionado: number | null,
    setError: (msg: string) => void,
    setSuccessMsg: (msg: string) => void,
) {
    const [repartidores, setRepartidores] = useState<any[]>([]);
    const [lugarVenta, setLugarVenta] = useState<'NORMAL' | 'DELIVERY'>(initialLugarVenta);
    const [showLugarVentaDropdown, setShowLugarVentaDropdown] = useState(false);
    const [lugarFocusedIndex, setLugarFocusedIndex] = useState<number>(-1);

    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [deliveryData, setDeliveryData] = useState<DeliveryData>({
        repartidorId: initialDeliveryData?.repartidorId || '',
        direccionEntrega: initialDeliveryData?.direccionEntrega || '',
        costoEnvio: initialDeliveryData?.costoEnvio !== undefined ? String(initialDeliveryData.costoEnvio) : '',
        montoPagaCliente: initialDeliveryData?.montoPagaCliente || ''
    });

    const [showModalRepartidor, setShowModalRepartidor] = useState(false);
    const [nuevoRepartidor, setNuevoRepartidor] = useState({ nombre: '', telefono: '' });

    useEffect(() => {
        api.get('/repartidores?limit=0').then(res => {
            setRepartidores(getArrayData(res.data, 'repartidores'));
        }).catch(() => { setRepartidores([]); console.error("Error fetching repartidores"); });
    }, []);

    const openDeliveryFlow = () => {
        setLugarVenta('DELIVERY');
        setShowDeliveryModal(true);
        const selectedClient = clientes.find(c => c.id === clienteIdSeleccionado);
        setDeliveryData(prev => ({ ...prev, direccionEntrega: selectedClient?.direccion || '' }));
    };

    const handleCrearRepartidor = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/repartidores', nuevoRepartidor);
            const created = res.data;
            setRepartidores(prev => [created, ...prev]);
            const createdId = created.id || created.repartidorid;
            setDeliveryData(prev => ({ ...prev, repartidorId: String(createdId) }));
            setShowModalRepartidor(false);
            setNuevoRepartidor({ nombre: '', telefono: '' });
            setSuccessMsg("Repartidor creado exitosamente");
        } catch (err: any) {
            setError(err.response?.data?.error || "Error al crear repartidor");
        }
    };

    const resetDelivery = () => {
        setDeliveryData({ repartidorId: '', direccionEntrega: '', costoEnvio: '', montoPagaCliente: '' });
        setShowDeliveryModal(false);
        setLugarVenta('NORMAL');
    };

    return {
        repartidores, lugarVenta, setLugarVenta,
        showLugarVentaDropdown, setShowLugarVentaDropdown, lugarFocusedIndex, setLugarFocusedIndex,
        showDeliveryModal, setShowDeliveryModal, deliveryData, setDeliveryData, openDeliveryFlow,
        showModalRepartidor, setShowModalRepartidor, nuevoRepartidor, setNuevoRepartidor, handleCrearRepartidor,
        resetDelivery,
    };
}
