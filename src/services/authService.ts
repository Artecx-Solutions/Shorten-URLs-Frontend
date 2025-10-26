// authService.ts
import { apiService } from './apiService';
import { SignUpRequest, LoginRequest, AuthResponse } from '../types/auth';

class AuthService {
  async signUp(userData: SignUpRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/signup', userData);
    
    if (response.success && response.data) {
      this.saveAuthData(response.data);
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to sign up');
  }

  async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', loginData);
      
      if (response.success && response.data) {
        this.saveAuthData(response.data);
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to login');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unexpected error occurred during login');
    }
  }

  saveAuthData(data: AuthResponse): void {
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Also set a flag to indicate user is logged in
      localStorage.setItem('isLoggedIn', 'true');
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getStoredUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    apiService.clearAuth();
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }
}

export const authService = new AuthService();