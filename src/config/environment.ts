// src/config/environment.ts
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  baseUrl: import.meta.env.VITE_BASE_URL || 'http://localhost:3001',
};

export default config;