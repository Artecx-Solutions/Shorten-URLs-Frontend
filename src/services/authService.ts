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
    const response = await apiService.post<AuthResponse>('/auth/login', loginData);
    
    if (response.success && response.data) {
      this.saveAuthData(response.data);
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to login');
  }

  saveAuthData(data: AuthResponse): void {
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    apiService.clearAuth();
  }

  isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  }
}

export const authService = new AuthService();