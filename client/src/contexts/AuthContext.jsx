import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Separate admin and user sessions
    const [adminUser, setAdminUser] = useState(null);
    const [adminToken, setAdminToken] = useState(null);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored tokens on mount
        const storedAdminToken = localStorage.getItem('adminToken');
        const storedAdminUser = localStorage.getItem('adminUser');
        const storedToken = localStorage.getItem('userToken');
        const storedUser = localStorage.getItem('user');

        if (storedAdminToken && storedAdminUser) {
            setAdminToken(storedAdminToken);
            setAdminUser(JSON.parse(storedAdminUser));
            validateToken(storedAdminToken, 'admin');
        }

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            validateToken(storedToken, 'user');
        }

        if (!storedAdminToken && !storedToken) {
            setLoading(false);
        }
    }, []);

    const validateToken = async (tokenToValidate, type) => {
        try {
            const isValid = await authService.validateToken(tokenToValidate);
            if (!isValid) {
                if (type === 'admin') {
                    logoutAdmin();
                } else {
                    logoutUser();
                }
            }
        } catch (error) {
            if (type === 'admin') {
                logoutAdmin();
            } else {
                logoutUser();
            }
        } finally {
            // Only set loading to false if both validations are done or no tokens exist
            const hasAdminToken = localStorage.getItem('adminToken');
            const hasUserToken = localStorage.getItem('userToken');
            
            if (!hasAdminToken && !hasUserToken) {
                setLoading(false);
            } else if (type === 'admin' && !hasUserToken) {
                setLoading(false);
            } else if (type === 'user' && !hasAdminToken) {
                setLoading(false);
            }
        }
    };

    const login = async (usernameOrEmail, password, role = 'user') => {
        try {
            const response = await authService.login(usernameOrEmail, password);
            const { token: newToken, user: userData } = response;
            
            // Check if user has the required role
            if (role === 'admin' && userData.role !== 'Admin') {
                return { success: false, error: 'Access denied. Admin privileges required.' };
            }
            if (role === 'user' && userData.role === 'Admin') {
                return { success: false, error: 'Please use admin login for admin accounts.' };
            }
            
            if (userData.role === 'Admin') {
                setAdminToken(newToken);
                setAdminUser(userData);
                localStorage.setItem('adminToken', newToken);
                localStorage.setItem('adminUser', JSON.stringify(userData));
            } else {
                setToken(newToken);
                setUser(userData);
                localStorage.setItem('userToken', newToken);
                localStorage.setItem('user', JSON.stringify(userData));
            }
            
            return { success: true, user: userData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (username, email, password, confirmPassword) => {
        try {
            const response = await authService.register(username, email, password, confirmPassword);
            const { token: newToken, user: userData } = response;
            
            // Registration always creates a User role, not Admin
            setToken(newToken);
            setUser(userData);
            localStorage.setItem('userToken', newToken);
            localStorage.setItem('user', JSON.stringify(userData));
            
            return { success: true, user: userData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logoutAdmin = () => {
        setAdminToken(null);
        setAdminUser(null);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
    };

    const logoutUser = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
    };

    const logout = (type = 'all') => {
        if (type === 'admin') {
            logoutAdmin();
        } else if (type === 'user') {
            logoutUser();
        } else {
            logoutAdmin();
            logoutUser();
        }
    };

    const isAdmin = () => {
        return adminUser?.role === 'Admin';
    };

    const isUserAuthenticated = () => {
        return !!token && !!user;
    };

    const isAdminAuthenticated = () => {
        return !!adminToken && !!adminUser && adminUser.role === 'Admin';
    };

    const isAuthenticated = () => {
        return isUserAuthenticated() || isAdminAuthenticated();
    };

    // Get the appropriate token based on route/context
    const getToken = (forAdmin = false) => {
        if (forAdmin) {
            return adminToken;
        }
        return token;
    };

    const value = {
        // User session
        user,
        token,
        // Admin session
        adminUser,
        adminToken,
        // Common
        loading,
        login,
        register,
        logout,
        logoutAdmin,
        logoutUser,
        isAdmin,
        isUserAuthenticated,
        isAdminAuthenticated,
        isAuthenticated,
        getToken
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
