import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css'
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);