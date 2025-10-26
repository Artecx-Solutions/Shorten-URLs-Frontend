// components/SessionExpiredModal.tsx
import React from 'react';
import { Modal, Button, Result, Typography, Space } from 'antd';
import { LogoutOutlined, LoginOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface SessionExpiredModalProps {
  visible: boolean;
  onRedirectToLogin: () => void;
  onReload?: () => void;
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  visible,
  onRedirectToLogin,
  onReload
}) => {
  const handleLoginRedirect = () => {
    onRedirectToLogin();
  };

  const handleReload = () => {
    if (onReload) {
      onReload();
    } else {
      window.location.reload();
    }
  };

  return (
    <Modal
      open={visible}
      closable={false}
      maskClosable={false}
      footer={null}
      width={480}
      centered
      styles={{
        body: {
          padding: '0',
        }
      }}
    >
      <Result
        status="warning"
        title="Session Expired"
        subTitle="Your session has expired due to inactivity or invalid credentials."
        icon={
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#fff7e6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            border: '2px solid #ffd591'
          }}>
            <LogoutOutlined style={{ fontSize: 32, color: '#fa8c16' }} />
          </div>
        }
        extra={
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={handleLoginRedirect}
              size="large"
              style={{
                height: '48px',
                fontSize: '16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                border: 'none',
                width: '100%'
              }}
            >
              Sign In Again
            </Button>
            
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReload}
              size="large"
              style={{
                height: '48px',
                fontSize: '16px',
                borderRadius: '8px',
                width: '100%'
              }}
            >
              Reload Page
            </Button>
          </Space>
        }
      />
      
      <div style={{ 
        padding: '16px 24px', 
        backgroundColor: '#f8f9fa', 
        borderTop: '1px solid #f0f0f0',
        borderRadius: '0 0 8px 8px'
      }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          For security reasons, your session has been automatically terminated after a period of inactivity.
        </Text>
      </div>
    </Modal>
  );
};

export default SessionExpiredModal;