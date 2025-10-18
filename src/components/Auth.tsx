// components/Auth.tsx
import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      {isLogin ? (
        <Login 
          onToggleMode={toggleMode} 
          onLoginSuccess={onAuthSuccess}
        />
      ) : (
        <Signup 
          onToggleMode={toggleMode} 
          onSignupSuccess={onAuthSuccess}
        />
      )}
    </div>
  );
};

export default Auth;