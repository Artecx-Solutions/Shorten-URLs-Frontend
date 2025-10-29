// App.tsx
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import Homepage from './pages/homepage';
import LinkPreviewPage from './components/LinkPreviewPage';
import AdminLoginForm from './pages/admin/login';
import AdminLayout from './pages/admin/adminLayout';
import Dashboard from './pages/admin/dashboard';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import UserManagement from './pages/admin/UserManagement';
import LinkManagement from './pages/admin/LinkManagement';

const DefaultSEO = () => (
  <>
    <title>MyUrl | URL Shortener & Analytics</title>
    <meta name="description" content="Transform long URLs into powerful, trackable short links. Drive engagement, understand your audience, and grow your brand with enterprise-grade analytics." />
    <meta name="keywords" content="url shortener, link shortener, shorten links, link analytics, click tracking, brand links, marketing analytics, short URLs" />
    <meta name="author" content="MyUrl" />
    <meta name="robots" content="index, follow" />
    
    <meta property="og:title" content="MyUrl | URL Shortener & Analytics" />
    <meta property="og:description" content="Transform long URLs into powerful, trackable short links. Drive engagement, understand your audience, and grow your brand with enterprise-grade analytics." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://myurl.life" />
    <meta property="og:site_name" content="YMyUrl | URL Shortener & Analytics" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Shorten Links. Amplify Your Reach" />
    <meta name="twitter:description" content="Transform long URLs into powerful, trackable short links with enterprise-grade analytics." />
    <meta name="twitter:site" content="@myurllife" />
    
    <meta name="theme-color" content="#4F46E5" />
    <meta name="msapplication-TileColor" content="#4F46E5" />
    <link rel="canonical" href="https://myurl.life" />
    
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "MyUrl | URL Shortener & Analytics",
        "description": "Transform long URLs into powerful, trackable short links with enterprise-grade analytics",
        "url": "https://myurl.life",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web-Based",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "author": {
          "@type": "Organization",
          "name": "myurl.life"
        }
      })}
    </script>
  </>
);

const App = () => {
  return (
    <HelmetProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#2563eb',
            borderRadius: 8,
          },
        }}
      >
        <DefaultSEO />
        
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
          <Routes>
            <Route 
              path="/" 
              element={
                <div className='mx-auto'>
                  <Homepage />
                </div>
              } 
            />
            <Route 
              path="/:shortCode" 
              element={<LinkPreviewPage />} 
            />
            <Route 
              path="/login" 
              element={<AdminLoginForm />} 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="links" element={<LinkManagement />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedAdminRoute>
              } 
            />
                        
            <Route 
              path="*" 
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Page not found</p>
                    <a 
                      href="/" 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Return to Homepage
                    </a>
                  </div>
                </div>
              } 
            />
          </Routes>
        </div>
      </ConfigProvider>
    </HelmetProvider>
  );
};

export default App;