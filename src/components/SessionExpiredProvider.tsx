import { useState, useEffect } from 'react';
import SessionExpiredDialog, { 
  sessionExpiredEvent, 
  SHOW_SESSION_EXPIRED 
} from './SessionExpiredDialog';

interface SessionExpiredProviderProps {
  children: React.ReactNode;
  loginUrl?: string;
}

const SessionExpiredProvider = ({ 
  children, 
  loginUrl = import.meta.env.VITE_LOGIN_REDIRECT_URL || 'http://localhost:3000/actions/social-login/auth/login?redirect=63ab42acbe1008c46bae760317da154175c5e18250cfcbeae7a96f64710d8302/after-login&provider=j365'
}: SessionExpiredProviderProps) => {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const handleSessionExpired = () => {
      setShowDialog(true);
    };

    sessionExpiredEvent.addEventListener(SHOW_SESSION_EXPIRED, handleSessionExpired);
    
    return () => {
      sessionExpiredEvent.removeEventListener(SHOW_SESSION_EXPIRED, handleSessionExpired);
    };
  }, []);

  return (
    <>
      {children}
      <SessionExpiredDialog 
        open={showDialog} 
        onOpenChange={setShowDialog}
        loginUrl={`https://6e9b2c50b484.ngrok-free.app/actions/social-login/auth/login?redirect=63ab42acbe1008c46bae760317da154175c5e18250cfcbeae7a96f64710d8302/after-login&provider=j365`}
      />
    </>
  );
};

export default SessionExpiredProvider;
