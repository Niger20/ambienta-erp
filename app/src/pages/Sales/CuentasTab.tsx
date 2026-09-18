import { IconCalendar, IconHash, IconSend, IconFilePdf } from './icons';
import type { Cliente, CuentaPorCobrar } from './types';

interface CuentasTabProps {
    cuentaSearchQuery: string;
    setCuentaSearchQuery: (v: string) => void;
    cuentasSortField: 'fechavencimiento' | 'ventaid';
    setCuentasSortField: (v: 'fechavencimiento' | 'ventaid') => void;
    cuentasSortDirection: 'asc' | 'desc';
    setCuentasSortDirection: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
    filteredCuentas: CuentaPorCobrar[];
    getClienteForCuenta: (cuenta: CuentaPorCobrar) => Cliente | undefined;
    expandedClientId: number | null;
    setExpandedClientId: (id: number | null) => void;
    buildClienteWsLink: (nombre: string, telefono: string, totalRestante: number) => string | null;
    openGlobalAbonoModal: (clienteId: number, nombre: string, totalRestante: number) => void;
    exportClienteCuentasPDF: (clienteId: number, clienteNombre: string, clienteTelefono: string, cuentasCliente: CuentaPorCobrar[]) => Promise<void>;
    cuentasPages: Record<number, number>;
    setCuentasPages: React.Dispatch<React.SetStateAction<Record<number, number>>>;
    selectedCuenta: CuentaPorCobrar | null;
    openCuentaDetail: (cuenta: CuentaPorCobrar) => void;
    estadoColor: (estado: string) => { color: string; bg: string };
}

export const CuentasTab = ({
    cuentaSearchQuery, setCuentaSearchQuery,
    cuentasSortField, setCuentasSortField, cuentasSortDirection, setCuentasSortDirection,
    filteredCuentas, getClienteForCuenta, expandedClientId, setExpandedClientId,
    buildClienteWsLink, openGlobalAbonoModal, exportClienteCuentasPDF,
    cuentasPages, setCuentasPages, selectedCuenta, openCuentaDetail, estadoColor,
}: CuentasTabProps) => {
    // Sort state fijo usado por el agrupador (no editable desde la UI, igual que el original)
    const cuentaSortBy = 'cliente';
    const cuentaSortOrder = 'asc';

    return (
        <div className="tab-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '300px', padding: '0 10px', gap: '8px', height: '36px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Buscar por cliente o ID..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }} value={cuentaSearchQuery} onChange={(e) => setCuentaSearchQuery(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <span>Ordenar por:</span>
                    <button className={`btn`} onClick={() => { setCuentasSortField('fechavencimiento'); setCuentasSortDirection(p => p === 'asc' ? 'desc' : 'asc'); }} style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', backgroundColor: cuentasSortField === 'fechavencimiento' ? 'rgba(99,102,241,0.12)' : 'transparent', color: cuentasSortField === 'fechavencimiento' ? 'var(--accent-primary)' : 'var(--text-secondary)', border: `1px solid ${cuentasSortField === 'fechavencimiento' ? 'var(--accent-primary)' : 'var(--border-color)'}`, fontWeight: cuentasSortField === 'fechavencimiento' ? 600 : 400, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <IconCalendar />
                        <span>Vencimiento {cuentasSortField === 'fechavencimiento' ? (cuentasSortDirection === 'asc' ? '↑' : '↓') : ''}</span>
                    </button>
                    <button className={`btn`} onClick={() => { setCuentasSortField('ventaid'); setCuentasSortDirection(p => p === 'asc' ? 'desc' : 'asc'); }} style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', backgroundColor: cuentasSortField === 'ventaid' ? 'rgba(99,102,241,0.12)' : 'transparent', color: cuentasSortField === 'ventaid' ? 'var(--accent-primary)' : 'var(--text-secondary)', border: `1px solid ${cuentasSortField === 'ventaid' ? 'var(--accent-primary)' : 'var(--border-color)'}`, fontWeight: cuentasSortField === 'ventaid' ? 600 : 400, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <IconHash />
                        <span>ID Venta {cuentasSortField === 'ventaid' ? (cuentasSortDirection === 'asc' ? '↑' : '↓') : ''}</span>
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(() => {
                    // Group cuentas by clienteid
                    const grouped = filteredCuentas.reduce((acc, cuenta) => {
                        const cid = cuenta.clienteid;
                        if (!acc[cid]) {
                            const cliente = getClienteForCuenta(cuenta);
                            acc[cid] = {
                                nombre: cuenta.clientes?.nombre || cliente?.nombre || `Cliente #${cid}`,
                                telefono: cuenta.clientes?.telefono || cliente?.telefono || '',
                                cuentas: [],
                            };
                        }
                        acc[cid].cuentas.push(cuenta);
                        return acc;
                    }, {} as Record<number, { nombre: string; telefono: string; cuentas: CuentaPorCobrar[] }>);

                    const sortedGroups = Object.entries(grouped).sort(([, a], [, b]) => {
                        if (cuentaSortBy === 'cliente') {
                            const cmp = a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
                            return cuentaSortOrder === 'asc' ? cmp : -cmp;
                        }
                        return 0;
                    });

                    if (sortedGroups.length === 0) {
                        return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No se encontraron cuentas por cobrar.</div>;
                    }

                    return sortedGroups.map(([clienteIdStr, data]) => {
                        const clienteId = Number(clienteIdStr);
                        const isExpanded = expandedClientId === clienteId;
                        const totalDeuda = data.cuentas.reduce((s, c) => s + Number(c.montototal), 0);
                        const totalRestante = data.cuentas.reduce((s, c) => s + Number(c.montorestante), 0);
                        const pendientes = data.cuentas.filter(c => c.estado !== 'PAGADO').length;
                        const totalCuentas = data.cuentas.length;

                        return (
                            <div key={clienteId} style={{
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                backgroundColor: 'var(--bg-card)',
                                borderLeft: isExpanded ? '3px solid var(--accent-primary)' : '1px solid var(--border-color)',
                                transition: 'border-left 0.15s ease-in-out'
                            }}>
                                {/* Accordion Header */}
                                <div
                                    style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: isExpanded ? 'rgba(59,130,246,0.05)' : 'transparent', transition: 'background-color 0.2s' }}
                                    onClick={() => setExpandedClientId(isExpanded ? null : clienteId)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #1e40af 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#ffffff',
                                            fontWeight: 700,
                                            fontSize: '1rem',
                                            flexShrink: 0,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}>
                                            {(data.nombre || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{data.nombre}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        <span>{totalCuentas} cuenta{totalCuentas !== 1 ? 's' : ''}</span>
                                        {pendientes > 0 && (
                                            <span style={{ color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                {pendientes} pendiente{pendientes !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                        <span>Deuda: <strong style={{ color: totalRestante > 0 ? 'var(--accent-danger)' : 'var(--accent-success)' }}>C$ {totalRestante.toFixed(2)}</strong></span>
                                        <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', fontSize: '0.9rem' }}>▼</span>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="accordion-content" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)' }}>
                                        {/* Action bar */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '0.75rem' }}>
                                            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem' }}>
                                                <span>Total compras: <strong>C$ {totalDeuda.toFixed(2)}</strong></span>
                                                <span>Pagado: <strong style={{ color: 'var(--accent-success)' }}>C$ {(totalDeuda - totalRestante).toFixed(2)}</strong></span>
                                                <span>Pendiente: <strong style={{ color: totalRestante > 0 ? 'var(--accent-danger)' : 'var(--accent-success)' }}>C$ {totalRestante.toFixed(2)}</strong></span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {totalRestante > 0 && data.telefono && (() => {
                                                    const clientWsLink = buildClienteWsLink(data.nombre, data.telefono, totalRestante);
                                                    return clientWsLink ? (
                                                        <a
                                                            href={clientWsLink}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="btn"
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                fontSize: '0.78rem',
                                                                padding: '0.3rem 0.75rem',
                                                                textDecoration: 'none',
                                                                backgroundColor: '#dcfce7',
                                                                color: '#15803d',
                                                                fontWeight: 600,
                                                                border: '1px solid #bbf7d0'
                                                            }}
                                                        >
                                                            <IconSend /> Recordatorio Total WA
                                                        </a>
                                                    ) : null;
                                                })()}
                                                {totalRestante > 0 && (
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={(e) => { e.stopPropagation(); openGlobalAbonoModal(clienteId, data.nombre, totalRestante); }}
                                                        style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
                                                    >
                                                        <span>+ Abono General</span>
                                                    </button>
                                                )}
                                                <button
                                                    className="btn"
                                                    onClick={(e) => { e.stopPropagation(); exportClienteCuentasPDF(clienteId, data.nombre, data.telefono, data.cuentas); }}
                                                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem', border: '1px solid var(--border-color)', color: 'var(--accent-primary)', backgroundColor: 'rgba(99,102,241,0.08)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                                >
                                                    <IconFilePdf />
                                                    <span>Exportar PDF del Cliente</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Cuentas table */}
                                        <div style={{ padding: '0 1.25rem 1rem' }}>
                                            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                                                <table style={{ minWidth: '850px', width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                                    <thead>
                                                        <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                                                            <th style={{ padding: '0.6rem 0', fontWeight: 500 }}>Cuenta #</th>
                                                            <th style={{ padding: '0.6rem 0', fontWeight: 500 }}>Venta #</th>
                                                            <th style={{ padding: '0.6rem 0', fontWeight: 500 }}>Total</th>
                                                            <th style={{ padding: '0.6rem 0', fontWeight: 500 }}>Pagado</th>
                                                            <th style={{ padding: '0.6rem 0', fontWeight: 500 }}>Restante</th>
                                                            <th style={{ padding: '0.6rem 0', fontWeight: 500 }}>Vence</th>
                                                            <th style={{ padding: '0.6rem 0', fontWeight: 500 }}>Estado</th>
                                                            <th style={{ padding: '0.6rem 0', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(() => {
                                                            const sortedCuentas = [...data.cuentas].sort((a, b) => {
                                                                const aPending = a.estado !== 'PAGADO';
                                                                const bPending = b.estado !== 'PAGADO';
                                                                if (aPending && !bPending) return -1;
                                                                if (!aPending && bPending) return 1;

                                                                if (cuentasSortField === 'fechavencimiento') {
                                                                    const cmp = new Date(a.fechavencimiento).getTime() - new Date(b.fechavencimiento).getTime();
                                                                    return cuentasSortDirection === 'asc' ? cmp : -cmp;
                                                                }
                                                                const cmp = a.ventaid - b.ventaid;
                                                                return cuentasSortDirection === 'asc' ? cmp : -cmp;
                                                            });

                                                            const clientPage = cuentasPages[clienteId] || 1;
                                                            const clientItemsPerPage = 25;
                                                            const totalClientPages = Math.ceil(sortedCuentas.length / clientItemsPerPage);
                                                            const paginatedCuentas = sortedCuentas.slice((clientPage - 1) * clientItemsPerPage, clientPage * clientItemsPerPage);

                                                            return (
                                                                <>
                                                                    {paginatedCuentas.map(cuenta => {
                                                                        const { color, bg } = estadoColor(cuenta.estado);
                                                                        const isSelected = (cuenta.id || cuenta.cuentaid) === (selectedCuenta?.id || selectedCuenta?.cuentaid);
                                                                        return (
                                                                            <tr key={cuenta.id || cuenta.cuentaid} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: isSelected ? 'rgba(99,102,241,0.08)' : '' }}>
                                                                                <td style={{ padding: '0.6rem 0', color: 'var(--text-secondary)' }}>#{cuenta.id || cuenta.cuentaid}</td>
                                                                                <td style={{ padding: '0.6rem 0', color: 'var(--text-secondary)' }}>#{cuenta.ventaid}</td>
                                                                                <td style={{ padding: '0.6rem 0' }}>C$ {Number(cuenta.montototal).toFixed(2)}</td>
                                                                                <td style={{ padding: '0.6rem 0', color: 'var(--accent-success)' }}>C$ {Number(cuenta.montopagado).toFixed(2)}</td>
                                                                                <td style={{ padding: '0.6rem 0', fontWeight: 600, color: Number(cuenta.montorestante) > 0 ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
                                                                                    C$ {Number(cuenta.montorestante).toFixed(2)}
                                                                                </td>
                                                                                <td style={{ padding: '0.6rem 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                                                                                    {new Date(cuenta.fechavencimiento).toLocaleDateString()}
                                                                                </td>
                                                                                <td style={{ padding: '0.6rem 0' }}>
                                                                                    <span style={{ color, backgroundColor: bg, padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{cuenta.estado}</span>
                                                                                </td>
                                                                                <td style={{ padding: '0.6rem 0', textAlign: 'right' }}>
                                                                                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn"
                                                                                            onClick={(e) => { e.stopPropagation(); openCuentaDetail(cuenta); }}
                                                                                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)', fontWeight: 500 }}
                                                                                        >
                                                                                            Gestionar
                                                                                        </button>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                                    {totalClientPages > 1 && (
                                                                        <tr>
                                                                            <td colSpan={8} style={{ padding: '0.5rem 0' }}>
                                                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn"
                                                                                        disabled={clientPage === 1}
                                                                                        onClick={(e) => { e.stopPropagation(); setCuentasPages(prev => ({ ...prev, [clienteId]: clientPage - 1 })); }}
                                                                                        style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                                                                                    >
                                                                                        Anterior
                                                                                    </button>
                                                                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                                                                        Página {clientPage} de {totalClientPages}
                                                                                    </span>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn"
                                                                                        disabled={clientPage === totalClientPages}
                                                                                        onClick={(e) => { e.stopPropagation(); setCuentasPages(prev => ({ ...prev, [clienteId]: clientPage + 1 })); }}
                                                                                        style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                                                                                    >
                                                                                        Siguiente
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </>
                                                            );
                                                        })()}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    });
                })()}
            </div>
        </div>
    );
};
