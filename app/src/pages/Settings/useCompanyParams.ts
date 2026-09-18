import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';

export function useCompanyParams() {
    const [tasaCambio, setTasaCambio] = useState<string>('36.50');
    const [empresaId, setEmpresaId] = useState<number | null>(null);
    const [savingParams, setSavingParams] = useState(false);

    useEffect(() => {
        api.get('/empresa')
            .then(res => {
                const list = getArrayData(res.data);
                if (list.length > 0) {
                    const emp = list[0];
                    setEmpresaId(emp.id ?? emp.empresaid);
                    setTasaCambio(String(emp.tasacambio || '36.50'));
                }
            })
            .catch(err => console.error("Error loading empresa details:", err));
    }, []);

    const handleSaveParams = async (e: React.FormEvent) => {
        e.preventDefault();
        const numTasa = Number(tasaCambio);

        if (isNaN(numTasa) || numTasa <= 0) {
            Swal.fire('Error', 'La tasa de cambio debe ser un número positivo.', 'error');
            return;
        }

        setSavingParams(true);
        try {
            if (empresaId) {
                await api.put(`/empresa/${empresaId}`, {
                    tasacambio: numTasa
                });
            } else {
                const res = await api.post('/empresa', {
                    tasacambio: numTasa,
                    nombreempresa: 'AmbientaPOS'
                });
                const createdId = res.data.id ?? res.data.empresaid;
                if (createdId) setEmpresaId(createdId);
            }

            Swal.fire({
                icon: 'success',
                title: 'Parámetros guardados con éxito',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudieron guardar los parámetros.', 'error');
        } finally {
            setSavingParams(false);
        }
    };

    return { tasaCambio, setTasaCambio, savingParams, handleSaveParams };
}
