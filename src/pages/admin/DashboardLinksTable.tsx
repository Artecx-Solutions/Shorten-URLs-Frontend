import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Tag, 
  Tooltip, 
  Badge,
  Button,
  Space,
  Typography,
  Spin
} from 'antd';
import { 
  LinkOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { adminLinksService } from '../../services/adminLinksService';
import { AdminLink, AdminLinksResponse } from '../../types/admin';

const { Text } = Typography;

interface DashboardLinksTableProps {
  limit?: number;
  showTitle?: boolean;
  compact?: boolean;
}

const DashboardLinksTable: React.FC<DashboardLinksTableProps> = ({ 
  limit = 10,
  compact = false
}) => {
  const [links, setLinks] = useState<AdminLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: limit,
    total: 0,
    pages: 0
  });

  const loadLinks = async () => {
    setLoading(true);
    try {
      const response: AdminLinksResponse = await adminLinksService.getLinks(
        1, 
        limit,
        {
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }
      );
      setLinks(response.links);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error('Failed to load links:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, [limit]);

  const handleOpenLink = (shortCode: string) => {
    const fullUrl = `${window.location.origin}/${shortCode}`;
    window.open(fullUrl, '_blank');
  };

  const handleCopyShortUrl = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    // You can add a message.success here if needed
  };

  const isLinkExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getStatusColor = (link: AdminLink) => {
    if (!link.isActive) return 'red';
    if (isLinkExpired(link.expiresAt)) return 'orange';
    return 'green';
  };

  const getStatusText = (link: AdminLink) => {
    if (!link.isActive) return 'Inactive';
    if (isLinkExpired(link.expiresAt)) return 'Expired';
    return 'Active';
  };

  const columns = [
    {
      title: 'Short URL',
      dataIndex: 'shortCode',
      key: 'shortUrl',
      width: compact ? 120 : 150,
      render: (code: string, record: AdminLink) => {
        const shortUrl = `${window.location.origin}/${code}`;
        return (
          <Space direction="vertical" size={4}>
            <Space size={4}>
              <Tooltip title="Click to open">
                <Text 
                  className="font-mono text-blue-600 cursor-pointer hover:text-blue-800 hover:underline"
                  style={{ fontSize: compact ? '12px' : '14px' }}
                  onClick={() => handleOpenLink(code)}
                >
                  {shortUrl}
                </Text>
              </Tooltip>
              <Tooltip title="Copy short URL">
                <Button 
                  icon={<CopyOutlined />} 
                  size="small" 
                  type="text"
                  onClick={() => handleCopyShortUrl(code)}
                  style={{ fontSize: compact ? '10px' : '12px' }}
                />
              </Tooltip>
            </Space>
            {record.customAlias && record.customAlias !== code && (
              <Tag color="cyan" size="small">Alias: {record.customAlias}</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Original URL',
      dataIndex: 'originalUrl',
      key: 'originalUrl',
       width: 50,
      ellipsis: true,
      render: (url: string) => (
        <Tooltip title={url}>
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer" style={{ maxWidth: 200 }}>
            {url}
          </span>
        </Tooltip>
      ),
    },    
    {
      title: 'Clicks',
      dataIndex: 'clicks',
      key: 'clicks',
      width: compact ? 60 : 80,
      align: 'center' as const,
      render: (clicks: number) => (
        <Badge 
          count={clicks} 
          showZero 
          color={clicks > 0 ? 'blue' : 'default'}
          style={{ 
            fontSize: compact ? '10px' : '12px',
            fontWeight: 'bold'
          }}
        />
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: compact ? 80 : 100,
      render: (_: any, record: AdminLink) => (
        <Tag 
          color={getStatusColor(record)} 
          style={{ 
            margin: 0,
            fontSize: compact ? '10px' : '12px',
            padding: compact ? '2px 6px' : '4px 8px',
            fontWeight: '500'
          }}
        >
          {getStatusText(record)}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-3">
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={links}
          rowKey="_id"
          loading={false}
          pagination={false}
          size={compact ? "small" : "middle"}
          scroll={{ x: 500 }}
          showHeader={!compact}
          className="dashboard-links-table"
        />
        
        {links.length === 0 && !loading && (
          <div className="text-center py-4 text-gray-500">
            <LinkOutlined style={{ fontSize: 24, marginBottom: 8 }} />
            <div>No links found</div>
          </div>
        )}
      </Spin>

      {!compact && links.length > 0 && (
        <div className="mt-3 text-center">
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Showing {links.length} of {pagination.total} links
          </Text>
        </div>
      )}
    </>
  );
};

export default DashboardLinksTable;