import React, { useState } from 'react';
import { BarChart3, Search } from 'lucide-react';
import { linkService } from '../services/api';
import { LinkAnalytics } from '../types/api';
import { LoadingSpinner } from './LoadingSpinner';
import { UserLinks } from './UserLinks';


export const Analytics: React.FC = () => {
  const [shortCode, setShortCode] = useState('');
  const [analytics, setAnalytics] = useState<LinkAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalytics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortCode.trim()) return;

    setLoading(true);
    setError('');

    try {
      const data = await linkService.getAnalytics(shortCode);
      setAnalytics(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch analytics');
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Link Analytics</h2>
      </div>

          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="py-8 px-4">
        <UserLinks />
      </div>
    </div>

      <form onSubmit={fetchAnalytics} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Short Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              placeholder="abc123"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200 flex items-center gap-2"
            >
              {loading ? <LoadingSpinner /> : <Search className="w-5 h-5" />}
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {analytics && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Original URL</p>
              <p className="font-medium truncate">{analytics.originalUrl}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Short Code</p>
              <p className="font-medium">{analytics.shortCode}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Total Clicks</p>
              <p className="text-2xl font-bold text-blue-700">{analytics.clicks}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Status</p>
              <p className={`font-medium ${analytics.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Created At</p>
            <p className="font-medium">
              {new Date(analytics.createdAt).toLocaleDateString()} at{' '}
              {new Date(analytics.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};