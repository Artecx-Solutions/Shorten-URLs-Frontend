// components/OpenGenerateLink.tsx
import React from 'react';

interface OpenGenerateLinkProps {
  shortUrl: string;
  shortCode: string;
}

const OpenGenerateLink: React.FC<OpenGenerateLinkProps> = ({ shortUrl, shortCode }) => {
  const handleOpenLink = () => {
    console.log('=== OpenGenerateLink Debug Info ===');
    console.log('Received shortCode prop:', shortCode);
    console.log('Received shortUrl prop:', shortUrl);
    
    let finalShortCode = shortCode;

    // If shortCode is invalid, try to extract from shortUrl
    if (!finalShortCode || finalShortCode === 'undefined' || finalShortCode === 'null') {
      console.log('Short code from prop is invalid, extracting from URL...');
      const extractedCode = shortUrl.split('/').pop();
      if (extractedCode && extractedCode !== 'undefined' && extractedCode !== 'null') {
        finalShortCode = extractedCode;
        console.log('Extracted short code from URL:', finalShortCode);
      } else {
        console.error('Could not extract valid short code from URL');
        // Fallback to direct URL opening
        console.log('Falling back to direct URL opening');
        window.open(shortUrl, '_blank');
        return;
      }
    }

    // Create preview URL
    const previewUrl = `${window.location.origin}/${finalShortCode}`;
    console.log('Final preview URL:', previewUrl);
    console.log('==============================');
    
    window.open(previewUrl, '_blank');
  };

  return (
    <button
      onClick={handleOpenLink}
      className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium justify-center"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      Open Generated Link
    </button>
  );
};

export default OpenGenerateLink;