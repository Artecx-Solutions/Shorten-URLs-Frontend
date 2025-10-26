// components/AdminLayout.tsx
import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  theme,
  Grid
} from 'antd';
import { 
  DashboardOutlined,
  LinkOutlined,
  TeamOutlined,
  SettingOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader'; // Import the new header

const { Sider, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/links',
      icon: <LinkOutlined />,
      label: 'Link Management',
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: 'User Management',
    },
    {
      key: '/admin/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleThemeChange = (dark: boolean) => {
    setIsDarkTheme(dark);
    // You can implement theme switching logic here
    console.log('Theme changed to:', dark ? 'dark' : 'light');
  };

  return (
    <Layout className="min-h-screen" style={{ background: isDarkTheme ? '#141414' : '#f5f5f5' }}>
      {/* Sidebar */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={280}
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
        {/* Logo in sidebar (optional, since we have it in header) */}
        {!collapsed && (
          <div className="flex items-center justify-center p-6 border-b border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-lg">ML</span>
              </div>
              <span className="text-sm font-semibold text-gray-700">MyUrl.life</span>
              <div className="text-xs text-gray-500 mt-1">Admin System</div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ 
            border: 'none',
            marginTop: '16px',
            background: 'transparent',
          }}
          className="sidebar-menu px-2"
        />
      </Sider>

      <Layout>
        {/* New Header Component */}
        <AdminHeader 
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onThemeChange={handleThemeChange}
          isDarkTheme={isDarkTheme}
        />

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
          <Outlet />
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
            <p>
              © 2025 MyUrl.life Admin Dashboard • Kasun Development
            </p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <p className="text-sm cursor-pointer hover:text-blue-600">
                Privacy
              </p>
              <p className="text-sm cursor-pointer hover:text-blue-600">
                Terms
              </p>
              <p className="text-sm cursor-pointer hover:text-blue-600">
                Support
              </p>
            </div>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;