import  { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Link2, BarChart3, Star, Sparkles, User, LogOut } from 'lucide-react';
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
      setShowAuthModal(false);
    } catch (error) {
      console.error('Failed to get user data:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const handleTabChange = (tab: Tab) => {
    if (tab === 'shorten' && !user) {
      setShowAuthModal(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <Routes>
      <Route path="/:shortCode" element={<RedirectPage />} />
      <Route path="/" element={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-hidden">
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
          </div>

          <div className="relative z-10 py-8 px-4">
            <div className="max-w-6xl mx-auto">
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
                        onClick={() => handleTabChange('shorten')}
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
                  {activeTab === 'shorten' && (
                    user ? (
                      <LinkShortener />
                    ) : (
                      <div className="text-center py-12">
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 border border-white/40 shadow-lg shadow-black/5">
                          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-500/40">
                            <User className="w-10 h-10" />
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 mb-4">
                            Authentication Required
                          </h3>
                          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                            Please sign in to start shortening URLs and access all our premium features.
                          </p>
                          <button
                            onClick={() => setShowAuthModal(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
                          >
                            <User className="w-5 h-5" />
                            Sign In to Continue
                          </button>
                        </div>
                      </div>
                    )
                  )}
                  {activeTab === 'analytics' && <Analytics />}
                </div>
              </div>         

            </div>
            </div>

          {/* Auth Modal */}
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
          />

        </div>
      } />
    </Routes>
  );
}

export default App;