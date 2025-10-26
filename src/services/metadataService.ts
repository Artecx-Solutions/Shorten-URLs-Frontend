// services/metadataService.ts
import { apiService } from './apiService';

export interface MetadataResponse {
  success: boolean;
  metadata: {
    title: string;
    description: string;
    image: string;
    keywords: string;
    siteName: string;
    url: string;
  };
}

class MetadataService {
  async getMetadata(url: string): Promise<MetadataResponse> {
    const response = await apiService.post<MetadataResponse>('/metadata', { url });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch metadata');
  }
}

export const metadataService = new MetadataService();