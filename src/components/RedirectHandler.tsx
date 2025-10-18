// components/RedirectHandler.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { urlService } from '../services/urlService';

const RedirectHandler: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [password, setPassword] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shortCode) {
      handleRedirect();
    }
  }, [shortCode]);

  const handleRedirect = async (providedPassword?: string) => {
    try {
      const response = await urlService.redirectToUrl(shortCode!, providedPassword);
      
      if (response.ok) {
        // Get the URL from the response and redirect
        window.location.href = response.url;
      } else {
        const result = await response.json();
        
        if (result.requiresPassword) {
          setRequiresPassword(true);
        } else {
          setError(result.message || 'URL not found');
        }
      }
    } catch (err) {
      setError('An error occurred while redirecting');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRedirect(password);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (requiresPassword) {
    return (
      <div className="password-prompt">
        <h3>This URL is password protected</h3>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }

  return <div>Redirecting...</div>;
};

export default RedirectHandler;