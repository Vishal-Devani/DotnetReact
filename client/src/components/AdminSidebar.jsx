import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserCog, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminSidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white';
    };

    return (
        <div className="flex flex-col w-64 h-screen bg-gray-900 text-white transition-all duration-300">
            {/* Logo area */}
            <div className="flex items-center justify-center h-16 border-b border-gray-800">
                <h1 className="text-xl font-bold tracking-wider">ADMIN PANEL</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-2 px-2">
                    <li>
                        <Link
                            to="/admin/dashboard"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard')}`}
                        >
                            <LayoutDashboard className="w-5 h-5 mr-3" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/users"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/admin/users')}`}
                        >
                            <Users className="w-5 h-5 mr-3" />
                            <span>User Management</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/person"
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/admin/person')}`}
                        >
                            <UserCog className="w-5 h-5 mr-3" />
                            <span>Person Records</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center justify-center w-full px-4 py-2 text-sm text-red-400 bg-red-400/10 rounded-lg hover:bg-red-400/20 transition-colors"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
