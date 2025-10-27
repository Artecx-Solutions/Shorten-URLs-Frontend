import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { authService } from '../../services/authService';
import { SignUpRequest } from '../../types/auth';

interface SignUpModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSwitchToLogin: () => void;
}

interface FormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ 
  visible, 
  onClose, 
  onSuccess, 
  onSwitchToLogin 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    
    try {
      const signUpData: SignUpRequest = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      };

      await authService.signUp(signUpData);
      
      message.success('Account created successfully! Welcome to MyUrl');
      form.resetFields();
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateConfirmPassword = (_: any, value: string) => {
    if (!value || form.getFieldValue('password') === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('The two passwords do not match!'));
  };

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Please input your password!'));
    }
    if (value.length < 6) {
      return Promise.reject(new Error('Password must be at least 6 characters!'));
    }
    return Promise.resolve();
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleSwitchToLogin = () => {
    console.log("SIGNUP MODAL: Switching to login modal");
    // Call the parent handler - this will handle closing this modal and opening login
    onSwitchToLogin();
  };

  return (
    <Modal
      title={
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h2>
          <p className="text-gray-600">Join MyUrl.life and start shortening URLs</p>
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
        className="mt-6"
        requiredMark={false}
        autoComplete="off"
      >
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[
            { required: true, message: 'Please input your full name!' },
            { min: 2, message: 'Full name must be at least 2 characters!' }
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Enter your full name"
            size="large"
            className="rounded-lg hover:border-blue-400 focus:border-blue-500"
            autoComplete="off"
          />
        </Form.Item>

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
            { validator: validatePassword }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Create a password"
            size="large"
            className="rounded-lg hover:border-blue-400 focus:border-blue-500"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            { validator: validateConfirmPassword }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Confirm your password"
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Form.Item>

        <div className="text-center mt-4">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={handleSwitchToLogin}
            >
              Sign In
            </button>
          </p>
        </div>
      </Form>
    </Modal>
  );
};

export default SignUpModal;