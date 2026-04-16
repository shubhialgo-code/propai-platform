import axios from 'axios';

const API_BASE_URL = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL 
  : process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const propertyService = {
  getAll: async (params: Record<string, string | number> = {}) => {
    const response = await api.get('/properties', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },
  create: async (data: Record<string, unknown>) => {
    const response = await api.post('/properties', data);
    return response.data;
  },
  update: async (id: string, data: Record<string, unknown>) => {
    const response = await api.put(`/properties/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },
};

export const aiService = {
  query: async (query: string) => {
    const response = await api.post('/ai-query', { query });
    return response.data.response;
  },
};

export const favoriteService = {
  save: async (userId: string, propertyId: string) => {
    const response = await api.post('/favorites', { userId, propertyId });
    return response.data;
  },
  getByUser: async (userId: string) => {
    const response = await api.get('/favorites', { params: { userId } });
    return response.data;
  },
};

export default api;
