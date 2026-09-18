import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import type { Merma, Product } from './types';

const MERMA_ITEMS_PER_PAGE = 15;

export function useMermas(
    products: Product[],
    userId: number | string | undefined,
    fetchData: () => Promise<void>,
    requestAuth: (accion: string, detalle: string, onSuccess: () => Promise<void>) => Promise<void>,
) {
    const [mermas, setMermas] = useState<Merma[]>([]);
    const [mermasLoading, setMermasLoading] = useState(false);
    const [mermaSearch, setMermaSearch] = useState('');
    const [mermaPage, setMermaPage] = useState(1);
    useEffect(() => { setMermaPage(1); }, [mermaSearch]);

    const [showMermaModal, setShowMermaModal] = useState(false);
    const [mermaForm, setMermaForm] = useState({
        productoid: '',
        cantidad: '',
        costounitario: '',
        motivo: '',
        esConversion: false,
        productodestinoid: '',
        cantidaddestino: '',
    });
    const [mermaProductSearch, setMermaProductSearch] = useState('');
    const [showMermaProductDropdown, setShowMermaProductDropdown] = useState(false);
    const [mermaDestinoSearch, setMermaDestinoSearch] = useState('');
    const [showMermaDestinoDropdown, setShowMermaDestinoDropdown] = useState(false);

    const fetchMermas = async () => {
        setMermasLoading(true);
        try {
            const res = await api.get('/mermas?limit=0');
            setMermas(getArrayData(res.data, 'mermas'));
        } catch { setMermas([]); }
        finally { setMermasLoading(false); }
    };

    const openMermaModal = () => {
        setMermaForm({ productoid: '', cantidad: '', costounitario: '', motivo: '', esConversion: false, productodestinoid: '', cantidaddestino: '' });
        setMermaProductSearch('');
        setMermaDestinoSearch('');
        setShowMermaProductDropdown(false);
        setShowMermaDestinoDropdown(false);
        setShowMermaModal(true);
    };

    const handleCreateMerma = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mermaForm.productoid || !mermaForm.cantidad || mermaForm.costounitario === '' || !mermaForm.motivo.trim()) {
            Swal.fire('Atención', 'Completa el producto, la cantidad, el costo unitario y el motivo.', 'warning');
            return;
        }
        const prod = products.find(p => p.id === Number(mermaForm.productoid));
        if (!prod) return;

        if (mermaForm.esConversion && !mermaForm.productodestinoid) {
            Swal.fire('Atención', 'Selecciona el producto en el que se convierte la merma.', 'warning');
            return;
        }

        const doCreate = async () => {
            try {
                await api.post('/mermas', {
                    productoid: Number(mermaForm.productoid),
                    cantidad: Number(mermaForm.cantidad),
                    costounitario: Number(mermaForm.costounitario),
                    motivo: mermaForm.motivo.trim(),
                    usuarioid: userId,
                    ...(mermaForm.esConversion ? {
                        productodestinoid: Number(mermaForm.productodestinoid),
                        cantidaddestino: Number(mermaForm.cantidaddestino || mermaForm.cantidad),
                    } : {}),
                });
                setShowMermaModal(false);
                fetchMermas();
                fetchData();
                Swal.fire({ icon: 'success', title: 'Merma registrada', timer: 1500, showConfirmButton: false });
            } catch (err: any) {
                const errMsg = err.response?.data?.error;
                Swal.fire('Error', typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg) || 'No se pudo registrar la merma', 'error');
            }
        };
        await requestAuth('REGISTRAR_MERMA', `Registrar merma — ${prod.nombre}`, doCreate);
    };

    const handleDeleteMerma = async (merma: Merma) => {
        const result = await Swal.fire({
            title: '¿Anular esta merma?',
            text: `Se revertirá el stock de "${merma.productonombre}"${merma.productodestinonombre ? ` y de "${merma.productodestinonombre}"` : ''}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, anular',
            cancelButtonText: 'Cancelar',
        });
        if (!result.isConfirmed) return;

        await requestAuth('ANULAR_MERMA', `Anular merma #${merma.id} — ${merma.productonombre}`, async () => {
            try {
                await api.delete(`/mermas/${merma.id}`);
                fetchMermas();
                fetchData();
                Swal.fire({ icon: 'success', title: 'Merma anulada', timer: 1500, showConfirmButton: false });
            } catch (err: any) {
                const errMsg = err.response?.data?.error;
                Swal.fire('Error', typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg) || 'No se pudo anular la merma', 'error');
            }
        });
    };

    const filteredMermas = mermas.filter(m =>
        (m.productonombre || '').toLowerCase().includes(mermaSearch.toLowerCase()) ||
        (m.motivo || '').toLowerCase().includes(mermaSearch.toLowerCase()) ||
        (m.productodestinonombre || '').toLowerCase().includes(mermaSearch.toLowerCase())
    );
    const totalMermaPages = Math.ceil(filteredMermas.length / MERMA_ITEMS_PER_PAGE);
    const paginatedMermas = filteredMermas.slice((mermaPage - 1) * MERMA_ITEMS_PER_PAGE, mermaPage * MERMA_ITEMS_PER_PAGE);

    return {
        mermasLoading, mermaSearch, setMermaSearch, mermaPage, setMermaPage,
        filteredMermas, totalMermaPages, paginatedMermas,
        fetchMermas, openMermaModal, handleCreateMerma, handleDeleteMerma,
        showMermaModal, setShowMermaModal, mermaForm, setMermaForm,
        mermaProductSearch, setMermaProductSearch, showMermaProductDropdown, setShowMermaProductDropdown,
        mermaDestinoSearch, setMermaDestinoSearch, showMermaDestinoDropdown, setShowMermaDestinoDropdown,
    };
}
