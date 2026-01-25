import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const UserLogin = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { login, register, isUserAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated as user
    if (isUserAuthenticated()) {
        navigate('/dashboard');
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Real-time validation for email field
        if (name === 'email' && !isLogin && value.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setErrors({
                    ...errors,
                    email: 'Please enter a valid email address'
                });
            } else {
                // Clear email error if valid
                const newErrors = { ...errors };
                delete newErrors.email;
                setErrors(newErrors);
            }
        } else {
            // Clear error when user starts typing other fields
            if (errors[name]) {
                setErrors({
                    ...errors,
                    [name]: ''
                });
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (isLogin) {
            // Login validation
            const usernameOrEmail = formData.username || formData.email;
            if (!usernameOrEmail || usernameOrEmail.trim() === '') {
                newErrors.username = 'Username or email is required';
            }
            if (!formData.password || formData.password.trim() === '') {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }
        } else {
            // Registration validation
            if (!formData.username || formData.username.trim() === '') {
                newErrors.username = 'Username is required';
            } else if (formData.username.length < 3) {
                newErrors.username = 'Username must be at least 3 characters';
            } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
                newErrors.username = 'Username can only contain letters, numbers, and underscores';
            }

            // Email validation - check if empty first, then format
            if (!formData.email || formData.email.trim() === '') {
                newErrors.email = 'Email is required';
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email.trim())) {
                    newErrors.email = 'Please enter a valid email address';
                }
            }

            if (!formData.password || formData.password.trim() === '') {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            } else if (formData.password.length > 100) {
                newErrors.password = 'Password cannot exceed 100 characters';
            }

            if (!formData.confirmPassword || formData.confirmPassword.trim() === '') {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
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

        const usernameOrEmail = formData.username || formData.email;
        const result = await login(usernameOrEmail, formData.password, 'user');

        if (result.success) {
            toast.success('Login successful!');
            navigate('/dashboard');
        } else {
            toast.error(result.error || 'Login failed');
        }

        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        const result = await register(
            formData.username,
            formData.email,
            formData.password,
            formData.confirmPassword
        );

        if (result.success) {
            toast.success('Registration successful!');
            navigate('/dashboard');
        } else {
            toast.error(result.error || 'Registration failed');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="mt-2 text-gray-600">
                        {isLogin ? 'Sign in to your account' : 'Register for a new account'}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                        errors.username ? 'text-red-400' : 'text-gray-400'
                                    }`} />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                            errors.username
                                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                        placeholder="Enter username (min 3 characters)"
                                        aria-invalid={errors.username ? "true" : "false"}
                                    />
                                </div>
                                {errors.username && (
                                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{errors.username}</span>
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label htmlFor={isLogin ? 'username' : 'email'} className="block text-sm font-medium text-gray-700 mb-2">
                                {isLogin ? 'Username or Email' : 'Email'} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                    (isLogin && errors.username) || (!isLogin && errors.email) ? 'text-red-400' : 'text-gray-400'
                                }`} />
                                <input
                                    id={isLogin ? 'username' : 'email'}
                                    type={isLogin ? 'text' : 'email'}
                                    name={isLogin ? 'username' : 'email'}
                                    value={isLogin ? formData.username : formData.email}
                                    onChange={handleChange}
                                    onBlur={(e) => {
                                        // Validate email on blur if in registration mode
                                        if (!isLogin && e.target.name === 'email') {
                                            const emailValue = e.target.value.trim();
                                            if (emailValue === '') {
                                                setErrors({
                                                    ...errors,
                                                    email: 'Email is required'
                                                });
                                            } else {
                                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                                if (!emailRegex.test(emailValue)) {
                                                    setErrors({
                                                        ...errors,
                                                        email: 'Please enter a valid email address'
                                                    });
                                                } else {
                                                    // Clear email error if valid
                                                    const newErrors = { ...errors };
                                                    delete newErrors.email;
                                                    setErrors(newErrors);
                                                }
                                            }
                                        }
                                    }}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                        (isLogin && errors.username) || (!isLogin && errors.email)
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                    placeholder={isLogin ? 'Enter username or email' : 'Enter your email address (e.g., user@example.com)'}
                                    aria-invalid={((isLogin && errors.username) || (!isLogin && errors.email)) ? "true" : "false"}
                                    aria-describedby={((isLogin && errors.username) || (!isLogin && errors.email)) ? `${isLogin ? 'username' : 'email'}-error` : undefined}
                                />
                            </div>
                            {isLogin && errors.username && (
                                <p id="username-error" className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{errors.username}</span>
                                </p>
                            )}
                            {!isLogin && errors.email && (
                                <p id="email-error" className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{errors.email}</span>
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
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                    placeholder={isLogin ? 'Enter password' : 'Enter password (min 6 characters)'}
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

                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                        errors.confirmPassword ? 'text-red-400' : 'text-gray-400'
                                    }`} />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                                            errors.confirmPassword
                                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                        placeholder="Re-enter your password"
                                        aria-invalid={errors.confirmPassword ? "true" : "false"}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{errors.confirmPassword}</span>
                                    </p>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    {isLogin ? (
                                        <>
                                            <LogIn className="w-5 h-5 mr-2" />
                                            Sign In
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5 mr-2" />
                                            Register
                                        </>
                                    )}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center space-y-2">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setFormData({
                                    username: '',
                                    email: '',
                                    password: '',
                                    confirmPassword: ''
                                });
                                setErrors({});
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            {isLogin
                                ? "Don't have an account? Register"
                                : 'Already have an account? Sign In'}
                        </button>
                        <div className="text-sm text-gray-600">
                            Admin?{' '}
                            <Link to="/admin/login" className="text-purple-600 hover:text-purple-800 font-medium">
                                Admin Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
