import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequest } from '../../types/auth';
import { LockOutlined, MailOutlined } from '@ant-design/icons';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSwitchToSignup: () => void;
}

interface FormValues {
  email: string;
  password: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  visible, 
  onClose, 
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    
    try {
      const loginData: LoginRequest = {
        email: values.email,
        password: values.password,
      };

      const response = await authService.login(loginData);
      console.log('Login response:', response);
      
      login(response.accessToken, response.user);
      
      const successMessage = response.message || 'Welcome back! Login successful!';
      console.log(successMessage);
      message.success(successMessage);
      
      form.resetFields();
      onClose();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

const handleSwitchToSignup = () => {
  console.log("LOGIN MODAL: Emergency switch to signup");
  // Force close this modal and trigger signup modal
  onClose(); // Close current modal
  
  // Use setTimeout to ensure modal closes before opening new one
  setTimeout(() => {
    // You might need to access the parent's state directly
    // This is a workaround - ideally the parent should handle this
    const event = new CustomEvent('openSignupModal');
    window.dispatchEvent(event);
  }, 100);
};

  return (
    <Modal
      title={
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your MyUrl.life account</p>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      centered
      width={400}
      className="rounded-xl"
      destroyOnClose={true} // Add this to ensure clean state
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
        requiredMark={false}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email address!' }
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="Enter your email"
            size="large"
            className="rounded-lg hover:border-blue-400 focus:border-blue-500"
            autoComplete="off"
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
            size="large"
            className="rounded-lg hover:border-blue-400 focus:border-blue-500"
            autoComplete="new-password"
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
              bg-gradient-to-r from-blue-500 to-purple-600 
              hover:from-blue-600 hover:to-purple-700
              border-0
              rounded-lg
              font-semibold
              text-white
              shadow-lg hover:shadow-xl
              transition-all duration-300
            "
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form.Item>

        <div className="text-center mt-4">
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={handleSwitchToSignup}
            >
              Sign Up
            </button>
          </p>
        </div>
      </Form>
    </Modal>
  );
};

export default LoginModal;