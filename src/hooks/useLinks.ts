import { useState, useEffect } from 'react';
import { urlService } from '../services/urlService';
import { ILink, LinksResponse } from '../types/url';

interface UseUserLinksReturn {
  links: ILink[];
  loading: boolean;
  error: string;
  currentPage: number;
  totalPages: number;
  totalLinks: number;
  fetchUserLinks: (page?: number) => Promise<void>;
  setCurrentPage: (page: number) => void;
}

export const useUserLinks = (): UseUserLinksReturn => {
  const [links, setLinks] = useState<ILink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLinks, setTotalLinks] = useState(0);

  const fetchUserLinks = async (page: number = 1) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Fetching user links for page:', page);
      
      const response: LinksResponse = await urlService.getUserLinks(page, 10);
      
      console.log('📥 User links response:', response);

      if (response.success) {
        setLinks(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalLinks(response.pagination.totalLinks);
      } else {
        setError(response.message || 'Failed to fetch links');
        setLinks([]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching user links:', err);
      setError(err.message || 'Failed to load your links');
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLinks(currentPage);
  }, [currentPage]);

  return {
    links,
    loading,
    error,
    currentPage,
    totalPages,
    totalLinks,
    fetchUserLinks,
    setCurrentPage,
  };
};