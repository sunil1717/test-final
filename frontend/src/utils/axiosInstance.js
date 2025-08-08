import axios from 'axios';

const instance = axios.create({
  baseURL:import.meta.env.VITE_BACKEND_URL, // fallback for dev
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // change to true if you use cookies for auth
});

// Optional: Interceptors (for auto-adding token)
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default instance;
