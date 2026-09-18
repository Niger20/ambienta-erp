import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IconMonitor, IconTrash, IconAlert, IconCheck } from './icons';
import { getSavedPOSState } from './types';
import { useToast } from './useToast';
import { usePaymentState } from './usePaymentState';
import { useCarrito } from './useCarrito';
import { useProductSearch } from './useProductSearch';
import { useClientes } from './useClientes';
import { useDelivery } from './useDelivery';
import { useTasaCambio } from './useTasaCambio';
import { useTotals } from './useTotals';
import { useCustomerDisplaySync } from './useCustomerDisplaySync';
import { usePOSPersistence } from './usePOSPersistence';
import { useCheckout } from './useCheckout';
import { ScannerInput } from './ScannerInput';
import { ClienteSelector } from './ClienteSelector';
import { LugarVentaSelector } from './LugarVentaSelector';
import { ProductTable } from './ProductTable';
import { SummaryPanel } from './SummaryPanel';
import { ClienteModal } from './ClienteModal';
import { RepartidorModal } from './RepartidorModal';
import { DeliveryModal } from './DeliveryModal';
import { SuccessModal } from './SuccessModal';

const POS = () => {
    // ── Restore from sessionStorage (leído una sola vez) ──
    const savedPOS = getSavedPOSState();

    const { activeSession, refreshSession } = useAuth();
    const sesionActiva = activeSession ? activeSession.id : null;

    const { error, setError, showError, successMsg, setSuccessMsg } = useToast();

    const payment = usePaymentState(savedPOS);
    const { metodoPago, setMetodoPago } = payment;

    const carrito = useCarrito(savedPOS?.lineas || [], showError, setMetodoPago, setSuccessMsg);
    const { lineas, setLineas, agregarProductoAlCarrito } = carrito;

    const search = useProductSearch(agregarProductoAlCarrito, showError);

    const clientesHook = useClientes(savedPOS?.clienteIdSeleccionado || null);
    const {
        clientes, clienteIdSeleccionado, setClienteIdSeleccionado, setBusquedaCliente, clienteSeleccionado,
        showModalCliente, setShowModalCliente, showClientesDropdown, setShowClientesDropdown,
    } = clientesHook;

    const delivery = useDelivery(savedPOS?.lugarVenta || 'NORMAL', savedPOS?.deliveryData, clientes, clienteIdSeleccionado, setError, setSuccessMsg);
    const { deliveryData, showDeliveryModal, setShowDeliveryModal } = delivery;

    const tasaCambio = useTasaCambio();

    const totals = useTotals(
        lineas, payment.descuentoFactura, payment.tipoDescuentoFactura, delivery.lugarVenta, delivery.deliveryData,
        payment.pagosMixtos, payment.montoRecibidoNIO, payment.montoRecibidoUSD, tasaCambio,
    );

    const { openCustomerDisplay } = useCustomerDisplaySync(
        lineas, setLineas, totals.subtotal, totals.descuentoTotal, totals.total, totals.totalItems,
        carrito.lastAdded, metodoPago, payment.divisaPago,
        totals.montoRecibidoNIONum, totals.cambioNIO, totals.montoRecibidoUSDNum, totals.equivalenteEnCordobas, totals.cambioEnCordobas,
    );

    usePOSPersistence(
        lineas, clienteIdSeleccionado, metodoPago, payment.tipoFactura, delivery.lugarVenta, payment.divisaPago,
        payment.numeroTransferencia, payment.descuentoFactura, payment.tipoDescuentoFactura, payment.pagosMixtos, delivery.deliveryData,
    );

    const clearAll = () => {
        setLineas([]);
        setError('');
        setSuccessMsg('');
        payment.resetPaymentState();
        setClienteIdSeleccionado(null);
        setBusquedaCliente('');
        search.setSearchResults([]);
        search.setShowSearchDropdown(false);
        search.setSearchFocusedIndex(-1);
        clientesHook.setClientFocusedIndex(-1);
        delivery.setLugarFocusedIndex(-1);
        delivery.resetDelivery();
        setShowClientesDropdown(false);
        sessionStorage.removeItem('pos_state');
        search.inputRef.current?.focus();
    };

    const checkout = useCheckout({
        lineas,
        sesionActiva,
        metodoPago,
        numeroTransferencia: payment.numeroTransferencia,
        pagosMixtos: payment.pagosMixtos,
        totalAsignadoMixto: totals.totalAsignadoMixto,
        trueTotal: totals.trueTotal,
        total: totals.total,
        subtotal: totals.subtotal,
        descuentoLineas: totals.descuentoLineas,
        montoDescuentoFactura: totals.montoDescuentoFactura,
        tipoDescuentoFactura: payment.tipoDescuentoFactura,
        descuentoFactura: payment.descuentoFactura,
        clienteIdSeleccionado,
        clientes,
        setClientes: clientesHook.setClientes,
        clienteSeleccionado,
        lugarVenta: delivery.lugarVenta,
        deliveryData: delivery.deliveryData,
        deliveryCost: totals.deliveryCost,
        repartidores: delivery.repartidores,
        tipoFactura: payment.tipoFactura,
        fechaVencimientoCredito: payment.fechaVencimientoCredito,
        divisaPago: payment.divisaPago,
        setError,
        refreshSession,
        clearAll,
    });

    // Keyboard shortcuts for POS cashier workflow
    useEffect(() => {
        const handlePOSKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isInput = target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA';
            const hasOpenModal = checkout.showSuccessModal || showDeliveryModal || showModalCliente;

            // F2 to trigger charge payment
            if (e.key === 'F2') {
                if (hasOpenModal) return;
                e.preventDefault();
                const chargeBtn = document.querySelector('.pos-btn-charge') as HTMLButtonElement;
                if (chargeBtn && !chargeBtn.disabled) {
                    chargeBtn.click();
                }
                return;
            }

            // Escape key to reset and focus scanner
            if (e.key === 'Escape') {
                if (checkout.showSuccessModal) {
                    checkout.setShowSuccessModal(false);
                    e.preventDefault();
                } else if (showDeliveryModal) {
                    setShowDeliveryModal(false);
                    delivery.setLugarVenta('NORMAL');
                    e.preventDefault();
                } else if (showModalCliente) {
                    setShowModalCliente(false);
                    e.preventDefault();
                } else if (showClientesDropdown) {
                    setShowClientesDropdown(false);
                    e.preventDefault();
                } else {
                    e.preventDefault();
                    search.setInputValue('');
                    search.inputRef.current?.focus();
                }
                return;
            }

            // Let inputs process normally unless it's a global action
            if (isInput && target.id !== 'pos-scanner-input') return;

            // F4 to open/focus client selector
            if (e.key === 'F4') {
                e.preventDefault();
                setShowClientesDropdown(true);
                setTimeout(() => {
                    document.getElementById('pos-client-input')?.focus();
                }, 50);
                return;
            }
        };

        window.addEventListener('keydown', handlePOSKeyDown);
        return () => window.removeEventListener('keydown', handlePOSKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkout.showSuccessModal, showDeliveryModal, showModalCliente, showClientesDropdown]);

    return (
        <div className="page-container" onClick={() => { setShowClientesDropdown(false); delivery.setShowLugarVentaDropdown(false); }}>

            {/* ── Header row ── */}
            <div className="pos-header-row">
                <div>
                    <h2 className="pos-header-row__title">
                        Punto de venta
                        <span className={`pos-session-badge ${sesionActiva ? 'pos-session-badge--open' : 'pos-session-badge--closed'}`}>
                            <span className="pos-session-dot" />
                            {sesionActiva ? 'Caja abierta' : 'Caja cerrada'}
                        </span>
                    </h2>
                    <p className="pos-header-row__sub">Escanee o ingrese el código de barras / nombre del producto</p>
                </div>
                <div className="pos-header-row__actions">
                    <button className="btn pos-btn-customer" onClick={openCustomerDisplay}>
                        <IconMonitor /> &nbsp;Pantalla cliente
                    </button>
                    <button className="btn" style={{ backgroundColor: 'var(--accent-danger-bg)', color: 'var(--accent-danger)', border: '1px solid var(--accent-danger-border)' }} onClick={clearAll}>
                        <IconTrash /> &nbsp;Limpiar
                    </button>
                </div>
            </div>

            {/* ── Toast messages ── */}
            {error && (
                <div className="pos-toast pos-toast--error" role="alert">
                    <IconAlert />
                    {error}
                </div>
            )}
            {successMsg && (
                <div className="pos-toast pos-toast--success" role="status">
                    <IconCheck />
                    {successMsg}
                </div>
            )}

            {/* ── Keyboard shortcuts ── */}
            <div className="pos-shortcuts-bar">
                <span style={{ fontWeight: 600, fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Atajos</span>
                <span><kbd className="pos-kbd">Esc</kbd> Limpiar buscador</span>
                <span><kbd className="pos-kbd">F2</kbd> Cobrar venta</span>
                <span><kbd className="pos-kbd">F4</kbd> Seleccionar cliente</span>
            </div>

            {/* ── Top bar: scanner + client + place ── */}
            <div className="pos-topbar">
                <ScannerInput
                    inputRef={search.inputRef}
                    inputValue={search.inputValue}
                    setInputValue={search.setInputValue}
                    isSearching={search.isSearching}
                    handleKeyDown={search.handleKeyDown}
                    showSearchDropdown={search.showSearchDropdown}
                    searchResults={search.searchResults}
                    searchFocusedIndex={search.searchFocusedIndex}
                    setShowSearchDropdown={search.setShowSearchDropdown}
                    setSearchResults={search.setSearchResults}
                    agregarProductoAlCarrito={agregarProductoAlCarrito}
                />

                <ClienteSelector
                    clienteSeleccionado={clienteSeleccionado}
                    clienteIdSeleccionado={clienteIdSeleccionado}
                    setClienteIdSeleccionado={setClienteIdSeleccionado}
                    busquedaCliente={clientesHook.busquedaCliente}
                    setBusquedaCliente={setBusquedaCliente}
                    showClientesDropdown={showClientesDropdown}
                    setShowClientesDropdown={setShowClientesDropdown}
                    clientFocusedIndex={clientesHook.clientFocusedIndex}
                    setClientFocusedIndex={clientesHook.setClientFocusedIndex}
                    clientesFiltrados={clientesHook.clientesFiltrados}
                    setShowModalCliente={setShowModalCliente}
                    scannerInputRef={search.inputRef}
                />

                <LugarVentaSelector
                    lugarVenta={delivery.lugarVenta}
                    setLugarVenta={delivery.setLugarVenta}
                    showLugarVentaDropdown={delivery.showLugarVentaDropdown}
                    setShowLugarVentaDropdown={delivery.setShowLugarVentaDropdown}
                    setShowClientesDropdown={setShowClientesDropdown}
                    lugarFocusedIndex={delivery.lugarFocusedIndex}
                    setLugarFocusedIndex={delivery.setLugarFocusedIndex}
                    setShowDeliveryModal={setShowDeliveryModal}
                    setDeliveryData={delivery.setDeliveryData}
                    clientes={clientes}
                    clienteIdSeleccionado={clienteIdSeleccionado}
                />
            </div>

            {/* ── Main layout: table + summary ── */}
            <div className="pos-layout">
                <ProductTable
                    lineas={lineas}
                    totalItems={totals.totalItems}
                    lastAdded={carrito.lastAdded}
                    updateCantidad={carrito.updateCantidad}
                    updateDescuento={carrito.updateDescuento}
                    removeLine={carrito.removeLine}
                />

                <SummaryPanel
                    subtotal={totals.subtotal}
                    descuentoLineas={totals.descuentoLineas}
                    tipoDescuentoFactura={payment.tipoDescuentoFactura}
                    setTipoDescuentoFactura={payment.setTipoDescuentoFactura}
                    descuentoFactura={payment.descuentoFactura}
                    setDescuentoFactura={payment.setDescuentoFactura}
                    montoDescuentoFactura={totals.montoDescuentoFactura}
                    lugarVenta={delivery.lugarVenta}
                    deliveryCost={totals.deliveryCost}
                    setShowDeliveryModal={setShowDeliveryModal}
                    totalItems={totals.totalItems}
                    trueTotal={totals.trueTotal}
                    totalEnUSD={totals.totalEnUSD}
                    tasaCambio={tasaCambio}
                    divisaPago={payment.divisaPago}
                    metodoPago={metodoPago}
                    setMetodoPago={setMetodoPago}
                    setNumeroTransferencia={payment.setNumeroTransferencia}
                    hasProductoAgotado={carrito.hasProductoAgotado}
                    tipoFactura={payment.tipoFactura}
                    setTipoFactura={payment.setTipoFactura}
                    numeroTransferencia={payment.numeroTransferencia}
                    pagosMixtos={payment.pagosMixtos}
                    handleAddPagoMixto={payment.handleAddPagoMixto}
                    handleRemovePagoMixto={payment.handleRemovePagoMixto}
                    handleUpdatePagoMixto={payment.handleUpdatePagoMixto}
                    totalAsignadoMixto={totals.totalAsignadoMixto}
                    restanteMixto={totals.restanteMixto}
                    cambioMixto={totals.cambioMixto}
                    fechaVencimientoCredito={payment.fechaVencimientoCredito}
                    setFechaVencimientoCredito={payment.setFechaVencimientoCredito}
                    clienteIdSeleccionado={clienteIdSeleccionado}
                    setDivisaPago={payment.setDivisaPago}
                    montoRecibidoUSD={payment.montoRecibidoUSD}
                    setMontoRecibidoUSD={payment.setMontoRecibidoUSD}
                    showCambioInfo={payment.showCambioInfo}
                    setShowCambioInfo={payment.setShowCambioInfo}
                    montoRecibidoNIO={payment.montoRecibidoNIO}
                    setMontoRecibidoNIO={payment.setMontoRecibidoNIO}
                    montoRecibidoNIONum={totals.montoRecibidoNIONum}
                    cambioNIO={totals.cambioNIO}
                    montoRecibidoUSDNum={totals.montoRecibidoUSDNum}
                    equivalenteEnCordobas={totals.equivalenteEnCordobas}
                    cambioEnCordobas={totals.cambioEnCordobas}
                    isProcessing={checkout.isProcessing}
                    lineas={lineas}
                    sesionActiva={sesionActiva}
                    handleCobrar={checkout.handleCobrar}
                    openCustomerDisplay={openCustomerDisplay}
                />
            </div>

            <ClienteModal
                show={showModalCliente}
                onClose={() => setShowModalCliente(false)}
                onCancel={() => {
                    setShowModalCliente(false);
                    clientesHook.setNuevoCliente({ nombre: '', telefono: '', direccion: '', cedula: '', autorizarCredito: false, limitecredito: '' });
                }}
                nuevoCliente={clientesHook.nuevoCliente}
                setNuevoCliente={clientesHook.setNuevoCliente}
                onSubmit={clientesHook.handleCrearCliente}
            />

            <RepartidorModal
                show={delivery.showModalRepartidor}
                onClose={() => delivery.setShowModalRepartidor(false)}
                nuevoRepartidor={delivery.nuevoRepartidor}
                setNuevoRepartidor={delivery.setNuevoRepartidor}
                onSubmit={delivery.handleCrearRepartidor}
            />

            <DeliveryModal
                show={showDeliveryModal}
                onClose={() => setShowDeliveryModal(false)}
                onCancel={() => { delivery.setLugarVenta('NORMAL'); setShowDeliveryModal(false); }}
                deliveryData={deliveryData}
                setDeliveryData={delivery.setDeliveryData}
                repartidores={delivery.repartidores}
                onRequestNewRepartidor={() => delivery.setShowModalRepartidor(true)}
                total={totals.total}
            />

            <SuccessModal
                show={checkout.showSuccessModal}
                whatsappMessage={checkout.whatsappMessage}
                whatsappLink={checkout.whatsappLink}
                onClose={() => checkout.setShowSuccessModal(false)}
                onCopy={() => {
                    navigator.clipboard.writeText(checkout.whatsappMessage);
                    checkout.setShowSuccessModal(false);
                    setSuccessMsg("Factura copiada al portapapeles.");
                }}
            />
        </div>
    );
};

export default POS;
