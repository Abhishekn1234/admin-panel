import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;
    if (message === 'No token provided' || message === 'Invalid token') {
      localStorage.removeItem('token');
      window.location.href = '/login'; // force redirect
    }
    return Promise.reject(error);
  }
);

export default API;
