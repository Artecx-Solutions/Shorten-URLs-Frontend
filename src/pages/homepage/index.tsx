import { Avatar, Button, Dropdown, Menu, Space, Tag, } from 'antd';
import {DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import SignUpModal from './SignUpModal';
import LoginModal from './loginModal';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import ModernURLShortener from './tabArea';
import LandingPage from './landing';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {

  const navigate = useNavigate();

  const { isAuthenticated, user, logout } = useAuth();

  const [isSignUpModalVisible, setIsSignUpModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  

  const showSignUpModal = () => {
    setIsSignUpModalVisible(true);
  };

  const gotoadmin = () => {
    navigate('/login');
  };

  const showLoginModal = () => {
    setIsLoginModalVisible(true);
  };

  const handleAuthSuccess = () => {
    // Refresh the page or update user state
    //window.location.reload();
  };

  const handleLogout = () => {
        logout();
    authService.logout();
    window.location.reload();
  };

  const userMenu = (
    <Menu>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );
  return (
    <>

      <header className="flex justify-between items-center p-6 bg-white shadow-sm border-b border-gray-100 mb-9 mx-auto">
        {/* Logo */}
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          MyUrl.life
        </div>

           <Space size="middle" className="hidden md:flex">
             <Button type="text" className="text-gray-600 hover:text-blue-600">
               Features
             </Button>
             <Button type="text" className="text-gray-600 hover:text-blue-600">
               Pricing
             </Button>
             <Button type="text" className="text-gray-600 hover:text-blue-600">
               About
             </Button>
                          <Button type="text" className="text-gray-600 hover:text-blue-600">
               Contact
             </Button>
           </Space>     
        
        {/* Auth Buttons or User Menu */}
        {isAuthenticated  ? (
          <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
            <Button 
              type="text" 
              className="flex items-center gap-2 hover:bg-gray-100 rounded-lg"
            >
              <Avatar 
                size="small" 
                icon={<UserOutlined />} 
                className="bg-gradient-to-r from-blue-500 to-purple-600"
              />
              <span className="text-gray-700">{user.fullName}</span>
              <DownOutlined />
            </Button>
          </Dropdown>
        ) : (
          <Space size="middle">
            <Button 
              type="text" 
              className="text-gray-600 hover:text-blue-600"
              onClick={showLoginModal}
            >
              Sign In
            </Button>
            <Button
              type="primary"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 font-semibold rounded-lg px-6"
              onClick={showSignUpModal}
            >
              Get Started
            </Button>
            <Button
              type="primary"
              variant="dashed"
              onClick={gotoadmin}
              className='font-semibold'
            >
              Admin Login
            </Button>            
          </Space>  

        )}
      </header>

        <div className="text-center mb-0 transition-all duration-1000 transform translate-y-0 opacity-100 ">
            <Tag className="mb-6 px-4 py-2 border-blue-200 text-blue-600 bg-blue-50 text-base font-medium rounded-full">
              🚀 The Most Advanced URL Shortener
            </Tag>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 !text-gray-900 leading-tight">
              Shorten Links.{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                Amplify Your Reach
              </span>
            </h1>
            
            <p className="text-lg lg:text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed para">
              Transform long URLs into powerful, trackable short links. Drive engagement, 
              understand your audience, and grow your brand with enterprise-grade analytics.
            </p>    
          </div>

      <SignUpModal
        visible={isSignUpModalVisible}
        onClose={() => setIsSignUpModalVisible(false)}
        onSuccess={handleAuthSuccess}
        onSwitchToLogin={() => {
          setIsSignUpModalVisible(false);
          setIsLoginModalVisible(true);
        }}
      />

      <LoginModal
        visible={isLoginModalVisible}
        onClose={() => setIsLoginModalVisible(false)}
        onSuccess={handleAuthSuccess}
        onSwitchToSignup={() => {
          setIsLoginModalVisible(false);
          setIsSignUpModalVisible(true);
        }}
      />

      <ModernURLShortener />
      <LandingPage />
</>
  );
};

export default Homepage;