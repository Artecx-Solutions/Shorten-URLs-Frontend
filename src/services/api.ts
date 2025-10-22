import axios from 'axios';
import { 
  CreateLinkRequest, 
  CreateLinkResponse, 
  LinkAnalytics, 
  CreateLinkResponseType 
} from '../types/api';
import { metadataService } from './../services/metadataService';
import { LinksResponse } from '../types/url';

// Get API URL from environment variables with fallback
const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';
const BACKEND_BASE_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:5000';
 
console.log('Environment Configuration:', {
  API_URL: import.meta.env.VITE_API_URL,
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  NODE_ENV: import.meta.env.MODE
});

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    if (error.response) {
      // Server responded with error status
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({ error: 'Network error: Could not connect to server' });
    } else {
      // Something else happened
      return Promise.reject({ error: error.message });
    }
  }
);

export const linkService = {
  /**
   * Create a new short link
   */
  createShortLink: async (data: CreateLinkRequest): Promise<CreateLinkResponse> => {
    try {
      const response = await api.post<CreateLinkResponseType>('/links/shorten', data);
      return response.data as CreateLinkResponse;
    } catch (error: any) {
      console.error('Error creating short link:', error);
      throw error;
    }
  },

  /**
   * Get analytics for a short link
   */
  getAnalytics: async (shortCode: string): Promise<LinkAnalytics> => {
    try {
      const response = await api.get<LinkAnalytics>(`/links/analytics/${shortCode}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  /**
   * Get link info for delayed redirect
   */
  getLinkForDelay: async (shortCode: string): Promise<LinkAnalytics> => {
    try {
      const response = await api.get<LinkAnalytics>(`/links/delay/${shortCode}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching link for delay:', error);
      throw error;
    }
  },

  /**
   * Get the redirect URL for a short code
   */
  getRedirectUrl: (shortCode: string): string => {
    return `${BACKEND_BASE_URL}/${shortCode}`;
  },

    // Get user's links
  getUserLinks: async (page: number = 1, limit: number = 10): Promise<LinksResponse> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${BACKEND_BASE_URL}/my-links?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch links');
    }

    return response.json();
  },

  /**
   * Test backend connection
   */
  testConnection: async (): Promise<{ status: string; database: string; timestamp: string }> => {
    try {
      const response = await axios.get(`${BACKEND_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      throw error;
    }
  },

  /**
   * Get current API configuration
   */
  getConfig: () => ({
    apiBaseUrl: API_BASE_URL,
    backendBaseUrl: BACKEND_BASE_URL,
    isDevelopment: import.meta.env.MODE === 'development'
  })
};

export { metadataService };

// Export the api instance for direct use if needed
export { api };