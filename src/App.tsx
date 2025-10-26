
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Homepage from './pages/homepage';
import LinkPreviewPage from './components/LinkPreviewPage';
import AdminLoginForm from './pages/admin/login';
import AdminLayout from './pages/admin/adminLayout';


const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 8,
        },
      }}
    >
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

          <Route 
            path="/dashboard" 
            element={<AdminLayout children={undefined} />} 
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
  );
};

export default App;