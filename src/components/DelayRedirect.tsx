import React, { useState, useEffect } from 'react';
import { Clock, ExternalLink, X } from 'lucide-react';
import { linkService } from '../services/api';
import { LinkAnalytics } from '../types/api';
import { LoadingSpinner } from './LoadingSpinner';

interface DelayRedirectProps {
  shortCode: string;
  onClose: () => void;
}

export const DelayRedirect: React.FC<DelayRedirectProps> = ({ shortCode, onClose }) => {
  const [countdown, setCountdown] = useState(4);
  const [linkInfo, setLinkInfo] = useState<LinkAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLinkInfo = async () => {
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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <LoadingSpinner size="lg" color="blue" />
          </div>
          <p className="text-center text-gray-600">Preparing your redirect...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Redirect Failed</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          {/* Countdown Circle */}
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="text-2xl font-bold text-blue-600">{countdown}</div>
            </div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

          {/* Heading */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Redirecting you...
          </h3>

          {/* Link Information */}
          {linkInfo && (
            <div className="mb-6 text-left bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Going to:</p>
              <p className="text-blue-600 font-medium truncate">
                {linkInfo.originalUrl}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}</span>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((4 - countdown) / 4) * 100}%` }}
            ></div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => linkInfo && (window.location.href = linkInfo.originalUrl)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Go Now
            </button>
          </div>

          {/* Security Note */}
          <p className="text-xs text-gray-500 mt-4">
            You're being redirected to an external website
          </p>
        </div>
      </div>
    </div>
  );
};