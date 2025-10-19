export interface CreateLinkRequest {
  originalUrl: string;
  customAlias?: string;
}

export interface CreateLinkResponse {
  success: boolean;
  message: string;
  data: {
    originalUrl: string;
    shortUrl: string;
    shortCode: string;
    createdAt: string;
    expiresAt: string;
    // Add clicks if your backend includes it
    clicks?: number;
  };
}

export interface LinkAnalytics {
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
  isActive: boolean;
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

export interface PageMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

export interface LinkAnalytics {
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
  isActive: boolean;
  metadata?: PageMetadata; // Add metadata field
}

// Union type for create link response
export type CreateLinkResponseType = CreateLinkResponse | ApiError;