export interface ApiConfig {
  baseUrl: string;
  accessToken: string | null;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  noAuth?: boolean;
}

class ApiConfigService {
  private config: ApiConfig;

  constructor() {
    this.config = {
      baseUrl: import.meta.env.VITE_API_URL,
      accessToken: localStorage.getItem('accessToken') || null
    };
  }

  setAccessToken(token: string): void {
    this.config.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  removeAccessToken(): void {
    this.config.accessToken = null;
    localStorage.removeItem('accessToken');
  }

  setBaseUrl(url: string): void {
    this.config.baseUrl = url;
  }

  getBaseUrl(): string {
    return this.config.baseUrl;
  }

  getHeaders(options?: RequestOptions): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    if (!options?.noAuth && this.config.accessToken) {
      headers['Authorization'] = `Bearer ${this.config.accessToken}`;
    }

    return headers;
  }

  getFullUrl(endpoint: string): string {
    return `${this.config.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }
}

export const apiConfigService = new ApiConfigService();