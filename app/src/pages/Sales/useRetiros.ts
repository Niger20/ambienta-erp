import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import { useAuth } from '../../context/AuthContext';

export function useRetiros(fetchData: () => Promise<void>) {
    const { user, activeSession } = useAuth();
    const [retiros, setRetiros] = useState<any[]>([]);
    const [loadingRetiros, setLoadingRetiros] = useState(false);
    const [showRetiroModal, setShowRetiroModal] = useState(false);
    const [retiroForm, setRetiroForm] = useState({ clienteid: '', monto: '', motivo: 'Retiro de efectivo' });
    const [savingRetiro, setSavingRetiro] = useState(false);
    const [gastoRetirosId, setGastoRetirosId] = useState<number | null>(null);
    const sesionActiva = activeSession ? activeSession.id : null;

    const fetchRetiros = async () => {
        setLoadingRetiros(true);
        try {
            const gastosRes = await api.get('/gastos?limit=0');
            const list = getArrayData(gastosRes.data, 'gastos');
            let gasto = list.find((g: any) => g.nombre === 'Retiros de Efectivo');
            if (!gasto) {
                const createRes = await api.post('/gastos', {
                    nombre: 'Retiros de Efectivo',
                    descripcion: 'Registro de salidas de dinero por retiros personales',
                    usuarioid: user?.id ?? 1
                });
                gasto = createRes.data;
            }
            const gid = gasto.id ?? gasto.gastoid;
            setGastoRetirosId(gid);

            const pagosRes = await api.get(`/pago-gastos/gasto/${gid}`);
            setRetiros(getArrayData(pagosRes.data, 'pagoGastos'));
        } catch (error) {
            console.error("Error fetching retiros:", error);
            setRetiros([]);
        } finally {
            setLoadingRetiros(false);
        }
    };

    const handleRegistrarRetiro = async (e: React.FormEvent) => {
        e.preventDefault();
        const clienteId = Number(retiroForm.clienteid);
        const monto = Number(retiroForm.monto);
        if (!clienteId) { Swal.fire('Error', 'Seleccione un cliente.', 'error'); return; }
        if (!monto || monto <= 0) { Swal.fire('Error', 'Ingrese un monto válido.', 'error'); return; }
        if (!sesionActiva) { Swal.fire('Error', 'Debe haber una sesión de caja activa para realizar retiros.', 'error'); return; }

        setSavingRetiro(true);
        try {
            const ventaRes = await api.post('/ventas', {
                sesionid: sesionActiva,
                total: monto,
                metodopago: 'credito',
                tipoventa: 'CREDITO',
                lugarventa: 'NORMAL',
                clienteid: clienteId,
            });
            const venta = ventaRes.data;
            const ventaId = venta.id ?? venta.ventaid;

            const vDate = new Date();
            vDate.setDate(vDate.getDate() + 30);
            const fechavencimiento = vDate.toISOString().split('T')[0];

            await api.post('/cuentas-por-cobrar', {
                ventaid: ventaId,
                clienteid: clienteId,
                montototal: monto,
                fechavencimiento,
                estado: 'PENDIENTE',
            });

            const pagoRes = await api.post('/pagos', {
                monto: monto,
                metodopago: 'efectivo',
                fecha: new Date().toISOString(),
                estado: true,
            });
            const pago = pagoRes.data;
            const pagoid = pago.id ?? pago.pagoid ?? pago.pago?.pagoid;

            const targetGid = gastoRetirosId || await (async () => {
                const gastosRes = await api.get('/gastos');
                const list = gastosRes.data.gastos || gastosRes.data || [];
                const existing = list.find((g: any) => g.nombre === 'Retiros de Efectivo');
                if (existing) return existing.id ?? existing.gastoid;
                const created = await api.post('/gastos', {
                    nombre: 'Retiros de Efectivo',
                    descripcion: 'Registro de salidas de dinero por retiros personales',
                    usuarioid: user?.id ?? 1
                });
                return created.data.id ?? created.data.gastoid;
            })();

            if (targetGid && pagoid) {
                await api.post('/pago-gastos', {
                    pagoid: Number(pagoid),
                    gastoid: Number(targetGid),
                });
            }

            Swal.fire({ icon: 'success', title: 'Retiro registrado con éxito', timer: 1500, showConfirmButton: false });
            setShowRetiroModal(false);
            setRetiroForm({ clienteid: '', monto: '', motivo: 'Retiro de efectivo' });

            await fetchRetiros();
            await fetchData();
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.error || 'No se pudo registrar el retiro de efectivo.', 'error');
        } finally {
            setSavingRetiro(false);
        }
    };

    return {
        retiros, loadingRetiros, showRetiroModal, setShowRetiroModal,
        retiroForm, setRetiroForm, savingRetiro,
        fetchRetiros, handleRegistrarRetiro,
    };
}
