import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, IeOutlined, LoginOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequest } from '../../types/auth';

const { Title, Text } = Typography;

interface FormValues {
  email: string;
  password: string;
}

const AdminLoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { login } = useAuth(); 

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    
    try {
      const loginData: LoginRequest = {
        email: values.email,
        password: values.password,
      };

      const response = await authService.login(loginData);
      console.log('Login response:', response);
      
      // Check if user has admin role
      if (response.user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      if (response.accessToken && response.user) {
        // Use the login function from AuthContext
        login(response.accessToken, response.user);
        message.success('Admin login successful!');
        form.resetFields();
        
        // Navigate to admin dashboard
        navigate('/admin/dashboard', { replace: true });
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      message.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
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
            Enter admin credentials to access the dashboard
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
            name="email"
            label="Admin Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Enter admin email"
              className="rounded-lg h-12 hover:border-blue-400 focus:border-blue-500"
              autoComplete="email"
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
      </Card>
    </div>
  );
};

export default AdminLoginForm;