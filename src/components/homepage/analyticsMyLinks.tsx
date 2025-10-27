import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  Card, 
  Tag, 
  Space, 
  Button, 
  message, 
  Popconfirm, 
  Tooltip,
  Pagination,
  Spin,
  Typography,
  Input,
  Result,
  Empty
} from 'antd';
import { 
  CopyOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SearchOutlined,
  LinkOutlined,
  LoginOutlined,
  LockOutlined
} from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import { linkService, ShortLink, MyLinksResponse } from '../../services/shortlinkService';
import { sessionErrorEmitter } from '../../services/apiService';
import SessionExpiredModal from '../../components/error/SessionExpiredModal';
import { useSessionError } from '../../hooks/useSessionError';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../../pages/homepage/loginModal';

const { Title, Text } = Typography;
const { Search } = Input;

const AnalyticsMyLinks = () => {
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [searchText, setSearchText] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Login modal state
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Use AuthContext - remove checkAuth since it doesn't exist
  const { isAuthenticated, user, logout } = useAuth();

  const {
    showSessionModal,
    handleSessionError,
    handleRedirectToLogin,
    handleReloadPage
  } = useSessionError();

  // Memoize the loadMyLinks function to prevent unnecessary re-renders
  const loadMyLinks = useCallback(async () => {
    if (!isAuthenticated || dataLoaded) {
      return;
    }

    try {
      setLoading(true);
      const response: MyLinksResponse = await linkService.getMyLinks(pagination.page, pagination.limit);
      setLinks(response.links);
      setPagination(response.pagination);
      setDataLoaded(true);
    } catch (error: any) {
      if (error.message?.includes('Session expired') || error.message?.includes('401')) {
        handleSessionError();
      } else {
        message.error('Failed to load links');
      }
      console.error('Error loading links:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, pagination.page, pagination.limit, dataLoaded, handleSessionError]);

  // Check authentication status on component mount
  useEffect(() => {
    // Remove checkAuth call - just use isAuthenticated from context
    if (isAuthenticated && !dataLoaded) {
      loadMyLinks();
    }
    
    // Subscribe to session errors
    const unsubscribe = sessionErrorEmitter.subscribe(handleSessionError);
    
    return () => {
      unsubscribe();
    };
  }, [isAuthenticated, dataLoaded, loadMyLinks, handleSessionError]); // Add dependencies

  const handleCopyLink = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    message.success('Link copied to clipboard!');
  };

  const handleOpenLink = (shortCode: string) => {
    try {
      const frontendBaseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
      const cleanBaseUrl = frontendBaseUrl.replace(/\/+$/, '');
      const fullUrl = `${cleanBaseUrl}/${shortCode}`;
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening link:', error);
      message.error('Failed to open link');
    }
  };

  const handleDeleteLink = async (linkId: string, shortCode: string) => {
    if (!isAuthenticated) {
      handleSessionError();
      return;
    }

    try {
      await linkService.deleteLink(shortCode);
      message.success('Link deleted successfully');
      setDataLoaded(false);
      loadMyLinks();
    } catch (error: any) {
      if (error.message?.includes('Session expired') || error.message?.includes('401')) {
        handleSessionError();
      } else {
        message.error('Failed to delete link');
      }
    }
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination(prev => ({
      ...prev,
      page,
      limit: pageSize || prev.limit
    }));
    setDataLoaded(false);
  };

  // Effect to reload data when pagination changes
  useEffect(() => {
    if (isAuthenticated && !dataLoaded) {
      loadMyLinks();
    }
  }, [pagination.page, pagination.limit, dataLoaded, isAuthenticated, loadMyLinks]);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setDataLoaded(false);
    message.success('Login successful! Loading your links...');
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
  };

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    message.info('Sign up feature coming soon!');
  };

  const handleRefresh = () => {
    setDataLoaded(false);
  };

  const filteredLinks = links.filter(link =>
    link.originalUrl.toLowerCase().includes(searchText.toLowerCase()) ||
    link.shortCode.toLowerCase().includes(searchText.toLowerCase()) ||
    (link.description && link.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  const columns = [
    {
      title: 'Short Link',
      dataIndex: 'shortCode',
      key: 'shortCode',
      width: 150,
      render: (shortCode: string) => (
        <Space>
          <Tag color="blue" icon={<LinkOutlined />}>
            {shortCode}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Original URL',
      dataIndex: 'originalUrl',
      key: 'originalUrl',
      ellipsis: true,
      render: (url: string) => (
        <Tooltip title={url}>
          <Text style={{ maxWidth: 150 }} ellipsis>{url}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Clicks',
      dataIndex: 'clicks',
      key: 'clicks',
      width: 100,
      render: (clicks: number) => (
        <Tag color={clicks > 0 ? 'green' : 'default'}>
          {clicks} clicks
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_: any, record: { expiresAt: string | number | Date; isActive: any; }) => {
        const isExpired = new Date(record.expiresAt) < new Date();
        const isActive = record.isActive;
        
        let status: string;
        let color: string;
        
        if (isExpired) {
          status = 'Expired';
          color = 'red';
        } else if (!isActive) {
          status = 'Inactive';
          color = 'orange';
        } else {
          status = 'Active';
          color = 'green';
        }
        
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Expires',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      width: 120,
      render: (expiresAt: string) => {
        const isExpired = new Date(expiresAt) < new Date();
        return (
          <Tag color={isExpired ? 'red' : 'default'}>
            {new Date(expiresAt).toLocaleDateString()}
          </Tag>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (createdAt: string) => (
        <Text type="secondary">
          {new Date(createdAt).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 250,
      render: (_: any, record: ShortLink) => {
        const isExpired = new Date(record.expiresAt) < new Date();
        const isActive = record.isActive;
        const canOpenLink = !isExpired && isActive;

        return (
          <Space size="small">
            <Tooltip title={canOpenLink ? "Open Link" : isExpired ? "Link has expired" : "Link is inactive"}>
              <Button 
                icon={<LinkOutlined />} 
                size="small"
                type={canOpenLink ? "primary" : "default"}
                danger={isExpired}
                disabled={!canOpenLink}
                onClick={() => canOpenLink && handleOpenLink(record.shortCode)}
              >
                {canOpenLink ? 'Open' : isExpired ? 'Expire' : 'Inactive'}
              </Button>
            </Tooltip>
            
            <Tooltip title="Copy short link">
              <Button 
                icon={<CopyOutlined />} 
                size="small"
                onClick={() => handleCopyLink(record.shortCode)}
              />
            </Tooltip>
            
            <Tooltip title="View analytics">
              <Button 
                icon={<EyeOutlined />} 
                size="small"
                onClick={() => message.info('Analytics feature coming soon!')}
              />
            </Tooltip>
            
            <Popconfirm
              title="Delete this link?"
              description="Are you sure you want to delete this short link?"
              onConfirm={() => handleDeleteLink(record._id, record.shortCode)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete">
                <Button 
                  icon={<DeleteOutlined />} 
                  size="small" 
                  danger
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    }
  ];

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#2563eb',
            borderRadius: 8,
          },
        }}
      >
        <div style={{ padding: '24px' }}>
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>
                <Text>Checking authentication...</Text>
              </div>
            </div>
          </Card>
        </div>
      </ConfigProvider>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#2563eb',
              borderRadius: 8,
            },
          }}
        >
          <div style={{ padding: '24px' }}>
            <Card>
              <Result
                icon={<LockOutlined style={{ color: '#ff4d4f', fontSize: '48px' }} />}
                title="Authentication Required"
                subTitle="Please log in to view and manage your short links."
                extra={
                  <Button 
                    type="primary" 
                    icon={<LoginOutlined />}
                    onClick={handleLoginClick}
                    size="large"
                    style={{
                      height: '48px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      border: 'none',
                      padding: '0 32px'
                    }}
                  >
                    Sign In
                  </Button>
                }
              />
            </Card>
          </div>
        </ConfigProvider>

        <LoginModal
          visible={showLoginModal}
          onClose={handleLoginClose}
          onSuccess={handleLoginSuccess}
          onSwitchToSignup={handleSwitchToSignup}
        />
      </>
    );
  }

  // Show main content when authenticated
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#2563eb',
            borderRadius: 8,
          },
        }}
      >
        <div style={{ padding: '24px' }}>
          <Card>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Title level={4}>My Short Links</Title>
                <Text type="secondary">Welcome back, {user?.name || user?.email}!</Text>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button 
                  type="default" 
                  icon={<EyeOutlined />}
                  onClick={handleRefresh}
                >
                  Refresh
                </Button>
              </div>
            </div>

            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Search
                placeholder="Search links..."
                allowClear
                style={{ width: 300 }}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={setSearchText}
              />
            </div>

            <Spin spinning={loading}>
              {filteredLinks.length > 0 ? (
                <>
                  <Table
                    columns={columns}
                    dataSource={filteredLinks}
                    rowKey="_id"
                    pagination={false}
                    scroll={{ x: 1000 }}
                  />
                  
                  <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                      current={pagination.page}
                      pageSize={pagination.limit}
                      total={pagination.total}
                      onChange={handlePageChange}
                      showSizeChanger
                      showQuickJumper
                      showTotal={(total, range) => 
                        `Showing ${range[0]}-${range[1]} of ${total} items`
                      }
                    />
                  </div>
                </>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span>
                      No short links found. <a onClick={() => message.info('Create link feature coming soon!')}>Create your first one!</a>
                    </span>
                  }
                />
              )}
            </Spin>
          </Card>
        </div>
      </ConfigProvider>

      <SessionExpiredModal
        visible={showSessionModal}
        onRedirectToLogin={handleLoginClick}
        onReload={handleReloadPage}
      />
    </>
  );
};

export default AnalyticsMyLinks;