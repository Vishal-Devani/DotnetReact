import api from './api';

export const authService = {
    login: async (usernameOrEmail, password) => {
        const response = await api.post('/auth/login', {
            usernameOrEmail,
            password
        });
        return response;
    },

    register: async (username, email, password, confirmPassword) => {
        const response = await api.post('/auth/register', {
            username,
            email,
            password,
            confirmPassword
        });
        return response;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response;
    },

    validateToken: async (token) => {
        try {
            await api.post('/auth/validate', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return true;
        } catch {
            return false;
        }
    },

    getAllUsers: async () => {
        const response = await api.get('/auth/users');
        return response;
    },

    updateUserStatus: async (userId, isActive) => {
        const response = await api.patch(`/auth/users/${userId}/status`, isActive, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    }
};
