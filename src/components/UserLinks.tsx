import React from 'react';
import { useUserLinks } from '../hooks/useLinks';
import { urlService } from '../services/urlService';

export const UserLinks: React.FC = () => {
  const {
    links,
    loading,
    error,
    currentPage,
    totalPages,
    totalLinks,
    setCurrentPage,
    fetchUserLinks
  } = useUserLinks();

  const handleDelete = async (shortCode: string) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await urlService.deleteLink(shortCode);
        // Refresh the current page
        fetchUserLinks(currentPage);
      } catch (err: any) {
        alert(`Failed to delete link: ${err.message}`);
      }
    }
  };

  const copyToClipboard = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    alert('Copied to clipboard!');
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

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading your links...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">❌</div>
        <h3>Failed to load links</h3>
        <p>{error}</p>
        <button 
          onClick={() => fetchUserLinks(1)}
          className="retry-btn"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="user-links">
      <div className="user-links-header">
        <h2>My Short Links     xxxxxx</h2>
        {totalLinks > 0 && (
          <div className="links-summary">
            {totalLinks} link{totalLinks !== 1 ? 's' : ''} total
          </div>
        )}
      </div>

      {links.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔗</div>
          <h3>No links yet</h3>
          <p>Create your first short link to get started!</p>
        </div>
      ) : (
        <>
          <div className="links-list">
            {links.map((link) => (
              <div key={link._id} className="link-card">
                <div className="link-main">
                  <div className="link-urls">
                    <div className="short-url">
                      <a 
                        href={`${window.location.origin}/${link.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="short-link"
                      >
                        {window.location.host}/{link.shortCode}
                      </a>
                      <button 
                        onClick={() => copyToClipboard(link.shortCode)}
                        className="copy-btn small"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                    </div>
                    <div className="original-url">
                      {link.originalUrl}
                    </div>
                  </div>
                  
                  <div className="link-stats">
                    <div className="stat">
                      <span className="stat-label">Clicks:</span>
                      <span className="stat-value">{link.clicks}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Created:</span>
                      <span className="stat-value">
                        {formatDate(link.createdAt)}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Status:</span>
                      <span className={`status ${link.isActive ? 'active' : 'inactive'}`}>
                        {link.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="link-actions">
                  <button 
                    onClick={() => handleDelete(link.shortCode)}
                    className="delete-btn"
                    title="Delete link"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                ← Previous
              </button>
              
              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>
              
              <button 
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};