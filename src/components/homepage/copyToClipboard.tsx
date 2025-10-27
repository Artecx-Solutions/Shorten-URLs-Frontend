import { message } from 'antd';
import React from 'react';

interface OpenGenerateLinkProps {
  shortUrl: string;
  shortCode: string;
}

const CopyToClipboard: React.FC<OpenGenerateLinkProps> = ({ shortUrl, shortCode }) => {
  const copyToClipboardLink = async () => {
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

    const previewUrl = `${window.location.origin}/${finalShortCode}`;
    await navigator.clipboard.writeText(previewUrl);
    message.success("Shortlink Copied to clipboard");
    console.log('Final preview URL:', previewUrl);
    console.log('==============================');
  };

  return (
        <button
        onClick={copyToClipboardLink}
        className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Copy
        </button>    
  );
};

export default CopyToClipboard;