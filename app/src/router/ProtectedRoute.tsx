import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="loading-screen">Loading...</div>; // Add a CSS class for generic loading styling
    }

    // If the user is authenticated, render the child routes inside <Outlet />
    // Otherwise, redirect them to the /login page
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
