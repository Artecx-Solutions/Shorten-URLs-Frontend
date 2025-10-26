// components/AnalyticsMyLinks.tsx
import React, { useState, useEffect } from 'react';
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
  Input
} from 'antd';
import { 
  CopyOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  EditOutlined,
  SearchOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import { linkService, ShortLink, MyLinksResponse } from '../services/shortlinkService';
import { sessionErrorEmitter } from '../services/apiService';
import SessionExpiredModal from '../components/error/SessionExpiredModal';
import { useSessionError } from '../hooks/useSessionError';

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

  const {
    showSessionModal,
    handleSessionError,
    handleRedirectToLogin,
    handleReloadPage
  } = useSessionError();

  useEffect(() => {
    loadMyLinks();
    
    // Subscribe to session errors
    const unsubscribe = sessionErrorEmitter.subscribe(handleSessionError);
    
    return () => {
      unsubscribe();
    };
  }, [pagination.page, pagination.limit, handleSessionError]);

  const loadMyLinks = async () => {
    try {
      setLoading(true);
      const response: MyLinksResponse = await linkService.getMyLinks(pagination.page, pagination.limit);
      setLinks(response.links);
      setPagination(response.pagination);
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
  };

  const handleCopyLink = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    message.success('Link copied to clipboard!');
  };

  const handleDeleteLink = async (linkId: string, shortCode: string) => {
    try {
      await linkService.deleteLink(shortCode);
      message.success('Link deleted successfully');
      loadMyLinks(); // Refresh the list
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
          <Text style={{ maxWidth: 300 }} ellipsis>{url}</Text>
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
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
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
      width: 150,
      render: (_: any, record: ShortLink) => (
        <Space size="small">
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
          <Tooltip title="Edit">
            <Button 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => message.info('Edit feature coming soon!')}
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
      ),
    },
  ];

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
            <div style={{ marginBottom: 24 }}>
              <Title level={2}>My Short Links</Title>
              <Text type="secondary">
                Manage and track your shortened URLs
              </Text>
            </div>

            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Search
                placeholder="Search links..."
                allowClear
                style={{ width: 300 }}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={setSearchText}
              />
              <Button 
                type="primary" 
                icon={<LinkOutlined />}
                onClick={() => message.info('Create link feature coming soon!')}
              >
                Create New Link
              </Button>
            </div>

            <Spin spinning={loading}>
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
            </Spin>
          </Card>
        </div>
      </ConfigProvider>

      {/* Session Expired Modal */}
      <SessionExpiredModal
        visible={showSessionModal}
        onRedirectToLogin={handleRedirectToLogin}
        onReload={handleReloadPage}
      />
    </>
  );
};

export default AnalyticsMyLinks;