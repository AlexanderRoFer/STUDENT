import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // asume backend en mismo host; ajustar a http://localhost:5000 si corren por separado
  headers: { 'Content-Type': 'application/json' }
});

export function setAuthToken(token) {
  try {
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete api.defaults.headers.common['Authorization'];
  } catch (err) {
    // noop in non-browser env
  }
}

// Si ya hay token en localStorage, inyectarlo
try {
  const token = localStorage.getItem('token');
  if (token) setAuthToken(token);
} catch (err) {
  // no-op
}

export default api;
