// components/UserLinks.tsx
import React, { useState, useEffect } from 'react';
import { Link2, Copy, Check, BarChart3, Trash2, Calendar, Eye, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { ILink, LinksResponse } from '../types/url';
import { urlService } from '../services/urlService';

export const UserLinks: React.FC = () => {
  const [links, setLinks] = useState<ILink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLinks: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchUserLinks = async (page: number = 1) => {
    try {
      setLoading(true);
      setError('');
      const response: LinksResponse = await urlService.getUserLinks(page, 8);
      setLinks(response.data);
      setPagination(response.pagination);
      setCurrentPage(response.pagination.currentPage);
    } catch (err) {
      setError('Failed to load your links');
      console.error('Error fetching links:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLinks();
  }, []);

  const handleCopy = async (shortCode: string) => {
    const shortUrl = `${window.location.origin}/redirect/${shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedLink(shortCode);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDelete = async (shortCode: string) => {
    if (!window.confirm('Are you sure you want to delete this link?')) {
      return;
    }

    try {
      await urlService.deleteLink(shortCode);
      setLinks(links.filter(link => link.shortCode !== shortCode));
      // Refresh the list
      fetchUserLinks(currentPage);
    } catch (err) {
      setError('Failed to delete link');
      console.error('Error deleting link:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && links.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Your Short Links</h2>
          <p className="text-gray-600">
            Manage and track all your shortened URLs in one place
          </p>
        </div>
        <div className="bg-blue-50 rounded-2xl px-4 py-2 border border-blue-200">
          <p className="text-blue-800 font-semibold">
            Total Links: {pagination.totalLinks}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Links Grid */}
      {links.length === 0 ? (
        <div className="text-center py-16 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-lg">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Link2 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No links yet</h3>
          <p className="text-gray-600 mb-6">Start shortening URLs to see them here</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 mb-8">
            {links.map((link) => {
              const shortUrl = `${window.location.origin}/redirect/${link.shortCode}`;
              const isExpired = new Date(link.expiresAt) < new Date();
              
              return (
                <div
                  key={link._id}
                  className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* URL Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/40 flex-shrink-0">
                          <Link2 className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 truncate">
                              {link.title || 'Untitled Link'}
                            </h3>
                            {!link.isActive && (
                              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                                Inactive
                              </span>
                            )}
                            {isExpired && (
                              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                                Expired
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 font-medium">Original:</span>
                              <a
                                href={link.originalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-700 truncate flex items-center gap-1"
                              >
                                {link.originalUrl}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 font-medium">Short:</span>
                              <span className="text-sm font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded-lg">
                                {shortUrl}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span className="font-semibold">{link.clicks}</span>
                            <span>clicks</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(link.createdAt)}</span>
                          </div>
                          
                          {link.expiresAt && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                Expires: {formatDate(link.expiresAt)}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(link.shortCode)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 hover:text-gray-900"
                          >
                            {copiedLink === link.shortCode ? (
                              <>
                                <Check className="w-4 h-4 text-green-600" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleDelete(link.shortCode)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-200 font-medium"
                            title="Delete link"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {/* Add analytics modal */}}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-100 transition-all duration-200 font-medium"
                            title="View analytics"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => fetchUserLinks(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {pagination.totalPages}
                </span>
              </div>

              <button
                onClick={() => fetchUserLinks(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};