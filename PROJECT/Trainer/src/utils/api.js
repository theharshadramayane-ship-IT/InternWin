import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

api.interceptors.request.use((config) => {
  const trainerRaw = localStorage.getItem('trainerUser');
  if (trainerRaw) {
    try {
      const trainer = JSON.parse(trainerRaw);
      if (trainer.token) {
        config.headers.Authorization = `Bearer ${trainer.token}`;
      }
    } catch {
      // ignore invalid storage
    }
  }
  return config;
});

export default api;
