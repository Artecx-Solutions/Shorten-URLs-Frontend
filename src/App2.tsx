import React, { useState, useEffect } from 'react';
import { Link2, BarChart3, Zap, Shield, Globe, Rocket, Star, TrendingUp, Users, Clock } from 'lucide-react';
import { LinkShortener } from './components/LinkShortner';
import { Analytics } from './components/Analytics';

type Tab = 'shorten' | 'analytics';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('shorten');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Generate short links instantly with our optimized platform",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
      delay: "0"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Track clicks, locations, and performance metrics in real-time",
      color: "from-green-500 to-teal-500",
      bgColor: "bg-gradient-to-br from-green-50 to-teal-50",
      delay: "100"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      delay: "200"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global CDN",
      description: "Lightning-fast redirects worldwide with our global network",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      delay: "300"
    }
  ];

  const stats = [
    { icon: <TrendingUp className="w-5 h-5" />, value: "10M+", label: "Links Shortened" },
    { icon: <Users className="w-5 h-5" />, value: "50K+", label: "Active Users" },
    { icon: <Clock className="w-5 h-5" />, value: "99.9%", label: "Uptime" },
    { icon: <Globe className="w-5 h-5" />, value: "150+", label: "Countries" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-75"></div>
        <div className="absolute top-40 left-1/4 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-150"></div>
      </div>

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className={`text-center mb-12 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 shadow-sm mb-6">
              <Rocket className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">The Ultimate URL Shortener</span>
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Shorten URLs
              <br />
              <span className="text-3xl md:text-4xl">Like Never Before</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Transform long URLs into short, memorable links with powerful analytics and 
              <span className="font-semibold text-blue-600"> enterprise-grade performance</span>
            </p>
          </div>

          {/* Main Content Card */}
          <div className={`bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl mb-12 transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Tab Navigation */}
            <div className="flex justify-center p-2" style={{paddingTop:45}}>
<div className="relative bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-1 shadow-inner">
  <div className="relative flex">
    {/* Animated Background Slider */}
    <div className={`absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg transition-all duration-500 ease-out ${
      activeTab === 'shorten' ? 'left-1 w-[calc(50%-0.25rem)]' : 'left-[calc(50%+0.25rem)] w-[calc(50%-0.25rem)]'
    }`}></div>
    
    <button
      onClick={() => setActiveTab('shorten')}
      className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 z-10 ${
        activeTab === 'shorten' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
      }`}
    >
      <Link2 className="w-5 h-5" />
      Shorten URL
    </button>
    
    <button
      onClick={() => setActiveTab('analytics')}
      className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 z-10 ${
        activeTab === 'analytics' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
      }`}
    >
      <BarChart3 className="w-5 h-5" />
      Analytics
    </button>
  </div>
</div>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {activeTab === 'shorten' && <LinkShortener />}
              {activeTab === 'analytics' && <Analytics />}
            </div>
          </div>

          {/* Stats Section */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <div className="text-blue-600 flex justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>          

          {/* Features Grid */}
          <div className={`mb-16 transition-all duration-700 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Why Choose Our URL Shortener?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Packed with features designed to make link management effortless and powerful
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2`}
                  style={{
                    animationDelay: `${feature.delay}ms`,
                    animation: isVisible ? `fadeInUp 0.6s ease-out ${feature.delay}ms both` : 'none'
                  }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg shadow-current/30 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className={`text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-blue-500/30 transition-all duration-700 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Links?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust our platform for their link shortening needs. 
              Get started in seconds, no registration required.
            </p>
            <button
              onClick={() => setActiveTab('shorten')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Start Shortening Now
            </button>
          </div>

          {/* Footer */}
          <footer className={`text-center mt-12 text-gray-600 transition-all duration-700 delay-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-sm">
             Powerby Octo Global
            </p>
            <p className="text-xs mt-2 text-gray-500">
              Fast • Secure • Reliable
            </p>
          </footer>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;