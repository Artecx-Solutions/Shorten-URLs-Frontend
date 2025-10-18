// types/url.ts
export interface CreateUrlRequest {
  originalUrl: string;
  customCode?: string;
  password?: string;
  expiry?: string;
  description?: string;
}

export interface CreateUrlResponse {
  success: boolean;
  data?: {
    shortUrl: string;
    customCode?: string;
    expiresAt?: string;
    description?: string;
  };
  message?: string;
}

export interface UrlInfo {
  originalUrl: string;
  shortCode: string;
  customCode?: string;
  expiresAt?: string;
  description?: string;
  clicks: number;
  createdAt: string;
}