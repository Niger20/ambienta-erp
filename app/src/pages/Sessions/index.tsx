import { useState } from 'react';
import { CashCalculatorModal, useCashCalculator } from '../../components/CashCalculator';
import { Pagination } from '../../components/ui/Pagination';
import { IconSearch, IconCalculator, IconFileText, IconTable } from './icons';
import { useSessionsData } from './useSessionsData';
import { useSessionsFilters } from './useSessionsFilters';
import { useSessionReports } from './useSessionReports';

const Sessions = () => {
    const { sessions, isLoading } = useSessionsData();
    const {
        searchQuery, setSearchQuery,
        filteredSessions,
        sessionPage, setSessionPage,
        totalSessionPages,
        paginatedSessions,
    } = useSessionsFilters(sessions);
    const { downloadingId, downloadingExcelId, handleDownloadSessionPDF, handleDownloadSessionExcel } = useSessionReports();
    const [isCalcOpen, setIsCalcOpen] = useState(false);
    const { calculatorModalProps } = useCashCalculator({
        isOpen: isCalcOpen,
        onClose: () => setIsCalcOpen(false),
    });

    return (
        <div className="page-container">
            <div className="card-header sessions-header">
                <h2 className="card-title sessions-title">Sesiones Registradas</h2>
                <p className="sessions-subtitle">Historial y cuadre de cajas por sesión de venta.</p>
            </div>

            <div className="card sessions-card">
                <div className="sessions-toolbar">
                    <h3 className="card-title sessions-toolbar-title">Listado de Sesiones</h3>
                    <div className="sessions-toolbar-actions">
                        <button
                            type="button"
                            className="btn sessions-calc-btn"
                            onClick={() => setIsCalcOpen(true)}
                        >
                            <IconCalculator size={16} />
                            <span>Calculadora de Cierre</span>
                        </button>
                        <div className="form-input sessions-search-box">
                            <IconSearch />
                            <input type="text" placeholder="Buscar por ID o usuario..." className="sessions-search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                    </div>
                </div>

                <CashCalculatorModal {...calculatorModalProps} />

                <div className="sessions-table-wrap">
                    <table className="sessions-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Estado</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                                <th className="sessions-th-right">Monto Inicial</th>
                                <th className="sessions-th-right">Final Sistema</th>
                                <th className="sessions-th-right">Final Físico</th>
                                <th className="sessions-th-right">Diferencia</th>
                                <th className="sessions-th-center">Reporte</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={10} className="sessions-empty">Cargando sesiones...</td>
                                </tr>
                            ) : filteredSessions.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="sessions-empty">No se encontraron sesiones.</td>
                                </tr>
                            ) : (
                                paginatedSessions.map(session => {
                                    const mSistema = Number(session.montofinalsistema) || 0;
                                    const mFisico = Number(session.montofinalfisico) || 0;
                                    const diferencia = mFisico - mSistema;
                                    const isClosed = !!session.fechafin;
                                    const diffClass = isClosed
                                        ? (diferencia >= 0 ? 'sessions-diff-positive' : 'sessions-diff-negative')
                                        : 'sessions-diff-neutral';

                                    return (
                                        <tr key={session.id}>
                                            <td className="tabular sessions-td-muted">#{session.id}</td>
                                            <td className="sessions-td-strong">{session.nombreusuario}</td>
                                            <td>
                                                {isClosed ? (
                                                    <span className="pos-session-badge pos-session-badge--closed">
                                                        Cerrada
                                                    </span>
                                                ) : (
                                                    <span className="pos-session-badge pos-session-badge--open">
                                                        <span className="pos-session-dot" />
                                                        Activa
                                                    </span>
                                                )}
                                            </td>
                                            <td className="tabular sessions-td-muted">
                                                {session.fechainicio ? new Date(session.fechainicio).toLocaleString('es-NI', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                                            </td>
                                            <td className="tabular sessions-td-muted">
                                                {session.fechafin ? new Date(session.fechafin).toLocaleString('es-NI', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                                            </td>
                                            <td className="tabular sessions-td-right sessions-td-primary">
                                                C$ {Number(session.montoinicial || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="tabular sessions-td-right sessions-td-primary">
                                                {isClosed ? `C$ ${mSistema.toLocaleString('es-NI', { minimumFractionDigits: 2 })}` : '—'}
                                            </td>
                                            <td className="tabular sessions-td-right sessions-td-primary">
                                                {isClosed ? `C$ ${mFisico.toLocaleString('es-NI', { minimumFractionDigits: 2 })}` : '—'}
                                            </td>
                                            <td className={`tabular sessions-td-right sessions-diff ${diffClass}`}>
                                                {isClosed ? `${diferencia >= 0 ? '+' : ''}C$ ${diferencia.toLocaleString('es-NI', { minimumFractionDigits: 2 })}` : '—'}
                                            </td>
                                            <td className="sessions-td-center">
                                                <div className="sessions-action-group">
                                                    <button
                                                        type="button"
                                                        className="btn sessions-action-btn sessions-action-btn--pdf"
                                                        disabled={downloadingId === session.id}
                                                        onClick={() => handleDownloadSessionPDF(session.id)}
                                                        title="Descargar Reporte PDF Detallado"
                                                    >
                                                        <IconFileText size={14} />
                                                        <span>{downloadingId === session.id ? 'Generando...' : 'PDF'}</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn sessions-action-btn sessions-action-btn--excel"
                                                        disabled={downloadingExcelId === session.id}
                                                        onClick={() => handleDownloadSessionExcel(session.id)}
                                                        title="Descargar Reporte Excel (.xlsx)"
                                                    >
                                                        <IconTable size={14} />
                                                        <span>{downloadingExcelId === session.id ? '...' : 'Excel'}</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination page={sessionPage} totalPages={totalSessionPages} onPageChange={setSessionPage} />
            </div>
        </div>
    );
};

export default Sessions;
