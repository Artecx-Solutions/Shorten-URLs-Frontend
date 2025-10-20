export interface CreateLinkRequest {
  originalUrl: string;
  customAlias?: string;
}

export interface CreateLinkResponse {
  success: boolean;
  message?: string;
  data?: {
    originalUrl: string;
    shortUrl: string;
    shortCode: string;
    createdAt: string;
    expiresAt: string;
    clicks: number;
  };
}

export interface ApiError {
  error: string;
  details?: Array<{
    code: string;
    validation: string;
    message: string;
    path: string[];
  }>;
  existingLinks?: Array<{
    shortUrl: string;
    shortCode: string;
    customAlias?: string;
    clicks: number;
  }>;
}

export interface LinkAnalytics {
  success: boolean;
  data: {
    originalUrl: string;
    shortCode: string;
    clicks: number;
    createdAt: string;
    expiresAt: string;
    isActive: boolean;
    title?: string;
    description?: string;
  };
  originalUrl: string;
}

export interface PageMetadata {
  title: string;
  description: string;
  image: string;
  keywords: string;
  siteName: string;
  url: string;
}

export interface MetadataResponse {
  success: boolean;
  metadata: PageMetadata;
  message?: string;
}

// Union type for create link response
export type CreateLinkResponseType = CreateLinkResponse | ApiError;