
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

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetUsersResponse {
  users: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TopUser {
  id: string;
  name: string;
  email: string;
  totalShortUrls: number;
  totalClicks: number;
  avatar?: string;
}

export interface User {
  _id: string;
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalLinks?: number;
  linkCount?: number;
  totalClicks?: number;
  lastActive?: string;
}


export interface TopUser {
  id: string;
  _id: string;
  name: string;
  fullName: string;
  email: string;
  totalShortUrls: number;
  totalLinks: number;
  totalClicks: number;
  avatar?: string;
}

export interface TopUsersResponse {
  users: TopUser[];
  success: boolean;
}

// For dashboard statistics
export interface DashboardStats {
  totalUsers: number;
  totalLinks: number;
  totalClicks: number;
  activeUsers: number;
  avgClickRate?: number;
}