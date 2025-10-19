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

/////////////////////
export interface ILink {
  _id: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  clicks: number;
  createdAt: string;
  createdBy: string;
  expiresAt: string;
  isActive: boolean;
  title?: string;
  description?: string;
}

export interface LinksResponse {
  success: boolean;
  data: ILink[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalLinks: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}