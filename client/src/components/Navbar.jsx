import { Menu, X, LogOut, User, Shield } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { 
        isUserAuthenticated, 
        isAdminAuthenticated, 
        user, 
        adminUser, 
        logout, 
        logoutAdmin, 
        logoutUser 
    } = useAuth();
    const navigate = useNavigate();

    const handleAdminLogout = () => {
        logoutAdmin();
        toast.success('Admin logged out successfully');
        if (window.location.pathname.startsWith('/admin')) {
            navigate('/admin/login');
        }
    };

    const handleUserLogout = () => {
        logoutUser();
        toast.success('User logged out successfully');
        if (window.location.pathname.startsWith('/dashboard')) {
            navigate('/login');
        }
    };
    return (
        <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand Logo */}
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300 cursor-pointer">
                            My Project
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink
                                to='/'
                                className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${isActive
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                    }`}
                            >
                                Home
                            </NavLink>

                            <NavLink
                                to='/about'
                                className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${isActive
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                    }`}
                            >
                                About
                            </NavLink>

                            {/* User Routes */}
                            {isUserAuthenticated() && (
                                <NavLink
                                    to='/dashboard'
                                    className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${isActive
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                        }`}
                                >
                                    Dashboard
                                </NavLink>
                            )}

                            {/* Admin Routes */}
                            {isAdminAuthenticated() && (
                                <>
                                    <NavLink
                                        to='/admin/dashboard'
                                        className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${isActive
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                            : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                                            }`}
                                    >
                                        Admin Dashboard
                                    </NavLink>
                                    <NavLink
                                        to='/admin/person'
                                        className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${isActive
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                            : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                                            }`}
                                    >
                                        Person
                                    </NavLink>
                                </>
                            )}

                            {/* User Session Info */}
                            {isUserAuthenticated() && (
                                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                                    <div className="flex items-center space-x-2 px-3 py-2 rounded-full bg-blue-100">
                                        <User className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-700">{user?.username}</span>
                                    </div>
                                    <button
                                        onClick={handleUserLogout}
                                        className="flex items-center px-3 py-2 rounded-full text-xs font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                                        title="Logout User"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Admin Session Info */}
                            {isAdminAuthenticated() && (
                                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                                    <div className="flex items-center space-x-2 px-3 py-2 rounded-full bg-purple-100">
                                        <Shield className="w-4 h-4 text-purple-600" />
                                        <span className="text-sm font-medium text-purple-700">{adminUser?.username}</span>
                                    </div>
                                    <button
                                        onClick={handleAdminLogout}
                                        className="flex items-center px-3 py-2 rounded-full text-xs font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                                        title="Logout Admin"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Login Links */}
                            {!isUserAuthenticated() && !isAdminAuthenticated() && (
                                <>
                                    <NavLink
                                        to='/login'
                                        className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${isActive
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                            }`}
                                    >
                                        Login
                                    </NavLink>
                                    {/* <NavLink
                                        to='/admin/login'
                                        className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${isActive
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                            : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                                            }`}
                                    >
                                        Admin
                                    </NavLink> */}
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen
                    ? 'max-h-64 opacity-100 visible'
                    : 'max-h-0 opacity-0 invisible overflow-hidden'
                    }`}
            >
                <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 border-t border-gray-200">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActive
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-sm'
                            }`}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={({ isActive }) => `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActive
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-sm'
                            }`}
                    >
                        About
                    </NavLink>

                    {/* User Routes */}
                    {isUserAuthenticated() && (
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) => `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActive
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105'
                                : 'text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-sm'
                                }`}
                        >
                            Dashboard
                        </NavLink>
                    )}

                    {/* Admin Routes */}
                    {isAdminAuthenticated() && (
                        <>
                            <NavLink
                                to="/admin/dashboard"
                                className={({ isActive }) => `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md transform scale-105'
                                    : 'text-gray-700 hover:text-purple-600 hover:bg-white hover:shadow-sm'
                                    }`}
                            >
                                Admin Dashboard
                            </NavLink>
                            <NavLink
                                to="/admin/person"
                                className={({ isActive }) => `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md transform scale-105'
                                    : 'text-gray-700 hover:text-purple-600 hover:bg-white hover:shadow-sm'
                                    }`}
                            >
                                Person
                            </NavLink>
                        </>
                    )}

                    {/* User Session */}
                    {isUserAuthenticated() && (
                        <div className="px-4 py-3 border-t border-gray-200 mt-2">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700">{user?.username}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleUserLogout}
                                className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout User
                            </button>
                        </div>
                    )}

                    {/* Admin Session */}
                    {isAdminAuthenticated() && (
                        <div className="px-4 py-3 border-t border-gray-200 mt-2">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <Shield className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-medium text-purple-700">{adminUser?.username}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleAdminLogout}
                                className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout Admin
                            </button>
                        </div>
                    )}

                    {/* Login Links */}
                    {!isUserAuthenticated() && !isAdminAuthenticated() && (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) => `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-sm'
                                    }`}
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/admin/login"
                                className={({ isActive }) => `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md transform scale-105'
                                    : 'text-gray-700 hover:text-purple-600 hover:bg-white hover:shadow-sm'
                                    }`}
                            >
                                Admin Login
                            </NavLink>
                        </>
                    )}
                </div>
            </div>

            {/* Decorative gradient line */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        </header>
    );
};

export default Navbar;
