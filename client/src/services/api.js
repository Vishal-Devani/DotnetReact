import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor (for adding auth tokens)
api.interceptors.request.use(
    (config) => {
        // Check if this is an admin route
        const isAdminRoute = config.url?.startsWith('/admin') || window.location.pathname.startsWith('/admin');
        
        // Get appropriate token based on route
        const token = isAdminRoute 
            ? localStorage.getItem('adminToken')
            : localStorage.getItem('userToken');
            
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        // Handle the new ApiResponse wrapper
        if (response.data && typeof response.data === 'object' && 'success' in response.data) {
            if (response.data.success) {
                return response.data.data !== undefined ? response.data.data : response.data;
            } else {
                // API returned an error response
                const errorMessage = response.data.message || 'An error occurred';
                const errors = response.data.errors || [errorMessage];
                toast.error(errorMessage);
                return Promise.reject(new Error(errorMessage));
            }
        }
        // Fallback for non-wrapped responses
        return response.data;
    },
    (error) => {
        // Handle HTTP errors
        let errorMessage = 'An error occurred';
        
        if (error.response) {
            // Server responded with error status
            const data = error.response.data;
            if (data && typeof data === 'object') {
                if (data.message) {
                    errorMessage = data.message;
                } else if (data.errors && Array.isArray(data.errors)) {
                    errorMessage = data.errors.join(', ');
                } else if (typeof data === 'string') {
                    errorMessage = data;
                }
            } else {
                errorMessage = error.response.statusText || `Error ${error.response.status}`;
            }
        } else if (error.request) {
            // Request made but no response received
            errorMessage = 'Network error. Please check your connection.';
        } else {
            // Something else happened
            errorMessage = error.message || 'An unexpected error occurred';
        }
        
        toast.error(errorMessage);
        return Promise.reject(new Error(errorMessage));
    }
);

// Person service
export const personService = {
    getAll: async () => {
        const response = await api.get('/people');
        return response;
    },
    
    getById: async (id) => {
        const response = await api.get(`/people/${id}`);
        return response;
    },
    
    create: async (data) => {
        const response = await api.post('/people', data);
        return response;
    },
    
    update: async (id, data) => {
        const response = await api.put(`/people/${id}`, data);
        return response;
    },
    
    delete: async (id) => {
        await api.delete(`/people/${id}`);
    }
};

export default api;
