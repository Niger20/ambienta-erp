import { useState } from 'react';
import { useAuthorizedAction, AuthorizationModal } from '../../components/auth';
import { IconCart, IconCreditCard, IconGlobal, IconHistory, IconSupplier } from './icons';
import { IconFile } from './icons';
import { usePurchasesData } from './usePurchasesData';
import { useComprasHistorial } from './useComprasHistorial';
import { useCuentasPorPagar } from './useCuentasPorPagar';
import { useLineasCompra } from './useLineasCompra';
import { useProductQuickCreate } from './useProductQuickCreate';
import { useNuevaCompra } from './useNuevaCompra';
import { useExcelImport } from './useExcelImport';
import { useOrdenesCompra } from './useOrdenesCompra';
import { useEditCompra } from './useEditCompra';
import { useProveedoresCrud } from './useProveedoresCrud';
import { usePropuestas } from './usePropuestas';
import { NuevaCompraTab } from './NuevaCompraTab';
import { OrdenesTab } from './OrdenesTab';
import { HistorialTab } from './HistorialTab';
import { SuppliersTab } from './SuppliersTab';
import { CuentasPorPagarTab } from './CuentasPorPagarTab';
import { PropuestasTab } from './PropuestasTab';
import { ProductQuickCreateModal } from './ProductQuickCreateModal';
import { CategoriaQuickCreateModal } from './CategoriaQuickCreateModal';
import { ProveedorModal } from './ProveedorModal';
import { PagoModal } from './PagoModal';
import { CrearOrdenModal } from './CrearOrdenModal';
import { OrdenDetalleModal } from './OrdenDetalleModal';
import { EditCompraModal } from './EditCompraModal';
import type { ActiveTab } from './types';

const Purchases = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('new');
    const { requestAuth, authModalProps, isAdmin } = useAuthorizedAction();

    const {
        proveedores, setCategorias, productosCatalogo, categorias,
        isLoading, setIsLoading, fetchInitialData,
    } = usePurchasesData();

    const {
        compraStatusFilter, setCompraStatusFilter,
        compraSearchQuery, setCompraSearchQuery, compraPage, setCompraPage,
        fetchCompras, handleVoidCompra, exportCompraDetallePDF,
        filteredCompras, totalCompraPages, paginatedCompras,
    } = useComprasHistorial(activeTab, setIsLoading, requestAuth);

    const {
        cuentaPagarSearchQuery, setCuentaPagarSearchQuery, filteredCuentasPorPagar,
        selectedCuentaPagar, setSelectedCuentaPagar, abonos, loadingAbonos,
        showPagoModal, setShowPagoModal, pagoForm, setPagoForm,
        fetchCuentasPorPagar, openCuentaDetail, handlePagarCuenta, estadoColor, exportFacturaPDF,
    } = useCuentasPorPagar(activeTab, setIsLoading);

    const [lineas, setLineas] = useLineasCompra();

    const {
        showProductModal, setShowProductModal, pendingBarcode, setPendingBarcode,
        productQueue, setProductQueue, productForm, setProductForm,
        showCategoriaModal, setShowCategoriaModal, categoriaForm, setCategoriaForm,
        handleSaveProduct, handleSaveCategoria,
    } = useProductQuickCreate(setLineas, setCategorias);

    const {
        inputValue, setInputValue, isSearching, searchResults, setSearchResults,
        showSearchDropdown, setShowSearchDropdown, searchFocusedIndex,
        selectedProveedor, setSelectedProveedor,
        busquedaProveedor, setBusquedaProveedor,
        showProveedoresDropdown, setShowProveedoresDropdown, supplierFocusedIndex, setSupplierFocusedIndex,
        tipoCompra, setTipoCompra, metodoPago, setMetodoPago, facturaProveedor, setFacturaProveedor,
        cuotas, setCuotas, fechaVencimiento, setFechaVencimiento, isSaving, inputRef,
        costosAdicionales,
        ordenCompraIdActiva, setOrdenCompraIdActiva,
        agregarProductoALineas, handleKeyDown, removeLine, updateLinea,
        handleAddCostoAdicional, handleRemoveCostoAdicional, handleUpdateCostoAdicional,
        totalDescuentosLineas, total, totalCostosAdicionales, costoTotalAdquisicion,
        proveedoresFiltradosDropdown,
        handleGuardarCompra,
    } = useNuevaCompra(lineas, setLineas, proveedores, setShowProductModal, setPendingBarcode, setProductForm);

    const { excelInputRef, downloadTemplate, handleExcelUpload } = useExcelImport(
        setLineas, setProductQueue, setPendingBarcode, setProductForm, setShowProductModal,
    );

    const {
        loadingOrdenes, ordenSearchQuery, setOrdenSearchQuery,
        ordenStatusFilter, setOrdenStatusFilter, selectedOrdenModal, setSelectedOrdenModal,
        showCrearOrdenModal, setShowCrearOrdenModal,
        nuevaOrdenProveedorId, setNuevaOrdenProveedorId,
        nuevaOrdenFechaEsperada, setNuevaOrdenFechaEsperada,
        nuevaOrdenLineas, setNuevaOrdenLineas,
        ordenInputSearch, setOrdenInputSearch,
        ordenSearchResults, setOrdenSearchResults,
        showOrdenSearchDropdown, setShowOrdenSearchDropdown,
        isSavingOrden,
        handleCrearOrdenCompra, handleRecibirOrden, handleCancelarOrden, exportOrdenCompraPDF,
        filteredOrdenesCompra,
    } = useOrdenesCompra(activeTab, setActiveTab, productosCatalogo, proveedores, setLineas, setSelectedProveedor, setOrdenCompraIdActiva);

    const {
        showEditCompraModal, setShowEditCompraModal, editingCompra, editLineas,
        editSelectedProveedor, setEditSelectedProveedor,
        editTipoCompra, setEditTipoCompra, editMetodoPago, setEditMetodoPago,
        editFacturaProveedor, setEditFacturaProveedor,
        editCuotas, setEditCuotas, editFechaVencimiento, setEditFechaVencimiento,
        editCostosAdicionales,
        editInputValue, editSearchResults, editShowSearchDropdown, setEditShowSearchDropdown,
        isSavingEditCompra, isLoadingEditDetails,
        editSubtotalLineas, editDescuentosLineas, editTotalCostosAdicionales, editTotalFactura,
        handleOpenEditModal, handleEditSearchChange, handleAddEditLinea, handleUpdateEditLinea, handleRemoveEditLinea,
        handleAddEditCostoAdicional, handleUpdateEditCostoAdicional, handleRemoveEditCostoAdicional,
        handleSaveEditCompra,
    } = useEditCompra(productosCatalogo, fetchCompras, fetchCuentasPorPagar, fetchInitialData);

    const {
        proveedorStatusFilter, setProveedorStatusFilter,
        proveedorSearchQuery, setProveedorSearchQuery,
        filteredProveedores,
        showProveedorModal, setShowProveedorModal,
        isEditingProveedor, proveedorForm, setProveedorForm,
        openCreateProveedor, openEditProveedor, handleSaveProveedor, deleteProveedor,
    } = useProveedoresCrud(proveedores, requestAuth, fetchInitialData, setSelectedProveedor);

    const { handleGenerarPropuestaGlobal, handleGenerarPropuesta } = usePropuestas();

    const tabBtn = (tab: ActiveTab, label: string, IconComponent: React.ComponentType) => (
        <button
            className={`btn ${activeTab === tab ? 'btn-primary' : ''}`}
            style={{
                backgroundColor: activeTab !== tab ? 'var(--bg-card)' : '',
                color: activeTab !== tab ? 'var(--text-primary)' : '',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: activeTab !== tab ? '1px solid var(--border-color)' : '1px solid var(--accent-primary)',
                transition: 'all 0.2s var(--ease-out)',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)'
            }}
            onClick={() => setActiveTab(tab)}
        >
            <IconComponent />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="page-container" onClick={() => { setShowProveedoresDropdown(false); setProductQueue([]); setShowSearchDropdown(false); setSearchResults([]); }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0, border: 'none', marginBottom: '1rem' }}>
                <div>
                    <h2 className="card-title" style={{ fontSize: '1.5rem' }}>Compras & Proveedores</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Registrar adquisiciones de inventario.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {tabBtn('new', 'Nueva Compra', IconCart)}
                {tabBtn('ordenes', 'Órdenes de Compra', IconFile)}
                {tabBtn('history', 'Historial', IconHistory)}
                {tabBtn('suppliers', 'Proveedores', IconSupplier)}
                {tabBtn('cuentas', 'Cuentas por Pagar', IconCreditCard)}
                {tabBtn('proposals', 'Propuestas de Pedido', IconGlobal)}
            </div>

            {activeTab === 'new' && (
                <NuevaCompraTab
                    ordenCompraIdActiva={ordenCompraIdActiva}
                    setOrdenCompraIdActiva={setOrdenCompraIdActiva}
                    inputRef={inputRef}
                    isSearching={isSearching}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleKeyDown={handleKeyDown}
                    showSearchDropdown={showSearchDropdown}
                    searchResults={searchResults}
                    searchFocusedIndex={searchFocusedIndex}
                    setShowSearchDropdown={setShowSearchDropdown}
                    setSearchResults={setSearchResults}
                    agregarProductoALineas={agregarProductoALineas}
                    downloadTemplate={downloadTemplate}
                    excelInputRef={excelInputRef}
                    handleExcelUpload={handleExcelUpload}
                    lineas={lineas}
                    updateLinea={updateLinea}
                    removeLine={removeLine}
                    selectedProveedor={selectedProveedor}
                    setSelectedProveedor={setSelectedProveedor}
                    busquedaProveedor={busquedaProveedor}
                    setBusquedaProveedor={setBusquedaProveedor}
                    showProveedoresDropdown={showProveedoresDropdown}
                    setShowProveedoresDropdown={setShowProveedoresDropdown}
                    supplierFocusedIndex={supplierFocusedIndex}
                    setSupplierFocusedIndex={setSupplierFocusedIndex}
                    proveedoresFiltradosDropdown={proveedoresFiltradosDropdown}
                    proveedores={proveedores}
                    openCreateProveedor={openCreateProveedor}
                    tipoCompra={tipoCompra}
                    setTipoCompra={setTipoCompra}
                    metodoPago={metodoPago}
                    setMetodoPago={setMetodoPago}
                    cuotas={cuotas}
                    setCuotas={setCuotas}
                    fechaVencimiento={fechaVencimiento}
                    setFechaVencimiento={setFechaVencimiento}
                    facturaProveedor={facturaProveedor}
                    setFacturaProveedor={setFacturaProveedor}
                    costosAdicionales={costosAdicionales}
                    handleAddCostoAdicional={handleAddCostoAdicional}
                    handleUpdateCostoAdicional={handleUpdateCostoAdicional}
                    handleRemoveCostoAdicional={handleRemoveCostoAdicional}
                    totalCostosAdicionales={totalCostosAdicionales}
                    totalDescuentosLineas={totalDescuentosLineas}
                    total={total}
                    costoTotalAdquisicion={costoTotalAdquisicion}
                    isSaving={isSaving}
                    handleGuardarCompra={handleGuardarCompra}
                    setLineas={setLineas}
                />
            )}

            {activeTab === 'ordenes' && (
                <OrdenesTab
                    ordenSearchQuery={ordenSearchQuery}
                    setOrdenSearchQuery={setOrdenSearchQuery}
                    ordenStatusFilter={ordenStatusFilter}
                    setOrdenStatusFilter={setOrdenStatusFilter}
                    onOpenCrearOrden={() => { setShowCrearOrdenModal(true); setNuevaOrdenLineas([]); setNuevaOrdenProveedorId(''); }}
                    loadingOrdenes={loadingOrdenes}
                    filteredOrdenesCompra={filteredOrdenesCompra}
                    proveedores={proveedores}
                    setSelectedOrdenModal={setSelectedOrdenModal}
                    handleRecibirOrden={handleRecibirOrden}
                    exportOrdenCompraPDF={exportOrdenCompraPDF}
                    handleCancelarOrden={handleCancelarOrden}
                />
            )}

            {activeTab === 'history' && (
                <HistorialTab
                    isAdmin={isAdmin}
                    isLoading={isLoading}
                    compraSearchQuery={compraSearchQuery}
                    setCompraSearchQuery={setCompraSearchQuery}
                    compraStatusFilter={compraStatusFilter}
                    setCompraStatusFilter={setCompraStatusFilter}
                    paginatedCompras={paginatedCompras}
                    filteredCompras={filteredCompras}
                    compraPage={compraPage}
                    setCompraPage={setCompraPage}
                    totalCompraPages={totalCompraPages}
                    exportCompraDetallePDF={exportCompraDetallePDF}
                    handleOpenEditModal={handleOpenEditModal}
                    handleVoidCompra={handleVoidCompra}
                />
            )}

            {activeTab === 'suppliers' && (
                <SuppliersTab
                    proveedorSearchQuery={proveedorSearchQuery}
                    setProveedorSearchQuery={setProveedorSearchQuery}
                    proveedorStatusFilter={proveedorStatusFilter}
                    setProveedorStatusFilter={setProveedorStatusFilter}
                    openCreateProveedor={openCreateProveedor}
                    filteredProveedores={filteredProveedores}
                    openEditProveedor={openEditProveedor}
                    deleteProveedor={deleteProveedor}
                />
            )}

            {activeTab === 'cuentas' && (
                <CuentasPorPagarTab
                    cuentaPagarSearchQuery={cuentaPagarSearchQuery}
                    setCuentaPagarSearchQuery={setCuentaPagarSearchQuery}
                    isLoading={isLoading}
                    filteredCuentasPorPagar={filteredCuentasPorPagar}
                    selectedCuentaPagar={selectedCuentaPagar}
                    setSelectedCuentaPagar={setSelectedCuentaPagar}
                    openCuentaDetail={openCuentaDetail}
                    estadoColor={estadoColor}
                    setShowPagoModal={setShowPagoModal}
                    exportFacturaPDF={exportFacturaPDF}
                    loadingAbonos={loadingAbonos}
                    abonos={abonos}
                />
            )}

            {activeTab === 'proposals' && (
                <PropuestasTab
                    handleGenerarPropuestaGlobal={handleGenerarPropuestaGlobal}
                    proveedores={proveedores}
                    handleGenerarPropuesta={handleGenerarPropuesta}
                />
            )}

            <ProductQuickCreateModal
                show={showProductModal}
                pendingBarcode={pendingBarcode}
                productQueue={productQueue}
                productForm={productForm}
                setProductForm={setProductForm}
                categorias={categorias}
                setShowCategoriaModal={setShowCategoriaModal}
                handleSaveProduct={handleSaveProduct}
                onClose={() => { setShowProductModal(false); setProductQueue([]); }}
            />

            <CategoriaQuickCreateModal
                show={showCategoriaModal}
                categoriaForm={categoriaForm}
                setCategoriaForm={setCategoriaForm}
                handleSaveCategoria={handleSaveCategoria}
                onClose={() => setShowCategoriaModal(false)}
            />

            <ProveedorModal
                show={showProveedorModal}
                isEditing={isEditingProveedor}
                proveedorForm={proveedorForm}
                setProveedorForm={setProveedorForm}
                handleSaveProveedor={handleSaveProveedor}
                onClose={() => setShowProveedorModal(false)}
            />

            <PagoModal
                show={showPagoModal}
                selectedCuentaPagar={selectedCuentaPagar}
                pagoForm={pagoForm}
                setPagoForm={setPagoForm}
                handlePagarCuenta={handlePagarCuenta}
                onClose={() => setShowPagoModal(false)}
            />

            <AuthorizationModal {...authModalProps} />

            <CrearOrdenModal
                show={showCrearOrdenModal}
                proveedores={proveedores}
                productosCatalogo={productosCatalogo}
                nuevaOrdenProveedorId={nuevaOrdenProveedorId}
                setNuevaOrdenProveedorId={setNuevaOrdenProveedorId}
                nuevaOrdenFechaEsperada={nuevaOrdenFechaEsperada}
                setNuevaOrdenFechaEsperada={setNuevaOrdenFechaEsperada}
                ordenInputSearch={ordenInputSearch}
                setOrdenInputSearch={setOrdenInputSearch}
                ordenSearchResults={ordenSearchResults}
                setOrdenSearchResults={setOrdenSearchResults}
                showOrdenSearchDropdown={showOrdenSearchDropdown}
                setShowOrdenSearchDropdown={setShowOrdenSearchDropdown}
                nuevaOrdenLineas={nuevaOrdenLineas}
                setNuevaOrdenLineas={setNuevaOrdenLineas}
                isSavingOrden={isSavingOrden}
                handleCrearOrdenCompra={handleCrearOrdenCompra}
                onClose={() => setShowCrearOrdenModal(false)}
            />

            <OrdenDetalleModal
                selectedOrdenModal={selectedOrdenModal}
                setSelectedOrdenModal={setSelectedOrdenModal}
                proveedores={proveedores}
                exportOrdenCompraPDF={exportOrdenCompraPDF}
                handleRecibirOrden={handleRecibirOrden}
            />

            <EditCompraModal
                show={showEditCompraModal}
                editingCompra={editingCompra}
                isLoadingEditDetails={isLoadingEditDetails}
                editLineas={editLineas}
                editInputValue={editInputValue}
                handleEditSearchChange={handleEditSearchChange}
                editShowSearchDropdown={editShowSearchDropdown}
                setEditShowSearchDropdown={setEditShowSearchDropdown}
                editSearchResults={editSearchResults}
                handleAddEditLinea={handleAddEditLinea}
                handleUpdateEditLinea={handleUpdateEditLinea}
                handleRemoveEditLinea={handleRemoveEditLinea}
                proveedores={proveedores}
                editSelectedProveedor={editSelectedProveedor}
                setEditSelectedProveedor={setEditSelectedProveedor}
                editTipoCompra={editTipoCompra}
                setEditTipoCompra={setEditTipoCompra}
                editMetodoPago={editMetodoPago}
                setEditMetodoPago={setEditMetodoPago}
                editCuotas={editCuotas}
                setEditCuotas={setEditCuotas}
                editFechaVencimiento={editFechaVencimiento}
                setEditFechaVencimiento={setEditFechaVencimiento}
                editFacturaProveedor={editFacturaProveedor}
                setEditFacturaProveedor={setEditFacturaProveedor}
                editCostosAdicionales={editCostosAdicionales}
                handleAddEditCostoAdicional={handleAddEditCostoAdicional}
                handleUpdateEditCostoAdicional={handleUpdateEditCostoAdicional}
                handleRemoveEditCostoAdicional={handleRemoveEditCostoAdicional}
                editSubtotalLineas={editSubtotalLineas}
                editDescuentosLineas={editDescuentosLineas}
                editTotalCostosAdicionales={editTotalCostosAdicionales}
                editTotalFactura={editTotalFactura}
                isSavingEditCompra={isSavingEditCompra}
                handleSaveEditCompra={handleSaveEditCompra}
                onClose={() => setShowEditCompraModal(false)}
            />
        </div>
    );
};

export default Purchases;
