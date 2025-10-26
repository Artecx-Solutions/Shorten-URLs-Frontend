// services/adminService.ts
import { apiService } from './apiService';
import { UsersResponse, User, PaginationInfo } from '../types/admin';

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
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User> {
    const response = await apiService.get<{ success: boolean; user: User }>(`${this.baseEndpoint}/users/${userId}`);
    
    if (response.success && response.data) {
      return response.data.user;
    }
    
    throw new Error(response.message || 'Failed to fetch user');
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: 'admin' | 'user'): Promise<User> {
    const response = await apiService.put<{ success: boolean; user: User }>(
      `${this.baseEndpoint}/users/${userId}/role`,
      { role }
    );
    
    if (response.success && response.data) {
      return response.data.user;
    }
    
    throw new Error(response.message || 'Failed to update user role');
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

  /**
   * Search users
   */
  async searchUsers(query: string, page: number = 1, limit: number = 20): Promise<UsersResponse> {
    return this.getUsers(page, limit, query);
  }
}

export const adminService = new AdminService();