import { useAuth } from '../../context/AuthContext';
import { IconPlus } from './icons';
import { useGastosData } from './useGastosData';
import { useGastoSelection } from './useGastoSelection';
import { useGastoCrud } from './useGastoCrud';
import { usePagoCrud } from './usePagoCrud';
import { useGastoPdfExport } from './useGastoPdfExport';
import { GastosList } from './GastosList';
import { PagosPanel } from './PagosPanel';
import { GastoModal } from './GastoModal';
import { PagoModal } from './PagoModal';

const Expenses = () => {
    const { user } = useAuth();
    const { isLoading, fetchGastos, search, setSearch, filtered } = useGastosData();
    const { selectedGasto, setSelectedGasto, pagos, loadingPagos, fetchPagos, handleSelectGasto, totalPagadoGasto } = useGastoSelection();

    const {
        showGastoModal, setShowGastoModal, editingGasto, gastoForm, setGastoForm,
        openCreateGasto, openEditGasto, handleSaveGasto, handleDeleteGasto,
    } = useGastoCrud(user?.id, fetchGastos, selectedGasto, setSelectedGasto);

    const {
        showPagoModal, setShowPagoModal, editingPago, pagoForm, setPagoForm,
        openPagoModal, openEditPago, handleDeletePago, handleSavePago,
    } = usePagoCrud(selectedGasto, fetchPagos, fetchGastos);

    const { exportPDF } = useGastoPdfExport();

    return (
        <div className="page-container">
            {/* Header */}
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0, border: 'none', marginBottom: '1.5rem' }}>
                <div>
                    <h2 className="card-title" style={{ fontSize: '1.5rem' }}>Gastos Operativos</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Registro de gastos y pagos realizados (renta, servicios, etc.)</p>
                </div>
                <button className="btn btn-primary" onClick={openCreateGasto} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconPlus />
                    <span>Nuevo Gasto</span>
                </button>
            </div>

            {/* Two-panel layout */}
            <div className={`split-layout-sidebar-440 ${!selectedGasto ? 'collapsed' : ''}`}>
                <GastosList
                    search={search}
                    setSearch={setSearch}
                    isLoading={isLoading}
                    filtered={filtered}
                    selectedGasto={selectedGasto}
                    onSelectGasto={handleSelectGasto}
                    onEditGasto={openEditGasto}
                    onDeleteGasto={handleDeleteGasto}
                />

                {selectedGasto && (
                    <PagosPanel
                        selectedGasto={selectedGasto}
                        onClose={() => setSelectedGasto(null)}
                        totalPagadoGasto={totalPagadoGasto}
                        pagos={pagos}
                        loadingPagos={loadingPagos}
                        onOpenPagoModal={openPagoModal}
                        onExportPDF={() => exportPDF(selectedGasto, pagos, totalPagadoGasto)}
                        onEditPago={openEditPago}
                        onDeletePago={handleDeletePago}
                    />
                )}
            </div>

            <GastoModal
                show={showGastoModal}
                isEditing={!!editingGasto}
                form={gastoForm}
                onChange={setGastoForm}
                onSubmit={handleSaveGasto}
                onClose={() => setShowGastoModal(false)}
            />

            <PagoModal
                show={showPagoModal}
                isEditing={!!editingPago}
                form={pagoForm}
                onChange={setPagoForm}
                onSubmit={handleSavePago}
                onClose={() => setShowPagoModal(false)}
                selectedGasto={selectedGasto}
            />
        </div>
    );
};

export default Expenses;
