import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false, requireUser = false }) => {
    const { isUserAuthenticated, isAdminAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (requireAdmin) {
        if (!isAdminAuthenticated()) {
            return <Navigate to="/admin/login" replace />;
        }
        return children;
    }

    if (requireUser) {
        if (!isUserAuthenticated()) {
            return <Navigate to="/login" replace />;
        }
        return children;
    }

    // Default: allow either admin or user
    if (!isUserAuthenticated() && !isAdminAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
