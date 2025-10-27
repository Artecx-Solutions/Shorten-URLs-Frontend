// components/LinkManagement.tsx
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Tag, 
  Space, 
  message, 
  Popconfirm, 
  Input, 
  Pagination, 
  Select,
  Tooltip,
  Badge,
} from 'antd';
import { 
  DeleteOutlined, 
  EyeOutlined, 
  LinkOutlined, 
  UserOutlined,
} from '@ant-design/icons';
import { adminLinksService } from '../../services/adminLinksService';
import { AdminLink, AdminLinksResponse } from '../../types/admin';

const { Option } = Select;
const { Search } = Input;


const LinkManagement: React.FC = () => {
  const [links, setLinks] = useState<AdminLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '' as string,
    sortBy: 'createdAt' as string,
    sortOrder: 'desc' as string,
  });

  const loadLinks = async (page: number = 1, filterParams?: any) => {
    setLoading(true);
    try {
      const currentFilters = filterParams || filters;
      const response: AdminLinksResponse = await adminLinksService.getLinks(
        page, 
        pagination.limit, 
        {
          search: currentFilters.search,
          status: currentFilters.status || undefined,
          sortBy: currentFilters.sortBy as any,
          sortOrder: currentFilters.sortOrder as any,
        }
      );
      setLinks(response.links);
      setPagination(response.pagination);
    } catch (error: any) {
      message.error(error.message || 'Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleSearch = (value: string) => {
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    loadLinks(1, newFilters);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    loadLinks(1, newFilters);
  };

  const handlePageChange = (page: number) => {
    loadLinks(page);
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await adminLinksService.deleteLink(linkId);
      setLinks(prev => prev.filter(link => link._id !== linkId));
      message.success('Link deleted successfully');
    } catch (error: any) {
      message.error(error.message || 'Failed to delete link');
    }
  };

  const handleOpenLink = (shortCode: string) => {
    const fullUrl = `${window.location.origin}/${shortCode}`;
    window.open(fullUrl, '_blank');
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
      title: 'Short Link',
      dataIndex: 'shortCode',
      key: 'shortCode',
      width: 120,
      render: (code: string, record: AdminLink) => (
        <Space>
          <Tag color="blue" icon={<LinkOutlined />}>
            {code}
          </Tag>
          {record.customAlias && record.customAlias !== code && (
            <Tag color="cyan">Custom: {record.customAlias}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Original URL',
      dataIndex: 'originalUrl',
      key: 'originalUrl',
       width: 100,
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
      width: 100,
      render: (clicks: number) => (
        <Badge count={clicks} showZero color={clicks > 0 ? 'blue' : 'default'} />
      ),
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 300,
      render: (user: any) => (
        user ? (
          <Space>
            <UserOutlined />
            <span>{user.fullName}</span>
            <Tag color={user.role === 'admin' ? 'gold' : 'blue'}>
              {user.role}
            </Tag>
          </Space>
        ) : (
          <Tag color="default">Anonymous</Tag>
        )
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_: any, record: AdminLink) => (
        <Space>
          <Tag color={getStatusColor(record)}>
            {getStatusText(record)}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Expires',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      width: 120,
      render: (date: string) => (
        <Tooltip title={new Date(date).toLocaleString()}>
          <Tag color={isLinkExpired(date) ? 'red' : 'default'}>
            {new Date(date).toLocaleDateString()}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: AdminLink) => (
        <Space>
          <Tooltip title="Open Link">
            <Button 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleOpenLink(record.shortCode)}
              disabled={!record.isActive || isLinkExpired(record.expiresAt)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this link?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteLink(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />} 
              danger 
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Link Management</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <Search
            placeholder="Search links..."
            style={{ width: 300 }}
            onSearch={handleSearch}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            enterButton
          />
          
          <Select
            placeholder="Status"
            style={{ width: 120 }}
            value={filters.status || undefined}
            onChange={(value) => handleFilterChange('status', value)}
            allowClear
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="expired">Expired</Option>
          </Select>

          <Select
            placeholder="Sort By"
            style={{ width: 140 }}
            value={filters.sortBy}
            onChange={(value) => handleFilterChange('sortBy', value)}
          >
            <Option value="createdAt">Created Date</Option>
            <Option value="clicks">Clicks</Option>
            <Option value="expiresAt">Expiry Date</Option>
          </Select>

          <Select
            placeholder="Order"
            style={{ width: 120 }}
            value={filters.sortOrder}
            onChange={(value) => handleFilterChange('sortOrder', value)}
          >
            <Option value="desc">Descending</Option>
            <Option value="asc">Ascending</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={links}
          rowKey="_id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1200 }}
        />

        <div className="mt-4 flex justify-center">
          <Pagination
            current={pagination.page}
            pageSize={pagination.limit}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger
            onShowSizeChange={(_current, size) => {
              setPagination(prev => ({...prev, limit: size}));
              loadLinks(1);
            }}
            showQuickJumper
            showTotal={(total, range) => 
              `Showing ${range[0]}-${range[1]} of ${total} links`
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default LinkManagement;