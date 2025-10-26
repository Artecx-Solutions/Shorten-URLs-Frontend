// components/AdminLayout.tsx
import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  Button, 
  Avatar, 
  Dropdown, 
  Space,
  Typography,
  theme,
  Grid
} from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  DashboardOutlined,
  LinkOutlined,
  BarChartOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getStoredUser();
  const screens = useBreakpoint();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '',
      icon: <LinkOutlined />,
      label: 'Link Management',
    },
    {
      key: '',
      icon: <TeamOutlined />,
      label: 'User Management',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={250}
        breakpoint="lg"
        collapsedWidth={screens.lg ? 80 : 0}
        onBreakpoint={(broken) => {
          if (broken) setCollapsed(true);
        }}
        style={{
          background: colorBgContainer,
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        }}
        className="border-r border-gray-200"
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200">
          {!collapsed ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <LinkOutlined className="text-white text-lg" />
              </div>
              <Text strong className="text-lg bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                MyUrl.life Admin
              </Text>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <LinkOutlined className="text-white text-lg" />
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ 
            border: 'none',
            marginTop: '16px',
          }}
          className="sidebar-menu"
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header 
          style={{ 
            padding: '0 24px', 
            background: colorBgContainer,
            borderBottom: '1px solid #f0f0f0',
          }}
          className="shadow-sm"
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
            </div>

            <div className="flex items-center space-x-4">
              
              {/* User Menu */}
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Space className="cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                  <Avatar 
                    icon={<UserOutlined />}
                    src={user?.avatar}
                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                  />
                  {screens.md && (
                    <div className="flex flex-col items-start">
                      <Text strong className="text-sm">
                        {user?.username || 'Admin'}
                      </Text>
                      <Text type="secondary" className="text-xs">
                        {user?.role || 'Administrator'}
                      </Text>
                    </div>
                  )}
                </Space>
              </Dropdown>
            </div>
          </div>
        </Header>

        {/* Main Content */}
        <Content
          style={{
            margin: '24px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className="shadow-sm"
        >
          {children}
        </Content>

        {/* Footer */}
        <Footer 
          style={{ 
            textAlign: 'center',
            background: colorBgContainer,
            borderTop: '1px solid #f0f0f0',
          }}
          className="shadow-inner"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Text type="secondary">
              © 2025 MyUrl.life Admin Dashboard. Kasun Development.
            </Text>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;