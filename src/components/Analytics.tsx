// components/Analytics.tsx
import React, { useState, useEffect } from 'react';
import { Link2, Copy, Check, BarChart3, Trash2, Calendar, Eye, ExternalLink, ChevronLeft, ChevronRight, Filter, Search, Users, Globe, Clock } from 'lucide-react';
import { linkService } from '../services/api';
import { ILink, LinksResponse } from '../types/url';
import { LoadingSpinner } from './LoadingSpinner';

export const Analytics: React.FC = () => {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const fetchUserLinks = async (page: number = 1) => {
    try {
      setLoading(true);
      setError('');
      const response: LinksResponse = await linkService.getUserLinks(page, 10);
      setLinks(response.data);
      setPagination(response.pagination);
      setCurrentPage(response.pagination.currentPage);
    } catch (err) {
      setError('Failed to load your links. Please try again.');
      console.error('Error fetching links:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLinks();
  }, []);

  const handleCopy = async (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedLink(shortCode);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDelete = async (shortCode: string) => {
    if (!window.confirm('Are you sure you want to delete this link? This action cannot be undone.')) {
      return;
    }

    try {
      await linkService.deleteLink(shortCode);
      // Remove the deleted link from the state
      setLinks(links.filter(link => link.shortCode !== shortCode));
      // Refresh the list to update pagination
      fetchUserLinks(currentPage);
    } catch (err: any) {
      setError(err.message || 'Failed to delete link');
      console.error('Error deleting link:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysAgo = (dateString: string) => {
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  // Filter links based on search and status
  const filteredLinks = links.filter(link => {
    const matchesSearch = link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (link.title && link.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && link.isActive) ||
                         (filterStatus === 'inactive' && !link.isActive);
    
    return matchesSearch && matchesStatus;
  });

  if (loading && links.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <LoadingSpinner size="lg" color="blue" />
          <p className="text-gray-600 mt-4">Loading your links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-4 lg:mb-0">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Your Short Links</h2>
          <p className="text-gray-600">
            Manage and track all your shortened URLs in one place
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl px-6 py-3 text-white">
          <p className="font-semibold text-center lg:text-left">
            Total Links: {pagination.totalLinks}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by URL, short code, or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filterStatus === 'all' 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filterStatus === 'active' 
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('inactive')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filterStatus === 'inactive' 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <p className="text-red-800 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            {error}
          </p>
        </div>
      )}

      {/* Links Grid */}
      {filteredLinks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Link2 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No links found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Start shortening URLs to see them here'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition duration-200"
            >
              Create Your First Link
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-6 mb-8">
            {filteredLinks.map((link) => {
              const shortUrl = `${window.location.origin}/${link.shortCode}`;
              const isExpired = new Date(link.expiresAt) < new Date();
              
              return (
                <div
                  key={link._id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Link Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/40 flex-shrink-0">
                          <Link2 className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-bold text-gray-900 truncate">
                              {link.title || 'Untitled Link'}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
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
                              {link.clicks > 0 && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-gray-500 font-medium">Original:</span>
                              <a
                                href={link.originalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-700 truncate flex items-center gap-1 max-w-xs"
                                title={link.originalUrl}
                              >
                                {link.originalUrl}
                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              </a>
                            </div>
                            
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-gray-500 font-medium">Short:</span>
                              <span className="text-sm font-mono text-gray-900 bg-gray-50 px-3 py-1 rounded-lg border">
                                {shortUrl}
                              </span>
                            </div>
                          </div>

                          {/* Stats and Meta */}
                          <div className="flex items-center gap-6 mt-4 text-sm text-gray-600 flex-wrap">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              <span className="font-semibold">{link.clicks}</span>
                              <span>clicks</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{getDaysAgo(link.createdAt)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                Expires: {formatDate(link.expiresAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
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

                      <a
                        href={`/redirect/${link.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-100 transition-all duration-200 font-medium"
                        title="Test link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <button
                onClick={() => fetchUserLinks(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600">
                  {pagination.totalLinks} total links
                </span>
              </div>

              <button
                onClick={() => fetchUserLinks(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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