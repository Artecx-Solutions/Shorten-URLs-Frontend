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
  message: string;
  data: {
    originalUrl: string;
    shortUrl: string;
    shortCode: string;
    createdAt: string;
    expiresAt: string;
    createdBy: string | { _id: string; name: string; email: string }; // User ID or user object
    title?: string;
    description?: string;
  };
}


export interface UrlInfo {
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
    description?: string;
  createdBy: string | { _id: string; name: string; email: string };
}

/////////////////////
export interface ILink {
  _id: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  clicks: number;
  createdAt: string;
  createdBy: string | { _id: string; name: string; email: string };
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