import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const propertyService = {
  getAll: async (params = {}) => {
    const response = await api.get('/properties', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/properties', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
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

export default api;
