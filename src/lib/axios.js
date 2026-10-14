import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  withCredentials: true,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ---------- Response Interceptor ---------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401 && typeof window !== 'undefined') {
      // Redirect to login only if we're inside a protected area
      const path = window.location.pathname;
      if (path.startsWith('/account') || path.startsWith('/dashboard')) {
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject({
      status,
      message,
      data: error.response?.data || null,
    });
  }
);

export default api;