export interface CreateLinkRequest {
  originalUrl: string;
  customAlias?: string;
}

export interface CreateLinkResponse {
  shortUrl: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  message?: string; // Add optional message for existing links
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