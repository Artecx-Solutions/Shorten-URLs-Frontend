// components/UrlShortener.tsx
import React, { useState } from 'react';
import { urlService } from '../services/urlService';
import { CreateUrlRequest } from '../types/url';

const UrlShortener: React.FC = () => {
  const [formData, setFormData] = useState<CreateUrlRequest>({
    originalUrl: '',
    customCode: '',
    password: '',
    expiry: '',
    description: ''
  });
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await urlService.createShortUrl(formData);
      
      if (result.success && result.data) {
        setShortUrl(result.data.shortUrl);
        // Reset form
        setFormData({
          originalUrl: '',
          customCode: '',
          password: '',
          expiry: '',
          description: ''
        });
      } else {
        setError(result.message || 'Failed to create short URL');
      }
    } catch (err) {
      setError('An error occurred while creating the short URL');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    alert('URL copied to clipboard!');
  };

  return (
    <div className="url-shortener">
      <h2>Shorten Your URL</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="originalUrl">Original URL *</label>
          <input
            type="url"
            id="originalUrl"
            name="originalUrl"
            value={formData.originalUrl}
            onChange={handleChange}
            required
            placeholder="https://example.com/very-long-url"
          />
        </div>

        <div className="form-group">
          <label htmlFor="customCode">Custom URL (Optional)</label>
          <input
            type="text"
            id="customCode"
            name="customCode"
            value={formData.customCode}
            onChange={handleChange}
            placeholder="my-custom-link"
          />
          <small>http://localhost:3001/your-custom-code</small>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password (Optional)</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password for this URL"
          />
        </div>

        <div className="form-group">
          <label htmlFor="expiry">Expiry (Optional)</label>
          <select
            id="expiry"
            name="expiry"
            value={formData.expiry}
            onChange={handleChange}
          >
            <option value="">No expiry</option>
            <option value="1h">1 hour</option>
            <option value="24h">24 hours</option>
            <option value="7days">7 days</option>
            <option value="30days">30 days</option>
            <option value="1year">1 year</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description for this URL"
            rows={3}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {shortUrl && (
        <div className="result">
          <h3>Your Short URL:</h3>
          <div className="short-url-container">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="short-url-input"
            />
            <button onClick={copyToClipboard} className="copy-btn">
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;