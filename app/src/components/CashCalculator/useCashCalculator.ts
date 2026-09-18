import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';

export const BANKNOTES_NIO = [1000, 500, 200, 100, 50, 20, 10];
export const COINS_NIO = [5, 1];
const EMPTY_COUNTS: Record<number, number> = { 1000: 0, 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 1: 0 };

export interface CashCalculatorTotals {
    totalNioFromBills: number;
    totalNioFromCoins: number;
    totalNioFromUsd: number;
    grandTotalNio: number;
    totalItemsCount: number;
}

export interface CashCalculatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Ausente = el modal no muestra el botón "Aplicar al Cierre". */
    onApply?: () => void;
    tasaCambio: number;
    countsNio: Record<number, number>;
    countUsd: number;
    onNioChange: (denom: number, val: number) => void;
    onNioStep: (denom: number, delta: number) => void;
    onCountUsdChange: (val: number) => void;
    onClear: () => void;
    totals: CashCalculatorTotals;
}

interface UseCashCalculatorArgs {
    isOpen: boolean;
    onClose: () => void;
    onApplyTotal?: (totalNio: number) => void;
    /** Si no se pasa, el hook la obtiene sola desde /empresa mientras el modal está abierto (Control Prop: controlada u obtenida internamente). */
    tasaCambio?: number;
}

/** Estado y cálculos del conteo de efectivo por denominación para cierre de caja. */
export function useCashCalculator({ isOpen, onClose, onApplyTotal, tasaCambio: tasaCambioProp }: UseCashCalculatorArgs) {
    const [countsNio, setCountsNio] = useState<Record<number, number>>(EMPTY_COUNTS);
    const [countUsd, setCountUsd] = useState(0);
    const [tasaCambioFetched, setTasaCambioFetched] = useState<number | null>(null);

    const tasaCambio = tasaCambioProp ?? tasaCambioFetched ?? 36.50;

    useEffect(() => {
        if (tasaCambioProp !== undefined || !isOpen) return;
        api.get('/empresa').then(res => {
            const empresas = getArrayData(res.data);
            const tasa = Number(empresas[0]?.tasacambio);
            if (tasa > 0) setTasaCambioFetched(tasa);
        }).catch(() => { /* se queda con el valor por defecto */ });
    }, [isOpen, tasaCambioProp]);

    const handleNioChange = (denom: number, val: number) => {
        const num = Math.max(0, Math.floor(isNaN(val) ? 0 : val));
        setCountsNio(prev => ({ ...prev, [denom]: num }));
    };

    const handleNioStep = (denom: number, delta: number) => {
        setCountsNio(prev => ({ ...prev, [denom]: Math.max(0, (prev[denom] || 0) + delta) }));
    };

    const handleCountUsdChange = (val: number) => {
        setCountUsd(Math.max(0, isNaN(val) ? 0 : val));
    };

    const totalNioFromBills = BANKNOTES_NIO.reduce((sum, d) => sum + (d * (countsNio[d] || 0)), 0);
    const totalNioFromCoins = COINS_NIO.reduce((sum, d) => sum + (d * (countsNio[d] || 0)), 0);
    const totalNioFromUsd = countUsd * tasaCambio;
    const grandTotalNio = totalNioFromBills + totalNioFromCoins + totalNioFromUsd;
    const totalItemsCount = Object.values(countsNio).reduce((a, b) => a + b, 0) + (countUsd > 0 ? 1 : 0);

    const reset = () => {
        setCountsNio(EMPTY_COUNTS);
        setCountUsd(0);
    };

    const handleClear = async () => {
        if (totalItemsCount === 0) return;
        const result = await Swal.fire({
            title: '¿Limpiar el conteo?',
            text: 'Se perderán todas las cantidades ingresadas.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Sí, limpiar',
            cancelButtonText: 'Cancelar',
        });
        if (result.isConfirmed) reset();
    };

    const handleApply = () => {
        onApplyTotal?.(grandTotalNio);
        onClose();
        reset();
    };

    const calculatorModalProps: CashCalculatorModalProps = {
        isOpen,
        onClose,
        onApply: onApplyTotal ? handleApply : undefined,
        tasaCambio,
        countsNio,
        countUsd,
        onNioChange: handleNioChange,
        onNioStep: handleNioStep,
        onCountUsdChange: handleCountUsdChange,
        onClear: handleClear,
        totals: { totalNioFromBills, totalNioFromCoins, totalNioFromUsd, grandTotalNio, totalItemsCount },
    };

    return { calculatorModalProps };
}
