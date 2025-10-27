// services/adminService.ts
import { apiService } from './apiService';
import { UsersResponse } from '../types/admin';

class AdminService {
  private baseEndpoint = '/admin';

  /**
   * Get all users with pagination
   */
  async getUsers(page: number = 1, limit: number = 20, search?: string): Promise<UsersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });

    const response = await apiService.get<UsersResponse>(`${this.baseEndpoint}/users?${params}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch users');
  }


  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiService.delete<{ success: boolean; message: string }>(
      `${this.baseEndpoint}/users/${userId}`
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to delete user');
  }

}

export const adminService = new AdminService();