import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─── SVG Icons ──────────────────────────────────────────────────────────
const Icon = ({ d, d2 }: { d: string; d2?: string }) => (
    <svg
        width="17" height="17" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0, opacity: 0.85 }}
    >
        <path d={d} />
        {d2 && <path d={d2} />}
    </svg>
);

const icons: Record<string, ReactNode> = {
    dashboard: <Icon d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
    pos:       <Icon d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" d2="M3 6h18M16 10a4 4 0 01-8 0" />,
    products:  <Icon d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" d2="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />,
    sales:     <Icon d="M2 16.1A5 5 0 015.5 8h.08a5.5 5.5 0 0110.84 0H16.5a5 5 0 010 8.1M12 20v-8M8 20h8" />,
    purchases: <Icon d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" d2="M3 6h18" />,
    deliveries:<Icon d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 17h8m0 0l-3-3m3 3l-3 3M13 21h8a2 2 0 002-2v-1M16 3.13a4 4 0 010 7.75" />,
    expenses:  <Icon d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />,
    reportes:  <Icon d="M18 20V10M12 20V4M6 20v-6" />,
    sesiones:  <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    usuarios:  <Icon d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />,
    settings:  <Icon d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.1a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" d2="M12 15a3 3 0 100-6 3 3 0 000 6z" />,
};

// ─── Section Separator ──────────────────────────────────────────────────
const NavSection = ({ label, collapsed }: { label: string; collapsed?: boolean }) => (
    collapsed ? (
        <div className="nav-section-divider" style={{ borderTop: '1px solid var(--border-color)', margin: '0.75rem 0.5rem', opacity: 0.4 }} />
    ) : (
        <div className="nav-section-label">{label}</div>
    )
);

// ─── Nav Link wrapper ────────────────────────────────────────────────────
const SidebarLink = ({
    to, label, icon, onClose, collapsed
}: { to: string; label: string; icon: ReactNode; onClose?: () => void; collapsed?: boolean }) => (
    <NavLink
        to={to}
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        onClick={onClose}
        style={{ gap: collapsed ? '0' : '0.65rem', justifyContent: collapsed ? 'center' : 'flex-start' }}
        title={collapsed ? label : undefined}
    >
        {icon}
        {!collapsed && <span className="sidebar-label">{label}</span>}
    </NavLink>
);

// ─── Sidebar ─────────────────────────────────────────────────────────────
const Sidebar = ({ isOpen, onClose, collapsed }: {
    isOpen?: boolean;
    onClose?: () => void;
    collapsed?: boolean;
}) => {
    const { user } = useAuth();
    const rol = user?.rol;
    const nombre = user?.nombreusuario || 'Usuario';

    const isAdmin = rol === 'administrador';
    const isAtLeastEmpleado = rol === 'administrador' || rol === 'empleado';

    // Generate initials from name
    const initials = nombre
        .split(' ')
        .slice(0, 2)
        .map((w: string) => w[0]?.toUpperCase() ?? '')
        .join('');

    const rolLabel: Record<string, string> = {
        administrador: 'Admin',
        empleado: 'Empleado',
        invitado: 'Invitado',
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
            {/* ── Brand ── */}
            <div className="sidebar-logo" style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '1.5rem 0' : '1.5rem' }}>
                <span className="sidebar-status-dot" title="Sistema en línea" />
                {!collapsed && <h2 style={{ marginLeft: '0.5rem' }}>Ambienta POS</h2>}
            </div>

            {/* ── Navigation ── */}
            <nav className="sidebar-nav" style={{ padding: collapsed ? '1.5rem 0.5rem' : '1.5rem 1rem' }}>
                {/* General — all roles */}
                <NavSection label="General" collapsed={collapsed} />
                <SidebarLink to="/dashboard"  label="Dashboard"      icon={icons.dashboard}  onClose={onClose} collapsed={collapsed} />
                <SidebarLink to="/pos"        label="Punto de Venta" icon={icons.pos}        onClose={onClose} collapsed={collapsed} />

                {/* Gestión — admin & empleado */}
                {isAtLeastEmpleado && (
                    <>
                        <NavSection label="Gestión" collapsed={collapsed} />
                        <SidebarLink to="/products"   label="Productos"     icon={icons.products}   onClose={onClose} collapsed={collapsed} />
                        <SidebarLink to="/sales"      label="Ventas"        icon={icons.sales}      onClose={onClose} collapsed={collapsed} />
                        <SidebarLink to="/purchases"  label="Compras"       icon={icons.purchases}  onClose={onClose} collapsed={collapsed} />
                        <SidebarLink to="/deliveries" label="Repartidores"  icon={icons.deliveries} onClose={onClose} collapsed={collapsed} />
                    </>
                )}

                {/* Administración — admin only */}
                {isAdmin && (
                    <>
                        <NavSection label="Administración" collapsed={collapsed} />
                        <SidebarLink to="/expenses"  label="Gastos"    icon={icons.expenses}  onClose={onClose} collapsed={collapsed} />
                        <SidebarLink to="/sesiones"  label="Sesiones"  icon={icons.sesiones}  onClose={onClose} collapsed={collapsed} />
                        <SidebarLink to="/usuarios"  label="Usuarios"  icon={icons.usuarios}  onClose={onClose} collapsed={collapsed} />
                    </>
                )}

                {/* Configuración — pushed to the bottom of the navigation area */}
                <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <NavSection label="Configuración" collapsed={collapsed} />
                    <SidebarLink to="/settings" label="Ajustes" icon={icons.settings} onClose={onClose} collapsed={collapsed} />
                </div>
            </nav>

            {/* ── User Footer ── */}
            {rol && (
                <div className="sidebar-user" style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '1rem 0' : '1rem 1.25rem', width: collapsed ? '72px' : '260px' }}>
                    <div className="sidebar-avatar" aria-hidden="true" title={collapsed ? `${nombre} (${rolLabel[rol] ?? rol})` : undefined}>
                        {initials || '?'}
                    </div>
                    {!collapsed && (
                        <div className="sidebar-user-info">
                            <span className="sidebar-user-name">{nombre}</span>
                            <span className="sidebar-user-role">
                                {rolLabel[rol] ?? rol}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
