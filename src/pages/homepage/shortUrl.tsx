import React, { useState } from 'react';
import { 
  Tabs, 
  Card, 
} from 'antd';
import { 
  LinkOutlined, 
  BarChartOutlined, 
} from '@ant-design/icons';

const ModernURLShortener: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shorten');


  const tabItems = [
    {
      key: 'shorten',
      label: (
        <span className="flex items-center gap-2 text-sm font-semibold">
          <LinkOutlined className="text-blue-500" />
          Shorten URL
        </span>
      ),
      children: (
        <div className="p-6">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Lightning Fast URL Shortening
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Shorten Your Links in Seconds
            </h2>
          </div>
        </div>
      ),
    },
    {
      key: 'analytics',
      label: (
        <span className="flex items-center gap-2 text-sm font-semibold">
          <BarChartOutlined className="text-green-500" />
          Analytics
        </span>
      ),
      children: (
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <BarChartOutlined />
              Advanced Analytics Dashboard
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Track Your Link Performance
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Gain insights into your audience with detailed analytics and performance metrics.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
      <main className="container mx-auto px-4 py-8">
        <Card 
          className="w-full max-w-6xl mx-auto border-0 shadow-2xl rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm"
          bodyStyle={{ padding: 0 }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="large"
            className="modern-tabs"
            tabBarStyle={{ 
              padding: '0 2rem',
              margin: 0,
              background: 'linear-gradient(to right, #f8fafc, #ffffff)',
            }}
          />
        </Card>
      </main>
  );
};

export default ModernURLShortener;