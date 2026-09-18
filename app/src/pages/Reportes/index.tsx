import { useState, useEffect } from 'react';
import { IconChart, IconDollar, IconBox, IconTrendUp, IconCreditCard, IconLineChart, IconProjection } from './icons';
import type { Tab } from './types';
import { useUtilidadReport } from './useUtilidadReport';
import { useUtilidadProductoReport } from './useUtilidadProductoReport';
import { useCxcReport } from './useCxcReport';
import { useCxpReport } from './useCxpReport';
import { useGastosReport } from './useGastosReport';
import { useGraficosData } from './useGraficosData';
import { useEvolutionTimelines } from './useEvolutionTimelines';
import { useProyeccionRLM } from './useProyeccionRLM';
import { UtilidadTab } from './UtilidadTab';
import { UtilidadProductoTab } from './UtilidadProductoTab';
import { CxcTab } from './CxcTab';
import { CxpTab } from './CxpTab';
import { GastosTab } from './GastosTab';
import { GraficosTab } from './GraficosTab';
import { ProyeccionesTab } from './ProyeccionesTab';

const Reportes = () => {
    const [activeTab, setActiveTab] = useState<Tab>('utilidad');
    const [isLoading, setIsLoading] = useState(false);

    // Filters
    const [fechaInicio, setFechaInicio] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0]);
    const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);

    const { utilidadData, fetchUtilidad } = useUtilidadReport(fechaInicio, fechaFin, setIsLoading);
    const {
        fetchUtilidadProducto,
        utilidadProductoSearch, setUtilidadProductoSearch,
        utilidadSortField, setUtilidadSortField,
        utilidadSortDirection, setUtilidadSortDirection,
        filteredAndSortedUtilidadProducto, utilidadProductoSummary,
    } = useUtilidadProductoReport(fechaInicio, fechaFin, setIsLoading);
    const { cxcData, clientesMap, fetchCxc, cxcSummary } = useCxcReport(fechaInicio, fechaFin, setIsLoading);
    const { cxpData, proveedoresMap, fetchCxp, cxpSummary } = useCxpReport(fechaInicio, fechaFin, setIsLoading);
    const { gastosData, fetchGastos, gastosSummary } = useGastosReport(setIsLoading);
    const { allSales, allProducts, allMovements, fetchGraficosData } = useGraficosData(setIsLoading);
    const { salesTimeline, stockTimeline } = useEvolutionTimelines(allSales, allProducts, allMovements, fechaInicio, fechaFin);
    const { periodoProyeccion, setPeriodoProyeccion, rlmData, proyeccionResult } = useProyeccionRLM(allSales);

    useEffect(() => {
        if (activeTab === 'utilidad') fetchUtilidad();
        if (activeTab === 'utilidadProducto') fetchUtilidadProducto();
        if (activeTab === 'cxc') fetchCxc();
        if (activeTab === 'cxp') fetchCxp();
        if (activeTab === 'gastos') fetchGastos();
        if (activeTab === 'graficos' || activeTab === 'proyecciones') fetchGraficosData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, fechaInicio, fechaFin]);

    return (
        <div className="page-container">
            <div className="card-header" style={{ padding: 0, marginBottom: '1.5rem', border: 'none' }}>
                <h2 className="card-title" style={{ fontSize: '1.5rem' }}>Reportes Detallados</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Visualice y filtre los reportes de rendimiento del sistema.</p>
            </div>

            {/* Rango de Fechas Global */}
            {activeTab !== 'proyecciones' && (
                <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '1rem 1.25rem', flexWrap: 'wrap', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Desde:</span>
                        <input type="date" className="form-input" style={{ padding: '0.45rem 0.75rem', width: 'auto', height: '36px', borderRadius: '8px' }} value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Hasta:</span>
                        <input type="date" className="form-input" style={{ padding: '0.45rem 0.75rem', width: 'auto', height: '36px', borderRadius: '8px' }} value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                    </div>
                    {isLoading && <span style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: 500, animation: 'cdPulse 1.5s infinite' }}>Cargando datos...</span>}
                    {(activeTab === 'cxc' || activeTab === 'cxp') && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', opacity: 0.8 }}>
                            (Filtra por creación; si está vacío en rango, muestra todas las activas)
                        </span>
                    )}
                </div>
            )}

            {/* Menu Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                {[
                    { tab: 'utilidad', label: 'Estado de Resultados', icon: IconChart },
                    { tab: 'utilidadProducto', label: 'Utilidad por Producto', icon: IconTrendUp },
                    { tab: 'graficos', label: 'Gráficos de Evolución', icon: IconLineChart },
                    { tab: 'proyecciones', label: 'Proyecciones (RLM)', icon: IconProjection },
                    { tab: 'cxc', label: 'Cuentas por Cobrar', icon: IconCreditCard },
                    { tab: 'cxp', label: 'Cuentas por Pagar', icon: IconBox },
                    { tab: 'gastos', label: 'Gastos Operativos', icon: IconDollar }
                ].map(item => {
                    const TabIcon = item.icon;
                    const isActive = activeTab === item.tab;
                    return (
                        <button
                            key={item.tab}
                            className={`btn ${isActive ? 'btn-primary' : ''}`}
                            onClick={() => setActiveTab(item.tab as Tab)}
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

            {/* Contenido */}
            {activeTab === 'utilidad' && <UtilidadTab utilidadData={utilidadData} />}
            {activeTab === 'utilidadProducto' && (
                <UtilidadProductoTab
                    utilidadProductoSummary={utilidadProductoSummary}
                    utilidadProductoSearch={utilidadProductoSearch}
                    setUtilidadProductoSearch={setUtilidadProductoSearch}
                    utilidadSortField={utilidadSortField}
                    setUtilidadSortField={setUtilidadSortField}
                    utilidadSortDirection={utilidadSortDirection}
                    setUtilidadSortDirection={setUtilidadSortDirection}
                    filteredAndSortedUtilidadProducto={filteredAndSortedUtilidadProducto}
                />
            )}
            {activeTab === 'graficos' && <GraficosTab salesTimeline={salesTimeline} stockTimeline={stockTimeline} />}
            {activeTab === 'proyecciones' && (
                <ProyeccionesTab
                    periodoProyeccion={periodoProyeccion}
                    setPeriodoProyeccion={setPeriodoProyeccion}
                    rlmData={rlmData}
                    proyeccionResult={proyeccionResult}
                />
            )}
            {activeTab === 'cxc' && <CxcTab cxcData={cxcData} clientesMap={clientesMap} cxcSummary={cxcSummary} />}
            {activeTab === 'cxp' && <CxpTab cxpData={cxpData} proveedoresMap={proveedoresMap} cxpSummary={cxpSummary} />}
            {activeTab === 'gastos' && <GastosTab gastosData={gastosData} gastosSummary={gastosSummary} />}
        </div>
    );
};

export default Reportes;
