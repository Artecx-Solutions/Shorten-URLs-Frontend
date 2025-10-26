// components/AdminHeader.tsx
import React from 'react';
import { 
  Layout, 
  Button, 
  Avatar, 
  Dropdown, 
  Space,
  Typography,
  Tooltip,
} from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const { Header } = Layout;
const { Text } = Typography;

interface AdminHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
  onThemeChange?: (isDark: boolean) => void;
  isDarkTheme?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  collapsed, 
  onToggle, 
}) => {
  const navigate = useNavigate();
  const user = authService.getStoredUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/admin/profile');
  };

  const handleSettings = () => {
    navigate('/admin/settings');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: handleProfile,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: handleSettings,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Header 
      style={{ 
        padding: '0 24px', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
      className="shadow-lg relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="flex items-center justify-between h-full relative z-10">
        {/* Left Section - Logo and Toggle */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle */}
          <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={onToggle}
              style={{
                fontSize: '18px',
                width: 48,
                height: 48,
                color: 'white',
              }}
              className="hover:bg-white hover:bg-opacity-20 transition-all duration-300 rounded-xl"
            />
          </Tooltip>

          {/* Company Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">ML</span>
              </div>
            </div>
            {!collapsed && (
              <div className="hidden md:block">
                <Text strong className="text-white text-lg tracking-tight">
                  MyUrl.life Admin Panel
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - User Menu and Actions */}
        <div className="flex items-center space-x-3">

          {/* User Menu */}
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
            overlayClassName="admin-header-dropdown"
          >
            <Space className="cursor-pointer hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-xl transition-all duration-300 group">
              <div className="flex items-center space-x-3">
                {/* User Avatar */}
                <div className="relative">
                  <Avatar 
                    size={36}
                    icon={<UserOutlined />}
                    className="bg-white text-purple-600 shadow-lg border-2 border-white border-opacity-20 group-hover:border-opacity-40 transition-all"
                    src={user?.avatar}
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                
                {/* User Info */}
                <div className="hidden md:block text-left">
                  <Text strong className="text-white text-sm block leading-tight">
                    {user?.name || user?.username || 'Admin User'}
                  </Text>
                  <Text className="text-white text-opacity-80 text-xs block leading-tight">
                    {user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}` : 'Administrator'}
                  </Text>
                </div>
              </div>
            </Space>
          </Dropdown>
        </div>
      </div>

      <style jsx>{`
        .admin-header-dropdown .ant-dropdown-menu {
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid #f0f0f0;
        }
        
        .admin-header-dropdown .ant-dropdown-menu-item {
          padding: 8px 16px;
          margin: 2px 8px;
          border-radius: 8px;
        }
        
        .admin-header-dropdown .ant-dropdown-menu-item:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      `}</style>
    </Header>
  );
};

export default AdminHeader;