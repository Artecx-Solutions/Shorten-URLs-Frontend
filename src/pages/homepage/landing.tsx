import React, { useState } from 'react';
import {
  Layout,
  Button,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Divider,
  Tag,
  Input,
  Form,
  List,
  Avatar,
  Grid,
  Timeline,
  Badge,
  Rate,
  Modal
} from 'antd';
import {
  RocketOutlined,
  BarChartOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  LinkOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  StarFilled,
  UserOutlined,
  ArrowRightOutlined,
  SearchOutlined,
  DownloadOutlined,
  MessageOutlined,
  TeamOutlined,
  SecurityScanOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import LoginModal from './../homepage/loginModal';
import SignupModal from './../homepage/SignUpModal';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { useBreakpoint } = Grid;

const LandingPage: React.FC = () => {
  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const features = [
    {
      icon: <ThunderboltOutlined />,
      title: 'Lightning Fast',
      description: 'Instant URL shortening with sub-second response times and global CDN',
      color: '#ff6b6b'
    },
    {
      icon: <BarChartOutlined />,
      title: 'Advanced Analytics',
      description: 'Track clicks, geographic data, referral sources, and user behavior',
      color: '#4ecdc4'
    },
    {
      icon: <SecurityScanOutlined />,
      title: 'Secure & Reliable',
      description: 'Military-grade encryption with 99.9% uptime guarantee and DDoS protection',
      color: '#45b7d1'
    },
    {
      icon: <TeamOutlined />,
      title: 'Team Collaboration',
      description: 'Share links with your team, manage permissions, and collaborate seamlessly',
      color: '#96ceb4'
    },
    {
      icon: <CrownOutlined />,
      title: 'Premium Features',
      description: 'Custom domains, QR codes, bulk shortening, and API access',
      color: '#feca57'
    },
    {
      icon: <BulbOutlined />,
      title: 'Smart Links',
      description: 'AI-powered link optimization and performance recommendations',
      color: '#ff9ff3'
    }
  ];

  const stats = [
    { value: '10M+', label: 'Links Shortened', icon: <LinkOutlined /> },
    { value: '500K+', label: 'Active Users', icon: <UserOutlined /> },
    { value: '99.9%', label: 'Uptime', icon: <SafetyCertificateOutlined /> },
    { value: '150+', label: 'Countries', icon: <GlobalOutlined /> }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Marketing Director',
      company: 'TechCorp',
      content: 'Short.ly transformed our marketing campaigns. The analytics helped us understand our audience better.',
      avatar: 'SC',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      role: 'Content Creator',
      company: 'Digital Studio',
      content: 'The custom domains and QR codes have been game-changers for my brand. Highly recommended!',
      avatar: 'MJ',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Startup Founder',
      company: 'InnovateLab',
      content: 'As a startup, we needed reliable link management. Short.ly delivered beyond expectations.',
      avatar: 'ED',
      rating: 4
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for personal use and getting started',
      features: [
        '1,000 links per month',
        'Basic analytics',
        'Standard support',
        '30-day history'
      ],
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$12',
      period: 'per month',
      description: 'Ideal for professionals and small teams',
      features: [
        '10,000 links per month',
        'Advanced analytics',
        'Priority support',
        'Custom domains',
        '1-year history',
        'QR code generation'
      ],
      buttonText: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: 'per month',
      description: 'For large organizations and agencies',
      features: [
        'Unlimited links',
        'Enterprise analytics',
        '24/7 dedicated support',
        'Multiple custom domains',
        'Team collaboration',
        'API access',
        'White-label options'
      ],
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  const handleShorten = async () => {
    if (!urlInput.trim()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Modal.success({
        title: 'URL Shortened Successfully!',
        content: 'Sign up to save and manage your shortened URLs.',
        okText: 'Sign Up Now',
        onOk: () => setSignupVisible(true)
      });
    }, 1000);
  };

  return (
    <Layout className="min-h-screen bg-white">

      <Content>
        {/* Hero Section */}
        <section className="py-16 lg:py-12 px-3 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-6xl mx-auto text-center">

            {/* Stats */}
            <Row gutter={[32, 32]} className="max-w-6xl mx-auto">
              {stats.map((stat, index) => (
                <Col xs={12} sm={6} key={index}>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3">
                      <div className="text-xl text-blue-600">
                        {stat.icon}
                      </div>
                    </div>
                    <Statistic
                      value={stat.value}
                      valueStyle={{
                        color: '#1e40af',
                        fontSize: screens.xs ? '24px' : '28px',
                        fontWeight: 'bold'
                      }}
                    />
                    <Text type="secondary" className="text-sm">
                      {stat.label}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Title level={2} className="text-3xl lg:text-4xl font-bold mb-4">
                Why <span className="text-blue-600">Thousands of Brands</span> Choose Short.ly
              </Title>
              <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to create, manage, and analyze your links in one powerful platform.
              </Paragraph>
            </div>

            <Row gutter={[32, 32]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card
                    className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl h-full hover:-translate-y-2 cursor-pointer group"
                    bodyStyle={{ padding: '32px' }}
                  >
                    <div className="text-center">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                        style={{ background: feature.color }}
                      >
                        <div className="text-2xl text-white">
                          {feature.icon}
                        </div>
                      </div>
                      <Title level={3} className="!mb-3 !text-xl">
                        {feature.title}
                      </Title>
                      <Paragraph className="text-gray-600 text-base leading-relaxed">
                        {feature.description}
                      </Paragraph>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 lg:py-24 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Title level={2} className="text-3xl lg:text-4xl font-bold mb-4">
                Trusted by <span className="text-blue-600">Amazing Teams</span>
              </Title>
              <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of satisfied users who transformed their link management with Short.ly
              </Paragraph>
            </div>

            <Row gutter={[32, 32]}>
              {testimonials.map((testimonial, index) => (
                <Col xs={24} lg={8} key={index}>
                  <Card className="border-0 shadow-lg rounded-2xl h-full">
                    <div className="flex items-center mb-4">
                      <Avatar size={48} className="bg-blue-100 text-blue-600 font-semibold">
                        {testimonial.avatar}
                      </Avatar>
                      <div className="ml-4">
                        <Text strong className="block">
                          {testimonial.name}
                        </Text>
                        <Text type="secondary" className="text-sm">
                          {testimonial.role}, {testimonial.company}
                        </Text>
                      </div>
                    </div>
                    <Rate 
                      disabled 
                      defaultValue={testimonial.rating} 
                      className="mb-3 text-yellow-400"
                    />
                    <Paragraph className="text-gray-600 italic">
                      "{testimonial.content}"
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 lg:py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Title level={2} className="text-3xl lg:text-4xl font-bold mb-4">
                Simple, <span className="text-blue-600">Transparent Pricing</span>
              </Title>
              <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the plan that works best for you. All plans include core features.
              </Paragraph>
            </div>

            <Row gutter={[32, 32]} justify="center">
              {pricingPlans.map((plan, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card
                    className={`border-2 rounded-2xl h-full transition-all duration-300 hover:shadow-2xl ${
                      plan.popular ? 'border-blue-500 relative' : 'border-gray-200'
                    }`}
                    bodyStyle={{ padding: '32px' }}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge.Ribbon text="Most Popular" color="blue">
                          <div></div>
                        </Badge.Ribbon>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <Title level={3} className="!mb-2">
                        {plan.name}
                      </Title>
                      <div className="flex items-baseline justify-center mb-2">
                        <Text className="text-4xl font-bold text-gray-900">
                          {plan.price}
                        </Text>
                        {plan.period !== 'forever' && (
                          <Text type="secondary" className="ml-2">
                            /{plan.period}
                          </Text>
                        )}
                      </div>
                      <Text type="secondary">{plan.description}</Text>
                    </div>

                    <Divider />

                    <List
                      dataSource={plan.features}
                      renderItem={(feature) => (
                        <List.Item className="!px-0 !py-2 border-0">
                          <CheckCircleOutlined className="text-green-500 mr-3" />
                          <Text>{feature}</Text>
                        </List.Item>
                      )}
                      className="mb-6"
                    />

                    <Button
                      type={plan.popular ? 'primary' : 'default'}
                      size="large"
                      block
                      className={`h-12 rounded-lg font-semibold ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-0' 
                          : 'border-gray-300'
                      }`}
                      onClick={() => plan.popular ? setSignupVisible(true) : setSignupVisible(true)}
                    >
                      {plan.buttonText}
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 px-6 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="max-w-4xl mx-auto text-center">
            <Title level={2} className="text-3xl lg:text-4xl font-bold mb-6 !text-white">
              Ready to Transform Your Link Strategy?
            </Title>
            <Paragraph className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of marketers, creators, and businesses using Short.ly to drive better results.
            </Paragraph>
            
            <Space size="large" direction={screens.xs ? "vertical" : "horizontal"}>
              <Button
                size="large"
                className="h-14 bg-white text-blue-600 hover:bg-gray-50 border-0 rounded-xl font-bold text-lg px-8 shadow-2xl"
                onClick={() => setSignupVisible(true)}
                icon={<CrownOutlined />}
              >
                Start Free Trial
              </Button>
              <Button
                size="large"
                className="h-14 bg-transparent text-white hover:bg-blue-700 border-2 border-white rounded-xl font-semibold text-lg px-8"
                onClick={() => {/* Navigate to demo */}}
                icon={<PlayCircleOutlined />}
              >
                Watch Demo
              </Button>
            </Space>
            
            <div className="mt-8 flex justify-center items-center space-x-6 text-blue-200 flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <CheckCircleOutlined />
                <Text className="text-blue-200">No credit card required</Text>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleOutlined />
                <Text className="text-blue-200">14-day free trial</Text>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleOutlined />
                <Text className="text-blue-200">Cancel anytime</Text>
              </div>
            </div>
          </div>
        </section>
      </Content>

      {/* Footer */}
      <Footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={8}>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <LinkOutlined className="text-white text-lg" />
                </div>
                <Text className="text-2xl font-bold text-white">MyUrl.life</Text>
              </div>
              <Paragraph className="text-gray-400 mb-4">
                The most advanced URL shortener for modern businesses. Create, manage, and analyze your links with ease.
              </Paragraph>
              <Space size="middle">
                <Button type="text" icon={<MessageOutlined />} className="text-gray-400 hover:text-white" />
                <Button type="text" icon={<TeamOutlined />} className="text-gray-400 hover:text-white" />
                <Button type="text" icon={<DownloadOutlined />} className="text-gray-400 hover:text-white" />
              </Space>
            </Col>
            
            <Col xs={12} sm={6} lg={4}>
              <Title level={4} className="!text-white !mb-4">Product</Title>
              <div className="space-y-2">
                <div><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></div>
                <div><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></div>
                <div><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></div>
                <div><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></div>
              </div>
            </Col>
            
            <Col xs={12} sm={6} lg={4}>
              <Title level={4} className="!text-white !mb-4">Resources</Title>
              <div className="space-y-2">
                <div><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></div>
                <div><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></div>
                <div><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></div>
                <div><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></div>
              </div>
            </Col>
            
            <Col xs={12} sm={6} lg={4}>
              <Title level={4} className="!text-white !mb-4">Company</Title>
              <div className="space-y-2">
                <div><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></div>
                <div><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></div>
                <div><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></div>
                <div><a href="#" className="text-gray-400 hover:text-white transition-colors">Partners</a></div>
              </div>
            </Col>
            
            <Col xs={12} sm={6} lg={4}>
              <Title level={4} className="!text-white !mb-4">Legal</Title>
              <div className="space-y-2">
                <div><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></div>
                <div><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></div>
                <div><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></div>
                <div><a href="#" className="text-gray-400 hover:text-white transition-colors">Compliance</a></div>
              </div>
            </Col>
          </Row>
          
          <Divider className="!border-gray-700 !my-8" />
          
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <Text className="text-gray-500 text-sm">
              © 2025 Kasun Development. All rights reserved.
            </Text>
            <div className="flex space-x-6 mt-4 lg:mt-0">
              <Text className="text-gray-500 text-sm cursor-pointer hover:text-white">Privacy Policy</Text>
              <Text className="text-gray-500 text-sm cursor-pointer hover:text-white">Terms of Service</Text>
              <Text className="text-gray-500 text-sm cursor-pointer hover:text-white">Cookie Policy</Text>
            </div>
          </div>
        </div>
      </Footer>

      {/* Modals */}
      <LoginModal
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
        onSwitchToSignup={() => {
          setLoginVisible(false);
          setSignupVisible(true);
        }}
      />
      
      <SignupModal
        visible={signupVisible}
        onClose={() => setSignupVisible(false)}
        onSwitchToLogin={() => {
          setSignupVisible(false);
          setLoginVisible(true);
        }}
      />
    </Layout>
  );
};

export default LandingPage;