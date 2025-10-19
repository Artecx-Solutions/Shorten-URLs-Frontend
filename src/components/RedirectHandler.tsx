// pages/RedirectPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink, AlertCircle, Loader, Clock, BarChart3, Calendar, Link2, Users } from 'lucide-react';

interface LinkData {
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  title?: string;
  description?: string;
}

export const RedirectPage: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [redirecting, setRedirecting] = useState(false);

  // Fetch link data
  useEffect(() => {
    const fetchLinkData = async () => {
      if (!shortCode) {
        setError('Invalid short code');
        setLoading(false);
        return;
      }

      try {
        console.log(`🔗 Fetching data for short code: ${shortCode}`);
        
        // Use the delay endpoint to get link information
        const response = await fetch(`http://localhost:5000/api/links/delay/${shortCode}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch link data');
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          setLinkData(result.data);
          console.log('✅ Link data loaded:', result.data);
        } else {
          throw new Error(result.message || 'Invalid response format');
        }
      } catch (err: any) {
        console.error('❌ Error fetching link data:', err);
        setError(err.message || 'Failed to load link information');
      } finally {
        setLoading(false);
      }
    };

    fetchLinkData();
  }, [shortCode]);

  // Countdown and redirect logic
  useEffect(() => {
    if (!linkData || redirecting) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setRedirecting(true);
      // Perform the actual redirect
      window.location.href = linkData.originalUrl;
    }
  }, [countdown, linkData, redirecting]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRedirectNow = () => {
    if (linkData) {
      setRedirecting(true);
      window.location.href = linkData.originalUrl;
    }
  };

  const handleCancelRedirect = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Link Information...</h2>
          <p className="text-gray-600">Getting everything ready for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Redirect Failed</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Back to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-xl hover:bg-gray-700 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting Now...</h2>
          <p className="text-gray-600">Taking you to your destination</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200/60 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Link2 className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-black mb-2">You're Being Redirected</h1>
                <p className="text-blue-100 opacity-90">
                  Safety check in progress. You'll be redirected in {countdown} seconds...
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                  <span className="text-2xl font-black">{countdown}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Countdown Progress */}
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(5 - countdown) * 20}%` }}
              ></div>
            </div>
          </div>

          {/* Link Information */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Original URL */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Destination URL
                </label>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-gray-800 font-medium break-all">
                    {linkData?.originalUrl}
                  </p>
                </div>
              </div>

              {/* Short Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Short Code
                </label>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-blue-800 font-mono font-bold text-lg">
                    {linkData?.shortCode}
                  </p>
                </div>
              </div>

              {/* Total Clicks */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Total Clicks
                </label>
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-bold text-2xl">
                      {linkData?.clicks || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Created Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Created Date
                </label>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="text-purple-800 font-medium text-sm">
                      {linkData ? formatDate(linkData.createdAt) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expires On
                </label>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="text-amber-800 font-medium text-sm">
                      {linkData ? formatDate(linkData.expiresAt) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRedirectNow}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 font-semibold flex items-center justify-center gap-3"
              >
                <ExternalLink className="w-5 h-5" />
                Continue Now ({countdown}s)
              </button>
              
              <button
                onClick={handleCancelRedirect}
                className="flex-1 bg-gray-500 text-white py-4 px-6 rounded-xl hover:bg-gray-600 transition-all duration-300 font-semibold"
              >
                Cancel Redirect
              </button>
            </div>

            {/* Safety Notice */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Safety Notice</h4>
                  <p className="text-yellow-700 text-sm">
                    Always verify the destination URL before proceeding. Make sure you trust the source of this shortened link.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Link Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-blue-600">{linkData?.clicks || 0}</div>
              <div className="text-sm text-gray-600">Total Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-green-600">
                {linkData?.isActive ? 'Active' : 'Inactive'}
              </div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-purple-600">
                {linkData ? Math.ceil((new Date().getTime() - new Date(linkData.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
              </div>
              <div className="text-sm text-gray-600">Days Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-amber-600">
                {linkData && new Date(linkData.expiresAt) > new Date() ? 'Valid' : 'Expired'}
              </div>
              <div className="text-sm text-gray-600">Expiration</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};