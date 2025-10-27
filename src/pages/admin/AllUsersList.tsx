import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Space, 
  Typography, 
  Spin, 
  message, 
  Button, 
  Input,
  Badge
} from 'antd';
import { 
  ReloadOutlined, 
  UserOutlined, 
  SearchOutlined,
  MailOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { adminService } from '../../services/adminService';
import { User } from '../../types/admin';

const { Text } = Typography;
const { Search } = Input;

const AllUsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      // Get all users with their stats
      const usersResponse = await adminService.getUsers(1, 1000); // Get large number to get all users
      setUsers(usersResponse.users);
      message.success(`Loaded ${usersResponse.users.length} users`);
    } catch (error: any) {
      message.error('Failed to load users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Filter users based on search text
  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'User',
      dataIndex: 'fullName',
      key: 'user',
      width: 100,
      render: (name: string, user: User) => (
        <Space>
          <Badge 
            dot 
            color={user.isActive ? '#52c41a' : '#ff4d4f'}
            offset={[-5, 5]}
          >
            <UserOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
          </Badge>
          <div className="flex flex-col">
            <Text strong style={{ fontSize: '14px' }}>
              {name || 'Unknown User'}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {user.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 10,
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Short URLs',
      dataIndex: 'linkCount',
      key: 'linkCount',
      width: 10,
      align: 'center' as const,
      render: (count: number) => (
        <Tag color={count > 0 ? 'blue' : 'default'}>
          {count || 0}
        </Tag>
      ),
    },
    {
      title: 'Total Clicks',
      dataIndex: 'totalClicks',
      key: 'totalClicks',
      width: 10,
      align: 'center' as const,
      render: (clicks: number) => (
        <Text strong style={{ color: clicks > 0 ? '#1890ff' : '#999' }}>
          {clicks?.toLocaleString() || 0}
        </Text>
      ),
    },
  ];

  return (
    <Card 
      title={
        <Space>
          <UserOutlined />
          <span>All Users</span>
          <Tag color="blue">{users.length} users</Tag>
        </Space>
      } 
      className="mb-4"
      extra={
        <Space>
          <Search
            placeholder="Search users..."
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchAllUsers}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      }
    >
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          loading={false}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} users`,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
          size="middle"
          locale={{
            emptyText: (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <UserOutlined style={{ fontSize: '48px', color: '#ddd', marginBottom: '16px' }} />
                <div>No users found</div>
              </div>
            )
          }}
        />
      </Spin>
    </Card>
  );
};

export default AllUsersList;