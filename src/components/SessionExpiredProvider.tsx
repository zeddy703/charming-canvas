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
        loginUrl={`https://12d84bd0f7de.ngrok-free.app/Account/Login?ReturnUrl=connect/authorize/callback?scope=openid%20profile%20member.info&state=68d68b157c8ac61fdf8798dfb0491a12&response_type=code&approval_prompt=auto&redirect_uri=/actions/social-login/auth/login?redirect=63ab42acbe1008c46bae760317da154175c5e18250cfcbeae7a96f64710d8302/after-login&provider=j365/social-login/auth/callback&client_id=srnmj.web1`}
      />
    </>
  );
};

export default SessionExpiredProvider;
