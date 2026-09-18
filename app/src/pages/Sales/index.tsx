import { useState } from 'react';
import { useAuthorizedAction, AuthorizationModal } from '../../components/auth';
import { IconReceipt, IconFileText, IconUsers, IconCreditCard, IconBriefcase } from './icons';
import { useSalesData } from './useSalesData';
import { useSalesFilters } from './useSalesFilters';
import { useVentaDetail } from './useVentaDetail';
import { useCotizaciones } from './useCotizaciones';
import { useCuentasPorCobrar } from './useCuentasPorCobrar';
import { useRetiros } from './useRetiros';
import { useCustomerCrud } from './useCustomerCrud';
import { SalesTab } from './SalesTab';
import { CotizacionesTab } from './CotizacionesTab';
import { CustomersTab } from './CustomersTab';
import { CuentasTab } from './CuentasTab';
import { CuentaDetailPanel } from './CuentaDetailPanel';
import { RetirosTab } from './RetirosTab';
import { AbonoModal } from './AbonoModal';
import { GlobalAbonoModal } from './GlobalAbonoModal';
import { RetiroModal } from './RetiroModal';
import { EditCustomerModal } from './EditCustomerModal';
import { FacturarCotizacionModal } from './FacturarCotizacionModal';
import { VentaDetalleModal } from './VentaDetalleModal';

type ActiveTab = 'sales' | 'cotizaciones' | 'customers' | 'cuentas' | 'retiros';

const btnStyle = (active: boolean) => ({
    backgroundColor: active ? '' : 'var(--bg-card)',
    color: active ? '' : 'var(--text-primary)',
});

const Sales = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('sales');
    const { requestAuth, authModalProps } = useAuthorizedAction();

    const {
        sales, customers, isLoading, error,
        saleStatusFilter, setSaleStatusFilter,
        customerStatusFilter, setCustomerStatusFilter,
        ventasAnuladas, fetchData,
    } = useSalesData();

    const {
        saleSearchQuery, setSaleSearchQuery,
        filteredSales, salesPage, setSalesPage, totalSalesPages, paginatedSales,
        customerSearchQuery, setCustomerSearchQuery, filteredCustomers,
    } = useSalesFilters(sales, ventasAnuladas, saleStatusFilter, customers, customerStatusFilter);

    const {
        showVentaDetalleModal, setShowVentaDetalleModal, ventaDetalleData, loadingVentaDetalle,
        handleVoidSale, exportVentaDetallePDF, openVentaDetalleModal,
    } = useVentaDetail(requestAuth, fetchData);

    const {
        cotizacionSearch, setCotizacionSearch, cotizacionesList,
        showFacturarModal, setShowFacturarModal,
        selectedCotizacion, cotizacionProductos, loadingCotizacionDetalle,
        facturarMetodoPago, setFacturarMetodoPago,
        facturarTipoFactura, setFacturarTipoFactura,
        facturarNumeroTransferencia, setFacturarNumeroTransferencia,
        facturarFechaVencimientoCredito, setFacturarFechaVencimientoCredito,
        facturarMontoRecibido, setFacturarMontoRecibido,
        isFacturando,
        openFacturarModal, handleConfirmarFacturacion, handleAnularCotizacion,
    } = useCotizaciones(sales, fetchData);

    const {
        cuentaSearchQuery, setCuentaSearchQuery, filteredCuentas,
        selectedCuenta, setSelectedCuenta, abonos, loadingAbonos,
        showAbonoModal, setShowAbonoModal, abonoForm, setAbonoForm, savingAbono,
        expandedClientId, setExpandedClientId,
        showGlobalAbonoModal, setShowGlobalAbonoModal, globalAbonoForm, setGlobalAbonoForm,
        globalAbonoClientInfo, setGlobalAbonoClientInfo, savingGlobalAbono,
        cuentasSortField, setCuentasSortField, cuentasSortDirection, setCuentasSortDirection,
        cuentasPages, setCuentasPages,
        openCuentaDetail, getClienteForCuenta,
        handleRegistrarAbono, handleLiquidarcCuentaCompleta,
        openGlobalAbonoModal, handleRegistrarAbonoGlobal,
        estadoColor, exportCuentaIndividualPDF, exportClienteCuentasPDF,
        buildWsLink, buildClienteWsLink,
    } = useCuentasPorCobrar(customers, activeTab);

    const {
        retiros, loadingRetiros, showRetiroModal, setShowRetiroModal,
        retiroForm, setRetiroForm, savingRetiro,
        fetchRetiros, handleRegistrarRetiro,
    } = useRetiros(fetchData);

    const {
        showEditCustomerModal, setShowEditCustomerModal,
        customerForm, setCustomerForm, savingCustomer,
        handleEditCustomer, openCreateCustomerModal, handleSaveCustomer, handleDeleteCustomer,
    } = useCustomerCrud(requestAuth, fetchData);

    return (
        <div className="page-container">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0, border: 'none' }}>
                <div>
                    <h2 className="card-title" style={{ fontSize: '1.5rem' }}>Ventas & Clientes</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Historial de ventas, cotizaciones, clientes y cuentas por cobrar.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button className={`btn ${activeTab === 'sales' ? 'btn-primary' : ''}`} style={{ ...btnStyle(activeTab === 'sales'), display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setActiveTab('sales')}>
                    <IconReceipt />
                    <span>Ventas Recientes</span>
                </button>
                <button className={`btn ${activeTab === 'cotizaciones' ? 'btn-primary' : ''}`} style={{ ...btnStyle(activeTab === 'cotizaciones'), display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setActiveTab('cotizaciones')}>
                    <IconFileText />
                    <span>Cotizaciones</span>
                    {cotizacionesList.length > 0 && (
                        <span style={{
                            backgroundColor: activeTab === 'cotizaciones' ? 'rgba(255,255,255,0.25)' : 'rgba(234, 179, 8, 0.2)',
                            color: activeTab === 'cotizaciones' ? '#ffffff' : 'rgb(234, 179, 8)',
                            borderRadius: '10px',
                            padding: '0.1rem 0.45rem',
                            fontSize: '0.72rem',
                            fontWeight: 700
                        }}>
                            {cotizacionesList.length}
                        </span>
                    )}
                </button>
                <button className={`btn ${activeTab === 'customers' ? 'btn-primary' : ''}`} style={{ ...btnStyle(activeTab === 'customers'), display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setActiveTab('customers')}>
                    <IconUsers />
                    <span>Clientes</span>
                </button>
                <button className={`btn ${activeTab === 'cuentas' ? 'btn-primary' : ''}`} style={{ ...btnStyle(activeTab === 'cuentas'), display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setActiveTab('cuentas')}>
                    <IconCreditCard />
                    <span>Cuentas por Cobrar</span>
                </button>
                <button className={`btn ${activeTab === 'retiros' ? 'btn-primary' : ''}`} style={{ ...btnStyle(activeTab === 'retiros'), display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => { setActiveTab('retiros'); fetchRetiros(); }}>
                    <IconBriefcase />
                    <span>Retiros de Efectivo</span>
                </button>
            </div>

            <div className="card">
                {activeTab === 'sales' && (
                    <SalesTab
                        isLoading={isLoading}
                        error={error}
                        saleSearchQuery={saleSearchQuery}
                        setSaleSearchQuery={setSaleSearchQuery}
                        saleStatusFilter={saleStatusFilter}
                        setSaleStatusFilter={setSaleStatusFilter}
                        paginatedSales={paginatedSales}
                        filteredSales={filteredSales}
                        salesPage={salesPage}
                        setSalesPage={setSalesPage}
                        totalSalesPages={totalSalesPages}
                        exportVentaDetallePDF={exportVentaDetallePDF}
                        handleVoidSale={handleVoidSale}
                    />
                )}

                {activeTab === 'cotizaciones' && (
                    <CotizacionesTab
                        cotizacionSearch={cotizacionSearch}
                        setCotizacionSearch={setCotizacionSearch}
                        cotizacionesList={cotizacionesList}
                        openFacturarModal={openFacturarModal}
                        openVentaDetalleModal={openVentaDetalleModal}
                        handleAnularCotizacion={handleAnularCotizacion}
                    />
                )}

                {activeTab === 'customers' && (
                    <CustomersTab
                        isLoading={isLoading}
                        customerSearchQuery={customerSearchQuery}
                        setCustomerSearchQuery={setCustomerSearchQuery}
                        customerStatusFilter={customerStatusFilter}
                        setCustomerStatusFilter={setCustomerStatusFilter}
                        filteredCustomers={filteredCustomers}
                        openCreateCustomerModal={openCreateCustomerModal}
                        handleEditCustomer={handleEditCustomer}
                        handleDeleteCustomer={handleDeleteCustomer}
                    />
                )}

                {activeTab === 'cuentas' && (
                    <>
                        <CuentasTab
                            cuentaSearchQuery={cuentaSearchQuery}
                            setCuentaSearchQuery={setCuentaSearchQuery}
                            cuentasSortField={cuentasSortField}
                            setCuentasSortField={setCuentasSortField}
                            cuentasSortDirection={cuentasSortDirection}
                            setCuentasSortDirection={setCuentasSortDirection}
                            filteredCuentas={filteredCuentas}
                            getClienteForCuenta={getClienteForCuenta}
                            expandedClientId={expandedClientId}
                            setExpandedClientId={setExpandedClientId}
                            buildClienteWsLink={buildClienteWsLink}
                            openGlobalAbonoModal={openGlobalAbonoModal}
                            exportClienteCuentasPDF={exportClienteCuentasPDF}
                            cuentasPages={cuentasPages}
                            setCuentasPages={setCuentasPages}
                            selectedCuenta={selectedCuenta}
                            openCuentaDetail={openCuentaDetail}
                            estadoColor={estadoColor}
                        />
                        <CuentaDetailPanel
                            selectedCuenta={selectedCuenta}
                            setSelectedCuenta={setSelectedCuenta}
                            getClienteForCuenta={getClienteForCuenta}
                            estadoColor={estadoColor}
                            setShowAbonoModal={setShowAbonoModal}
                            handleLiquidarcCuentaCompleta={handleLiquidarcCuentaCompleta}
                            openVentaDetalleModal={openVentaDetalleModal}
                            exportCuentaIndividualPDF={exportCuentaIndividualPDF}
                            buildWsLink={buildWsLink}
                            loadingAbonos={loadingAbonos}
                            abonos={abonos}
                        />
                    </>
                )}

                {activeTab === 'retiros' && (
                    <RetirosTab
                        loadingRetiros={loadingRetiros}
                        retiros={retiros}
                        sales={sales}
                        setShowRetiroModal={setShowRetiroModal}
                    />
                )}
            </div>

            <AbonoModal
                show={showAbonoModal}
                selectedCuenta={selectedCuenta}
                abonoForm={abonoForm}
                setAbonoForm={setAbonoForm}
                savingAbono={savingAbono}
                handleRegistrarAbono={handleRegistrarAbono}
                onClose={() => setShowAbonoModal(false)}
            />

            <GlobalAbonoModal
                show={showGlobalAbonoModal}
                globalAbonoClientInfo={globalAbonoClientInfo}
                globalAbonoForm={globalAbonoForm}
                setGlobalAbonoForm={setGlobalAbonoForm}
                savingGlobalAbono={savingGlobalAbono}
                handleRegistrarAbonoGlobal={handleRegistrarAbonoGlobal}
                onClose={() => { setShowGlobalAbonoModal(false); setGlobalAbonoClientInfo(null); }}
            />

            <RetiroModal
                show={showRetiroModal}
                customers={customers}
                retiroForm={retiroForm}
                setRetiroForm={setRetiroForm}
                savingRetiro={savingRetiro}
                handleRegistrarRetiro={handleRegistrarRetiro}
                onClose={() => setShowRetiroModal(false)}
            />

            <EditCustomerModal
                show={showEditCustomerModal}
                customerForm={customerForm}
                setCustomerForm={setCustomerForm}
                savingCustomer={savingCustomer}
                handleSaveCustomer={handleSaveCustomer}
                onClose={() => setShowEditCustomerModal(false)}
            />

            <AuthorizationModal {...authModalProps} />

            <FacturarCotizacionModal
                show={showFacturarModal}
                selectedCotizacion={selectedCotizacion}
                isFacturando={isFacturando}
                onClose={() => setShowFacturarModal(false)}
                loadingCotizacionDetalle={loadingCotizacionDetalle}
                cotizacionProductos={cotizacionProductos}
                facturarTipoFactura={facturarTipoFactura}
                setFacturarTipoFactura={setFacturarTipoFactura}
                facturarMetodoPago={facturarMetodoPago}
                setFacturarMetodoPago={setFacturarMetodoPago}
                facturarNumeroTransferencia={facturarNumeroTransferencia}
                setFacturarNumeroTransferencia={setFacturarNumeroTransferencia}
                facturarFechaVencimientoCredito={facturarFechaVencimientoCredito}
                setFacturarFechaVencimientoCredito={setFacturarFechaVencimientoCredito}
                facturarMontoRecibido={facturarMontoRecibido}
                setFacturarMontoRecibido={setFacturarMontoRecibido}
                handleConfirmarFacturacion={handleConfirmarFacturacion}
            />

            <VentaDetalleModal
                show={showVentaDetalleModal}
                onClose={() => setShowVentaDetalleModal(false)}
                loadingVentaDetalle={loadingVentaDetalle}
                ventaDetalleData={ventaDetalleData}
            />
        </div>
    );
};

export default Sales;
