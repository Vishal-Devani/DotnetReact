import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Shield, Mail, Lock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: ''
    });

    const { login, isAdminAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated as admin
    if (isAdminAuthenticated()) {
        navigate('/admin/dashboard');
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.usernameOrEmail || formData.usernameOrEmail.trim() === '') {
            newErrors.usernameOrEmail = 'Username or email is required';
        }

        if (!formData.password || formData.password.trim() === '') {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        const result = await login(formData.usernameOrEmail, formData.password, 'admin');

        if (result.success) {
            toast.success('Admin login successful!');
            navigate('/admin/dashboard');
        } else {
            toast.error(result.error || 'Admin login failed');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Admin Login
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Sign in to access the admin dashboard
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username or Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                    errors.usernameOrEmail ? 'text-red-400' : 'text-gray-400'
                                }`} />
                                <input
                                    type="text"
                                    name="usernameOrEmail"
                                    value={formData.usernameOrEmail}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                        errors.usernameOrEmail
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                                    }`}
                                    placeholder="Enter username or email"
                                    aria-invalid={errors.usernameOrEmail ? "true" : "false"}
                                />
                            </div>
                            {errors.usernameOrEmail && (
                                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{errors.usernameOrEmail}</span>
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                    errors.password ? 'text-red-400' : 'text-gray-400'
                                }`} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                        errors.password
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                                    }`}
                                    placeholder="Enter password (min 6 characters)"
                                    aria-invalid={errors.password ? "true" : "false"}
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{errors.password}</span>
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Admin Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Not an admin?{' '}
                            <a href="/login" className="text-purple-600 hover:text-purple-800 font-medium">
                                User Login
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
