// components/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Tag, Space, message, Popconfirm, Input, Pagination } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, UserOutlined, CrownOutlined } from '@ant-design/icons';
import { adminService } from '../../services/adminService';
import { User, UsersResponse } from '../../types/admin';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [searchText, setSearchText] = useState('');

  const loadUsers = async (page: number = 1, search?: string) => {
    setLoading(true);
    try {
      const response: UsersResponse = await adminService.getUsers(page, pagination.limit, search);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (error: any) {
      message.error(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    loadUsers(1, value);
  };

  const handlePageChange = (page: number) => {
    loadUsers(page, searchText);
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const updatedUser = await adminService.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(user => 
        user._id === userId ? updatedUser : user
      ));
      message.success(`User role updated to ${newRole}`);
    } catch (error: any) {
      message.error(error.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      setUsers(prev => prev.filter(user => user._id !== userId));
      message.success('User deleted successfully');
    } catch (error: any) {
      message.error(error.message || 'Failed to delete user');
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name: string, record: User) => (
        <Space>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <UserOutlined className="text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-gray-500 text-sm">{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string, record: User) => (
        <Popconfirm
          title={`Change role to ${role === 'admin' ? 'user' : 'admin'}?`}
          onConfirm={() => handleRoleChange(record._id, role === 'admin' ? 'user' : 'admin')}
          okText="Yes"
          cancelText="No"
        >
          <Tag 
            color={role === 'admin' ? 'gold' : 'blue'} 
            icon={role === 'admin' ? <CrownOutlined /> : <UserOutlined />}
            className="cursor-pointer"
          >
            {role.toUpperCase()}
          </Tag>
        </Popconfirm>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Popconfirm
            title="Delete this user?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteUser(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />} 
              danger 
              size="small"
              disabled={record.role === 'admin'} // Prevent deleting admins
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
          <h2 className="text-xl font-bold">User Management</h2>
          <Input.Search
            placeholder="Search users..."
            style={{ width: 300 }}
            onSearch={handleSearch}
            onChange={(e) => setSearchText(e.target.value)}
            enterButton
          />
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
          pagination={false}
        />

        <div className="mt-4 flex justify-center">
          <Pagination
            current={pagination.page}
            pageSize={pagination.limit}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) => 
              `Showing ${range[0]}-${range[1]} of ${total} users`
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;