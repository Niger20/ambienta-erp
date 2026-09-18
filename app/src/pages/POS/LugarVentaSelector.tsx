import { IconPin, IconChevron } from './icons';
import type { Cliente, DeliveryData } from './types';

interface LugarVentaSelectorProps {
    lugarVenta: 'NORMAL' | 'DELIVERY';
    setLugarVenta: (v: 'NORMAL' | 'DELIVERY') => void;
    showLugarVentaDropdown: boolean;
    setShowLugarVentaDropdown: React.Dispatch<React.SetStateAction<boolean>>;
    setShowClientesDropdown: (v: boolean) => void;
    lugarFocusedIndex: number;
    setLugarFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
    setShowDeliveryModal: (v: boolean) => void;
    setDeliveryData: (fn: (prev: DeliveryData) => DeliveryData) => void;
    clientes: Cliente[];
    clienteIdSeleccionado: number | null;
}

export const LugarVentaSelector = ({
    lugarVenta, setLugarVenta, showLugarVentaDropdown, setShowLugarVentaDropdown, setShowClientesDropdown,
    lugarFocusedIndex, setLugarFocusedIndex, setShowDeliveryModal, setDeliveryData, clientes, clienteIdSeleccionado,
}: LugarVentaSelectorProps) => {
    const openDelivery = () => {
        setLugarVenta('DELIVERY');
        setShowDeliveryModal(true);
        const selectedClient = clientes.find(c => c.id === clienteIdSeleccionado);
        setDeliveryData(prev => ({ ...prev, direccionEntrega: selectedClient?.direccion || '' }));
    };

    return (
        <div style={{ width: '200px', position: 'relative' }}>
            <label id="pos-lugar-label" className="sr-only">Lugar de venta</label>
            <div
                className="form-input"
                tabIndex={0}
                role="combobox"
                aria-expanded={showLugarVentaDropdown}
                aria-haspopup="listbox"
                aria-labelledby="pos-lugar-label"
                aria-controls="pos-lugar-listbox"
                style={{ height: '3.5rem', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0 1rem', border: '2px solid var(--border-color)', borderRadius: '12px', userSelect: 'none', gap: '0.5rem' }}
                onClick={(e) => { e.stopPropagation(); setShowLugarVentaDropdown(!showLugarVentaDropdown); setShowClientesDropdown(false); }}
                onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                        if (!showLugarVentaDropdown) {
                            e.preventDefault();
                            setShowLugarVentaDropdown(true);
                            setLugarFocusedIndex(lugarVenta === 'NORMAL' ? 0 : 1);
                        } else {
                            e.preventDefault();
                            if (lugarFocusedIndex === 0) { setLugarVenta('NORMAL'); }
                            else if (lugarFocusedIndex === 1) { openDelivery(); }
                            setShowLugarVentaDropdown(false);
                        }
                        return;
                    }
                    if (showLugarVentaDropdown) {
                        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setLugarFocusedIndex(prev => (prev === 0 ? 1 : 0)); return; }
                        if (e.key === 'Escape') { e.preventDefault(); setShowLugarVentaDropdown(false); setLugarFocusedIndex(-1); return; }
                    }
                }}
            >
                <span style={{ color: 'var(--text-secondary)', display: 'flex' }}><IconPin /></span>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', flex: 1, fontSize: '0.9rem' }}>
                    {lugarVenta === 'NORMAL' ? 'Local' : 'Delivery'}
                </div>
                <span style={{ color: 'var(--text-secondary)', display: 'flex' }}><IconChevron /></span>
            </div>

            {showLugarVentaDropdown && (
                <div
                    id="pos-lugar-listbox" role="listbox" aria-label="Lugar de venta"
                    style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem', backgroundColor: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)', zIndex: 50, overflow: 'hidden' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        role="option" aria-selected={lugarFocusedIndex === 0}
                        style={{ padding: '0.85rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: lugarFocusedIndex === 0 ? 'var(--bg-hover)' : 'transparent' }}
                        onClick={() => { setLugarVenta('NORMAL'); setShowLugarVentaDropdown(false); }}
                        className="nav-link"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        <strong style={{ color: lugarVenta === 'NORMAL' ? 'var(--accent-primary)' : 'inherit', fontWeight: lugarVenta === 'NORMAL' ? 600 : 400 }}>Local (tienda)</strong>
                    </div>
                    <div
                        role="option" aria-selected={lugarFocusedIndex === 1}
                        style={{ padding: '0.85rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: lugarFocusedIndex === 1 ? 'var(--bg-hover)' : 'transparent' }}
                        onClick={() => { openDelivery(); setShowLugarVentaDropdown(false); }}
                        className="nav-link"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                        <strong style={{ color: lugarVenta === 'DELIVERY' ? 'var(--accent-primary)' : 'inherit', fontWeight: lugarVenta === 'DELIVERY' ? 600 : 400 }}>Delivery</strong>
                    </div>
                </div>
            )}
        </div>
    );
};
