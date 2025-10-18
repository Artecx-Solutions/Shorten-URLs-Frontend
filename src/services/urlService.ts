// src/services/urlService.ts
import { CreateUrlRequest, CreateUrlResponse, UrlInfo } from '../types/url';
import config from '../config/environment';

export const urlService = {
  async createShortUrl(data: CreateUrlRequest): Promise<CreateUrlResponse> {
    const response = await fetch(`${config.apiUrl}/url/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    return await response.json();
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
  }
};