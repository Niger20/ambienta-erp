import { useState } from 'react';
import type { LineaCompra } from './types';

/**
 * Solo el estado de las líneas del carrito de "Nueva Compra", separado de
 * useNuevaCompra para romper la dependencia circular con useProductQuickCreate
 * (que necesita setLineas para agregar el producto recién registrado).
 */
export function useLineasCompra() {
    const savedPurchase = (() => { try { return JSON.parse(sessionStorage.getItem('purchase_state') || 'null'); } catch { return null; } })();
    const [lineas, setLineas] = useState<LineaCompra[]>(savedPurchase?.lineas || []);
    return [lineas, setLineas] as const;
}
