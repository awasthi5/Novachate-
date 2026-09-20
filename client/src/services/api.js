import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const users = {
  getUsers: () => api.get('/users'),
  searchUsers: (query) => api.get(`/users/search?q=${query}`),
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  updateAvatar: (data) => api.put('/users/avatar', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const conversations = {
  getConversations: () => api.get('/conversations'),
  createConversation: (userId) => api.post('/conversations', { userId }),
  getConversationById: (id) => api.get(`/conversations/${id}`),
  deleteConversation: (id) => api.delete(`/conversations/${id}`),
};

export const messages = {
  getMessages: (conversationId, page = 1, limit = 50) => 
    api.get(`/messages/${conversationId}?page=${page}&limit=${limit}`),
  sendMessage: (data) => {
    if (data instanceof FormData) {
      return api.post('/messages', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post('/messages', data);
  },
  editMessage: (id, text) => api.put(`/messages/${id}`, { text }),
  deleteMessage: (id) => api.delete(`/messages/${id}`),
};

export default api;
