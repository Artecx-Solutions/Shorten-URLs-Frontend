const BASE_URL = import.meta.env.VITE_API_URL;

// Create an event emitter for session errors
class SessionErrorEmitter {
  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit() {
    this.listeners.forEach(listener => listener());
  }
}

export const sessionErrorEmitter = new SessionErrorEmitter();

export class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; message?: string }> {
    const url = `${BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      });

      // Handle unauthorized responses (token expired)
      if (response.status === 401) {
        // Clear invalid token
        this.clearAuth();
        // Emit session error event
        sessionErrorEmitter.emit();
        window.location.reload();
        return {
          success: false,
          message: 'Session expired. Please login again.'
        };
      }

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          success: false,
          message: responseData.message || `Request failed with status: ${response.status}`
        };
      }

      return {
        success: true,
        data: responseData
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }

  async post<T>(endpoint: string, data: any): Promise<{ success: boolean; data?: T; message?: string }> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async get<T>(endpoint: string): Promise<{ success: boolean; data?: T; message?: string }> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
    });
  }

  async put<T>(endpoint: string, data: any): Promise<{ success: boolean; data?: T; message?: string }> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<{ success: boolean; data?: T; message?: string }> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string): Promise<{ success: boolean; message?: string }> {
    return this.makeRequest(endpoint, {
      method: 'DELETE',
    });
  }

  // Method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Method to clear authentication data
  clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
}

export const apiService = new ApiService();