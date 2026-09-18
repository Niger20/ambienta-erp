import { useState, useEffect, Fragment } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAdminAutorizacionWS } from '../hooks/useAutorizacionWS';
import { CashCalculatorModal, useCashCalculator } from '../components/CashCalculator';
import {
    buildReporteCierreConMetodos,
    exportReporteCierrePDF,
    exportReporteCierreExcel,
} from '../utils/reporteCierreUtils';
import type {
    ReporteCierreBase,
    ReporteCierreDetallado,
} from '../utils/reporteCierreUtils';

export type ReporteCierre = ReporteCierreBase;

const IconCalculator = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="16" y1="14" x2="16" y2="18" />
        <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
    </svg>
);

const IconChart = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

const IconLock = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const IconUnlock = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
);

const IconChevronDown = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: 'transform 0.15s ease' }}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const IconArrowRight = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const IconX = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const Header = ({ onToggleSidebar }: { onToggleSidebar?: () => void }) => {
    const { user, logout, activeSession, setActiveSession } = useAuth();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);

    // Modal state
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, type: 'open' | 'close', action: (monto: number) => Promise<void> }>({
        isOpen: false,
        type: 'open',
        action: async () => { }
    });
    const [montoInput, setMontoInput] = useState('');
    const [modalError, setModalError] = useState('');
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const { calculatorModalProps } = useCashCalculator({
        isOpen: isCalculatorOpen,
        onClose: () => setIsCalculatorOpen(false),
        onApplyTotal: (total) => setMontoInput(total.toFixed(2)),
    });

    // Reporte Cierre state
    const [showReporteModal, setShowReporteModal] = useState(false);
    const [reporteData, setReporteData] = useState<ReporteCierreDetallado | null>(null);
    const [loadingReporte, setLoadingReporte] = useState(false);
    const [expandedMetodo, setExpandedMetodo] = useState<string | null>(null);

    // Authorizations state
    const [pendingAuths, setPendingAuths] = useState<any[]>([]);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authCode, setAuthCode] = useState<string | null>(null);

    // Only admins should poll for pending authorizations
    const isAdmin = user?.rol === 'administrador';

    const playBeep = () => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.4);
        } catch (_) { /* silently ignore if audio not available */ }
    };

    // Fetch active session on mount
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await api.get('/sesiones/active');
                if (res.data && res.data.length > 0) {
                    setActiveSession({
                        id: res.data[0].id ?? res.data[0].sesionid,
                        montoinicial: Number(res.data[0].montoinicial),
                        montofinalsistema: res.data[0].montofinalsistema != null ? Number(res.data[0].montofinalsistema) : undefined
                    });
                } else if (res.data && (res.data.id || res.data.sesionid)) {
                    setActiveSession({
                        id: res.data.id ?? res.data.sesionid,
                        montoinicial: Number(res.data.montoinicial),
                        montofinalsistema: res.data.montofinalsistema != null ? Number(res.data.montofinalsistema) : undefined
                    });
                } else {
                    setActiveSession(null);
                }
            } catch (err) {
                // No active session or error
                setActiveSession(null);
            }
        };
        fetchSession();
    }, [setActiveSession]);

    // WebSocket — escucha nuevas solicitudes de autorización en tiempo real (solo admin)
    useAdminAutorizacionWS({
        enabled: isAdmin,
        onNuevaSolicitud: (autorizacion) => {
            setPendingAuths(prev => {
                // Evitar duplicados
                if (prev.some(a => (a.autorizacionid ?? a.id) === autorizacion.autorizacionid)) return prev;
                playBeep();
                setShowAuthModal(true);
                setAuthCode(null);
                return [...prev, autorizacion];
            });
        },
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleOpenSession = async (montoinicial: number) => {
        setIsProcessing(true);
        setModalError('');
        try {
            const res = await api.post('/sesiones', { montoinicial });
            const data = res.data;
            setActiveSession({
                id: data.id ?? data.sesionid,
                montoinicial: Number(data.montoinicial)
            });
            setModalConfig(prev => ({ ...prev, isOpen: false }));
            setMontoInput('');
        } catch (err: any) {
            setModalError(err.response?.data?.error || "Error al abrir caja.");
        } finally {
            setIsProcessing(false);
        }
    };

    const openOpenModal = () => {
        setMontoInput('');
        setModalError('');
        setModalConfig({
            isOpen: true,
            type: 'open',
            action: handleOpenSession
        });
    };

    const handleCloseSession = async (montofinalfisico: number) => {
        if (!activeSession) return;

        setIsProcessing(true);
        setModalError('');
        try {
            await api.put(`/sesiones/close/${activeSession.id}`, { montofinalfisico });
            setActiveSession(null);
            setModalConfig(prev => ({ ...prev, isOpen: false }));
            setMontoInput('');
        } catch (err: any) {
            setModalError(err.response?.data?.error || "Error al cerrar caja.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Step 1: Show reporte before closing
    const confirmCloseSession = async () => {
        if (!activeSession) return;
        setLoadingReporte(true);
        setShowReporteModal(true);
        setModalError('');
        setExpandedMetodo(null);
        try {
            const res = await api.get(`/sesiones/${activeSession.id}/reporte-cierre`);
            const detailed = await buildReporteCierreConMetodos(activeSession.id, res.data);
            setReporteData(detailed);
        } catch (err: any) {
            setReporteData(null);
            setModalError(err.response?.data?.error || "Error al obtener reporte de cierre.");
        } finally {
            setLoadingReporte(false);
        }
    };

    // Step 2: After reviewing reporte, proceed to physical cash input
    const proceedToClose = () => {
        setShowReporteModal(false);
        setReporteData(null);
        setMontoInput('');
        setModalError('');
        setModalConfig({
            isOpen: true,
            type: 'close',
            action: handleCloseSession
        });
    };

    const submitModal = () => {
        const monto = parseFloat(montoInput);
        if (isNaN(monto) || monto < 0) {
            setModalError("Por favor ingrese un monto válido.");
            return;
        }
        modalConfig.action(monto);
    };

    const handleAprobarAuth = async (id: number) => {
        setIsProcessing(true);
        try {
            const res = await api.put(`/autorizaciones/${id}/aprobar`);
            setAuthCode(res.data.codigo);
            const pendRes = await api.get('/autorizaciones/pendientes');
            setPendingAuths(pendRes.data);
        } catch (error: any) {
            alert(error.response?.data?.error || "Error al aprobar la autorización");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRechazarAuth = async (id: number) => {
        setIsProcessing(true);
        try {
            await api.put(`/autorizaciones/${id}/rechazar`);
            const pendRes = await api.get('/autorizaciones/pendientes');
            setPendingAuths(pendRes.data);
            setAuthCode(null);
        } catch (error: any) {
            alert(error.response?.data?.error || "Error al rechazar la autorización");
        } finally {
            setIsProcessing(false);
        }
    };

    const fmt = (n: number) => `C$ ${n.toFixed(2)}`;

    return (
        <>
            <header className="header">
                <div className="header-brand">
                    <button className="sidebar-toggle" onClick={onToggleSidebar} aria-label="Toggle Sidebar" style={{ border: 'none', background: 'transparent', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="6" x2="20" y2="6"></line>
                            <line x1="4" y1="12" x2="14" y2="12"></line>
                            <line x1="4" y1="18" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <div className="header-title">
                        <h1 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>Ambienta POS</h1>
                    </div>
                </div>

                <div className="header-actions">
                    {/* Admin Authorizations Icon */}
                    {isAdmin && (
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => { setShowAuthModal(true); setAuthCode(null); }}
                                style={{
                                    position: 'relative',
                                    background: pendingAuths.length > 0 ? 'var(--accent-warning-bg)' : 'var(--bg-hover)',
                                    border: `1px solid ${pendingAuths.length > 0 ? 'var(--accent-warning)' : 'var(--border-color)'}`,
                                    padding: '0.55rem',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: pendingAuths.length > 0 ? 'var(--accent-warning)' : 'var(--text-secondary)',
                                    transition: 'all 0.2s var(--ease-out)',
                                    boxShadow: pendingAuths.length > 0 ? '0 0 12px rgba(245, 158, 11, 0.35)' : 'none',
                                    animation: pendingAuths.length > 0 ? 'authPulse 1.2s ease-in-out infinite' : 'none'
                                }}
                                title="Autorizaciones pendientes"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
                                </svg>
                                {pendingAuths.length > 0 && (
                                    <span style={{ 
                                        position: 'absolute', 
                                        top: -6, 
                                        right: -6, 
                                        background: 'var(--accent-warning)', 
                                        color: '#0f172a', 
                                        borderRadius: '50%', 
                                        width: '20px', 
                                        height: '20px', 
                                        fontSize: '0.75rem', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        fontWeight: '800', 
                                        boxShadow: '0 0 0 3px var(--bg-card)' 
                                    }}>
                                        {pendingAuths.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Session Widget */}
                    <div className="header-session-widget">
                        {activeSession ? (
                            <>
                                <div className="session-status-wrap">
                                    <span className="session-status-badge session-open">
                                        <span className="status-dot"></span>
                                        CAJA ABIERTA
                                    </span>
                                    <span className="session-amount">
                                        Esperado: <strong>C$ {activeSession.montofinalsistema?.toFixed(2) || activeSession.montoinicial.toFixed(2)}</strong>
                                    </span>
                                </div>
                                <button
                                    onClick={confirmCloseSession}
                                    disabled={isProcessing || loadingReporte}
                                    className="btn btn-close-session"
                                >
                                    {loadingReporte ? 'Cargando...' : isProcessing ? 'Procesando...' : 'Cerrar Caja'}
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="session-status-badge session-closed">
                                    <span className="status-dot"></span>
                                    CAJA CERRADA
                                </span>
                                <button
                                    onClick={openOpenModal}
                                    disabled={isProcessing}
                                    className="btn btn-primary btn-open-session"
                                >
                                    {isProcessing ? 'Procesando...' : 'Abrir Caja'}
                                </button>
                            </>
                        )}
                    </div>

                    <div className="header-user">
                        <button className="btn-logout" onClick={handleLogout} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                            </svg>
                            <span>Salir</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ── REPORTE PRE-CIERRE MODAL ── */}
            {showReporteModal && (
                <div className="modal-backdrop" onClick={() => !loadingReporte && setShowReporteModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '780px', backgroundColor: 'var(--bg-card)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                        <div className="card-header" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 className="card-title" style={{ fontSize: '1.25rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
                                    <IconChart size={22} />
                                    <span>Cierre y Conciliación por Método de Pago</span>
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                                    Entradas y salidas clasificadas por Efectivo, BAC, LAFISE y Tarjetas.
                                </p>
                            </div>
                            <button onClick={() => setShowReporteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                                <IconX size={20} />
                            </button>
                        </div>

                        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
                            {loadingReporte ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                                    Analizando y conciliando movimientos...
                                </div>
                            ) : reporteData ? (
                                <>
                                    {/* ── TOP METRIC CARDS ── */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                        {/* Card Efectivo */}
                                        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--accent-success-border)', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Efectivo en Caja</div>
                                            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-success)', marginTop: '0.2rem' }}>
                                                {fmt(reporteData.totalEsperadoEfectivo)}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                                Base: {fmt(reporteData.montoinicial)}
                                            </div>
                                        </div>

                                        {/* Card BAC */}
                                        {(() => {
                                            const bac = (reporteData.desgloseMetodos || []).find(m => m.metodo === 'BAC') || { entradas: 0, salidas: 0, neto: 0 };
                                            return (
                                                <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Banco BAC</div>
                                                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: bac.neto >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)', marginTop: '0.2rem' }}>
                                                        {bac.neto >= 0 ? '+' : ''}{fmt(bac.neto)}
                                                    </div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                                        +{fmt(bac.entradas)} | -{fmt(bac.salidas)}
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* Card LAFISE */}
                                        {(() => {
                                            const lafise = (reporteData.desgloseMetodos || []).find(m => m.metodo === 'LAFISE') || { entradas: 0, salidas: 0, neto: 0 };
                                            return (
                                                <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Banco LAFISE</div>
                                                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: lafise.neto >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)', marginTop: '0.2rem' }}>
                                                        {lafise.neto >= 0 ? '+' : ''}{fmt(lafise.neto)}
                                                    </div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                                        +{fmt(lafise.entradas)} | -{fmt(lafise.salidas)}
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* Card Tarjetas */}
                                        {(() => {
                                            const tj = (reporteData.desgloseMetodos || []).find(m => m.metodo === 'TARJETA') || { entradas: 0, salidas: 0, neto: 0 };
                                            return (
                                                <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Tarjetas / POS</div>
                                                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                                                        {fmt(tj.entradas)}
                                                    </div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                                        Total ventas POS
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* ── CONSOLIDATED METHODS TABLE ── */}
                                    <div style={{ marginBottom: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '10px', padding: '1rem', border: '1px solid var(--border-color)' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <span>Resumen Consolidado por Método de Pago</span>
                                        </div>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                    <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>Método / Entidad</th>
                                                    <th style={{ textAlign: 'right', padding: '0.4rem 0.5rem' }}>Entradas (+)</th>
                                                    <th style={{ textAlign: 'right', padding: '0.4rem 0.5rem' }}>Salidas (−)</th>
                                                    <th style={{ textAlign: 'right', padding: '0.4rem 0.5rem' }}>Flujo Neto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(reporteData.desgloseMetodos || []).map(m => {
                                                    const movsMetodo = (reporteData.movimientos || []).filter(mv => mv.metodo === m.metodo);
                                                    const isExpanded = expandedMetodo === m.metodo;
                                                    return (
                                                        <Fragment key={m.metodo}>
                                                            <tr style={{ borderBottom: isExpanded ? 'none' : '1px solid var(--border-color)' }}>
                                                                <td style={{ padding: '0.45rem 0.5rem', fontWeight: 600 }}>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setExpandedMetodo(isExpanded ? null : m.metodo)}
                                                                        disabled={movsMetodo.length === 0}
                                                                        style={{
                                                                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                                                            background: 'none', border: 'none', padding: 0,
                                                                            color: movsMetodo.length === 0 ? 'inherit' : 'var(--accent-primary)',
                                                                            fontWeight: 600, fontSize: 'inherit', fontFamily: 'inherit',
                                                                            cursor: movsMetodo.length === 0 ? 'default' : 'pointer',
                                                                        }}
                                                                        title={movsMetodo.length === 0 ? undefined : (isExpanded ? 'Ocultar movimientos' : 'Ver movimientos')}
                                                                    >
                                                                        {movsMetodo.length > 0 && (
                                                                            <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', display: 'inline-flex' }}>
                                                                                <IconChevronDown size={14} />
                                                                            </span>
                                                                        )}
                                                                        <span>{m.nombre}</span>
                                                                        {movsMetodo.length > 0 && (
                                                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', background: 'var(--bg-dark)', borderRadius: '999px', padding: '0.05rem 0.45rem' }}>
                                                                                {movsMetodo.length}
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                </td>
                                                                <td style={{ padding: '0.45rem 0.5rem', textAlign: 'right', color: 'var(--accent-success)', fontWeight: 600 }}>
                                                                    {fmt(m.entradas)}
                                                                </td>
                                                                <td style={{ padding: '0.45rem 0.5rem', textAlign: 'right', color: 'var(--accent-danger)', fontWeight: 600 }}>
                                                                    {fmt(m.salidas)}
                                                                </td>
                                                                <td style={{ padding: '0.45rem 0.5rem', textAlign: 'right', fontWeight: 700, color: m.neto >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                                                                    {m.neto >= 0 ? '+' : ''}{fmt(m.neto)}
                                                                </td>
                                                            </tr>
                                                            {isExpanded && (
                                                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                                    <td colSpan={4} style={{ padding: '0 0.5rem 0.6rem 1.5rem' }}>
                                                                        <div style={{ background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                                                                            {movsMetodo.map(mv => {
                                                                                const isEntry = mv.tipo === 'VENTA' || mv.tipo === 'ABONO';
                                                                                return (
                                                                                    <div key={mv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 0.65rem', fontSize: '0.78rem', borderBottom: '1px solid var(--border-color)' }}>
                                                                                        <span style={{ color: 'var(--text-secondary)', fontWeight: 700, minWidth: '52px' }}>{mv.tipo}</span>
                                                                                        <span style={{ flex: 1, color: 'var(--text-primary)' }}>{mv.referencia || '—'}</span>
                                                                                        <span style={{ fontWeight: 700, color: isEntry ? 'var(--accent-success)' : 'var(--accent-danger)', whiteSpace: 'nowrap' }}>
                                                                                            {isEntry ? '+' : '−'} {fmt(mv.monto)}
                                                                                        </span>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </Fragment>
                                                    );
                                                })}
                                                <tr style={{ fontWeight: 800, background: 'var(--bg-dark)', borderTop: '2px solid var(--border-color)' }}>
                                                    <td style={{ padding: '0.6rem 0.5rem' }}>TOTAL GENERAL</td>
                                                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: 'var(--accent-success)' }}>
                                                        {fmt(reporteData.totalEntradasGeneral)}
                                                    </td>
                                                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: 'var(--accent-danger)' }}>
                                                        {fmt(reporteData.totalSalidasGeneral)}
                                                    </td>
                                                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: reporteData.totalNetoGeneral >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                                                        {reporteData.totalNetoGeneral >= 0 ? '+' : ''}{fmt(reporteData.totalNetoGeneral)}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* ── ARQUEO DE CAJA FÍSICA CARD ── */}
                                    <div style={{ background: 'var(--bg-dark)', borderRadius: '10px', padding: '1rem', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.6rem' }}>
                                            Conciliación de Efectivo Físico en Caja
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.25rem 0' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>Monto Base Inicial</span>
                                            <span style={{ fontWeight: 600 }}>{fmt(reporteData.montoinicial)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.25rem 0' }}>
                                            <span style={{ color: 'var(--accent-success)' }}>+ Entradas Efectivo</span>
                                            <span style={{ fontWeight: 600, color: 'var(--accent-success)' }}>
                                                + {fmt((reporteData.desgloseMetodos || []).find(m => m.metodo === 'EFECTIVO')?.entradas || 0)}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.25rem 0' }}>
                                            <span style={{ color: 'var(--accent-danger)' }}>− Salidas Efectivo</span>
                                            <span style={{ fontWeight: 600, color: 'var(--accent-danger)' }}>
                                                − {fmt((reporteData.desgloseMetodos || []).find(m => m.metodo === 'EFECTIVO')?.salidas || 0)}
                                            </span>
                                        </div>
                                        <div style={{ borderTop: '2px solid var(--border-color)', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
                                            <span>Total Esperado en Caja Física</span>
                                            <span style={{ color: 'var(--accent-primary)' }}>{fmt(reporteData.totalEsperadoEfectivo)}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-danger)' }}>
                                    {modalError || 'No se pudo cargar el reporte.'}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        {reporteData && (
                            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        type="button"
                                        className="btn"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--accent-primary-border)', backgroundColor: 'var(--accent-primary-bg)', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.85rem' }}
                                        onClick={() => exportReporteCierrePDF(reporteData)}
                                    >
                                        <span>PDF por Método</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--accent-success-border)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', fontWeight: 600, fontSize: '0.85rem' }}
                                        onClick={() => exportReporteCierreExcel(reporteData)}
                                    >
                                        <span>Excel (.xlsx)</span>
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn" style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={() => setShowReporteModal(false)}>
                                        Cancelar
                                    </button>
                                    <button className="btn" style={{ backgroundColor: 'var(--accent-danger)', color: 'white', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }} onClick={proceedToClose}>
                                        <span>Continuar al Cierre</span>
                                        <IconArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Session Management Modal */}
            {modalConfig.isOpen && (
                <div className="modal-backdrop" onClick={() => !isProcessing && setModalConfig(prev => ({ ...prev, isOpen: false }))}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                        <div className="card-header" style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                            <h3 className="card-title" style={{ fontSize: '1.35rem', fontWeight: 700, color: modalConfig.type === 'open' ? 'var(--accent-primary)' : 'var(--accent-danger)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                {modalConfig.type === 'open' ? (
                                    <>
                                        <IconUnlock size={24} />
                                        <span>Apertura de Caja</span>
                                    </>
                                ) : (
                                    <>
                                        <IconLock size={24} />
                                        <span>Cierre de Caja</span>
                                    </>
                                )}
                            </h3>
                        </div>

                        <div className="modal-body">
                            {modalConfig.type === 'close' && activeSession && (
                                <div style={{
                                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                    borderRadius: '12px',
                                    padding: '1.1rem',
                                    marginBottom: '1.5rem',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 600 }}>Monto Esperado en Sistema</p>
                                    <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)', margin: 0 }} className="tabular">
                                        C$ {activeSession.montofinalsistema?.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '---'}
                                    </p>
                                </div>
                            )}

                            <div className="form-group">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                                        {modalConfig.type === 'open' ? 'Ingrese el monto base inicial (C$)' : 'Monto físico final en caja (C$)'}
                                    </label>
                                    {modalConfig.type === 'close' && (
                                        <button
                                            type="button"
                                            onClick={() => setIsCalculatorOpen(true)}
                                            style={{
                                                fontSize: '0.825rem',
                                                fontWeight: 700,
                                                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                                                color: 'var(--accent-success)',
                                                border: '1px solid var(--accent-success-border)',
                                                borderRadius: '8px',
                                                padding: '0.35rem 0.75rem',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <IconCalculator size={16} />
                                            <span>Conteo por Billetes / Monedas</span>
                                        </button>
                                    )}
                                </div>
                                <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '1.1rem' }}>C$</span>
                                    <input
                                        type="number"
                                        className="form-input"
                                        style={{ paddingLeft: '2.8rem', fontSize: '1.3rem', fontWeight: 700, height: '48px', backgroundColor: 'var(--bg-dark)', borderRadius: '10px' }}
                                        value={montoInput}
                                        onChange={e => setMontoInput(e.target.value)}
                                        placeholder="0.00"
                                        autoFocus
                                        onKeyDown={e => e.key === 'Enter' && submitModal()}
                                    />
                                </div>
                                {modalError && <div className="text-error" style={{ marginTop: '0.5rem', color: 'var(--accent-danger)', fontWeight: 600 }}>{modalError}</div>}
                            </div>
                        </div>

                        <div className="modal-actions" style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                className="btn"
                                style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '10px', padding: '0.6rem 1.2rem', fontWeight: 600 }}
                                onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                                disabled={isProcessing}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn"
                                style={{
                                    backgroundColor: modalConfig.type === 'open' ? 'var(--accent-primary)' : 'var(--accent-danger)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '0.6rem 1.4rem',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    boxShadow: modalConfig.type === 'open' ? '0 4px 14px rgba(59,130,246,0.3)' : '0 4px 14px rgba(239,68,68,0.3)'
                                }}
                                onClick={submitModal}
                                disabled={isProcessing || !montoInput}
                            >
                                {isProcessing ? 'Procesando...' : (modalConfig.type === 'open' ? 'Abrir Caja' : 'Confirmar Cierre')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Standalone Fullscreen Cash Calculator Modal */}
            <CashCalculatorModal {...calculatorModalProps} />

            {/* Authorizations Admin Modal */}
            {showAuthModal && (
                <div className="modal-backdrop" onClick={() => setShowAuthModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', backgroundColor: 'var(--bg-card)' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="card-title">Autorizaciones Pendientes</h3>
                            <button onClick={() => setShowAuthModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="modal-body" style={{ marginTop: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
                            {authCode && (
                                <div style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-success)', borderRadius: '8px', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--accent-success)', fontWeight: 600, marginBottom: '0.5rem' }}>¡Autorización Aprobada!</p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Dícale el siguiente código al empleado en caja para que confirme la acción:</p>
                                    <div style={{ fontSize: '3rem', letterSpacing: '8px', fontWeight: 800, color: 'var(--text-primary)' }}>{authCode}</div>
                                </div>
                            )}

                            {pendingAuths.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>No hay autorizaciones pendientes en este momento.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {pendingAuths.map(auth => (
                                        <div key={auth.autorizacionid ?? auth.id} style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <div>
                                                    <span style={{ padding: '0.15rem 0.5rem', backgroundColor: 'var(--accent-danger-bg)', color: 'var(--accent-danger)', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                                        {auth.accion}
                                                    </span>
                                                    <h4 style={{ margin: '0.5rem 0 0.25rem 0', fontWeight: 600 }}>{auth.detalle || 'Acción Crítica'}</h4>
                                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                                                        Solicitado por: <strong>{auth.nombreusuario || `Usuario #${auth.usuarioid}`}</strong> • {new Date(auth.fecha).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                                                <button
                                                    onClick={() => handleRechazarAuth(auth.autorizacionid ?? auth.id)}
                                                    disabled={isProcessing}
                                                    className="btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                                                    Rechazar
                                                </button>
                                                <button
                                                    onClick={() => handleAprobarAuth(auth.autorizacionid ?? auth.id)}
                                                    disabled={isProcessing}
                                                    className="btn btn-primary" style={{ padding: '0.3rem 1rem', fontSize: '0.85rem' }}>
                                                    Aprobar y Generar PIN
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
