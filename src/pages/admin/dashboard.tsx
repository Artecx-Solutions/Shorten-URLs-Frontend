// pages/admin/dashboard.tsx
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
} from 'antd';
import { 
  LinkOutlined, 
  UserOutlined, 
  EyeOutlined, 
  RocketOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import DashboardLinksTable from '../admin/DashboardLinksTable';
import { adminLinksService } from '../../services/adminLinksService';
import { adminService } from '../../services/adminService';
import TopPerformingUsers from './AllUsersList';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {

  const [statsData, setStatsData] = useState([
    {
      title: 'Total Short Links',
      value: 0,
      precision: 0,
      valueStyle: { color: '#3f8600' },
      prefix: <ArrowUpOutlined />,
      suffix: null,
      icon: <LinkOutlined />,
    },
    {
      title: 'Active Users',
      value: 0,
      precision: 0,
      valueStyle: { color: '#1890ff' },
      prefix: <ArrowUpOutlined />,
      suffix: null,
      icon: <UserOutlined />,
    },
    {
      title: 'Total Clicks',
      value: 0,
      precision: 0,
      valueStyle: { color: '#cf1322' },
      prefix: <ArrowUpOutlined />,
      suffix: null,
      icon: <EyeOutlined />,
    },
    {
      title: 'Avg. Click Rate',
      value: 0,
      precision: 1,
      valueStyle: { color: '#722ed1' },
      prefix: null,
      suffix: '%',
      icon: <RocketOutlined />,
    },
  ]);

  const [loading, setLoading] = useState(true);



  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch links data
      const linksResponse = await adminLinksService.getLinks(1, 1, {});
      
      // Fetch users data
      const usersResponse = await adminService.getUsers(1, 1, {});
      
      // Calculate total clicks from all links
      const totalClicks = linksResponse.links.reduce((sum: number, link: any) => sum + (link.clicks || 0), 0);
      
      // Calculate average click rate (percentage of links with clicks)
      const linksWithClicks = linksResponse.links.filter((link: any) => link.clicks > 0).length;
      const avgClickRate = linksResponse.pagination.total > 0 
        ? (linksWithClicks / linksResponse.pagination.total) * 100 
        : 0;

      // Update stats data with real values
      setStatsData([
        {
          title: 'Total Short Links',
          value: linksResponse.pagination.total,
          precision: 0,
          valueStyle: { color: '#3f8600' },
          prefix: <ArrowUpOutlined />,
          suffix: null,
          icon: <LinkOutlined />,
        },
        {
          title: 'Active Users',
          value: usersResponse.pagination.total,
          precision: 0,
          valueStyle: { color: '#1890ff' },
          prefix: <ArrowUpOutlined />,
          suffix: null,
          icon: <UserOutlined />,
        },
        {
          title: 'Total Clicks',
          value: totalClicks,
          precision: 0,
          valueStyle: { color: '#cf1322' },
          prefix: <ArrowUpOutlined />,
          suffix: null,
          icon: <EyeOutlined />,
        },
        {
          title: 'Avg. Click Rate',
          value: avgClickRate,
          precision: 1,
          valueStyle: { color: '#722ed1' },
          prefix: null,
          suffix: '%',
          icon: <RocketOutlined />,
        },
      ]);

    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Fallback to default values if API fails
      setStatsData([
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
      ]);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    fetchDashboardStats();
  }, []);

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
      <Row gutter={16} className="mb-6">
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card 
              style={{ 
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              bodyStyle={{ 
                width: '100%',
                padding: '16px'
              }}
            >
              <Statistic
                title={
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {stat.icon}
                    {stat.title}
                  </div>
                }
                value={stat.value}
                precision={stat.precision}
                valueStyle={stat.valueStyle}
                prefix={stat.prefix}
                suffix={stat.suffix}
                loading={loading}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* Recent Links Table */}
        <Col xs={24} lg={14}>
          <Card 
            title="Recent Short Links" 
            extra={<a href="/admin/links">View All</a>}
            className="h-full"
          >
<DashboardLinksTable />
          </Card>
        </Col>

        {/* Right Sidebar - Analytics */}
        <Col xs={24} lg={10}>
          {/* Top Performing Links */}
          <TopPerformingUsers />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;