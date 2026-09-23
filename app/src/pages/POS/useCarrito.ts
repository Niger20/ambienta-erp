import { useState, useCallback, useEffect, useRef } from 'react';
import type { LineaProducto, Producto } from './types';

export function useCarrito(
    initialLineas: LineaProducto[],
    showError: (msg: string) => void,
    setMetodoPago: (v: string) => void,
    setSuccessMsg: (v: string) => void,
    metodoPago: string,
) {
    const [lineas, setLineas] = useState<LineaProducto[]>(initialLineas);
    const metodoPagoRef = useRef(metodoPago);
    metodoPagoRef.current = metodoPago;

    // En cotizaciones (o productos agotados, que fuerzan cotización) no se limita por stock
    const limiteStock = (producto: Producto): number | null => {
        if (producto.stockactual == null) return null;
        if (metodoPagoRef.current === 'cotizacion' || producto.stockactual <= 0) return null;
        return producto.stockactual;
    };
    const [lastAdded, setLastAdded] = useState<number | null>(null);

    useEffect(() => {
        if (lastAdded !== null) {
            const t = setTimeout(() => setLastAdded(null), 800);
            return () => clearTimeout(t);
        }
    }, [lastAdded]);

    const agregarProductoAlCarrito = useCallback((producto: Producto) => {
        setLineas(prev => {
            const idx = prev.findIndex(l => l.producto.id === producto.id);
            if (idx >= 0) {
                const currentLine = prev[idx];
                if (currentLine.cantidad + 1 > 10000) {
                    showError(`La cantidad máxima permitida es 10000.`);
                    return prev;
                }
                const maxStock = limiteStock(producto);
                if (maxStock != null && currentLine.cantidad + 1 > maxStock) {
                    showError(`Stock insuficiente para "${producto.nombre}". Solo hay ${producto.stockactual} disponibles.`);
                    return prev;
                }
                const updated = [...prev];
                updated[idx] = { ...updated[idx], cantidad: updated[idx].cantidad + 1 };
                return updated;
            }

            if (producto.stockactual != null && producto.stockactual <= 0) {
                setMetodoPago('cotizacion');
                setSuccessMsg(`"${producto.nombre}" está agotado: la venta se convirtió en Cotización.`);
            }

            return [...prev, { producto, cantidad: 1, descuento: 0 }];
        });

        setLastAdded(producto.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateCantidad = (idx: number, cantidad: number | string) => {
        const strValue = String(cantidad);
        if (strValue === '') {
            setLineas(prev => {
                const copy = [...prev];
                copy[idx] = { ...copy[idx], cantidad: '' as any };
                return copy;
            });
            return;
        }

        if (!/^\d*\.?\d*$/.test(strValue)) return;

        const parsed = parseFloat(strValue);
        if (!isNaN(parsed)) {
            if (parsed > 10000) {
                showError(`La cantidad máxima permitida es 10000.`);
                return;
            }
            const maxStock = limiteStock(lineas[idx].producto);
            if (maxStock != null && parsed > maxStock) {
                showError(`Stock máximo alcanzado. Solo hay ${maxStock} disponibles.`);
                return;
            }
        }

        setLineas(prev => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], cantidad: cantidad as any };
            return copy;
        });
    };

    const updateDescuento = (idx: number, descuento: number | string) => {
        const strValue = String(descuento);
        if (strValue === '') {
            setLineas(prev => {
                const copy = [...prev];
                copy[idx] = { ...copy[idx], descuento: 0 };
                return copy;
            });
            return;
        }
        const parsed = parseFloat(strValue);
        if (isNaN(parsed) || parsed < 0) return;
        const linePrice = lineas[idx].producto.precioventa * (Number(lineas[idx].cantidad) || 1);
        const validDiscount = Math.min(parsed, linePrice);
        setLineas(prev => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], descuento: validDiscount };
            return copy;
        });
    };

    const removeLine = (idx: number) => {
        setLineas(prev => prev.filter((_, i) => i !== idx));
    };

    const hasProductoAgotado = lineas.some(l => l.producto.stockactual != null && l.producto.stockactual <= 0);

    return {
        lineas, setLineas, lastAdded,
        agregarProductoAlCarrito, updateCantidad, updateDescuento, removeLine,
        hasProductoAgotado,
    };
}
