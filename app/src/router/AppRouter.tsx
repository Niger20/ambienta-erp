import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layout/MainLayout';
import { useAuth } from '../context/AuthContext';

// Pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import POS from '../pages/POS';
import CustomerDisplay from '../pages/CustomerDisplay';
import Products from '../pages/Products';
import Sales from '../pages/Sales';
import Purchases from '../pages/Purchases';
import Expenses from '../pages/Expenses';
import Sessions from '../pages/Sessions';
import Reportes from '../pages/Reportes';
import Users from '../pages/Users';
import Deliveries from '../pages/Deliveries';
import Settings from '../pages/Settings';

/**
 * Role-based access:
 *   administrador → ALL routes
 *   empleado      → all except /usuarios
 *   invitado      → /dashboard and /pos only
 */
const AppRouter = () => {
    const { isAuthenticated, user } = useAuth();
    const rol = user?.rol;
    const isAdmin = rol === 'administrador';
    const isAtLeastEmpleado = rol === 'administrador' || rol === 'empleado';

    const Denied = () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
            <div style={{ fontSize: '3rem' }}>🔒</div>
            <h2 style={{ fontWeight: 700, fontSize: '1.3rem' }}>Acceso denegado</h2>
            <p style={{ color: 'var(--text-secondary)' }}>No tienes permisos para acceder a esta sección.</p>
            <a href="/dashboard" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>Volver al Dashboard</a>
        </div>
    );

    return (
        <Routes>
            {/* Public Route */}
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
            />

            {/* Protected Routes encapsulated in MainLayout */}
            <Route element={<ProtectedRoute />}>
                {/* Customer display — full screen, no layout */}
                <Route path="/pos/cliente" element={<CustomerDisplay />} />

                <Route element={<MainLayout />}>
                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* ALL roles */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/pos" element={<POS />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* Empleado + Admin */}
                    <Route path="/products" element={isAtLeastEmpleado ? <Products /> : <Denied />} />
                    <Route path="/sales" element={isAtLeastEmpleado ? <Sales /> : <Denied />} />
                    <Route path="/purchases" element={isAtLeastEmpleado ? <Purchases /> : <Denied />} />
                    <Route path="/deliveries" element={isAtLeastEmpleado ? <Deliveries /> : <Denied />} />

                    {/* Admin only */}
                    <Route path="/expenses" element={isAdmin ? <Expenses /> : <Denied />} />
                    <Route path="/sesiones" element={isAdmin ? <Sessions /> : <Denied />} />
                    <Route path="/reportes" element={isAdmin ? <Reportes /> : <Denied />} />
                    <Route path="/usuarios" element={isAdmin ? <Users /> : <Denied />} />
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRouter;
