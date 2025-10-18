// Updated App.tsx (add these changes)
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Link2, BarChart3, Zap, Shield, Globe, Rocket, Star, TrendingUp, Users, Clock, Sparkles, User, LogOut } from 'lucide-react';
import { LinkShortener } from './components/LinkShortner';
import { Analytics } from './components/Analytics';
import { RedirectPage } from './pages/RedirectPage';
import AuthModal from './components/AuthModal';
import { authService } from './services/auth';
import { User as UserType } from './types/auth';

type Tab = 'shorten' | 'analytics';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('shorten');
  const [isVisible, setIsVisible] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    checkAuth();
    setIsVisible(true);
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      }
    }
    setLoadingUser(false);
  };

  const handleAuthSuccess = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to get user data:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Generate short links instantly with our optimized platform",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50/50 to-orange-50/50",
      delay: "0"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Track clicks, locations, and performance metrics in real-time",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-gradient-to-br from-emerald-50/50 to-teal-50/50",
      delay: "100"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee",
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-gradient-to-br from-blue-50/50 to-indigo-50/50",
      delay: "200"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global CDN",
      description: "Lightning-fast redirects worldwide with our global network",
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-violet-50/50 to-purple-50/50",
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
    <Routes>
      <Route path="/redirect/:shortCode" element={<RedirectPage />} />
      <Route path="/" element={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-hidden">
          {/* Enhanced Animated Background (keep your existing background) */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {/* ... your existing background elements */}
          </div>

          <div className="relative z-10 py-8 px-4">
            <div className="max-w-6xl mx-auto">
              {/* Enhanced Header Section with Auth Button */}
              <div className={`text-center mb-0 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="flex justify-between items-center mb-8">
                  <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/40 shadow-lg shadow-black/5">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span className="text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      The Ultimate URL Shortener
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-amber-500 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Auth Button */}
                  {!loadingUser && (
                    <div className="flex items-center gap-3">
                      {user ? (
                        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xl rounded-2xl px-4 py-2 border border-white/40 shadow-lg shadow-black/5">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                          <button
                            onClick={handleLogout}
                            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/50 hover:bg-white/70 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-110 border border-white/40"
                            title="Logout"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAuthModal(true)}
                          className="bg-white/70 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/40 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 hover:scale-105 group flex items-center gap-2"
                        >
                          <User className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                          <span className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                            Sign In
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-6 leading-tight">
                  Shorten URLs
                </h1>
                
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
                  Transform long URLs into short, memorable links with powerful analytics and{' '}
                  <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    enterprise-grade performance
                  </span>
                </p>
              </div>

            {/* Enhanced Main Content Card */}
              <div className={`mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {/* Enhanced Tab Navigation */}
                <div className="flex justify-center pt-8">
                  <div className="relative bg-white/50 backdrop-blur-lg rounded-2xl p-1.5 shadow-lg shadow-black/5 border border-white/40">
                    <div className="relative flex">
                      {/* Animated Background Slider */}
                      <div className={`absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 transition-all duration-500 ease-out ${
                        activeTab === 'shorten' ? 'left-1 w-[calc(50%-0.25rem)]' : 'left-[calc(50%+0.25rem)] w-[calc(50%-0.25rem)]'
                      }`}></div>
                      
                      <button
                        onClick={() => setActiveTab('shorten')}
                        className={`relative px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 z-10 min-w-[160px] justify-center ${
                          activeTab === 'shorten' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <Link2 className="w-5 h-5" />
                        Shorten URL
                      </button>
                      
                      <button
                        onClick={() => setActiveTab('analytics')}
                        className={`relative px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 z-10 min-w-[160px] justify-center ${
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
                <div className="p-8 md:p-10">
                  {activeTab === 'shorten' && <LinkShortener />}
                  {activeTab === 'analytics' && <Analytics />}
                </div>
              </div>

              {/* Enhanced Stats Section */}
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-300"></div>
                    <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/40 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 hover:scale-105">
                      <div className="text-blue-600 flex justify-center mb-3">
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-black text-gray-900 mb-2">{stat.value}</div>
                      <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>          

              {/* Enhanced Features Grid */}
              <div className={`mb-20 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                    Why Choose Our URL Shortener?
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                    Packed with features designed to make link management effortless and powerful
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="group relative"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl blur-md opacity-30 group-hover:opacity-50 transition duration-300`}></div>
                      <div
                        className={`relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 h-full`}
                        style={{
                          animationDelay: `${feature.delay}ms`,
                          animation: isVisible ? `fadeInUp 0.8s ease-out ${feature.delay}ms both` : 'none'
                        }}
                      >
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg shadow-current/40 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                          {feature.icon}
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed font-medium group-hover:text-gray-700 transition-colors">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced CTA Section */}
              <div className={`relative text-center rounded-[2.5rem] p-12 md:p-16 text-white shadow-2xl shadow-blue-500/20 transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-[2.5rem]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2.5rem]"></div>
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-black mb-6">
                    Ready to Transform Your Links?
                  </h2>
                  <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                    Join thousands of users who trust our platform for their link shortening needs. 
                    Get started in seconds, no registration required.
                  </p>
                  <button
                    onClick={() => setActiveTab('shorten')}
                    className="group bg-white text-gray-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl inline-flex items-center gap-3"
                  >
                    <Zap className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    Start Shortening Now
                  </button>
                </div>
              </div>

              {/* Enhanced Footer */}
              <footer className={`text-center mt-16 transition-all duration-1000 delay-1100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <p className="text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Powered by Octo Global
                </p>
                <p className="text-sm mt-3 text-gray-500 font-medium">
                  Fast • Secure • Reliable
                </p>
              </footer>
            </div>
            </div>

          {/* Auth Modal */}
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
          />

          {/* Custom CSS for enhanced animations */}
          <style jsx>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(40px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes float {
              0%, 100% {
                transform: translateY(0px) rotate(0deg);
              }
              50% {
                transform: translateY(-20px) rotate(1deg);
              }
            }
            
            @keyframes float-delayed {
              0%, 100% {
                transform: translateY(0px) rotate(0deg);
              }
              50% {
                transform: translateY(20px) rotate(-1deg);
              }
            }
            
            @keyframes pulse-slow {
              0%, 100% {
                opacity: 0.15;
              }
              50% {
                opacity: 0.25;
              }
            }
            
            .animate-float {
              animation: float 8s ease-in-out infinite;
            }
            
            .animate-float-delayed {
              animation: float-delayed 10s ease-in-out infinite;
            }
            
            .animate-pulse-slow {
              animation: pulse-slow 6s ease-in-out infinite;
            }
          `}</style>
        </div>
      } />
    </Routes>
  );
}

export default App;