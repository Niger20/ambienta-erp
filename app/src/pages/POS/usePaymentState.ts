import { useState, useEffect } from 'react';
import type { PagoMixtoItem, SavedPOSState } from './types';

export function usePaymentState(savedPOS: SavedPOSState | null) {
    const [metodoPago, setMetodoPago] = useState(savedPOS?.metodoPago || 'efectivo');
    const [tipoFactura, setTipoFactura] = useState<'FISCAL' | 'NO_FISCAL' | null>(savedPOS?.tipoFactura !== undefined ? savedPOS.tipoFactura : null);
    const [numeroTransferencia, setNumeroTransferencia] = useState(savedPOS?.numeroTransferencia || '');

    const [divisaPago, setDivisaPago] = useState<'NIO' | 'USD'>(savedPOS?.divisaPago || 'NIO');
    const [montoRecibidoUSD, setMontoRecibidoUSD] = useState<string>('');
    const [montoRecibidoNIO, setMontoRecibidoNIO] = useState<string>('');
    const [showCambioInfo, setShowCambioInfo] = useState(false);

    const [fechaVencimientoCredito, setFechaVencimientoCredito] = useState<string>(() => {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        return d.toISOString().split('T')[0];
    });

    const [descuentoFactura, setDescuentoFactura] = useState<string>(savedPOS?.descuentoFactura || '');
    const [tipoDescuentoFactura, setTipoDescuentoFactura] = useState<'FIXED' | 'PERCENT'>(savedPOS?.tipoDescuentoFactura || 'FIXED');

    const [pagosMixtos, setPagosMixtos] = useState<PagoMixtoItem[]>(savedPOS?.pagosMixtos || [
        { id: '1', metodo: 'EFECTIVO', monto: '', referencia: '' },
        { id: '2', metodo: 'BAC', monto: '', referencia: '' }
    ]);

    // Reset dollar payment state when method changes
    useEffect(() => {
        if (metodoPago !== 'efectivo') {
            setDivisaPago('NIO');
            setMontoRecibidoUSD('');
            setMontoRecibidoNIO('');
            setShowCambioInfo(false);
        }
    }, [metodoPago]);

    const handleAddPagoMixto = () => {
        setPagosMixtos(prev => [
            ...prev,
            { id: Date.now().toString(), metodo: 'EFECTIVO', monto: '', referencia: '' }
        ]);
    };

    const handleRemovePagoMixto = (id: string) => {
        if (pagosMixtos.length <= 1) return;
        setPagosMixtos(prev => prev.filter(p => p.id !== id));
    };

    const handleUpdatePagoMixto = (id: string, field: keyof PagoMixtoItem, value: any) => {
        setPagosMixtos(prev => prev.map(p => {
            if (p.id === id) {
                return { ...p, [field]: value };
            }
            return p;
        }));
    };

    const resetPaymentState = () => {
        setDivisaPago('NIO');
        setMontoRecibidoUSD('');
        setMontoRecibidoNIO('');
        setShowCambioInfo(false);
        setDescuentoFactura('');
        setTipoDescuentoFactura('FIXED');
        setPagosMixtos([
            { id: '1', metodo: 'EFECTIVO', monto: '', referencia: '' },
            { id: '2', metodo: 'BAC', monto: '', referencia: '' }
        ]);
        setMetodoPago('efectivo');
        setTipoFactura(null);
        setNumeroTransferencia('');
        const d = new Date();
        d.setDate(d.getDate() + 30);
        setFechaVencimientoCredito(d.toISOString().split('T')[0]);
    };

    return {
        metodoPago, setMetodoPago, tipoFactura, setTipoFactura, numeroTransferencia, setNumeroTransferencia,
        divisaPago, setDivisaPago, montoRecibidoUSD, setMontoRecibidoUSD, montoRecibidoNIO, setMontoRecibidoNIO,
        showCambioInfo, setShowCambioInfo,
        fechaVencimientoCredito, setFechaVencimientoCredito,
        descuentoFactura, setDescuentoFactura, tipoDescuentoFactura, setTipoDescuentoFactura,
        pagosMixtos, setPagosMixtos, handleAddPagoMixto, handleRemovePagoMixto, handleUpdatePagoMixto,
        resetPaymentState,
    };
}
