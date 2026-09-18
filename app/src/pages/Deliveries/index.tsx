import { useState } from 'react';
import { useAuthorizedAction, AuthorizationModal } from '../../components/auth';
import { IconBox, IconUser, IconSummary } from './icons';
import { useDeliveriesData } from './useDeliveriesData';
import { useResumenDiario } from './useResumenDiario';
import { useDeliveriesFilters } from './useDeliveriesFilters';
import { useRepartidoresCrud } from './useRepartidoresCrud';
import { useDeliveriesCrud } from './useDeliveriesCrud';
import { DeliveriesTab } from './DeliveriesTab';
import { RepartidoresTab } from './RepartidoresTab';
import { ResumenTab } from './ResumenTab';
import { RepartidorModal } from './RepartidorModal';
import { DeliveryModal } from './DeliveryModal';
import type { ActiveTab } from './types';

const Deliveries = () => {
    const { requestAuth, authModalProps } = useAuthorizedAction();
    const [activeTab, setActiveTab] = useState<ActiveTab>('deliveries');

    const {
        repartidores, deliveries, isLoading, fetchData,
        deliveryStatusFilter, setDeliveryStatusFilter,
        repartidorStatusFilter, setRepartidorStatusFilter,
        deactivatedDeliveries, deactivatedRepartidores,
    } = useDeliveriesData(activeTab);

    const { deliveriesHoy, resumenPorRepartidor } = useResumenDiario(deliveries, repartidores);

    const activeDeliveriesList = deliveryStatusFilter === 'inactive' ? deactivatedDeliveries : deliveries;
    const activeRepartidoresList = repartidorStatusFilter === 'inactive' ? deactivatedRepartidores : repartidores;

    const {
        deliverySearchQuery, setDeliverySearchQuery, filteredDeliveries,
        repartidorSearchQuery, setRepartidorSearchQuery, filteredRepartidores,
        resumenSearchQuery, setResumenSearchQuery, filteredResumen,
    } = useDeliveriesFilters(activeDeliveriesList, activeRepartidoresList, resumenPorRepartidor);

    const {
        showRepartidorModal, setShowRepartidorModal, isEditingRepartidor, repartidorForm, setRepartidorForm,
        openCreateRepartidor, openEditRepartidor, handleSaveRepartidor, handleDeleteRepartidor,
    } = useRepartidoresCrud(fetchData, requestAuth);

    const {
        showDeliveryModal, setShowDeliveryModal, deliveryForm, setDeliveryForm,
        openCreateDelivery, handleSaveDelivery, finalizeDelivery,
    } = useDeliveriesCrud(fetchData);

    return (
        <div className="page-container">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0, border: 'none', marginBottom: '1.5rem' }}>
                <div>
                    <h2 className="card-title" style={{ fontSize: '1.5rem' }}>Módulo de Repartidores & Entregas</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Gestión de personal de entregas, seguimiento de paquetes y resumen diario.</p>
                </div>
            </div>

            {/* Premium Tab Selectors */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                {[
                    { tab: 'deliveries', label: 'Entregas Activas', icon: IconBox },
                    { tab: 'repartidores', label: 'Personal (Repartidores)', icon: IconUser },
                    { tab: 'resumen', label: 'Resumen Diario', icon: IconSummary }
                ].map(item => {
                    const TabIcon = item.icon;
                    const isActive = activeTab === item.tab;
                    return (
                        <button
                            key={item.tab}
                            className={`btn ${isActive ? 'btn-primary' : ''}`}
                            onClick={() => setActiveTab(item.tab as ActiveTab)}
                            style={{
                                padding: '0.6rem 1.2rem',
                                fontSize: '0.85rem',
                                whiteSpace: 'nowrap',
                                backgroundColor: !isActive ? 'var(--bg-card)' : '',
                                color: !isActive ? 'var(--text-primary)' : '',
                                border: !isActive ? '1px solid var(--border-color)' : '1px solid var(--accent-primary)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 600,
                                transition: 'all 0.2s var(--ease-out)'
                            }}
                        >
                            <TabIcon />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
                {isLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando datos...</div>
                ) : (
                    <>
                        {activeTab === 'deliveries' && (
                            <DeliveriesTab
                                deliverySearchQuery={deliverySearchQuery}
                                setDeliverySearchQuery={setDeliverySearchQuery}
                                deliveryStatusFilter={deliveryStatusFilter}
                                setDeliveryStatusFilter={setDeliveryStatusFilter}
                                onCreateDelivery={openCreateDelivery}
                                filteredDeliveries={filteredDeliveries}
                                onFinalizeDelivery={finalizeDelivery}
                            />
                        )}

                        {activeTab === 'repartidores' && (
                            <RepartidoresTab
                                repartidorSearchQuery={repartidorSearchQuery}
                                setRepartidorSearchQuery={setRepartidorSearchQuery}
                                repartidorStatusFilter={repartidorStatusFilter}
                                setRepartidorStatusFilter={setRepartidorStatusFilter}
                                onCreateRepartidor={openCreateRepartidor}
                                filteredRepartidores={filteredRepartidores}
                                deliveriesHoy={deliveriesHoy}
                                onEditRepartidor={openEditRepartidor}
                                onDeleteRepartidor={handleDeleteRepartidor}
                            />
                        )}

                        {activeTab === 'resumen' && (
                            <ResumenTab
                                resumenSearchQuery={resumenSearchQuery}
                                setResumenSearchQuery={setResumenSearchQuery}
                                deliveriesHoy={deliveriesHoy}
                                resumenPorRepartidor={resumenPorRepartidor}
                                filteredResumen={filteredResumen}
                            />
                        )}
                    </>
                )}
            </div>

            <RepartidorModal
                show={showRepartidorModal}
                isEditing={isEditingRepartidor}
                form={repartidorForm}
                onChange={setRepartidorForm}
                onSubmit={handleSaveRepartidor}
                onClose={() => setShowRepartidorModal(false)}
            />

            <DeliveryModal
                show={showDeliveryModal}
                form={deliveryForm}
                onChange={setDeliveryForm}
                onSubmit={handleSaveDelivery}
                onClose={() => setShowDeliveryModal(false)}
                repartidores={repartidores}
            />

            <AuthorizationModal {...authModalProps} />
        </div>
    );
};

export default Deliveries;
