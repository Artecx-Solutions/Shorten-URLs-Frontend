// types/admin.ts
export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'user';
  tokenVersion: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  pagination: PaginationInfo;
}


export interface AdminLink {
  _id: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  clicks: number;
  createdBy: User | null;
  expiresAt: string;
  isActive: boolean;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AdminLinksResponse {
  success: boolean;
  links: AdminLink[];
  pagination: PaginationInfo;
}

export interface LinkStats {
  totalLinks: number;
  activeLinks: number;
  totalClicks: number;
  averageClicks: number;
}