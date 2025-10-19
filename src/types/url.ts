// src/types/url.ts
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
  __v?: number;
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