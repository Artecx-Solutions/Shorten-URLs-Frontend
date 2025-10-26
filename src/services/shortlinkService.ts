import { apiService } from './apiService';

export interface CreateLinkRequest {
  originalUrl: string;
  customAlias?: string;
  description?: string;
  password?: string;
  expiryDate?: string;
}

export interface ShortLinkResponse {
  data: any;
  shortUrl: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ShortLink {
  _id: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  clicks: number;
  createdBy: string;
  expiresAt: string;
  isActive: boolean;
  description?: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MyLinksResponse {
  success: boolean;
  links: ShortLink[];
  pagination: PaginationInfo;
}


class LinkService {
  private baseEndpoint = '/links';

  async createLink(linkData: CreateLinkRequest): Promise<ShortLinkResponse> {
    const response = await apiService.post<ShortLinkResponse>(this.baseEndpoint, linkData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create link');
  }

  async getLinks(): Promise<ShortLinkResponse[]> {
    const response = await apiService.get<ShortLinkResponse[]>(this.baseEndpoint);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch links');
  }

  async getLink(shortCode: string): Promise<ShortLinkResponse> {
    const response = await apiService.get<ShortLinkResponse>(`${this.baseEndpoint}/${shortCode}/info`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch link');
  }

  async getMyLinks(page: number = 1, limit: number = 10): Promise<MyLinksResponse> {
    const response = await apiService.get<MyLinksResponse>(
      `${this.baseEndpoint}/my?page=${page}&limit=${limit}`
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch links');
  }

    async deleteLink(shortCode: string): Promise<void> {
    const response = await apiService.delete(`${this.baseEndpoint}/${shortCode}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete link');
    }
  }

  // Public link access (no authentication required)
  async getLinkAnalytics(shortCode: string): Promise<any> {
    const response = await apiService.get<any>(`/analytics/${shortCode}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch analytics');
  }
}

export const linkService = new LinkService();