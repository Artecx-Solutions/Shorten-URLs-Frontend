// components/ShareModal.tsx
import React, { useState } from 'react';
import { Modal, Button, Space, message, Input, Typography, Image } from 'antd';
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  LinkedinOutlined, 
  WhatsAppOutlined,
  MailOutlined,
  CopyOutlined,
  PictureOutlined
} from '@ant-design/icons';

const { Text } = Typography;

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ 
  visible, 
  onClose, 
  url, 
  title = '', 
  description = '',
  image = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const shareText = title || 'Check this out!';
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(shareText);
  const shareDescription = encodeURIComponent(description);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <FacebookOutlined />,
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
    },
    {
      name: 'Twitter',
      icon: <TwitterOutlined />,
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`
    },
    {
      name: 'LinkedIn',
      icon: <LinkedinOutlined />,
      color: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
    },
    {
      name: 'WhatsApp',
      icon: <WhatsAppOutlined />,
      color: '#25D366',
      url: `https://wa.me/?text=${shareTitle}%20${shareUrl}`
    },
    {
      name: 'Email',
      icon: <MailOutlined />,
      color: '#EA4335',
      url: `mailto:?subject=${shareTitle}&body=${shareDescription}%0A%0A${shareUrl}`
    }
  ];

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      message.success('URL copied to clipboard!');
    } catch (err) {
      message.error('Failed to copy URL');
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Reset states when modal opens/closes
  React.useEffect(() => {
    if (visible) {
      setImageError(false);
      setImageLoading(true);
    }
  }, [visible, image]);

  return (
    <Modal
      title="Share This Link"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
    >
      <div className="space-y-6">
        {/* URL Copy Section */}
        <div>
          <Text strong className="block mb-2">Share this URL:</Text>
          <Space.Compact className="w-full">
            <Input
              value={url}
              readOnly
              className="flex-1"
            />
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={copyToClipboard}
            >
              Copy
            </Button>
          </Space.Compact>
        </div>

        {/* Social Media Buttons */}
        <div>
          <Text strong className="block mb-3">Share on social media:</Text>
          <div className="grid grid-cols-3 gap-3">
            {shareLinks.map((platform) => (
              <Button
                key={platform.name}
                size="large"
                icon={platform.icon}
                onClick={() => handleShare(platform.url)}
                style={{
                  background: platform.color,
                  borderColor: platform.color,
                  color: 'white',
                  height: '50px'
                }}
                className="flex items-center justify-center font-medium"
              >
                {platform.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        {(title || description || image) && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <Text strong className="block mb-3">Preview:</Text>
            
            {/* Image Preview */}
            {image && !imageError && (
              <div className="mb-3 rounded-lg overflow-hidden bg-white border border-gray-200">
                {imageLoading && (
                  <div className="h-32 bg-gray-100 flex items-center justify-center">
                    <PictureOutlined className="text-gray-400 text-2xl" />
                  </div>
                )}
                <img 
                  src={image} 
                  alt={title}
                  crossOrigin="anonymous"
                  className={`w-full h-32 object-cover transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: imageLoading ? 'none' : 'block' }}
                />
              </div>
            )}

            {/* Title */}
            {title && (
              <Text strong className="block mb-2 text-sm line-clamp-2">
                {title}
              </Text>
            )}

            {/* Description */}
            {description && (
              <Text type="secondary" className="block text-xs line-clamp-2 mb-2">
                {description}
              </Text>
            )}

            {/* URL */}
            <Text type="secondary" className="block text-xs truncate">
              {url}
            </Text>

            {/* Image Error Message */}
            {imageError && (
              <div className="flex items-center gap-2 text-xs text-orange-600 mt-2">
                <PictureOutlined />
                <span>Preview image not available</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ShareModal;