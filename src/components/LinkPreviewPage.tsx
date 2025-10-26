// components/LinkPreviewPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ConfigProvider, Spin, Alert, Button } from 'antd';
import { Helmet } from 'react-helmet-async';
import { metadataService } from '../services/metadataService';
import { linkService } from '../services/shortlinkService';
import { Link } from 'react-router-dom';
import ShareModal from './ShareModal'; // Import the ShareModal
import { ShareAltOutlined } from '@ant-design/icons'; // Import share icon

interface LinkInfo {
  _id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdBy: string;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const LinkPreviewPage: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [metadata, setMetadata] = useState<any>(null);
  const [linkInfo, setLinkInfo] = useState<LinkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState(100);
  const [redirecting, setRedirecting] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false); 

  // Base URL for the site
  const siteUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
  const currentUrl = `${siteUrl}/${shortCode}`;

  useEffect(() => {
    if (shortCode && shortCode !== 'undefined') {
      fetchLinkData(shortCode);
    } else {
      setError('Invalid short URL');
      setLoading(false);
    }
  }, [shortCode]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (linkInfo && countdown > 0 && !redirecting) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && linkInfo && !redirecting) {
      handleRedirect();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, linkInfo, redirecting]);

  const fetchLinkData = async (code: string) => {
    try {
      setLoading(true);
      
      // Step 1: Get the original URL from short code
      const response = await linkService.getLink(code);
      console.log('Link service response:', response);
      
      // Check if response has data property (based on your API structure)
      const linkData = response.data || response;
      console.log('Link data:', linkData);
      
      if (!linkData || !linkData.originalUrl) {
        throw new Error('Invalid link data received');
      }
      
      setLinkInfo(linkData);

      // Step 2: Get metadata for the original URL
      const metadataResponse = await metadataService.getMetadata(linkData.originalUrl);
      console.log('Metadata response:', metadataResponse);
      setMetadata(metadataResponse.metadata);

    } catch (err: any) {
      console.error('Error fetching link data:', err);
      setError(err.message || 'Failed to load link information');
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    if (linkInfo?.originalUrl) {
      setRedirecting(true);
      console.log('Redirecting to:', linkInfo.originalUrl);
      
      // Add a small delay to show "Redirecting..." state
      setTimeout(() => {
        window.location.href = linkInfo.originalUrl;
      }, 500);
    } else {
      setError('No destination URL found');
    }
  };

  const handleSkipWait = () => {
    console.log('Skip wait clicked');
    handleRedirect();
  };

  // Default values for SEO
  const pageTitle = metadata?.title 
    ? `${metadata.title} - MyUrl.life` 
    : `Redirecting - MyUrl.life`;

  const pageDescription = metadata?.description 
    ? metadata.description 
    : 'You are being redirected to the destination URL via MyUrl.life URL shortener service.';

  const pageImage = metadata?.image 
    ? metadata.image 
    : `${siteUrl}/og-default-image.jpg`;

  const pageUrl = currentUrl;

  // Debug logs to check state
  useEffect(() => {
    console.log('Current state:', {
      shortCode,
      loading,
      error,
      countdown,
      redirecting,
      linkInfo: linkInfo ? 'has linkInfo' : 'no linkInfo',
      metadata: metadata ? 'has metadata' : 'no metadata'
    });
  }, [shortCode, loading, error, countdown, redirecting, linkInfo, metadata]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading... - MyUrl.life</title>
          <meta name="description" content="Loading link preview..." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#2563eb',
              borderRadius: 8,
            },
          }}
        >
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <Spin size="large" />
              <p className="mt-4 text-gray-600">Loading link preview...</p>
            </div>
          </div>
        </ConfigProvider>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error - MyUrl.life</title>
          <meta name="description" content="Error loading the requested link" />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#2563eb',
              borderRadius: 8,
            },
          }}
        >
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
              <Alert
                message="Error Loading Link"
                description={error}
                type="error"
                showIcon
                action={
                  <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                    Go Home
                  </a>
                }
              />
            </div>
          </div>
        </ConfigProvider>
      </>
    );
  }

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={metadata?.keywords || 'url shortener, link shortener, redirect'} />
        <meta name="author" content="MyUrl.life" />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={metadata?.siteName || "MyUrl.life"} />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        <meta name="twitter:site" content="@MyUrl" />
        <meta name="twitter:creator" content="@MyUrl" />

        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* Noindex for preview pages (optional) */}
        <meta name="robots" content="noindex, nofollow" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": pageTitle,
            "description": pageDescription,
            "url": pageUrl,
            "publisher": {
              "@type": "Organization",
              "name": "MyUrl.life",
              "url": siteUrl
            }
          })}
        </script>

        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Additional SEO Meta Tags */}
        <meta name="language" content="en" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        
        {/* Prevent search engines from indexing redirect pages */}
        <meta name="googlebot" content="noindex, nofollow" />
        <meta name="bingbot" content="noindex, nofollow" />
      </Helmet>

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#2563eb',
            borderRadius: 8,
          },
        }}
      >
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Link to="/" key="home-link">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg></Link>
                  </div>
                  <Link to="/" key="home-link">
  <span className="text-lg font-semibold text-gray-800">MyUrl.life</span>
</Link>
                </div>
                <div className="text-sm text-gray-500">
                  Redirecting: {shortCode}
                </div>
                                  <Button
                    type="primary"
                    icon={<ShareAltOutlined />}
                    onClick={() => setShowShareModal(true)}
                    className="bg-green-600 hover:bg-green-700 border-0"
                  >
                    Share
                  </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Countdown Banner */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {redirecting ? (
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span className="text-lg font-bold text-blue-600">{countdown}</span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-800">
                      {redirecting ? 'Redirecting...' : `Redirecting in ${countdown} seconds`}
                    </h1>
                    <p className="text-gray-600 text-sm">
                      {redirecting 
                        ? 'Taking you to the destination...' 
                        : 'You\'re being redirected to the destination website'
                      }
                    </p>
                  </div>
                </div>
                {!redirecting && (
                  <button
                    onClick={handleSkipWait}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Skip Wait
                  </button>
                )}
              </div>

              {/* Progress Bar - Only show when not redirecting */}
              {!redirecting && (
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((8 - countdown) / 8) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>

            {/* Link Preview Card */}
            {metadata && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                  {/* Title */}
                  <h1 className="text-xl sm:text-4xl font-bold text-gray-900 mb-3 line-clamp-3 p-6">
                    {metadata.title}
                  </h1>


                {/* Preview Image */}
                {metadata.image && (
                  <div className="h-84 sm:h-84 bg-gray-100 overflow-hidden">
                    <img 
                      src={metadata.image} 
                      alt={metadata.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Site Name */}
                  {metadata.siteName && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {metadata.siteName}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {metadata.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {metadata.description}
                    </p>
                  )}

                  {/* URL */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="truncate">{metadata.url}</span>
                  </div>

                  {/* Security Info */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Secure Redirect</h3>
                        <p className="text-sm text-gray-600">
                          This link is being safely redirected through Short.ly. {redirecting ? 'Redirecting now...' : 'You\'ll be taken to the destination shortly.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Powered by MyUrl.life - Kasun Developer • Safe link shortening service
              </p>
            </div>
          </div>
        </div>
        {/* Share Modal */}
        <ShareModal
          visible={showShareModal}
          onClose={() => setShowShareModal(false)}
          url={currentUrl}
          title={metadata?.title}
          description={metadata?.description}
          image={metadata?.image}
        />
      </ConfigProvider>
    </>
  );
};

export default LinkPreviewPage;