import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, IeOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

const { Title, Text } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

interface AdminAuthResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: string;
  };
}

const AdminLoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    
    try {
      // Simulate API call - replace with your actual admin login endpoint
      const response = await adminLogin(values.username, values.password);
      
      // Save admin data to localStorage
      saveAdminData(response);
      
      message.success('Admin login successful!');
      
      // Redirect to dashboard
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      
    } catch (error: any) {
      message.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (username: string, password: string): Promise<AdminAuthResponse> => {
    // Replace this with your actual API call
    const mockAdminUser = {
      accessToken: 'admin-jwt-token-here',
      user: {
        id: 'admin-1',
        username: username,
        email: 'admin@example.com',
        role: 'admin' as const,
        createdAt: new Date().toISOString()
      }
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo purposes, accept only specific credentials
    if (username === 'admin' && password === 'admin123') {
      return mockAdminUser;
    } else {
      throw new Error('Invalid admin credentials');
    }
  };

  const saveAdminData = (data: AdminAuthResponse) => {
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('admin', 'true'); // Additional admin flag
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card 
        className="w-full max-w-md shadow-2xl border-0 rounded-2xl"
        bodyStyle={{ padding: '40px' }}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <IeOutlined className="text-white text-2xl" />
            </div>
          </div>
          
          <Title level={2} className="!mb-2 !text-gray-800">
            Admin Portal
          </Title>
          <Text type="secondary" className="text-gray-600">
            Enter your credentials to access the dashboard
          </Text>
        </div>

        <Form
          form={form}
          name="admin-login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, message: 'Username must be at least 3 characters!' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Enter admin username"
              className="rounded-lg h-12 hover:border-blue-400 focus:border-blue-500"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your password"
              className="rounded-lg h-12 hover:border-blue-400 focus:border-blue-500"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="
                h-12
                bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-700 hover:to-purple-700
                border-0
                rounded-lg
                font-semibold
                text-white
                shadow-lg hover:shadow-xl
                transition-all duration-300
                text-base
              "
              icon={<LoginOutlined />}
            >
              {loading ? 'Signing In...' : 'Sign In as Admin'}
            </Button>
          </Form.Item>
        </Form>

        <Divider className="my-6">Demo Credentials</Divider>
        
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <Text className="text-blue-800 text-sm">
            <strong>Username:</strong> admin<br />
            <strong>Password:</strong> admin123
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default AdminLoginForm;