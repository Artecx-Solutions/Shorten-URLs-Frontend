// src/services/urlService.ts
import { CreateUrlRequest, CreateUrlResponse, UrlInfo } from '../types/url';
import config from '../config/environment';
import { ILink, LinksResponse } from '../types/url';

const API_URL = config.apiUrl

export const urlService = {

  async createShortUrl(data: CreateUrlRequest): Promise<CreateUrlResponse> {
    const token = localStorage.getItem('token');
    
    console.log('📤 Sending request to:', `${API_URL}/links/shorten`);
    console.log('📦 Request data:', data);
    console.log('🔐 Auth token present:', !!token);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if user is authenticated
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_URL}/links/shorten`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      const result = await response.json();
      console.log('📥 Response data:', result);

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return result;
      
    } catch (error: any) {
      console.error('❌ Fetch error:', error);
      throw new Error(`Failed to shorten URL: ${error.message}`);
    }
  },
  
  async getUrlInfo(shortCode: string): Promise<{ success: boolean; data?: UrlInfo; message?: string }> {
    const response = await fetch(`${config.apiUrl}/url/${shortCode}`);
    return await response.json();
  },
  
  async redirectToUrl(shortCode: string, password?: string): Promise<Response> {
    return await fetch(`${config.apiUrl}/url/${shortCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
  },


  // Get user's links
  getUserLinks: async (page: number = 1, limit: number = 10): Promise<LinksResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL}/links/my-links?page=${page}&limit=${limit}`,
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

  // Get link analytics
  getLinkAnalytics: async (shortCode: string): Promise<{ success: boolean; data: ILink }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL}/links/analytics/${shortCode}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch link analytics');
    }

    return response.json();
  },

  // Delete a link
  deleteLink: async (shortCode: string): Promise<{ success: boolean; message: string }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL}/links/${shortCode}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete link');
    }

    return response.json();
  },

  


};