// App.tsx
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Homepage from './pages/homepage';
import LinkPreviewPage from './components/LinkPreviewPage';
import AdminLoginForm from './pages/admin/login';
import AdminLayout from './pages/admin/adminLayout';
import Dashboard from './pages/admin/dashboard';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import UserManagement from './pages/admin/UserManagement';
import LinkManagement from './pages/admin/LinkManagement';

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
            
            {/* Admin Routes - Use relative paths for nested routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              {/* Use relative paths (without leading slash) */}
              <Route index element={<Dashboard />} /> {/* This becomes /admin */}
              <Route path="dashboard" element={<Dashboard />} /> {/* This becomes /admin/dashboard */}
              <Route path="links" element={<LinkManagement />} /> {/* /admin/links */}
              <Route path="users" element={<UserManagement />} /> {/* /admin/users */}
            </Route>
            
            {/* Separate standalone dashboard route (if needed) */}
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
  );
};

export default App;