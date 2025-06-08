import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log(`API URL: ${API_URL}`); 

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add these functions or update existing ones
export const setActiveProduct = (productId) => api.post(`/products/${productId}/set-active`);
export const login = (credentials) => api.post('/auth/login', credentials);
export const getAllProducts = () => api.get('/products');
export const getActiveProduct = () => api.get('/products/active');
export const createProduct = (data) => api.post('/products', data);

// Update this function to use the correct endpoint 
export const getAdminBids = (page = 1, limit = 10, productId = null) => {
    let url = `/bids/admin?page=${page}&limit=${limit}`;
    if (productId) url += `&product_id=${productId}`;
    return api.get(url);
};

// Regular bids for a product
export const getBids = (productId) => api.get(`/bids/${productId}`);
export const placeBid = (data) => api.post('/bids', data);


export default api;