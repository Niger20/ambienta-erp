import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import type { Cliente } from './types';

export function useClientes(initialClienteId: number | null) {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [clienteIdSeleccionado, setClienteIdSeleccionado] = useState<number | null>(initialClienteId);
    const [busquedaCliente, setBusquedaCliente] = useState('');
    const [showClientesDropdown, setShowClientesDropdown] = useState(false);
    const [clientFocusedIndex, setClientFocusedIndex] = useState<number>(-1);

    const [showModalCliente, setShowModalCliente] = useState(false);
    const [nuevoCliente, setNuevoCliente] = useState({
        nombre: '',
        telefono: '',
        direccion: '',
        cedula: '',
        autorizarCredito: false,
        limitecredito: ''
    });

    useEffect(() => {
        api.get('/clientes?limit=0').then(res => {
            setClientes(getArrayData(res.data, 'clientes'));
        }).catch(() => { setClientes([]); console.error("Error fetching clients"); });
    }, []);

    const clientesFiltrados = useMemo(() => {
        if (!busquedaCliente) return clientes.slice(0, 10);
        const lower = busquedaCliente.toLowerCase();
        return clientes.filter(c =>
            c.nombre.toLowerCase().includes(lower) ||
            (c.cedula && c.cedula.toLowerCase().includes(lower))
        ).slice(0, 10);
    }, [clientes, busquedaCliente]);

    const clienteSeleccionado = clientes.find(c => c.id === clienteIdSeleccionado);

    const handleCrearCliente = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanTelefono = nuevoCliente.telefono ? nuevoCliente.telefono.replace(/\D/g, '') : '';
        const payload = {
            nombre: nuevoCliente.nombre,
            cedula: nuevoCliente.cedula,
            telefono: cleanTelefono,
            direccion: nuevoCliente.direccion,
            limitecredito: nuevoCliente.autorizarCredito && nuevoCliente.limitecredito ? Number(nuevoCliente.limitecredito) : null
        };
        try {
            const res = await api.post('/clientes', payload);
            const created = res.data;
            setClientes(prev => [created, ...prev]);
            setClienteIdSeleccionado(created.id || created.clienteid);
            setBusquedaCliente('');
            setShowModalCliente(false);
            setNuevoCliente({ nombre: '', telefono: '', direccion: '', cedula: '', autorizarCredito: false, limitecredito: '' });
            Swal.fire({
                icon: 'success',
                title: 'Cliente registrado',
                text: `${created.nombre} fue agregado exitosamente.`,
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar cliente',
                text: err.response?.data?.error || err.response?.data?.message || err.message || 'No se pudo registrar el cliente.'
            });
        }
    };

    return {
        clientes, setClientes, clienteIdSeleccionado, setClienteIdSeleccionado,
        busquedaCliente, setBusquedaCliente, showClientesDropdown, setShowClientesDropdown,
        clientFocusedIndex, setClientFocusedIndex, clientesFiltrados, clienteSeleccionado,
        showModalCliente, setShowModalCliente, nuevoCliente, setNuevoCliente, handleCrearCliente,
    };
}
