import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  ExternalLink, 
  ArrowLeft, 
  Shield, 
  AlertCircle, 
  FileText,
  Tag,
  Globe,
  Eye,
  Link2
} from 'lucide-react';
import { linkService } from '../services/api';
import { LinkAnalytics } from '../types/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Helmet } from 'react-helmet-async';

interface PageMetadata {
  title: string;
  description: string;
  image: string;
  keywords: string;
  siteName: string;
  url: string;
}

export const RedirectPage: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  
  const [countdown, setCountdown] = useState(5);
  const [linkInfo, setLinkInfo] = useState<LinkAnalytics | null>(null);
  const [metadata, setMetadata] = useState<PageMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const [metadataLoading, setMetadataLoading] = useState(false);

  // Function to fetch metadata via backend API
  const fetchPageMetadata = async (url: string): Promise<PageMetadata | null> => {
    try {
      setMetadataLoading(true);
      console.log('🔍 Fetching metadata via API for:', url);
      
      const response = await fetch('http://localhost:5000/api/metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Metadata received:', data.metadata);
        return data.metadata;
      } else {
        console.log('⚠️ Using fallback metadata');
        return getFallbackMetadata(url);
      }
    } catch (error) {
      console.error('❌ Metadata API error:', error);
      return getFallbackMetadata(url);
    } finally {
      setMetadataLoading(false);
    }
  };

  // Fallback metadata when API fails
  const getFallbackMetadata = (url: string): PageMetadata => {
    const urlObj = new URL(url);
    return {
      title: urlObj.hostname,
      description: `Redirecting to ${url}`,
      image: '',
      keywords: '',
      siteName: urlObj.hostname,
      url: url
    };
  };

  // Extract domain from URL for display
  const getDomainFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  useEffect(() => {
    const fetchLinkInfo = async () => {
      if (!shortCode) {
        setError('Invalid short code');
        setLoading(false);
        return;
      }

      try {
        const data = await linkService.getLinkForDelay(shortCode);
        console.log('🔗 Link data received:', data);
        setLinkInfo(data);
        
        // Fetch metadata from the original URL
        if (data.data?.originalUrl) {
          const pageMetadata = await fetchPageMetadata(data.data.originalUrl);
          setMetadata(pageMetadata);
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('❌ Error fetching link:', err);
        setError(err.message || err.error || 'Failed to fetch link information');
        setLoading(false);
      }
    };

    fetchLinkInfo();
  }, [shortCode]);

  useEffect(() => {
    if (!loading && !error && linkInfo && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleRedirect();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, error, linkInfo, countdown]);

  const handleRedirect = () => {
    if (linkInfo?.data?.originalUrl && !redirecting) {
      setRedirecting(true);
      console.log('🚀 Redirecting to:', linkInfo.data.originalUrl);
      
      window.location.href = linkInfo.data.originalUrl;
    }
  };

  const handleGoNow = () => {
    if (linkInfo?.data?.originalUrl && !redirecting) {
      setCountdown(0);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  // Helper function to truncate long text
  const truncateText = (text: string, maxLength: number = 120): string => {
    if (!text || text === 'No title available' || text === 'No description available') return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Get display title
  const getDisplayTitle = () => {
    if (metadata?.title && metadata.title !== 'No title available') {
      return truncateText(metadata.title, 60);
    }
    return getDomainFromUrl(linkInfo?.data?.originalUrl || '');
  };

  // Get display description
  const getDisplayDescription = () => {
    if (metadata?.description && metadata.description !== 'No description available') {
      return truncateText(metadata.description, 150);
    }
    return `You are being redirected to ${getDomainFromUrl(linkInfo?.data?.originalUrl || '')}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <LoadingSpinner size="lg" color="blue" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Preparing Redirect</h2>
          <p className="text-gray-600">Loading link information and page preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Redirect Failed</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={handleGoBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-200 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <LoadingSpinner size="lg" color="green" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Redirecting...</h2>
          <p className="text-gray-600">Taking you to your destination</p>
        </div>
      </div>
    );
  }

  const hasRichPreview = metadata && 
    metadata.title && 
    metadata.title !== 'No title available' && 
    metadata.description && 
    metadata.description !== 'No description available';

  return (
    <>
      {/* Dynamic Meta Tags */}
      <Helmet>
        <title>
          {hasRichPreview 
            ? `${metadata.title} - Redirecting...` 
            : `Redirecting to ${getDomainFromUrl(linkInfo?.data?.originalUrl || 'URL')}`
          }
        </title>
        <meta 
          name="description" 
          content={hasRichPreview ? metadata.description : `Redirecting to ${linkInfo?.data?.originalUrl}`} 
        />
        {hasRichPreview && (
          <>
            <meta property="og:title" content={metadata.title} />
            <meta property="og:description" content={metadata.description} />
            {metadata.image && <meta property="og:image" content={metadata.image} />}
            <meta name="twitter:card" content={metadata.image ? "summary_large_image" : "summary"} />
            <meta name="twitter:title" content={metadata.title} />
            <meta name="twitter:description" content={metadata.description} />
            {metadata.image && <meta name="twitter:image" content={metadata.image} />}
          </>
        )}
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Shortener
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Preview Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Website Icon/Preview */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Globe className="w-8 h-8" />
                  </div>
                </div>
                
                {/* Title and Description */}
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold mb-3">
                    {hasRichPreview ? getDisplayTitle() : getDomainFromUrl(linkInfo?.data?.originalUrl || '')}
                  </h1>
                  <p className="text-blue-100 text-lg opacity-90">
                    {getDisplayDescription()}
                  </p>
                </div>

                {/* Countdown Circle */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                      <span className="text-2xl font-bold">{countdown}</span>
                    </div>
                    <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Actions & Stats */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Countdown Progress */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Redirect Timer
                    </h3>
                    <div className="space-y-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-linear"
                          style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        Auto-redirecting in <strong>{countdown}</strong> second{countdown !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleGoNow}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center gap-3 justify-center"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Continue Now
                    </button>
                    <button
                      onClick={handleGoBack}
                      className="w-full bg-gray-500 text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 flex items-center gap-3 justify-center"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Cancel Redirect
                    </button>
                  </div>

                  {/* Link Statistics */}
                  {linkInfo?.data && (
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-600" />
                        Link Statistics
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Short Code</span>
                          <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">
                            {linkInfo.data.shortCode}
                          </code>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Clicks</span>
                          <span className="font-semibold text-gray-800">{linkInfo.data.clicks + 1}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Created</span>
                          <span className="text-sm text-gray-600">{formatDate(linkInfo.data.createdAt)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Status</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            linkInfo.data.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {linkInfo.data.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Preview */}
                <div className="lg:col-span-2">
                  {hasRichPreview ? (
                    <div className="space-y-6">
                      {/* Rich Preview Card */}
                      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                        {metadata.image && (
                          <div className="h-48 bg-gray-100 overflow-hidden">
                            <img
                              src={metadata.image}
                              alt={metadata.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('hidden');
                              }}
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Link2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-gray-800 mb-2">
                                {metadata.title}
                              </h2>
                              <p className="text-gray-600 leading-relaxed">
                                {metadata.description}
                              </p>
                            </div>
                          </div>

                          {/* Meta Information */}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              {metadata.siteName}
                            </span>
                            {metadata.keywords && (
                              <span className="flex items-center gap-1">
                                <Tag className="w-4 h-4" />
                                {metadata.keywords.split(',').slice(0, 3).join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* URL Information */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Globe className="w-5 h-5 text-blue-600" />
                          Destination URL
                        </h3>
                        <p className="text-blue-600 font-mono text-sm break-all bg-white p-3 rounded-lg border">
                          {linkInfo?.data?.originalUrl}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Basic Preview */
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-xl bg-white p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {getDomainFromUrl(linkInfo?.data?.originalUrl || '')}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          You are being redirected to this website
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-blue-600 font-mono text-sm break-all">
                            {linkInfo?.data?.originalUrl}
                          </p>
                        </div>
                      </div>

                      {metadataLoading && (
                        <div className="text-center py-4">
                          <LoadingSpinner size="md" color="blue" />
                          <p className="text-gray-600 mt-2">Loading page preview...</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">Security Notice</h4>
                    <p className="text-yellow-700 text-sm">
                      You are about to be redirected to an external website. Please ensure you trust the destination URL before proceeding. 
                      {hasRichPreview && ` You're going to: "${metadata.title}"`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};