// pages/admin/dashboard.tsx
import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Table, 
  Tag, 
  Progress,
  List,
  Space,
  Avatar
} from 'antd';
import { 
  LinkOutlined, 
  UserOutlined, 
  EyeOutlined, 
  RocketOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  // Sample data
  const statsData = [
    {
      title: 'Total Short Links',
      value: 11280,
      precision: 0,
      valueStyle: { color: '#3f8600' },
      prefix: <ArrowUpOutlined />,
      suffix: null,
      icon: <LinkOutlined />,
    },
    {
      title: 'Active Users',
      value: 9280,
      precision: 0,
      valueStyle: { color: '#1890ff' },
      prefix: <ArrowUpOutlined />,
      suffix: null,
      icon: <UserOutlined />,
    },
    {
      title: 'Total Clicks',
      value: 456789,
      precision: 0,
      valueStyle: { color: '#cf1322' },
      prefix: <ArrowUpOutlined />,
      suffix: null,
      icon: <EyeOutlined />,
    },
    {
      title: 'Avg. Click Rate',
      value: 68.9,
      precision: 1,
      valueStyle: { color: '#722ed1' },
      prefix: null,
      suffix: '%',
      icon: <RocketOutlined />,
    },
  ];

  const recentLinks = [
    {
      key: '1',
      shortUrl: 'myurl.life/abc123',
      originalUrl: 'https://example.com/very-long-url-path',
      clicks: 156,
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      key: '2',
      shortUrl: 'myurl.life/def456',
      originalUrl: 'https://anotherexample.com/path',
      clicks: 89,
      status: 'active',
      createdAt: '2024-01-14',
    },
    {
      key: '3',
      shortUrl: 'myurl.life/ghi789',
      originalUrl: 'https://third-example.com/article',
      clicks: 234,
      status: 'inactive',
      createdAt: '2024-01-13',
    },
  ];

  const topLinks = [
    { name: 'myurl.life/promo2024', clicks: 1256 },
    { name: 'myurl.life/product-launch', clicks: 987 },
    { name: 'myurl.life/blog-post', clicks: 654 },
    { name: 'myurl.life/special-offer', clicks: 543 },
    { name: 'myurl.life/newsletter', clicks: 432 },
  ];

  const columns = [
    {
      title: 'Short URL',
      dataIndex: 'shortUrl',
      key: 'shortUrl',
      render: (text: string) => (
        <Text copyable className="font-mono text-blue-600">
          {text}
        </Text>
      ),
    },
    {
      title: 'Original URL',
      dataIndex: 'originalUrl',
      key: 'originalUrl',
      render: (text: string) => (
        <Text ellipsis style={{ maxWidth: 200 }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Clicks',
      dataIndex: 'clicks',
      key: 'clicks',
      render: (clicks: number) => (
        <Tag color="blue">{clicks}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <Title level={2} className="!mb-2">
            Dashboard Overview
          </Title>
          <Text type="secondary">
            Welcome back! Here's what's happening with your links today.
          </Text>
        </div>
        <div className="text-right">
          <Text type="secondary" className="block text-sm">
            Last updated
          </Text>
          <Text strong>
            {new Date().toLocaleDateString()}
          </Text>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <Statistic
                title={stat.title}
                value={stat.value}
                precision={stat.precision}
                valueStyle={stat.valueStyle}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
              <div className="absolute top-4 right-4 text-2xl text-gray-300">
                {stat.icon}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* Recent Links Table */}
        <Col xs={24} lg={16}>
          <Card 
            title="Recent Short Links" 
            extra={<a href="/admin/links">View All</a>}
            className="h-full"
          >
            <Table 
              dataSource={recentLinks} 
              columns={columns}
              pagination={false}
              size="small"
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>

        {/* Right Sidebar - Analytics */}
        <Col xs={24} lg={8}>
          {/* Top Performing Links */}
          <Card title="Top Performing Links" className="mb-4">
            <List
              dataSource={topLinks}
              renderItem={(item, index) => (
                <List.Item>
                  <div className="flex justify-between items-center w-full">
                    <Space>
                      <Text strong className="w-6">#{index + 1}</Text>
                      <Text ellipsis style={{ maxWidth: 150 }}>
                        {item.name}
                      </Text>
                    </Space>
                    <Tag color="blue">{item.clicks} clicks</Tag>
                  </div>
                </List.Item>
              )}
              size="small"
            />
          </Card>

          {/* Performance Metrics */}
          <Card title="Performance Metrics">
            <Space direction="vertical" className="w-full" size="middle">
              <div>
                <div className="flex justify-between mb-1">
                  <Text>Link Performance</Text>
                  <Text strong>78%</Text>
                </div>
                <Progress percent={78} strokeColor="#52c41a" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <Text>User Engagement</Text>
                  <Text strong>65%</Text>
                </div>
                <Progress percent={65} strokeColor="#1890ff" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <Text>Conversion Rate</Text>
                  <Text strong>42%</Text>
                </div>
                <Progress percent={42} strokeColor="#722ed1" />
              </div>
            </Space>
          </Card>

          {/* Quick Stats */}
          <Card title="Quick Stats" className="mt-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Space>
                  <CheckCircleOutlined className="text-green-500" />
                  <Text>Active Links</Text>
                </Space>
                <Text strong>245</Text>
              </div>
              <div className="flex justify-between items-center">
                <Space>
                  <ClockCircleOutlined className="text-orange-500" />
                  <Text>Expiring Soon</Text>
                </Space>
                <Text strong>12</Text>
              </div>
              <div className="flex justify-between items-center">
                <Space>
                  <EyeOutlined className="text-blue-500" />
                  <Text>Today's Clicks</Text>
                </Space>
                <Text strong>1,234</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Additional Sections */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Activity">
            <List
              dataSource={[
                { action: 'Link created', target: 'myurl.life/abc123', time: '2 hours ago' },
                { action: 'Link deleted', target: 'myurl.life/old123', time: '5 hours ago' },
                { action: 'User registered', target: 'john@example.com', time: '1 day ago' },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} size="small" />}
                    title={item.action}
                    description={
                      <Space>
                        <Text type="secondary">{item.target}</Text>
                        <Text type="secondary">•</Text>
                        <Text type="secondary">{item.time}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
              size="small"
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="System Status">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <Text strong>API Service</Text>
                <Tag color="green">Operational</Tag>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <Text strong>Database</Text>
                <Tag color="green">Healthy</Tag>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <Text strong>Cache Service</Text>
                <Tag color="orange">Degraded</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;