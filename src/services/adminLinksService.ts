// services/adminLinksService.ts
import { apiService } from './apiService';
import { AdminLinksResponse, AdminLink, PaginationInfo, LinkStats } from '../types/admin';

class AdminLinksService {
  private baseEndpoint = '/admin';

  /**
   * Get all links with pagination and filters
   */
  async getLinks(
    page: number = 1, 
    limit: number = 20, 
    filters?: {
      search?: string;
      status?: 'active' | 'inactive' | 'expired';
      userId?: string;
      sortBy?: 'createdAt' | 'clicks' | 'expiresAt';
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<AdminLinksResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.userId && { userId: filters.userId }),
      ...(filters?.sortBy && { sortBy: filters.sortBy }),
      ...(filters?.sortOrder && { sortOrder: filters.sortOrder }),
    });

    const response = await apiService.get<AdminLinksResponse>(`${this.baseEndpoint}/links?${params}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch links');
  }

  /**
   * Get link by ID
   */
  async getLinkById(linkId: string): Promise<AdminLink> {
    const response = await apiService.get<{ success: boolean; link: AdminLink }>(
      `${this.baseEndpoint}/links/${linkId}`
    );
    
    if (response.success && response.data) {
      return response.data.link;
    }
    
    throw new Error(response.message || 'Failed to fetch link');
  }

  /**
   * Update link status (active/inactive)
   */
  async updateLinkStatus(linkId: string, isActive: boolean): Promise<AdminLink> {
    const response = await apiService.put<{ success: boolean; link: AdminLink }>(
      `${this.baseEndpoint}/links/${linkId}/status`,
      { isActive }
    );
    
    if (response.success && response.data) {
      return response.data.link;
    }
    
    throw new Error(response.message || 'Failed to update link status');
  }

  /**
   * Delete link
   */
  async deleteLink(linkId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiService.delete<{ success: boolean; message: string }>(
      `${this.baseEndpoint}/links/${linkId}`
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to delete link');
  }

  /**
   * Get link statistics
   */
  async getLinkStats(): Promise<LinkStats> {
    const response = await apiService.get<{ success: boolean; stats: LinkStats }>(
      `${this.baseEndpoint}/links/stats`
    );
    
    if (response.success && response.data) {
      return response.data.stats;
    }
    
    throw new Error(response.message || 'Failed to fetch link statistics');
  }

  /**
   * Search links with advanced filters
   */
  async searchLinks(
    query: string, 
    page: number = 1, 
    limit: number = 20,
    filters?: {
      status?: 'active' | 'inactive' | 'expired';
      userId?: string;
    }
  ): Promise<AdminLinksResponse> {
    return this.getLinks(page, limit, { ...filters, search: query });
  }

  /**
   * Get links by user ID
   */
  async getLinksByUser(userId: string, page: number = 1, limit: number = 20): Promise<AdminLinksResponse> {
    return this.getLinks(page, limit, { userId });
  }
}

export const adminLinksService = new AdminLinksService();