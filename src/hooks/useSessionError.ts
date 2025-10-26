// hooks/useSessionError.ts
import { useState, useCallback } from 'react';
import { authService } from '../services/authService';

export const useSessionError = () => {
  const [showSessionModal, setShowSessionModal] = useState(false);

  const handleSessionError = useCallback(() => {
    // Clear all auth data
    authService.logout();
    
    // Show modal after a small delay for better UX
    setTimeout(() => {
      setShowSessionModal(true);
    }, 100);
  }, []);

  const handleRedirectToLogin = useCallback(() => {
    setShowSessionModal(false);
    // Redirect to login page
    window.location.href = '/login';
  }, []);

  const handleReloadPage = useCallback(() => {
    setShowSessionModal(false);
    window.location.reload();
  }, []);

  return {
    showSessionModal,
    setShowSessionModal,
    handleSessionError,
    handleRedirectToLogin,
    handleReloadPage
  };
};