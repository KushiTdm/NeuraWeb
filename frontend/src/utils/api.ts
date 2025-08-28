import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      // Redirect to admin login if needed
      if (window.location.pathname.startsWith('/admin')) {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

// Wizard API functions
export const wizardApi = {
  saveStep: (step: number, data: any, isDraft = true) =>
    api.post('/wizard/save', { step, data, isDraft }),
  
  submitWizard: () =>
    api.post('/wizard/submit'),
  
  getResponses: (clientId?: string) =>
    api.get(`/wizard${clientId ? `/${clientId}` : ''}`),
};

// Client API functions
export const clientApi = {
  register: (name: string, email: string, password: string) =>
    api.post('/client/register', { name, email, password }),
  
  login: (email: string, password: string) =>
    api.post('/client/login', { email, password }),
};

export default api;