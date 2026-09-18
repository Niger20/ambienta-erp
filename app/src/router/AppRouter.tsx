import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layout/MainLayout';
import { useAuth } from '../context/AuthContext';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Login/Register';
import VerifyEmail from '../pages/VerifyEmail';
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
import Roles from '../pages/Roles';
import Deliveries from '../pages/Deliveries';
import Settings from '../pages/Settings';

/**
 * El acceso a cada ruta ya no se decide por un `rol` fijo, sino por los permisos
 * que trae el usuario autenticado (tabla roles/permisos del backend, ver
 * AuthContext.hasPermission). Un rol nuevo creado desde /roles queda habilitado
 * para las rutas correspondientes sin tocar este archivo.
 */
const AppRouter = () => {
    const { isAuthenticated, hasPermission } = useAuth();

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
            {/* Rutas públicas */}
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
            <Route path="/verificar-correo/:token" element={<VerifyEmail />} />

            {/* Protected Routes encapsulated in MainLayout */}
            <Route element={<ProtectedRoute />}>
                {/* Customer display — full screen, no layout */}
                <Route path="/pos/cliente" element={<CustomerDisplay />} />

                <Route element={<MainLayout />}>
                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    <Route path="/dashboard" element={hasPermission('dashboard.ver') ? <Dashboard /> : <Denied />} />
                    <Route path="/pos" element={hasPermission('pos.ver') ? <POS /> : <Denied />} />
                    <Route path="/settings" element={<Settings />} />

                    <Route path="/products" element={hasPermission('productos.ver') ? <Products /> : <Denied />} />
                    <Route path="/sales" element={hasPermission('ventas.ver') ? <Sales /> : <Denied />} />
                    <Route path="/purchases" element={hasPermission('compras.ver') ? <Purchases /> : <Denied />} />
                    <Route path="/deliveries" element={hasPermission('deliveries.ver') ? <Deliveries /> : <Denied />} />

                    <Route path="/expenses" element={hasPermission('gastos.ver') ? <Expenses /> : <Denied />} />
                    <Route path="/sesiones" element={hasPermission('sesiones.ver') ? <Sessions /> : <Denied />} />
                    <Route path="/reportes" element={hasPermission('reportes.ver') ? <Reportes /> : <Denied />} />
                    <Route path="/usuarios" element={hasPermission('usuarios.ver') ? <Users /> : <Denied />} />
                    <Route path="/roles" element={hasPermission('roles.ver') ? <Roles /> : <Denied />} />
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRouter;
