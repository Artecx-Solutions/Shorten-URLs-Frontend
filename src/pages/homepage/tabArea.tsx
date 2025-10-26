import React, { useState } from 'react';
import { 
  Tabs, 
  Card, 
} from 'antd';
import { 
  LinkOutlined, 
  BarChartOutlined, 
} from '@ant-design/icons';
import ShortUrlGenerator from './../../components/homepage/ShortUrlGenerator';
import AnalyticsMyLinks from '../../components/homepage/analyticsMyLinks';

const ModernURLShortener: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shorten');


  const tabItems = [
    {
      key: 'shorten',
      label: (
        <span className="flex items-center gap-2 text-lg font-semibold">
          <LinkOutlined className="text-blue-500" />
          Shorten URL
        </span>
      ),
      children: (
        <ShortUrlGenerator />
      ),
    },
    {
      key: 'analytics',
      label: (
        <span className="flex items-center gap-2 text-lg font-semibold">
          <BarChartOutlined className="text-green-500" />
          Analytics
        </span>
      ),
      children: (
        <AnalyticsMyLinks />
      ),
    },
  ];

  return (
      <main className="container mx-auto p-30 max-w-6xl">
<Card 
  className=""
  bodyStyle={{ padding: 0 }}
>
  <Tabs
    activeKey={activeTab}
    onChange={setActiveTab}
    items={tabItems}
    size="large"
    centered
    tabBarGutter={32} // Adds space between tabs
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