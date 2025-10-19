import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, Copy, ExternalLink, RefreshCw, Sparkles, CheckCircle, Zap, ArrowLeft } from 'lucide-react';
import { urlService } from '../services/urlService';
import { CreateLinkResponse } from '../types/api';
import { LoadingSpinner } from './LoadingSpinner';

export const LinkShortener: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortLink, setShortLink] = useState<CreateLinkResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCopied(false);

    try {
      const result = await urlService.createShortUrl({
        originalUrl: originalUrl.trim(),
        customAlias: customAlias.trim() || undefined,
      });
      
      console.log('🔍 Received result:', result); // Debug log
      
      if (result.success) {
        setShortLink(result);
        setOriginalUrl('');
        setCustomAlias('');
      } else {
        setError(result.message || 'Failed to create short link');
        setShortLink(null);
      }
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || err.error || 'Failed to create short link');
      setShortLink(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Failed to copy to clipboard');
    }
  };

  const createAnother = () => {
    setShortLink(null);
    setError('');
    setCopied(false);
    setOriginalUrl('');
    setCustomAlias('');
  };

  const handleTestLink = () => {
    if (shortLink?.data?.shortCode) {
      navigate(`/${shortLink.data.shortCode}`);
    }
  };

  // Helper to safely access the short URL
  const getShortUrl = () => {
    return shortLink?.data?.shortUrl || '';
  };

  // Helper to safely access the original URL
  const getOriginalUrl = () => {
    return shortLink?.data?.originalUrl || '';
  };

  // Helper to safely access the short code
  const getShortCode = () => {
    return shortLink?.data?.shortCode || '';
  };

  // Helper to safely access clicks
  const getClicks = () => {
    return shortLink?.data?.clicks || 0;
  };

  return (
    <div className="mx-auto p-0 bg-white/0 backdrop-blur-xl shadow-black/5">
      {!shortLink && (
        <>
          <form onSubmit={handleSubmit} className="flex gap-3 p-1 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex-1">
              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="Paste your long URL here..."
                className="w-full px-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-500 font-medium"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !originalUrl.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-semibold min-w-[140px] justify-center"
            >
              {loading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <Link2 className="w-4 h-4" />
              )}
              {loading ? 'Creating...' : 'Shorten'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl">
              <p className="text-red-700 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                {error}
              </p>
            </div>
          )}

          <div className="mt-8 p-6 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 backdrop-blur-sm border border-blue-200/40 rounded-2xl">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              Pro Tips
            </h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Use custom aliases for branded links
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Track performance in the Analytics tab
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Share your shortened links anywhere
              </li>
            </ul>
          </div>
        </>
      )}

      {/* Success State - Updated to handle nested data structure */}
      {shortLink && shortLink.success && (
        <div className="space-y-6">
          <div className="p-8 bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm border border-green-200/60 rounded-2xl shadow-lg">
            {/* Success Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">Short URL Created!</h3>
                <p className="text-green-600 font-semibold">Ready to share with the world</p>
              </div>
              <button
                onClick={createAnother}
                className="group flex float-right items-center gap-3 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 font-semibold"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                Create Another Link
              </button>              
            </div>
            
            {/* Short URL Display */}
            <div className="space-y-4 mb-6">
              <label className="block text-sm font-semibold text-gray-700">
                Your Short URL
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={getShortUrl()}
                    readOnly
                    className="w-full px-4 py-4 bg-white border border-green-300 rounded-xl text-green-800 font-mono font-bold text-lg shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(getShortUrl())}
                  className={`group p-4 rounded-xl transition-all duration-300 font-semibold flex items-center gap-2 min-w-[120px] justify-center ${
                    copied 
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/25' 
                      : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/25'
                  }`}
                >
                  <Copy className={`w-5 h-5 ${copied ? 'scale-110' : ''} transition-transform duration-300`} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Link Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/80 p-4 rounded-xl border border-gray-200/60">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Original URL</span>
                <p className="text-gray-700 text-sm font-medium truncate mt-1">{getOriginalUrl()}</p>
              </div>
              <div className="bg-white/80 p-4 rounded-xl border border-gray-200/60">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Short Code</span>
                <p className="text-gray-700 font-mono font-bold text-lg mt-1">{getShortCode()}</p>
              </div>
              <div className="bg-white/80 p-4 rounded-xl border border-gray-200/60">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Clicks</span>
                <p className="text-gray-700 font-bold text-2xl mt-1">{getClicks()}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleTestLink}
                className="group flex items-center gap-3 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold"
              >
                <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Test Your Link
              </button>

              <button
                onClick={() => copyToClipboard(getShortUrl())}
                className="group flex items-center gap-3 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 font-semibold"
              >
                <Copy className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Copy Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};