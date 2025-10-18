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
  Image as ImageIcon,
  Globe
} from 'lucide-react';
import { linkService } from '../services/api';
import { LinkAnalytics, PageMetadata } from '../types/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Helmet } from 'react-helmet-async';

export const RedirectPage: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  
  const [countdown, setCountdown] = useState(4);
  const [linkInfo, setLinkInfo] = useState<LinkAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLinkInfo = async () => {
      if (!shortCode) {
        setError('Invalid short code');
        setLoading(false);
        return;
      }

      try {
        const data = await linkService.getLinkForDelay(shortCode);
        setLinkInfo(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.error || 'Failed to fetch link information');
        setLoading(false);
      }
    };

    fetchLinkInfo();
  }, [shortCode]);

  useEffect(() => {
    if (!loading && !error && linkInfo) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Redirect when countdown reaches 0
            window.location.href = linkInfo.originalUrl;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, error, linkInfo]);

  // Update page title and meta tags dynamically
  useEffect(() => {
    if (linkInfo?.metadata) {
      const { title, description } = linkInfo.metadata;
      
      // Update document title
      if (title) {
        document.title = `${title} - Redirecting...`;
      } else {
        document.title = `Redirecting to ${linkInfo.originalUrl}`;
      }

      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description || `Redirecting to ${linkInfo.originalUrl}`);

      // Update Open Graph tags for social sharing
      updateOpenGraphTags(linkInfo.metadata, linkInfo.originalUrl);
    }
  }, [linkInfo]);

  const updateOpenGraphTags = (metadata: PageMetadata, originalUrl: string) => {
    // OG Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', metadata.title || 'URL Shortener Redirect');

    // OG Description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', metadata.description || `Redirecting to ${originalUrl}`);

    // OG URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', window.location.href);

    // OG Image
    if (metadata.image) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', metadata.image);
    }
  };

  const handleGoNow = () => {
    if (linkInfo) {
      window.location.href = linkInfo.originalUrl;
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  // Helper function to truncate long text
  const truncateText = (text: string, maxLength: number = 120): string => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Get page title for display
  const getDisplayTitle = () => {
    if (linkInfo?.metadata?.title) {
      return truncateText(linkInfo.metadata.title, 60);
    }
    return truncateText(linkInfo?.originalUrl || '', 50);
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

  return (
    <>
      {/* Dynamic Meta Tags */}
      <Helmet>
        <title>
          {linkInfo?.metadata?.title 
            ? `${linkInfo.metadata.title} - Redirecting...` 
            : `Redirecting to ${linkInfo?.originalUrl || 'URL'}`
          }
        </title>
        <meta 
          name="description" 
          content={linkInfo?.metadata?.description || `Redirecting to ${linkInfo?.originalUrl || 'the destination URL'}`} 
        />
        <meta property="og:title" content={linkInfo?.metadata?.title || 'URL Shortener Redirect'} />
        <meta 
          property="og:description" 
          content={linkInfo?.metadata?.description || `Redirecting to ${linkInfo?.originalUrl || 'the destination URL'}`} 
        />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        {linkInfo?.metadata?.image && (
          <meta property="og:image" content={linkInfo.metadata.image} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={linkInfo?.metadata?.title || 'URL Shortener Redirect'} />
        <meta 
          name="twitter:description" 
          content={linkInfo?.metadata?.description || `Redirecting to ${linkInfo?.originalUrl || 'the destination URL'}`} 
        />
        {linkInfo?.metadata?.image && (
          <meta name="twitter:image" content={linkInfo.metadata.image} />
        )}
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Page Header with Destination Info */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                Redirecting to:
              </h1>
              {linkInfo?.metadata?.title ? (
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-blue-600">
                    {getDisplayTitle()}
                  </h2>
                  {linkInfo.metadata.description && (
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                      {truncateText(linkInfo.metadata.description, 150)}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-blue-600 font-mono text-lg break-all">
                  {linkInfo?.originalUrl}
                </p>
              )}
            </div>

            {/* Countdown and Main Info */}
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              {/* Left Column - Countdown */}
              <div className="lg:w-1/3 flex flex-col items-center justify-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-500/30">
                    <div className="text-3xl font-bold">{countdown}</div>
                  </div>
                  <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  Secure Redirect
                </h2>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((4 - countdown) / 4) * 100}%` }}
                  ></div>
                </div>

                {/* Countdown Info */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <Clock className="w-4 h-4" />
                  <span>Auto-redirecting in {countdown} second{countdown !== 1 ? 's' : ''}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={handleGoNow}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition duration-200 flex items-center gap-2 justify-center shadow-lg shadow-blue-500/30"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Continue to Website
                  </button>
                  <button
                    onClick={handleGoBack}
                    className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition duration-200 flex items-center gap-2 justify-center"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Cancel Redirect
                  </button>
                </div>
              </div>

              {/* Right Column - Detailed Preview */}
              <div className="lg:w-2/3">
                {/* URL Information */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Destination URL
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <p className="text-blue-600 font-mono text-sm break-all">
                      {linkInfo?.originalUrl}
                    </p>
                  </div>
                </div>

                {/* Detailed Page Preview */}
                {linkInfo?.metadata && (
                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    {/* Preview Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        Page Information
                      </h3>
                    </div>

                    {/* Preview Content */}
                    <div className="p-4 space-y-4">
                      {/* Full Title */}
                      {linkInfo.metadata.title && (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            Page Title
                          </div>
                          <p className="text-gray-800 font-semibold">
                            {linkInfo.metadata.title}
                          </p>
                        </div>
                      )}

                      {/* Full Description */}
                      {linkInfo.metadata.description && (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4 text-green-600" />
                            Description
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {linkInfo.metadata.description}
                          </p>
                        </div>
                      )}

                      {/* Keywords */}
                      {linkInfo.metadata.keywords && (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Tag className="w-4 h-4 text-purple-600" />
                            Keywords
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {linkInfo.metadata.keywords.split(',').slice(0, 8).map((keyword, index) => (
                              <span
                                key={index}
                                className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                              >
                                {keyword.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Preview Image */}
                      {linkInfo.metadata.image && (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <ImageIcon className="w-4 h-4 text-orange-600" />
                            Preview Image
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3 border">
                            <img
                              src={linkInfo.metadata.image}
                              alt="Page preview"
                              className="max-w-full h-32 object-cover rounded mx-auto"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* No Metadata Available */}
                {linkInfo && !linkInfo.metadata && (
                  <div className="border border-gray-200 rounded-xl bg-yellow-50 p-6 text-center">
                    <FileText className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-yellow-800 mb-2">Limited Preview Available</h3>
                    <p className="text-yellow-700 text-sm">
                      Basic page information is available. The site might be blocking external requests.
                    </p>
                  </div>
                )}

                {/* Link Stats */}
                {linkInfo && (
                  <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-blue-600 font-semibold">Short Code</div>
                      <div className="font-mono text-gray-800">{linkInfo.shortCode}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-green-600 font-semibold">Total Clicks</div>
                      <div className="font-semibold text-gray-800">{linkInfo.clicks + 1}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-left">
                  <p className="text-yellow-800 font-medium text-sm">
                    Security Notice
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    You're being redirected to an external website. Make sure you trust the destination before proceeding.
                    {linkInfo?.metadata?.title && ` You're going to: "${getDisplayTitle()}"`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};