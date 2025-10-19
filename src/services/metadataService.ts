// services/metadataService.ts
import { PageMetadata } from '../types/api';
import  config  from '../config/environment';

const API_URL = config.apiUrl

export interface MetadataResponse {
  success: boolean;
  metadata: PageMetadata;
  message?: string;
}

export const metadataService = {
  /**
   * Fetch page metadata from a URL using the backend API
   */
  async fetchPageMetadata(url: string): Promise<PageMetadata> {
    try {
      console.log('🔍 Fetching metadata for:', url);

      const response = await fetch(`${API_URL}/metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MetadataResponse = await response.json();
      
      if (data.success) {
        console.log('✅ Metadata received:', {
          title: data.metadata.title?.substring(0, 50) + '...',
          description: data.metadata.description?.substring(0, 50) + '...',
          hasImage: !!data.metadata.image
        });
        return data.metadata;
      } else {
        throw new Error(data.message || 'Failed to fetch metadata');
      }
    } catch (error) {
      console.error('❌ Metadata fetch error:', error);
      // Return fallback metadata
      return this.getFallbackMetadata(url);
    }
  },

  /**
   * Get fallback metadata when API fails
   */
  getFallbackMetadata(url: string): PageMetadata {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    
    return {
      title: domain,
      description: `Redirecting to ${domain}`,
      image: '',
      keywords: '',
      siteName: domain,
      url: url
    };
  },

  /**
   * Extract domain from URL for display
   */
  extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  },

  /**
   * Check if metadata is rich (has proper title and description)
   */
  isRichMetadata(metadata: PageMetadata): boolean {
    return !!(metadata.title && 
              metadata.title !== 'No title available' && 
              metadata.description && 
              metadata.description !== 'No description available');
  },

  /**
   * Truncate text for display
   */
  truncateText(text: string, maxLength: number = 120): string {
    if (!text || text === 'No title available' || text === 'No description available') {
      return '';
    }
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
};